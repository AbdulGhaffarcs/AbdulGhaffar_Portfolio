# Abdul Ghaffar — Portfolio

Personal portfolio site. Static HTML/CSS/JS, no build step, no framework.

**Live sections:** Experience → Work → Certifications → Skills → Education → Contact.

## Structure

```
.
├── index.html        # all page content and section markup
├── styles.css         # design system + layout (single stylesheet)
├── script.js           # scroll reveal, active-nav state, mobile menu
├── vercel.json          # clean URLs config for Vercel
└── assets/
    ├── portrait.jpg
    ├── favicon.svg
    └── AbdulGhaffar-Resume.pdf
```

## Run locally

No build tools needed — it's static.

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

or just open `index.html` directly in a browser.

## Deploy

**Vercel (recommended, matches `vercel.json`):**
```bash
npm i -g vercel
vercel
```
or connect the GitHub repo at vercel.com/new — it auto-detects a static site.

**GitHub Pages:**
Settings → Pages → Deploy from branch → `main` / root.

## Before you push

- [ ] `index.html` line ~224 — the Kaggle certification row links to `kaggle.com` as a placeholder. Replace with your actual profile URL: `https://www.kaggle.com/<your-username>`.
- [ ] Swap `assets/AbdulGhaffar-Resume.pdf` if your résumé changes — the filename is referenced in three places in `index.html` (nav, hero, contact).
- [ ] Update the `open to work` status in the nav/hero if that changes.

## Editing content

Everything is in `index.html` — no CMS, no data files. Each section is commented (`<!-- 01 EXPERIENCE -->`, `<!-- 02 WORK -->`, etc.) so you can find and edit a section directly. Project cards, skills, and certifications are plain markup — copy an existing block to add a new entry.
