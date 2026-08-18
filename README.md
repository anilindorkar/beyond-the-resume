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
- `script.js` — client-side rendering and theme toggle
- `profile.js` — structured professional content used by the page
- `favicon.svg` — site favicon

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

The site uses relative asset paths, so switching to a custom domain later is straightforward.