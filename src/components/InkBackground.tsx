"use client";

import React, { useEffect, useRef } from "react";

/**
 * InkBackground — Owldio ambient ink-wash layer (stateful GPU fluid).
 *
 * A quiet black/grey/white sumi mist drifting in a dark hall. Unlike a stateless
 * shader that springs back to a rest pose (the "jelly" feel), this keeps a
 * persistent dye buffer that is advected every frame along a divergence-free
 * curl-noise flow and slowly dissipates. Disturbances therefore behave like real
 * smoke: when you sweep a pointer through it the mist is pushed along the motion,
 * keeps drifting, disperses, and fades — it never returns to where it started.
 *
 * Two RGBA8 textures ping-pong: an UPDATE pass semi-Lagrangian-advects the dye
 * and injects ambient/pointer/click sources; a DISPLAY pass maps dye → colour
 * with soft masks. No Three.js. Sits behind the hero content, never intercepts
 * pointer events, blends additively (screen). Reduced resolution, capped fps,
 * pauses off-screen / hidden, honours prefers-reduced-motion.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Tunables live in INK_CONFIG below.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const INK_CONFIG = {
  opacity: 0.85, // overall presence of the whole layer (CSS opacity, 0–1)
  intensity: 0.7, // dye → brightness in the display pass
  flowSpeed: 0.14, // ambient curl-flow advection speed (slow — drifting fog)
  driftSpeed: 0.018, // gentle sideways drift (uv units / sec) — mist through a valley
  dissipation: 0.992, // mist turnover — lower = builds in faster, drifts & clears
  interactive: false, // pointer pen-stroke disturbance — OFF by default
  interaction: 1.0, // how strongly a pointer sweep pushes the mist (when on)
  color: [0.83, 0.82, 0.81] as const, // near-neutral pale ink (low saturation)
  gold: [0.95, 0.66, 0.3] as const, // copper/gold theme accent
  goldAmount: 0.6, // how much gold the denser wisps catch (0 = pure grey-white)
  maxDim: 760, // longest sim-buffer edge — caps fluid cost
  maxDimTouch: 560, // smaller buffer on touch devices
  fps: 30, // update cap
};

const QUAD_VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// shared noise / curl helpers
const NOISE_GLSL = `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm3(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 3; i++) {
    v += amp * noise(p);
    p = p * 2.05 + vec2(2.8, 5.1);
    amp *= 0.5;
  }
  return v;
}
vec2 curl(vec2 p) {
  float e = 0.1;
  float a = fbm3(p + vec2(0.0, e));
  float b = fbm3(p - vec2(0.0, e));
  float c = fbm3(p + vec2(e, 0.0));
  float d = fbm3(p - vec2(e, 0.0));
  return vec2(a - b, d - c) / (2.0 * e);
}
`;

// UPDATE: advect the dye field + inject sources → next dye buffer
const UPDATE_FRAG = `
precision highp float;

uniform sampler2D uPrev;
uniform vec2 uRes;
uniform float uTime;
uniform float uDt;
uniform vec2 uPointer;     // uv 0..1 — current cursor
uniform vec2 uPointerPrev; // uv 0..1 — cursor one frame ago (stroke start)
uniform vec2 uPointerVel;  // uv / sec
uniform vec2 uClick;       // uv 0..1
uniform float uClickStr;
uniform float uFlow;
uniform float uDrift;
uniform float uDissipation;

${NOISE_GLSL}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 ap = vec2(uv.x * aspect, uv.y); // aspect space → isotropic flow

  // ambient velocity — a divergence-free curl flow whose sampling position is
  // itself warped by slow time-noise, so the flow MORPHS over time (not a uniform
  // scroll). Streamlines keep changing → the mist gathers, disperses and re-forms
  // instead of holding one shape or sliding in one direction.
  vec2 fp = ap * 1.5;
  fp += 0.6 * vec2(
    fbm3(ap * 0.7 + vec2(0.0, uTime * 0.03)),
    fbm3(ap * 0.7 + vec2(5.0, 2.0) - vec2(0.0, uTime * 0.027))
  );
  vec2 vel = curl(fp) * uFlow;
  vel.y *= 0.5;            // suppress vertical motion → layered, horizontal mist
  vel.x += uDrift;         // gentle sideways drift, like mist through a valley
  vel.y += uDrift * 0.12;

  // pointer wake — a fine pen-tip stroke through the mist. We measure the
  // distance to the SEGMENT the cursor swept this frame (a continuous thin
  // scratch, not a fat dot) and shove smoke perpendicular to it, to both sides,
  // so the mist opens cleanly and disperses. Speed-driven, so a still cursor
  // does nothing — bodiless smoke, no carry, no spring-back.
  vec2 a = vec2(uPointerPrev.x * aspect, uPointerPrev.y);
  vec2 b = vec2(uPointer.x * aspect, uPointer.y);
  vec2 ab = b - a;
  float tt = clamp(dot(ap - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  vec2 toSeg = ap - (a + tt * ab);
  float dist2 = dot(toSeg, toSeg);
  float infl = exp(-dist2 * 2500.0);
  float speed = length(uPointerVel);
  vec2 outward = toSeg * inversesqrt(dist2 + 1e-5);
  vel += outward * infl * speed * 0.9;                 // open a thin scratch
  vel += vec2(-toSeg.y, toSeg.x) * infl * speed * 0.25; // faint wake curl only

  // semi-Lagrangian advection: trace back along velocity and carry the dye.
  // because the buffer is persistent, pushed dye STAYS pushed and drifts on.
  vec2 prevUv = uv - vel * uDt;
  float dye = texture2D(uPrev, prevUv).r;

  // dissipate toward empty so disturbances slowly clear (no rest pose to snap to)
  dye *= uDissipation;

  // ambient source — soft, horizontally LAYERED wisps (morning mountain mist).
  // Vertical squash elongates features sideways into fog layers; they are seeded
  // in place and the morphing flow above stretches, drifts and dissolves them.
  vec2 mp = vec2(ap.x * 1.1, ap.y * 4.2);
  vec2 sw = vec2(
    fbm3(mp + vec2(0.0, uTime * 0.025)),
    fbm3(mp + vec2(4.0, 2.0) - vec2(0.0, uTime * 0.022))
  );
  float src = fbm3(mp * 1.3 + 1.2 * sw);
  src = smoothstep(0.42, 0.9, src);
  dye += src * 0.0055;

  // click releases an ink puff that now persists and disperses via the flow
  vec2 toC = ap - vec2(uClick.x * aspect, uClick.y);
  dye += uClickStr * exp(-dot(toC, toC) * 70.0) * 0.5;

  dye = clamp(dye, 0.0, 1.0);
  gl_FragColor = vec4(vec3(dye), 1.0);
}
`;

// DISPLAY: dye buffer → masked, coloured mist on screen
const DISPLAY_FRAG = `
precision highp float;

uniform sampler2D uDye;
uniform vec2 uRes;
uniform float uIntensity;
uniform vec3 uColor;
uniform vec3 uGold;
uniform float uGoldAmount;

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float d = texture2D(uDye, uv).r;

  // soft feather — wide, low-contrast veil like diffuse morning haze
  float smoke = smoothstep(0.03, 0.6, d);

  // gentle, EVEN presence across the whole canvas, only slightly calmer over the
  // bright photo (right) and the very top
  float side = mix(1.0, 0.62, smoothstep(0.5, 1.0, uv.x));
  float vert = mix(0.78, 1.0, 1.0 - uv.y);

  // a little "flowing gold" — the denser drifting wisps catch a warm copper
  // sheen, so the gold moves with the mist (theme accent, kept subtle)
  vec3 mist = mix(uColor, uGold, smoothstep(0.12, 0.55, d) * uGoldAmount);

  float a = smoke * side * vert * uIntensity;
  gl_FragColor = vec4(mist * a, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function buildProgram(gl: WebGLRenderingContext, vert: string, frag: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, vert);
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  return program;
}

interface InkBackgroundProps {
  className?: string;
  /** Override INK_CONFIG.intensity for a specific mount. */
  intensity?: number;
}

