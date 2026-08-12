# Professional Recording Positioning Design

## Context

Owldio Studio is a professional concert recording team. Student pricing and campus collaborations are a specific offer, not the company's primary identity. Public brand surfaces must therefore avoid describing the company as a campus-only or student-only recording team.

## Decision

Use a targeted brand-surface correction:

- The homepage metadata title will describe Owldio Studio as a professional concert recording service.
- The About page metadata title will use `專業音樂會錄影錄音團隊`.
- The About page metadata description and visible introduction will identify the company as `專注於音樂會專業錄製的團隊`.
- The navigation brand label will change from `CONCERT RECORDING` to `RECORDING`.

The visible About introduction must read:

> 專注於音樂會專業錄製的團隊，用心為每一場演出留下最珍貴的瞬間。

The existing responsive line break between the two clauses will remain.

## Scope Boundaries

This change does not perform a global replacement of `校園` or `學生`.

- Student-project and student-pricing pages keep their student-specific language.
- Campus-related SEO keywords and service descriptions remain when they accurately describe a supported audience or use case.
- Layout, typography, navigation behavior, pricing, and service definitions do not change.

## Alternatives Considered

1. Change only the visible About sentence. This is too narrow because metadata and the navigation label would continue communicating the old positioning.
2. Replace every `校園` reference with `專業`. This is too broad because it would erase accurate student-offer and campus-collaboration language.
3. Correct only company-level brand surfaces while preserving offer-specific language. This is the selected approach because it fixes positioning without changing the student promotion.

## Verification

- A focused copy-contract test will verify the selected public wording and guard the student-specific page from accidental broad replacement.
- The focused test must fail before production copy changes and pass afterward.
- The full Node test suite, ESLint, TypeScript check, and production build must pass.
- The final diff must contain only the intended copy, test, and Superpowers documentation changes; generated brand images remain outside the commit unless separately requested.
