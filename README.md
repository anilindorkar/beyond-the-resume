# beyond-the-resume

Static personal website for **Anil Indorkar**, designed as a professional profile and online extension of his CV.

## Run locally

Because the site is fully static, there is no build step or backend.

From the repository root:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Project structure

- `index.html` — page structure, metadata and semantic sections
- `styles.css` — responsive styling and theme tokens
- `script.js` — client-side rendering, theme toggle, mobile navigation and scroll spy
- `profile.js` — structured professional content used by the page
- `404.html` — self-contained not-found page for GitHub Pages
- `favicon.svg` / `apple-touch-icon.png` — site icons
- `og-image.png` — social sharing preview (1200×630)
- `robots.txt` / `sitemap.xml` — crawler directives

## Editing content

All copy lives in `profile.js` under `window.siteContent`; `script.js` renders it into the
containers declared in `index.html`. To change a role, metric or project, edit `profile.js`
only — no markup changes are needed.

## Theming

The colour theme resolves before first paint via a small inline script in `<head>` that sets
`data-theme` on `<html>`. The toggle cycles system → dark → light and stores the choice in
`localStorage`. With JavaScript disabled the stylesheet still honours
`prefers-color-scheme`.

## Deploy to GitHub Pages

This repository is ready for GitHub Pages as a static site:

1. Push the contents to the default branch.
2. In GitHub, open **Settings → Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Choose the default branch and `/ (root)` folder.
5. Save the settings.

## Custom domain later

To move from the GitHub Pages URL to a custom domain later:

1. Add a `CNAME` file at the repository root with the custom domain.
2. Update the DNS records for the domain in GitHub Pages settings.
3. Update the canonical/Open Graph URL values in `index.html`.
4. Update the absolute URLs in `sitemap.xml`, `robots.txt` and `404.html`.

The site uses relative asset paths, so switching to a custom domain later is straightforward.

## Github pages deployment