const InkBackground = ({ className, intensity }: InkBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const updateProgram = buildProgram(gl, QUAD_VERT, UPDATE_FRAG);
    const displayProgram = buildProgram(gl, QUAD_VERT, DISPLAY_FRAG);
    if (!updateProgram || !displayProgram) return;

    // full-screen triangle, shared by both passes
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const bindQuad = (program: WebGLProgram) => {
      const aPos = gl.getAttribLocation(program, "aPos");
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    };

    const uUpd = (n: string) => gl.getUniformLocation(updateProgram, n);
    const uDis = (n: string) => gl.getUniformLocation(displayProgram, n);

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const maxDim = isTouch ? INK_CONFIG.maxDimTouch : INK_CONFIG.maxDim;

    // ping-pong dye targets
    type Target = { tex: WebGLTexture; fbo: WebGLFramebuffer };
    let targets: Target[] = [];
    let simW = 0;
    let simH = 0;

    const makeTarget = (w: number, h: number): Target | null => {
      const tex = gl.createTexture();
      const fbo = gl.createFramebuffer();
      if (!tex || !fbo) return null;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return { tex, fbo };
    };

    const disposeTargets = () => {
      for (const t of targets) {
        gl.deleteTexture(t.tex);
        gl.deleteFramebuffer(t.fbo);
      }
      targets = [];
    };

    const allocate = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(1, maxDim / Math.max(rect.width, rect.height));
      simW = Math.max(1, Math.round(rect.width * scale));
      simH = Math.max(1, Math.round(rect.height * scale));
      canvas.width = simW;
      canvas.height = simH;

      disposeTargets();
      const a = makeTarget(simW, simH);
      const b = makeTarget(simW, simH);
      if (!a || !b) return;
      targets = [a, b];
      // clear both to empty
      for (const t of targets) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
        gl.viewport(0, 0, simW, simH);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    allocate();

    // pointer — smoothed position + velocity (disturbance follows motion)
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, prevX: 0.5, prevY: 0.5, vx: 0, vy: 0 };
    const click = { x: 0.5, y: 0.5, str: 0 };

    const toLocal = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return { x: (clientX - rect.left) / rect.width, y: 1 - (clientY - rect.top) / rect.height };
    };

    const onMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e.clientX, e.clientY);
      if (x < -0.1 || x > 1.1 || y < -0.1 || y > 1.1) return;
      pointer.tx = x;
      pointer.ty = y;
    };
    const onDown = (e: PointerEvent) => {
      const { x, y } = toLocal(e.clientX, e.clientY);
      click.x = x;
      click.y = y;
      click.str = 1;
    };
    if (INK_CONFIG.interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frameMs = 1000 / INK_CONFIG.fps;
    const dyeIntensity = intensity ?? INK_CONFIG.intensity;

    let raf = 0;
    let visible = true;
    let lastDraw = 0;
    let read = 0;
    const start = performance.now();

    const step = (now: number, dt: number) => {
      // pointer velocity (uv / sec) — track snappily so the stroke stays in sync
      // with the cursor (lag is what reads as drag / resistance)
      const ax = pointer.prevX;
      const ay = pointer.prevY;
      pointer.x += (pointer.tx - pointer.x) * 0.32;
      pointer.y += (pointer.ty - pointer.y) * 0.32;
      const inv = dt > 0 ? 1 / dt : 0;
      const vx = (pointer.x - ax) * inv;
      const vy = (pointer.y - ay) * inv;
      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;
      pointer.vx += (vx - pointer.vx) * 0.5;
      pointer.vy += (vy - pointer.vy) * 0.5;
      const vmag = Math.hypot(pointer.vx, pointer.vy);
      const vclamp = vmag > 3.5 ? 3.5 / vmag : 1;
      click.str *= 0.972;

      const src = targets[read];
      const dst = targets[read ^ 1];

      // UPDATE pass → dst
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
      gl.viewport(0, 0, simW, simH);
      gl.useProgram(updateProgram);
      bindQuad(updateProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, src.tex);
      gl.uniform1i(uUpd("uPrev"), 0);
      gl.uniform2f(uUpd("uRes"), simW, simH);
      gl.uniform1f(uUpd("uTime"), (now - start) / 1000);
      gl.uniform1f(uUpd("uDt"), dt);
      gl.uniform2f(uUpd("uPointer"), pointer.x, pointer.y);
      gl.uniform2f(uUpd("uPointerPrev"), ax, ay);
      gl.uniform2f(
        uUpd("uPointerVel"),
        pointer.vx * vclamp * INK_CONFIG.interaction,
        pointer.vy * vclamp * INK_CONFIG.interaction
      );
      gl.uniform2f(uUpd("uClick"), click.x, click.y);
      gl.uniform1f(uUpd("uClickStr"), click.str);
      gl.uniform1f(uUpd("uFlow"), INK_CONFIG.flowSpeed);
      gl.uniform1f(uUpd("uDrift"), INK_CONFIG.driftSpeed);
      gl.uniform1f(uUpd("uDissipation"), INK_CONFIG.dissipation);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      read ^= 1;
    };

    const present = () => {
      const dye = targets[read];
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, simW, simH);
      gl.useProgram(displayProgram);
      bindQuad(displayProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dye.tex);
      gl.uniform1i(uDis("uDye"), 0);
      gl.uniform2f(uDis("uRes"), simW, simH);
      gl.uniform1f(uDis("uIntensity"), dyeIntensity);
      gl.uniform3f(uDis("uColor"), INK_CONFIG.color[0], INK_CONFIG.color[1], INK_CONFIG.color[2]);
      gl.uniform3f(uDis("uGold"), INK_CONFIG.gold[0], INK_CONFIG.gold[1], INK_CONFIG.gold[2]);
      gl.uniform1f(uDis("uGoldAmount"), INK_CONFIG.goldAmount);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (!visible) {
        lastDraw = now;
        return;
      }
      if (now - lastDraw < frameMs) return;
      const dt = Math.min(0.05, (now - lastDraw) / 1000);
      lastDraw = now;
      step(now, dt);
      present();
    };

    if (reduceMotion) {
      // settle a still field, then present one frame
      for (let i = 0; i < 80; i++) step(start + i * 33, 0.033);
      present();
    } else {
      raf = requestAnimationFrame(render);
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) visible = false;
    };
    document.addEventListener("visibilitychange", onVisibility);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        allocate();
        if (reduceMotion) {
          for (let i = 0; i < 80; i++) step(start + i * 33, 0.033);
          present();
        }
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      if (INK_CONFIG.interactive) {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
      }
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(resizeTimer);
      disposeTargets();
      gl.deleteProgram(updateProgram);
      gl.deleteProgram(displayProgram);
      gl.deleteBuffer(buffer);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: "block", width: "100%", height: "100%", opacity: INK_CONFIG.opacity }}
    />
  );
};

export default InkBackground;
