# Ayo Omotoso Portfolio

Production portfolio for Ayo Omotoso, built with Next.js App Router, TypeScript and Tailwind CSS.

## Local development

1. Use Node.js 20.9 or newer.
2. Copy `.env.example` to `.env.local` and add only the values required for the phase in progress.
3. Install dependencies with `npm install`.
4. Run `npm run dev`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

The production build is a static export written to `out/` for Cloudflare Pages. Deployment is intentionally not configured or run during Phase 2A.

