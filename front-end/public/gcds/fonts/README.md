## GCDS font snapshot

This directory contains vendored GCDS font assets that are served locally by the app.

Source used for this snapshot:

- Package: `@cdssnc/gcds-fonts`
- Version: `0.2.2`
- Fetch date: `2026-04-12`

Copied directories from the published package:

- `fonts/icons/`
- `fonts/lato/`
- `fonts/noto-sans/`
- `fonts/noto-sans-mono/`

`../gcds-fonts.css` is loaded after vendored `../gcds.css` and overrides the font-face URLs so the app serves GCDS fonts from local packaged files instead of the GCDS CDN.

Refresh procedure:

1. Download the same published `@cdssnc/gcds-fonts` package version you intend to vendor.
2. Replace the contents of `icons/`, `lato/`, `noto-sans/`, and `noto-sans-mono/` with the upstream package files.
3. Update `../gcds-fonts.css` if upstream font-face declarations or filenames changed.
4. Run the frontend build and the Maven package step, then verify the app makes no external font requests.
