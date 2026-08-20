# Project Status

## Current phase

Phase 2A — Foundation (complete; awaiting client review).

## Completed work

- Audited the initial Git repository and supplied assets.
- Established Next.js App Router, strict TypeScript and Tailwind CSS foundations.
- Configured a static export suitable for a Cloudflare Pages public frontend.
- Added a token-led visual system based on the approved warm, editorial direction.
- Added locally self-hosted-at-build open font families through `next/font`.
- Added the accessible global layout, skip link, minimal header shell and foundation route.
- Centralised approved profile/contact constants pending the Sanity migration.
- Added environment, lint, type-check and repository hygiene configuration.
- Reserved the agreed component, motion, work, Sanity and Studio folders.

## Next action

Wait for explicit approval before Phase 2B — Sanity CMS.

## Test/build status

- `npm run lint`: passed (2026-08-20)
- `npm run typecheck`: passed (2026-08-20)
- `npm run build`: passed (2026-08-20)
- Static export: passed; `/` and `/_not-found` prerendered into `out/`
- Export HTTP smoke check: passed; `/` returned `200 OK` from a local static server
- Dependency audit at install: 0 known vulnerabilities
- Browser screenshot/responsive QA: not run because no browser surface was available in this environment; requires human/browser review

## Unresolved technical decisions

- Confirm the canonical production domain before canonical and social metadata are completed.
- Confirm the Sanity project ID, dataset, access model and Studio hosting preference.
- Confirm whether the Cloudflare Pages build should use the static `out/` directory directly or an organisation-specific deployment adapter/workflow.
- Motion is intentionally not installed. Add it only when an approved interaction needs more than native CSS.
- Full primary navigation is deferred until its page/section destinations exist, avoiding dead links in the Phase 2A shell.

## Boundaries observed

- No CMS implementation, homepage sections, production deployment or fabricated imagery were added.
- No client facts, metrics, case-study outcomes, collaborators or URLs were invented.
