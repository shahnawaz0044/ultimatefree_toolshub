# Ultimate Productivity Tools Hub

Next.js 15 (App Router) + TypeScript + Tailwind + PostgreSQL (Prisma).

**49 tools** (image, PDF, text, developer, marketing, business, audio, daily life) run **in the browser** via
`public/engine.html`, embedded on each `/tools/[slug]` page. Files are never uploaded, so no server-side
temporary storage or cleanup is needed. The app around them adds SEO pages, optional accounts, history,
analytics, a blog and an admin panel.

## Run locally
    cp .env.example .env      # fill in DATABASE_URL, AUTH_SECRET, ADMIN_PASSWORD
    npm install
    npx prisma db push        # creates the tables
    npm run dev               # http://localhost:3000   (admin: /admin)

## Deploy on Vercel
1. Push to GitHub and import the repo in Vercel.
2. Add a Postgres database (Vercel Postgres, Neon or Supabase) and set the four variables from `.env.example`.
3. Run `npx prisma db push` once against the production DATABASE_URL.
4. Deploy. The site still renders if the database is empty or unreachable; only accounts, analytics and admin need it.

## Structure
- `app/` pages: home, tools, categories, tool pages (SEO metadata + JSON-LD + FAQ), history, dashboard, blog, about, contact, admin
- `app/api/` auth, events (analytics + history), contact, admin
- `lib/tools-data.json` the tool list. `public/engine.html` the tool implementations.
- `prisma/schema.prisma` database

## Adding a tool
Add the tool in `public/engine.html`, add its entry to `lib/tools-data.json` (id must match the engine id),
then manage visibility, SEO and sponsor text in `/admin`.

## Known limits
- Rate limiting is in memory (per server instance). Use Redis/Upstash for a shared limit.
- Not included: PDF to Word/Excel, OCR, video tools, background remover, speech to text, AI writing tools.
  These need server processing or paid APIs. See the earlier text-to-speech download components for one approach.
- No virus scanning: files never reach the server.
