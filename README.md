# Ayo Omotoso Portfolio

Production portfolio for Ayo Omotoso, built with Next.js App Router, TypeScript, Tailwind CSS and Sanity.

The public application remains a static export for Cloudflare Pages. Sanity content will be read during `next build`; this repository does not use Server Actions, runtime API routes, middleware, draft mode or a persistent Next.js server.

## Local development

1. Use Node.js 22.12 or newer.
2. Copy `.env.example` to `.env.local`.
3. Install dependencies with `npm install`.
4. Run `npm run dev`.

The frontend is intentionally safe to run before Sanity is connected. When `NEXT_PUBLIC_SANITY_PROJECT_ID` is blank, the CMS query functions skip network requests and return `null` or empty arrays. They do not substitute invented portfolio content.

## Sanity connection

The authorised Sanity project is connected locally through `.env.local`, and its public-readable `production` dataset is used for published portfolio content. Keep real project IDs out of committed documentation and never commit Sanity user credentials or tokens.

Set these public, non-secret values in `.env.local` and in the eventual static-site build environment:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-08-20
```

Published portfolio content is intended to be publicly readable, so normal frontend queries do not use a read token. Draft preview is not implemented.

For the separate editing Studio, also set:

```bash
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

The Studio values should point to the same project and dataset as the frontend values. They are separate names so the editing workspace has an explicit configuration and can be hosted independently later. The repository's Sanity command runner loads the root `.env.local`, so a duplicate `studio/.env.local` is not required.

## Sanity Studio

After the project is connected and the editor has authenticated with Sanity, run:

```bash
npm run studio:dev
```

The Studio lives in `studio/`. It owns the schema definitions and editing navigation. The public integration lives in `sanity/`; schemas are not duplicated there.

Profile is handled as a singleton with the fixed document ID `profile`. Project, Experience and Social Link remain regular document collections. The Profile's LinkedIn field references the LinkedIn Social Link document, so its public URL is edited in one place.

The Studio is configured with clear areas for Profile, Projects, Experience and Social Links. Projects also have featured, category and editorial-status views. The Studio is not deployed; running it locally requires a Sanity account with access to the connected project.

## Verified foundation seed

Review the deterministic seed without changing remote content:

```bash
npm run sanity:seed
```

Only after explicit authorisation, apply it with:

```bash
npm run sanity:seed:commit
```

The seed uses fixed document IDs and field-preserving patches, making it safe to review and rerun without duplicate foundation records. It contains only the approved Profile with two education entries, LinkedIn, six Experience entries, four verified Culture Projects and four verified WorkSpan B2B Projects. B2B publication years remain absent because they are not verified, and no Project receives fabricated media or customer-company metrics framed as Ayo's results. The script uploads `public/images/ayo-portrait.jpeg` only when the Profile has no portrait. It uses the authenticated Sanity CLI session at execution time; no private token is stored in the script or repository.

## Schema validation and TypeScript types

Run the complete local schema/type workflow with:

```bash
npm run sanity:validate
```

This runs schema extraction with required-field enforcement and then Sanity TypeGen. It writes:

- `studio/schema.json` — the extracted schema used by TypeGen;
- `sanity/sanity.types.ts` — generated schema and GROQ result types.

Both generated files are committed so regular frontend type-checks do not depend on access to a live Sanity project. Do not edit them by hand. The local placeholder in `studio/env.ts` exists only so these schema tools can run while disconnected; the public client never uses it.

## Image strategy

Sanity image references are converted to CDN URLs through `sanity/image.ts`. The Next.js configuration keeps `images.unoptimized: true` and permits `https://cdn.sanity.io`, so future `next/image` use remains compatible with static export. Any later change to an image service or custom loader should remain explicit and export-compatible.

## Later Studio hosting direction

Studio deployment is intentionally out of scope for Phase 2C. The recommended first option is a separately deployed Sanity-hosted Studio because it gives Ayo the simplest editor login and keeps the public Cloudflare Pages site independent. A separately built Studio on another static host is also viable if the team wants hosting consolidated; access would still be controlled through Sanity project membership.

Before choosing either route, confirm the current Sanity plan, hosting terms, authorised editors and desired Studio URL. No hosting option should be assumed to remain permanently free.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
npm run sanity:validate
git diff --check
```

The production build is a static export written to `out/` for Cloudflare Pages.

## Cloudflare Pages staging

Phase 2I prepares the repository for a review-only Pages project; it does not create or deploy that project. Use these exact build settings:

- Framework preset: `Next.js (Static HTML Export)`
- Production branch: a dedicated staging branch, not `main`
- Build command: `npm run build`
- Build output directory: `out`
- Root directory: repository root
- Node.js: `22.16.0` through `NODE_VERSION=22.16.0`
- Public build variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET=production`, and `NEXT_PUBLIC_SANITY_API_VERSION=2026-08-20`
- Do not configure a custom domain, production deployment hook, or automatic production-branch deployment during review.

The build script explicitly uses Next.js's supported `--webpack` production-build path. This avoids the current Turbopack CSS-worker port-binding failure observed in the QA environment while preserving the same App Router static export and `out/` output contract.

The committed `public/_headers` and `public/robots.txt` deliberately apply `noindex` protection to the staging artifact. `_headers` also adds conservative browser security headers and immutable caching for fingerprinted Next.js assets. Before any production launch, remove the global `X-Robots-Tag` rule, replace the blocking `robots.txt`, confirm the production domain, and then add verified canonical URLs and a sitemap. Do not reuse a `pages.dev` preview URL as the canonical origin.
