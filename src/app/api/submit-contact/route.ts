import { NextRequest, NextResponse } from 'next/server';
import {
  getStudentConsentMode,
  STUDENT_AUTHORIZATION_VERSION,
  type StudentAgeStatus,
  type StudentPerformerScope,
} from '@/lib/student-authorization';
import { APPLICATION_NOTICE_VERSION } from '@/lib/application-notice';
import { addOns, studentCollaborationPlan } from '@/lib/pricing';

type JsonRecord = Record<string, unknown>;

const isJsonRecord = (value: unknown): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isEmailLike = (value: unknown): value is string =>
  isNonEmptyString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const allowedStudentAddOnNames = new Set<string>(
  studentCollaborationPlan.addons.map((addOn) => addOn.name),
);
const allowedAddOnNames = new Set<string>(addOns.map((addOn) => addOn.name));

export async function POST(req: NextRequest) {
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  if (!isJsonRecord(body)) {
    return NextResponse.json(
      { status: 'error', message: 'JSON body must be an object' },
      { status: 400 },
    );
  }

  const isBooking = body.requestType === 'booking';
  const hasValidApplicationNotice =
    body.applicationNoticeAccepted === true &&
    body.applicationNoticeVersion === APPLICATION_NOTICE_VERSION;
  const submittedAddOns = Array.isArray(body.addOns) ? body.addOns : [];
  const hasValidAddOnShape = body.addOns === undefined || Array.isArray(body.addOns);
  const hasValidAddOns =
    hasValidAddOnShape &&
    submittedAddOns.every(
      (addOn) => typeof addOn === 'string' && allowedAddOnNames.has(addOn),
    );

  if (isBooking && (!hasValidAddOns || !hasValidApplicationNotice)) {
    return NextResponse.json(
      { status: 'error', message: 'Booking application information is incomplete' },
      { status: 400 },
    );
  }

  const isStudentBooking = isBooking && body.studentPlanRequested === true;

  if (isStudentBooking) {
    const hasValidEligibility =
      (body.studentAgeStatus === 'adult' || body.studentAgeStatus === 'minor') &&
      (body.studentPerformerScope === 'solo' || body.studentPerformerScope === 'group');
    const expectedConsentMode = hasValidEligibility
      ? getStudentConsentMode(
          body.studentAgeStatus as StudentAgeStatus,
          body.studentPerformerScope as StudentPerformerScope,
        )
      : 'incomplete';
    const expectedFutureContractingParty =
      body.studentAgeStatus === 'minor'
        ? body.studentGuardianName
        : body.studentApplicantName;
    const hasValidApplicationRecord =
      body.studentApplicationNoticeAcknowledged === true &&
      body.studentAuthorizationVersion === STUDENT_AUTHORIZATION_VERSION &&
      isNonEmptyString(body.studentFutureContractingParty) &&
      isNonEmptyString(body.studentApplicantName) &&
      body.studentFutureContractingParty === expectedFutureContractingParty &&
      body.studentConsentMode === expectedConsentMode &&
      body.studentAuthorizationCompleted === false;

    const minorHasGuardian =
      body.studentAgeStatus !== 'minor' ||
      (isNonEmptyString(body.studentGuardianName) &&
        isEmailLike(body.studentGuardianEmail));
    const hasFixedStudentPlan = body.pricingPlan === studentCollaborationPlan.name;
    const hasValidStudentAddOns =
      submittedAddOns.every(
        (addOn) => typeof addOn === 'string' && allowedStudentAddOnNames.has(addOn),
      );

    if (
      !hasValidEligibility ||
      !hasValidApplicationRecord ||
      !minorHasGuardian ||
      !hasFixedStudentPlan ||
      !hasValidStudentAddOns
    ) {
      return NextResponse.json(
        { status: 'error', message: 'Student application information is incomplete' },
        { status: 400 },
      );
    }
  }

  const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const applicationRecordedAt = new Date().toISOString();
  const requestIp = forwardedFor || req.headers.get('x-real-ip') || '';
  const requestUserAgent = req.headers.get('user-agent') || '';
  const bookingBody = isBooking
    ? {
        ...body,
        applicationNoticeServerAcknowledgedAt: applicationRecordedAt,
        applicationNoticeIp: requestIp,
        applicationNoticeUserAgent: requestUserAgent,
      }
    : body;
  const enrichedBody = isStudentBooking
    ? {
        ...bookingBody,
        studentApplicationNoticeServerAcknowledgedAt: applicationRecordedAt,
        studentApplicationNoticeIp: requestIp,
        studentApplicationNoticeUserAgent: requestUserAgent,
      }
    : bookingBody;

  if (!GOOGLE_SCRIPT_URL) {
    console.error(
      '[submit-contact] GOOGLE_SCRIPT_URL env var is not set. This must be a server-only variable; do NOT prefix with NEXT_PUBLIC_.',
    );
    return NextResponse.json(
      { status: 'error', message: 'Server configuration error' },
      { status: 500 },
    );
  }

  try {
    const upstream = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrichedBody),
    });

    const text = await upstream.text();
    const contentType = upstream.headers.get('content-type') ?? 'application/json';

    return new NextResponse(text, {
      status: upstream.ok ? 200 : upstream.status,
      headers: { 'content-type': contentType },
    });
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Upstream request failed' },
      { status: 502 },
    );
  }
}
