# Public-safe course content index (Issue #8)

`content/course-index.json` records **metadata**, not source material. The index is not published in `site/` until a reviewed learner-facing feature needs it.

- Every document has a stable `L<number>` or `D<number>` identifier, page count, document type, review date, complete visual audit range, topic-summary sections and actual source-drawing records.
- `L13-F01` is an internally assigned identifier for an *unnumbered source drawing*, not a textbook figure number or an original interactive lesson.
- Section titles are **original topic summaries**, not claimed to be verbatim instructor headings. Page ranges denote content coverage and may overlap where the instructor transitions topics.
- `math_verified` is separate from `visually_audited`: seeing a proof written down does not constitute independent mathematical verification. `verified_none_found` requires all PDF pages to have been visually inspected.
- The seed covers five reviewed documents only; it is **not** a claim that the entire course is indexed.

Run `node scripts/validate-course-index.js` and `node --test`. The validator checks stable IDs, page bounds, review status, duplicate identifiers and common accidental publication strings. It is not a substitute for the repository's publication gate, Gitleaks or human copyright review.

For each new lecture/discussion, inspect the exact source privately and update #2, #3 and #4 as appropriate. Do not commit private Drive IDs/URLs, source PDFs, scans, transcript excerpts, exam/homework solutions, secrets or copied figures.

**Next:** Lecture 12 visual audit; earlier discussion audit resumes at Discussion 08. Follow the current `AGENTS.md` and the live issue backlog.
