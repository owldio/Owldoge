# Professional Recording Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct company-level Owldio copy so it presents the business as a professional concert recording team while retaining student-specific promotion language.

**Architecture:** Keep the existing Next.js page and component structure. Make literal copy-only changes in the root metadata, About metadata and introduction, and navigation brand label, then verify the exact copy with a one-time assertion command plus the existing project checks.

**Tech Stack:** Next.js 15, React 19, TypeScript, Node built-in test runner

## Global Constraints

- The visible About sentence must use `專注於音樂會專業錄製的團隊` verbatim.
- The navigation brand label must be `RECORDING`, not `CONCERT RECORDING`.
- Student-project and student-pricing language remains student-specific.
- Do not change layout, typography, pricing, service definitions, or runtime behavior.
- Do not add a permanent test that merely locks human-facing prose to an exact string.
- Do not include generated files under `output/` in a Git commit.

---

### Task 1: Correct company-level brand positioning

**Files:**
- Modify: `src/app/layout.tsx:24-73`
- Modify: `src/app/about/layout.tsx:4-8`
- Modify: `src/app/about/page.tsx:157-160`
- Modify: `src/components/Navigation.tsx:64-71`

**Interfaces:**
- Consumes: Existing Next.js metadata objects and static JSX copy.
- Produces: Public metadata and rendered navigation/About copy with the approved professional-recording positioning.

- [x] **Step 1: Record the pre-change copy evidence**

```powershell
rg -n "Owldio Studio \| 音樂會錄影、錄音、直播與後製服務|關於我們 — 校園音樂會錄影錄音團隊|專注校園音樂會錄製的新創團隊|CONCERT RECORDING" src/app/layout.tsx src/app/about/layout.tsx src/app/about/page.tsx src/components/Navigation.tsx
```

Expected: the command finds the old company-level positioning in the four target files.

- [x] **Step 2: Apply the minimal copy changes**

In `src/app/layout.tsx`, set all three root social/title variants to:

```typescript
'Owldio Studio | 專業音樂會錄影、錄音、直播與後製服務'
```

In `src/app/about/layout.tsx`, use:

```typescript
title: '關於我們 — 專業音樂會錄影錄音團隊',
description: 'Owldio Studio 是專注於音樂會專業錄製的團隊，提供 4K 錄影、多軌錄音、直播與後製，協助演出者留下專業作品。',
```

In `src/app/about/page.tsx`, preserve the responsive break and use:

```tsx
專注於音樂會專業錄製的團隊，<br className="hidden sm:block" />用心為每一場演出留下最珍貴的瞬間。
```

In `src/components/Navigation.tsx`, use:

```tsx
RECORDING
```

- [x] **Step 3: Verify exact new copy and preserved student positioning**

Run this one-time assertion without creating a permanent test file:

```powershell
@'
const fs = require('node:fs');
const assert = require('node:assert/strict');
const read = (path) => fs.readFileSync(path, 'utf8');
const rootLayout = read('src/app/layout.tsx');
const aboutLayout = read('src/app/about/layout.tsx');
const aboutPage = read('src/app/about/page.tsx');
const navigation = read('src/components/Navigation.tsx');
const studentLayout = read('src/app/student-projects/layout.tsx');
assert.match(rootLayout, /Owldio Studio \| 專業音樂會錄影、錄音、直播與後製服務/);
assert.match(aboutLayout, /關於我們 — 專業音樂會錄影錄音團隊/);
assert.match(aboutLayout, /Owldio Studio 是專注於音樂會專業錄製的團隊/);
assert.match(aboutPage, /專注於音樂會專業錄製的團隊，<br/);
assert.match(navigation, />\s*RECORDING\s*</);
assert.doesNotMatch(navigation, /CONCERT RECORDING/);
assert.match(studentLayout, /學生作品授權合作方案 — 校園音樂會錄影錄音/);
console.log('brand positioning copy: PASS');
'@ | node
```

- [x] **Step 4: Run full verification**

Run these commands separately and require exit code 0 from each:

```powershell
node --test tests/*.test.mjs
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

- [x] **Step 5: Review scope and commit implementation**

Inspect `git diff --check`, `git diff --stat`, and the full diff. Confirm that `output/` is untracked and unstaged. Stage only the plan, test, and four production files, then commit:

```powershell
git add -- docs/superpowers/specs/2026-08-12-professional-recording-positioning-design.md docs/superpowers/plans/2026-08-12-professional-recording-positioning.md src/app/layout.tsx src/app/about/layout.tsx src/app/about/page.tsx src/components/Navigation.tsx
git commit -m "fix: clarify professional recording positioning"
```
