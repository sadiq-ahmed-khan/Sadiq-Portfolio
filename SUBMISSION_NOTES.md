# Submission Notes

## To deploy (you're doing this part)
1. `git init && git add . && git commit -m "portfolio v1"`
2. Push to a GitHub repo.
3. In Netlify: "Add new site" → "Import an existing project" → connect the repo.
   Build command: none. Publish directory: `.` (already set in netlify.toml).
4. Confirm a push triggers a new deploy.

## Before you push
- [ ] Add `profile1.png` to the root (referenced as favicon, currently missing — will 404 otherwise)
- [ ] Check no API keys / secrets anywhere in index.html (this file has none as far as I can see, but you edited it, so re-check)

## What's in here
- `index.html` — your existing portfolio, unchanged.
- `health.html` — new, required by the assignment brief. Not linked in nav. Visit `/health.html` directly to confirm deploy + fetch work.
- `netlify.toml` — minimal config, publish root, basic security headers.

## Open gaps (not fixed, flagging so they don't disappear)
- **Brief asked for Next.js App Router** (Server/Client Components, routed pages). This is static HTML/CSS/JS with anchor-link sections, not routes. Functionally similar for a one-page portfolio, but if this is graded against the literal brief, that's a mismatch worth addressing with whoever's grading it.
- **Sports Hub has no live link and no repo link** — "In Progress" status, no proof attached. Zaiqa Express and Sasha Mart have live links but no GitHub repo links either. Per your own stated goal (claims → proof), every project card needs both a live demo AND a repo link to actually function as evidence, not just a claim restated with a URL next to it.
