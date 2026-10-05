import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';

const result = await build({
  entryPoints: ['tooling/cloudflare/worker.ts'], bundle: true, format: 'esm',
  platform: 'browser', write: false, tsconfig: 'tsconfig.json',
});
const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const request = (body) => new Request('https://preview.invalid/api/submit-contact', {
  method: 'POST', headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1' },
  body: JSON.stringify(body),
});
const env = { GOOGLE_SCRIPT_URL: 'https://upstream.invalid/exec', ASSETS: {
  fetch: async () => new Response('static page'),
} };

test('rejects malformed JSON, non-object bodies and incomplete applications without contacting upstream', async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Unexpected external request'); };
  try {
    const invalid = new Request('https://preview.invalid/api/submit-contact', { method: 'POST', body: '{' });
    assert.equal((await worker.fetch(invalid, env)).status, 400);
    for (const body of [null, [], { requestType: 'booking' }, {
      requestType: 'booking', applicationNoticeAccepted: true, applicationNoticeVersion: '1.0',
      studentPlanRequested: true, studentAuthorizationCompleted: true,
    }]) {
      assert.equal((await worker.fetch(request(body), env)).status, 400);
    }
  } finally { globalThis.fetch = previous; }
});

test('forwards contact data using the server binding and returns uncached upstream response', async () => {
  const previous = globalThis.fetch;
  let submitted;
  globalThis.fetch = async (url, init) => {
    assert.equal(url, env.GOOGLE_SCRIPT_URL);
    submitted = JSON.parse(init.body);
    return Response.json({ status: 'success' });
  };
  try {
    const body = { name: 'Local test', requestType: 'contact', email: 'test@example.invalid' };
    const response = await worker.fetch(request(body), env);
    assert.deepEqual(submitted, body);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.deepEqual(await response.json(), { status: 'success' });
  } finally { globalThis.fetch = previous; }
});

test('preserves upstream failures instead of returning success', async () => {
  const previous = globalThis.fetch;
  try {
    globalThis.fetch = async () => Response.json({ status: 'error' }, { status: 503 });
    assert.equal((await worker.fetch(request({ requestType: 'contact' }), env)).status, 503);
    globalThis.fetch = async () => { throw new Error('Connection failed'); };
    assert.equal((await worker.fetch(request({ requestType: 'contact' }), env)).status, 502);
    assert.equal((await worker.fetch(request({ requestType: 'contact' }), { ...env, GOOGLE_SCRIPT_URL: undefined })).status, 500);
  } finally { globalThis.fetch = previous; }
});

test('rejects HTTP 200 upstream failures and unconfirmed responses without exposing upstream details', async () => {
  const previous = globalThis.fetch;
  const invalidResponses = [
    JSON.stringify({ status: 'error', message: 'Private upstream diagnostic' }),
    JSON.stringify({ status: 'pending' }),
    JSON.stringify({ message: 'OK' }),
    'null', '[]', '"success"', '', '{', '<html>Login required</html>',
  ];
  try {
    for (const requestType of ['booking', 'simple_email']) {
      for (const body of invalidResponses) {
        globalThis.fetch = async () => new Response(body, { status: 200 });
        const response = await worker.fetch(request({
          requestType, applicationNoticeAccepted: true, applicationNoticeVersion: '1.0',
        }), env);
        assert.equal(response.status, 502, `${requestType}: ${body}`);
        assert.equal(response.headers.get('Cache-Control'), 'no-store');
        assert.deepEqual(await response.json(), { status: 'error', message: 'Upstream request failed' });
      }
    }
  } finally { globalThis.fetch = previous; }
});

test('booking and student applications retain non-binding evidence and trusted Cloudflare IP', async () => {
  const previous = globalThis.fetch;
  const forwarded = [];
  globalThis.fetch = async (_url, init) => {
    forwarded.push(JSON.parse(init.body));
    return Response.json({ status: 'success' });
  };
  const booking = {
    requestType: 'booking', applicationNoticeAccepted: true, applicationNoticeVersion: '1.0',
    pricingPlan: '單機方案', addOns: [],
  };
  const student = {
    ...booking, studentPlanRequested: true, pricingPlan: '學生作品授權合作方案',
    studentApplicationNoticeAcknowledged: true, studentAuthorizationVersion: '1.2',
    studentAuthorizationCompleted: false, studentAgeStatus: 'minor', studentPerformerScope: 'group',
    studentApplicantName: 'Local student test', studentGuardianName: 'Local guardian test',
    studentGuardianEmail: 'guardian@example.invalid', studentFutureContractingParty: 'Local guardian test',
    studentConsentMode: 'enhanced-signature-required',
  };
  try {
    for (const body of [booking, student]) {
      const incoming = request(body);
      incoming.headers.set('X-Forwarded-For', 'spoofed-ip, 192.0.2.2');
      incoming.headers.set('X-Real-IP', 'spoofed-ip');
      incoming.headers.set('User-Agent', 'Local migration test');
      assert.equal((await worker.fetch(incoming, env)).status, 200);
    }
    for (const body of forwarded) {
      assert.equal(body.applicationNoticeIp, '192.0.2.1');
      assert.equal(body.applicationNoticeUserAgent, 'Local migration test');
      assert.ok(Number.isFinite(Date.parse(body.applicationNoticeServerAcknowledgedAt)));
    }
    assert.equal(forwarded[1].studentApplicationNoticeIp, '192.0.2.1');
    assert.equal(forwarded[1].studentAuthorizationCompleted, false);
    assert.ok(Number.isFinite(Date.parse(forwarded[1].studentApplicationNoticeServerAcknowledgedAt)));
    assert.equal((await worker.fetch(request({ ...student, studentAuthorizationCompleted: true }), env)).status, 400);
    assert.equal((await worker.fetch(request({ ...student, studentGuardianEmail: '' }), env)).status, 400);
    assert.equal((await worker.fetch(request({ ...student, addOns: ['unknown add-on'] }), env)).status, 400);
    assert.equal(forwarded.length, 2);
  } finally { globalThis.fetch = previous; }
});

test('limits API methods, returns 404 for unknown API paths and forwards static pages to assets', async () => {
  const response = await worker.fetch(new Request('https://preview.invalid/api/submit-contact'), env);
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('Allow'), 'POST');
  assert.equal((await worker.fetch(new Request('https://preview.invalid/api/unknown'), env)).status, 404);
  assert.equal(await (await worker.fetch(new Request('https://preview.invalid/pricing'), env)).text(), 'static page');
});
