import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

const authorization = read("src/lib/student-authorization.ts");
const contactPage = read("src/app/contact/page.tsx");
const submitRoute = read("src/app/api/submit-contact/route.ts");

test("authorization terms identify the signer without granting group authority", () => {
  assert.match(authorization, /表單「姓名」欄位所填寫之真實姓名/);
  assert.match(authorization, /授權人及簽約人/);
  assert.match(authorization, /其他可辨識表演者仍須個別同意/);
  assert.match(authorization, /法定代理人作為簽約人/);
});

test("standard checkbox authorization stays narrow", () => {
  assert.match(authorization, /STUDENT_AUTHORIZATION_VERSION = "1\.1"/);
  assert.match(authorization, /STUDENT_AUTHORIZATION_TERM_YEARS = 10/);
  assert.match(authorization, /十年/);
  assert.match(authorization, /不包含付費廣告投放/);
  assert.match(authorization, /人工智慧模型訓練/);
  assert.match(authorization, /正式電子簽署/);
});

test("contact form collects eligibility and records the decision", () => {
  assert.match(contactPage, /name="studentAgeStatus"/);
  assert.match(contactPage, /name="studentPerformerScope"/);
  assert.match(contactPage, /name="studentGuardianName"/);
  assert.match(contactPage, /name="studentAgreementAccepted"/);
  assert.match(contactPage, /studentAuthorizationVersion/);
  assert.match(contactPage, /studentContractingParty/);
  assert.match(contactPage, /studentConsentMode/);
  assert.match(contactPage, /<dialog/);
  assert.match(contactPage, /showModal\(\)/);
  assert.match(contactPage, /aria-haspopup="dialog"/);
  assert.match(contactPage, /onCancel=/);
  assert.doesNotMatch(contactPage, /<details/);
});

test("server validates and timestamps student authorization evidence", () => {
  assert.match(submitRoute, /studentTermsAcknowledged === true/);
  assert.match(submitRoute, /studentAuthorizationCompleted === true/);
  assert.match(submitRoute, /studentAuthorizationVersion === STUDENT_AUTHORIZATION_VERSION/);
  assert.match(submitRoute, /body\.pricingPlan === studentCollaborationPlan\.name/);
  assert.match(submitRoute, /allowedStudentAddOnNames\.has\(addOn\)/);
  assert.match(submitRoute, /allowedAddOnNames\.has\(addOn\)/);
  assert.match(submitRoute, /getStudentConsentMode/);
  assert.match(submitRoute, /studentContractingParty === expectedContractingParty/);
  assert.match(submitRoute, /studentTermsServerAcknowledgedAt/);
  assert.match(submitRoute, /studentAuthorizationServerAcceptedAt/);
  assert.match(submitRoute, /studentAuthorizationIp/);
  assert.match(submitRoute, /studentAuthorizationUserAgent/);
});
