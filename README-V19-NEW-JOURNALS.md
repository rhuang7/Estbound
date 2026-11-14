# EASTBOUND V19 · Eastern Canada journal replacement

- Input: user-supplied `eastern_canada_data.zip` (19 source articles, 100 saved image assets).
- Replaced previous `real_reports_data.js` (113 old links) with **exactly 19 new records**.
- Replaced `licensed_journals_data.js` with extracted article text and references to 100 saved local images in `journal_media/`.
- Homepage #reading and `travelogues.html` now use ONLY the imported catalog, and every article opens `journal.html?id=ec-...` to read source text and available source photographs.
- Deleted six old synthetic editorial travelogues, their datasets, and their scripts. `editorials.html` now redirects to the updated collection so previously shared links do not break.
- Preserved trip itinerary templates (`stories.html`) and vlog content; those are not part of the travel-journal catalog.
- `original.html`, the crawler database, and OS metadata are NOT included because the site renders escaped text and static images only.

## IMPORTANT RIGHTS STATUS

The upload's `metadata.json` records `rights: "not_verified"` for **all 19 articles**, including their photographs. Being publicly visible or collected in an archive is not republication permission. These imported articles are available to inspect in this build, but please obtain authorization or confirm an applicable license before public deployment, or replace the full text and photos with excerpts and links. EASTBOUND displays original source links, does not claim permission, and labels copyright status as unverified.

## Deploy to GitHub Pages

Upload the files INSIDE this ZIP to the repository's published root. Ensure `index.html`, `travelogues.html`, `journal.html`, `real_reports_data.js`, `licensed_journals_data.js` and `journal_media/` are in the same relative layout. No build step or server-side database is needed. GitHub Pages is case-sensitive.
