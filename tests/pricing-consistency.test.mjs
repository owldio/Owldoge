import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

const pricingData = read("src/lib/pricing.ts");
const studentAuthorization = read("src/lib/student-authorization.ts");
const pricingPage = read("src/app/pricing/page.tsx");
const studentPage = read("src/app/student-projects/page.tsx");
const studentLayout = read("src/app/student-projects/layout.tsx");
const servicesPage = read("src/app/services/page.tsx");
const contactPage = read("src/app/contact/page.tsx");
const googleAppsScript = read("google-apps-script/Code.gs");

test("public prices have one canonical source", () => {
  assert.match(pricingData, /price: 7800/);
  assert.match(pricingData, /price: 14800/);
  assert.match(pricingData, /price: 21200/);
  assert.match(pricingData, /price: 3300/);
  assert.match(pricingData, /name: "多機位升級"/);
  assert.match(pricingData, /name: "延長錄製", amount: 1200, unit: "起 \/ 30 分鐘"/);

  for (const page of [pricingPage, studentPage, servicesPage, contactPage]) {
    assert.doesNotMatch(
      page,
      /NT\$\s*(?:3,300|7,800|10,500|14,800|18,800|21,200|27,200)/,
      "page components must render prices from src/lib/pricing.ts"
    );
  }
});

test("pricing pages consume the shared catalog", () => {
  assert.match(pricingPage, /standardPlans\.map/);
  assert.match(studentPage, /standardPlans\.map/);
  assert.match(servicesPage, /serviceCatalog\.map/);
  assert.match(contactPage, /standardPlans\.map/);
  assert.match(contactPage, /studentCollaborationPlan\.contactValue/);
});

test("retired discount claims and mismatched deliverables stay removed", () => {
  const reviewedCopy = [pricingPage, studentPage, studentLayout, servicesPage, contactPage].join("\n");

  assert.doesNotMatch(reviewedCopy, /最高省\s*45%|8\s*折|originalPrice|省 NT\$/);
  assert.doesNotMatch(reviewedCopy, /60 秒精華版|雲端＋USB 交付|實體光碟/);
  assert.doesNotMatch(studentLayout, /多軌錄音|現場直播/);
  assert.doesNotMatch(servicesPage, /母帶處理|多機位 4K 錄影/);
});

test("student offer is described as a conditional collaboration price", () => {
  assert.match(pricingData, /學生作品授權合作方案/);
  assert.match(pricingData, /studentAuthorizationSummary/);
  assert.match(studentAuthorization, /成年單人演出者/);
  assert.match(studentAuthorization, /多人演出或未成年人/);
  assert.match(studentPage, /同規格一般單機方案/);
  assert.match(contactPage, /學生作品授權合作方案/);
});

test("contact pricing decisions are required before submission", () => {
  assert.match(contactPage, /name="useStudentPlan"[\s\S]*?required/);
  assert.match(contactPage, /name="pricingPlan"[\s\S]*?required/);
  assert.match(contactPage, /formData\.useStudentPlan === "no" &&/);
  assert.match(contactPage, /studentCollaborationPlan\.addons/);
  assert.match(contactPage, /name="selectedAddOns"/);
  assert.match(contactPage, /學生方案已固定為單機規格/);
  assert.match(googleAppsScript, /'加購需求'/);
  assert.match(googleAppsScript, /Array\.isArray\(data\.addOns\)/);
  assert.match(contactPage, /addOns: \[/);
  assert.match(contactPage, /name="deliveryTime"[\s\S]*?required/);
  assert.match(contactPage, /name="applicationNoticeAccepted"[\s\S]*?required/);
  assert.match(googleAppsScript, /'申請性質確認', '申請說明版本'/);
  assert.match(googleAppsScript, /不代表契約或授權已成立/);
});
