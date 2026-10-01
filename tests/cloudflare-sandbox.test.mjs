import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { buildSandboxScript } from '../tooling/cloudflare/prepare-sandbox.mjs';

const source = await readFile(new URL('../google-apps-script/Code.gs', import.meta.url), 'utf8');
const generated = buildSandboxScript(source);

function harness(values = {}, services = {}) {
  let externalCalls = 0;
  const context = vm.createContext({
    PropertiesService: { getScriptProperties: () => ({ getProperty: name => values[name], setProperties: entries => Object.assign(values, entries) }) },
    ScriptApp: { getScriptId: () => 'sandbox-script' },
    Session: { getEffectiveUser: () => ({ getEmail: () => 'owner@example.com' }) },
    SpreadsheetApp: { openById: () => { externalCalls++; throw new Error('Unexpected spreadsheet access'); } },
    MailApp: { sendEmail: () => { externalCalls++; throw new Error('Unexpected email'); } },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput: text => ({ text, setMimeType() { return this; } }),
    },
    console: { log() {}, error() {} },
    ...services,
  });
  vm.runInContext(generated, context);
  return { context, externalCalls: () => externalCalls };
}

test('sandbox source removes production spreadsheet and notification constants', () => {
  const productionId = source.match(/const SPREADSHEET_ID = '([^']+)'/)[1];
  assert.ok(!generated.includes(productionId));
  assert.ok(!generated.includes("const NOTIFICATION_EMAIL = 'owldio.art@gmail.com'"));
  assert.throws(() => buildSandboxScript(source.replace('function doPost(e)', 'function other(e)')));
});

test('setup creates only one named sheet across separate script executions', () => {
  const properties = {};
  let created = 0;
  let sheetName;
  const spreadsheet = {
    getId: () => 'new-sheet',
    getUrl: () => 'https://docs.google.com/spreadsheets/d/new-sheet',
    getName: () => 'OWLDIO CF Migration Sandbox 2026-10-01',
    getSheets: () => [{ setName: name => { sheetName = name; } }],
  };
  const services = {
    SpreadsheetApp: {
      create: name => {
        assert.equal(name, spreadsheet.getName());
        created++;
        return spreadsheet;
      },
      openById: id => { assert.equal(id, 'new-sheet'); return spreadsheet; },
    },
    Utilities: { getUuid: () => 'random-test-token-' },
  };
  harness(properties, services).context.setupSandbox();
  harness(properties, services).context.setupSandbox();
  assert.equal(created, 1);
  assert.equal(sheetName, 'Form_Responses');
  assert.equal(properties.SANDBOX_NOTIFICATION_EMAIL, 'owner@example.com');
  assert.equal(properties.SANDBOX_SCRIPT_ID, 'sandbox-script');
  assert.ok(properties.SANDBOX_TOKEN);
});

test('authorized sandbox submission writes only the sandbox and emails its owner', () => {
  const rows = [];
  const emails = [];
  const range = { setValues() {}, setFontWeight() {}, setBackground() {} };
  const sheet = {
    getMaxColumns: () => 30,
    getLastColumn: () => 0,
    getRange: () => range,
    appendRow: row => rows.push(row),
  };
  const run = harness({
    SANDBOX_MARKER: 'OWLDIO_CF_MIGRATION_SANDBOX_V1',
    SANDBOX_SCRIPT_ID: 'sandbox-script',
    SANDBOX_SPREADSHEET_ID: 'new-sheet',
    SANDBOX_NOTIFICATION_EMAIL: 'owner@example.com',
    SANDBOX_TOKEN: 'correct',
  }, {
    SpreadsheetApp: { openById: id => {
      assert.equal(id, 'new-sheet');
      return { getName: () => 'OWLDIO CF Migration Sandbox 2026-10-01', getSheetByName: () => sheet };
    } },
    MailApp: { sendEmail: email => emails.push(email) },
  });
  const result = run.context.doPost({
    parameter: { sandboxToken: 'correct' },
    postData: { contents: JSON.stringify({ name: 'Synthetic applicant', email: 'customer@example.com' }) },
  });
  assert.equal(JSON.parse(result.text).status, 'success');
  assert.equal(rows.length, 1);
  assert.equal(emails.length, 1);
  assert.equal(emails[0].to, 'owner@example.com');
});

test('correct identity still refuses a sheet outside the named sandbox', () => {
  const run = harness({
    SANDBOX_MARKER: 'OWLDIO_CF_MIGRATION_SANDBOX_V1',
    SANDBOX_SCRIPT_ID: 'sandbox-script',
    SANDBOX_SPREADSHEET_ID: 'other-sheet',
    SANDBOX_NOTIFICATION_EMAIL: 'owner@example.com',
  }, { SpreadsheetApp: { openById: () => ({ getName: () => 'Production sheet' }) } });
  assert.throws(() => run.context.recordToSheet({}), /outside the named sandbox/);
  assert.throws(() => run.context.sendEmailNotification({}), /outside the named sandbox/);
  assert.equal(run.externalCalls(), 0);
});

test('missing or incorrect sandbox token cannot write data or email', () => {
  for (const values of [{}, { SANDBOX_TOKEN: 'correct' }]) {
    const run = harness(values);
    const result = run.context.doPost({ parameter: { sandboxToken: 'wrong' } });
    assert.equal(JSON.parse(result.text).status, 'error');
    assert.equal(run.externalCalls(), 0);
  }
});

test('direct writer and notification functions refuse an unconfigured sandbox', () => {
  const run = harness();
  for (const name of ['recordToSheet', 'sendEmailNotification', 'handleSimpleEmail']) {
    assert.throws(() => run.context[name]({}), /Sandbox is not configured/);
  }
  assert.equal(run.externalCalls(), 0);
});

test('another script or notification owner cannot reuse sandbox configuration', () => {
  for (const changed of [{ SANDBOX_SCRIPT_ID: 'different-script' }, { SANDBOX_NOTIFICATION_EMAIL: 'customer@example.com' }]) {
    const run = harness({
      SANDBOX_MARKER: 'OWLDIO_CF_MIGRATION_SANDBOX_V1',
      SANDBOX_SCRIPT_ID: 'sandbox-script',
      SANDBOX_SPREADSHEET_ID: 'new-sheet',
      SANDBOX_NOTIFICATION_EMAIL: 'owner@example.com',
      ...changed,
    });
    assert.throws(() => run.context.recordToSheet({}), /Sandbox is not configured/);
    assert.equal(run.externalCalls(), 0);
  }
});
