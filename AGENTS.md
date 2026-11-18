# ENEE 620 — Repository Agent Instructions

## Mission and ownership

This is the independent, student-created, public learning companion for **ENEE 620: Random Processes in Communication and Control**, not an official University of Maryland website. Source repository: `RHHanson-UMD/ENEE-620`. Intended Pages URL: https://rhhanson-umd.github.io/ENEE-620/.

Maintain ENEE 620 independently from ENEE 630, ENEE 641, the central portal, `learning-core`, and `course-template`. Cross-repo changes require an issue, PR, or an explicit transfer through the main-site coordination chat. Do not use this repository to update another course's syllabus or Pages.

## Read live state and precise academic evidence

1. Before editing, inspect current `README.md`, source files, `package.json`, tests, open issues/PRs, workflow status and any relevant issue comments. Historical project handoffs are dated context, not proof of the live implementation.
2. Course tracking: **#2** lecture/figure inventory, **#3** interactive candidates, **#4** core concepts/identities, **#5** verified syllabus and mastery checklist, **#6** public supplemental resources and **#7** these development instructions.
3. For any instructor-specific statement, privately **open the exact syllabus, lecture, recitation or assignment source** before citing its content. A filename, search excerpt, tentative syllabus topic or historical summary cannot establish what was taught. Track confirmed coverage versus planned or unverified coverage, with neutral lecture/date/page provenance but **no private Drive/ELMS links**.
4. Preserve the actual instructor's stochastic-process conventions: random-variable conditioning, probability models, expectation, covariance versus correlation, stationarity, Fourier/PSD sign and normalization, continuous versus discrete time and units. Do not silently infer conventions or release status. Mark uncertainties explicitly.
5. For a source figure inventory, inspect every relevant page/overlay visually when claiming exhaustive coverage; text extraction alone cannot establish the presence of diagrams or handwritten labels. Log the next unfinished page without copying source artwork.
6. Supplemental public references must be individually checked for accuracy and suitability. Free to view does not mean licensed for republication.

## Absolute public publication boundaries

Never publish instructor PDFs, raw lectures/transcripts, private course files or URLs, classroom photos, exam questions or answer keys, unreleased/restricted homework solutions, personally identifying student records, credentials, or unlicensed copyrighted textbook/slide figures in GitHub commits, PRs, issues, workflows or Pages. **Released solutions still require explicit public redistribution permission.** Do not put restricted source excerpts in public PR descriptions, tests or artifacts. Prefer synthetic stochastic examples and original graphics; cite sources without disclosing private paths. If permission or evidence is missing, keep that work blocked and continue with independently developed general examples.

## Actual architecture and mathematical verification

- `site/`: static HTML, CSS and vanilla JavaScript, including original modules under `site/visualizations/`. Keep computation in pure engine modules rather than DOM controllers; no React/Vite/backend assumption.
- `package.json`: Node >=20, `npm test` executes Node's built-in test runner (`node --test`).
- `.github/workflows/tests.yml`: test suite for PRs and `main`.
- `.github/workflows/deploy.yml`: publishes `./site` from `main` to the independent Pages site.

For new mathematical models state assumptions, distribution parameters, dimensions, valid domains and units. Verify independently derived results, boundary/degenerate and invalid-input cases, and counterexamples (e.g., zero variance, singular covariance, nonstationarity, correlation limits or conditioning on impossible events). Test that controls and reset reflect actual computations; show intermediate reasoning and failure modes. Avoid implying original synthetic demonstrations are instructor-provided.

Keep dark mode default with user-selectable remembered light mode; ensure keyboard focus, readable contrast, accessible labels and useful narrow-screen behavior without adding unnecessary frameworks or mandatory mobile-first design.

## Review, deploy and report

Use a small issue-linked branch and PR. Inspect the diff for licensing and privacy exposure. For changes affecting code/math, run `npm test` and independent expected-result checks; check affected links, accessible inputs, theme toggle and desktop browser where possible. Report unrun checks as unrun. Merge only with appropriate review and CI; a passing test is **not** a Pages deployment. Verify the Actions deployment and actual public `/ENEE-620/` route separately.

Report exact public or privately opened source identifiers (without private URLs), changed paths, tests actually performed, PR/commit URL, deployment status, unresolved rights/coverage risks and the next concrete issue or source/page checkpoint. Close #7 only when this file has been reviewed and relevant checks passed.
