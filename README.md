# blitz-ds

The design layer for the Blitz Tattoo Studio website. The site is built in Webflow, and these files add the redesign on top of it. They change no text and no markup.

The files are served by jsDelivr. Always load a pinned version tag, never `@latest`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/denisovcharenko/blitz-ds@v0.1.0/dist/blitz-ds.css">
<script src="https://cdn.jsdelivr.net/gh/denisovcharenko/blitz-ds@v0.1.0/dist/blitz-ds.js" defer></script>
```

| File | Where it loads |
|---|---|
| `dist/blitz-ds.css`, `dist/blitz-ds.js` | every page |
| `dist/pages/<page>.css`, `dist/pages/<page>.js` | only the matching page |

These are build output, so don't edit them here. To release a change:

1. Rebuild the files from the sources.
2. Commit the result and tag a new version.
3. Update the version in the Webflow embeds.
