import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

const authorization = read("src/lib/student-authorization.ts");
const applicationNotice = read("src/lib/application-notice.ts");
const contactPage = read("src/app/contact/page.tsx");
const submitRoute = read("src/app/api/submit-contact/route.ts");

test("contact notice clearly defers contract formation", () => {
  assert.match(applicationNotice, /本表單僅供聯絡、檔期查詢、需求蒐集及報價申請/);
  assert.match(applicationNotice, /不構成服務契約、檔期保留、付款承諾或作品展示授權/);
  assert.match(applicationNotice, /經雙方確認後始成立/);
  assert.match(applicationNotice, /本次送出僅為預約／報價申請/);
  assert.match(applicationNotice, /本次送出僅為申請，不代表服務契約或作品展示授權已成立/);
});

test("student explanation stays non-binding and narrow", () => {
  assert.match(authorization, /STUDENT_AUTHORIZATION_VERSION = "1\.2"/);
  assert.match(authorization, /送出申請不會成立服務契約或作品展示授權/);
  assert.match(authorization, /多人演出時，每位可辨識表演者仍須個別同意/);
  assert.match(authorization, /未成年人則須由法定代理人完成正式電子簽署/);
  assert.match(authorization, /STUDENT_AUTHORIZATION_TERM_YEARS = 10/);
  assert.match(authorization, /十年/);
  assert.match(authorization, /後續標準授權不包含付費廣告投放/);
  assert.match(authorization, /人工智慧模型訓練/);
  assert.doesNotMatch(authorization, /共同成立/);
});

test("contact form collects eligibility and requires one application acknowledgment", () => {
  assert.match(contactPage, /name="studentAgeStatus"/);
  assert.match(contactPage, /name="studentPerformerScope"/);
  assert.match(contactPage, /name="studentGuardianName"/);
  assert.match(contactPage, /name="applicationNoticeAccepted"/);
  assert.match(contactPage, /GENERAL_APPLICATION_ACKNOWLEDGMENT/);
  assert.match(contactPage, /STUDENT_APPLICATION_ACKNOWLEDGMENT/);
  assert.match(contactPage, /studentAuthorizationVersion/);
  assert.match(contactPage, /studentFutureContractingParty/);
  assert.match(contactPage, /studentConsentMode/);
  assert.match(contactPage, /studentAuthorizationCompleted: false/);
  assert.match(contactPage, /text-\[11px\]/);
  assert.match(contactPage, /<dialog/);
  assert.match(contactPage, /showModal\(\)/);
  assert.match(contactPage, /aria-haspopup="dialog"/);
  assert.match(contactPage, /onCancel=/);
  assert.doesNotMatch(contactPage, /name="studentAgreementAccepted"/);
  assert.doesNotMatch(contactPage, /<details/);
});

test("server validates and timestamps application evidence without accepting authorization", () => {
  assert.match(submitRoute, /applicationNoticeAccepted === true/);
  assert.match(submitRoute, /applicationNoticeVersion === APPLICATION_NOTICE_VERSION/);
  assert.match(submitRoute, /studentApplicationNoticeAcknowledged === true/);
  assert.match(submitRoute, /studentAuthorizationCompleted === false/);
  assert.match(submitRoute, /studentAuthorizationVersion === STUDENT_AUTHORIZATION_VERSION/);
  assert.match(submitRoute, /body\.pricingPlan === studentCollaborationPlan\.name/);
  assert.match(submitRoute, /allowedStudentAddOnNames\.has\(addOn\)/);
  assert.match(submitRoute, /allowedAddOnNames\.has\(addOn\)/);
  assert.match(submitRoute, /getStudentConsentMode/);
  assert.match(submitRoute, /studentFutureContractingParty === expectedFutureContractingParty/);
  assert.match(submitRoute, /applicationNoticeServerAcknowledgedAt/);
  assert.match(submitRoute, /studentApplicationNoticeServerAcknowledgedAt/);
  assert.doesNotMatch(submitRoute, /studentAuthorizationServerAcceptedAt/);
});
