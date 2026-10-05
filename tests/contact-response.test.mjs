import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'esbuild';

const result = await build({
  entryPoints: ['src/lib/contact-response.ts'], bundle: true, format: 'esm',
  platform: 'browser', write: false, tsconfig: 'tsconfig.json',
});
const { isContactResponseSuccessful } = await import(
  `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
);

test('clients require both a successful HTTP response and explicit application success', async () => {
  assert.equal(await isContactResponseSuccessful(Response.json({ status: 'success' })), true);
  assert.equal(await isContactResponseSuccessful(Response.json({
    status: 'success', message: '表單已成功提交',
  }, { headers: { 'Content-Type': 'application/json; charset=utf-8' } })), true);
  for (const body of [{ status: 'error' }, { status: 'pending' }, {}, null, [], 'success']) {
    assert.equal(await isContactResponseSuccessful(Response.json(body)), false);
  }
  for (const body of ['', '{', '<html>Login required</html>']) {
    assert.equal(await isContactResponseSuccessful(new Response(body)), false);
  }
  assert.equal(await isContactResponseSuccessful(Response.json({ status: 'success' }, { status: 503 })), false);
  assert.equal(await isContactResponseSuccessful(new Response(null, { status: 204 })), false);
});
