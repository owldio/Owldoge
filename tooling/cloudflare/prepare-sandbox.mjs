import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function buildSandboxScript(source) {
  const replacements = [
    [/const SPREADSHEET_ID = '[^']+';/g, "const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SANDBOX_SPREADSHEET_ID') || '';"],
    [/const NOTIFICATION_EMAIL = '[^']+';/g, "const NOTIFICATION_EMAIL = PropertiesService.getScriptProperties().getProperty('SANDBOX_NOTIFICATION_EMAIL') || '';"],
    [/function doPost\(e\) \{/g, `function doPost(e) {
  const properties = PropertiesService.getScriptProperties();
  const token = properties.getProperty('SANDBOX_TOKEN');
  if (!token || !e || !e.parameter || e.parameter.sandboxToken !== token) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: 'Sandbox authorization required'})).setMimeType(ContentService.MimeType.JSON);
  }
  assertSandboxReady();`],
    [/function recordToSheet\(data\) \{/g, 'function recordToSheet(data) {\n  assertSandboxReady();'],
    [/function handleSimpleEmail\(data\) \{/g, 'function handleSimpleEmail(data) {\n  assertSandboxReady();'],
    [/function sendEmailNotification\(data\) \{/g, 'function sendEmailNotification(data) {\n  assertSandboxReady();'],
  ];
  let result = source;
  for (const [pattern, replacement] of replacements) {
    if ([...result.matchAll(pattern)].length !== 1) {
      throw new Error(`Expected exactly one sandbox replacement: ${pattern.source}`);
    }
    result = result.replace(pattern, replacement);
  }
  return result + `

// Run only in a NEW standalone Apps Script project, never in the production project.
function setupSandbox() {
  const properties = PropertiesService.getScriptProperties();
  if (properties.getProperty('SANDBOX_SPREADSHEET_ID')) {
    assertSandboxReady();
    console.log('Sandbox already configured. Spreadsheet: ' + SPREADSHEET_ID);
    return;
  }
  const ownerEmail = Session.getEffectiveUser().getEmail();
  if (!ownerEmail) throw new Error('Cannot identify the sandbox owner');
  const spreadsheet = SpreadsheetApp.create('OWLDIO CF Migration Sandbox 2026-10-01');
  spreadsheet.getSheets()[0].setName(SHEET_NAME);
  properties.setProperties({
    SANDBOX_SPREADSHEET_ID: spreadsheet.getId(),
    SANDBOX_NOTIFICATION_EMAIL: ownerEmail,
    SANDBOX_SCRIPT_ID: ScriptApp.getScriptId(),
    SANDBOX_TOKEN: Utilities.getUuid() + Utilities.getUuid(),
    SANDBOX_MARKER: 'OWLDIO_CF_MIGRATION_SANDBOX_V1'
  });
  console.log('Sandbox spreadsheet: ' + spreadsheet.getUrl());
  console.log('Notifications go only to the script owner: ' + ownerEmail);
  // Retrieve SANDBOX_TOKEN from Script Properties, never publish it in logs or source.
}

function assertSandboxReady() {
  const properties = PropertiesService.getScriptProperties();
  if (properties.getProperty('SANDBOX_MARKER') !== 'OWLDIO_CF_MIGRATION_SANDBOX_V1' ||
      properties.getProperty('SANDBOX_SCRIPT_ID') !== ScriptApp.getScriptId() ||
      !SPREADSHEET_ID || !NOTIFICATION_EMAIL ||
      NOTIFICATION_EMAIL !== Session.getEffectiveUser().getEmail()) {
    throw new Error('Sandbox is not configured for this script and owner');
  }
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  if (spreadsheet.getName() !== 'OWLDIO CF Migration Sandbox 2026-10-01') {
    throw new Error('Refusing to use a spreadsheet outside the named sandbox');
  }
}
`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const source = await readFile('google-apps-script/Code.gs', 'utf8');
  const destination = resolve('.cloudflare-build/google-sandbox');
  await mkdir(destination, { recursive: true });
  await writeFile(resolve(destination, 'Code.gs'), buildSandboxScript(source));
  console.log(`Prepared isolated Apps Script source: ${destination}/Code.gs`);
}
