# ENEE-620: Random Processes in Communication and Control

Interactive learning companion for University of Maryland ENEE-620.

- Expected site: https://rhhanson-umd.github.io/ENEE-620/
- Main learning portal: https://rhhanson-umd.github.io/
- Project Manager status dashboard: https://github.com/RHHanson-UMD/ENEE-620/issues/23

## Local preview

```sh
python -m http.server 8000 -d site
```

Open http://localhost:8000/.

## Deploy

This repo is independently deployed with GitHub Actions. In GitHub, choose
Settings > Pages > Build and deployment > Source: GitHub Actions. The workflow
publishes `site/` on pushes to `main`.

## Content rules

- Publish original explanations and independently drawn visualizations.
- Attribute textbooks and source examples; do not copy textbook figures.
- Do not publish unreleased or restricted homework.
- Even once officially released, confirm permission to republish solutions.
- Keep algorithm math tested independently of the presentation layer.

The course roadmap is illustrative, not an instructor syllabus. The homepage follows the ENEE 641-style expandable chapter/lesson catalog using verified lecture ranges rather than assumed textbook chapter numbers. Each chapter contains original learning-topic cards; only published lessons have working launch links. Planned material and unfinished source audits are labeled rather than presented as completed teaching.

## Interactive lessons (newest course material first)

- [Gaussian conditional estimation](site/visualizations/gaussian-conditioning.html) — original interactive scalar illustration of ENEE 620 Fall 2026 Lecture 20 (November 16). Adjustable correlation, observation, conditional MMSE, and residual plots.

## Mathematical tests

Run `npm test` with Node 20+. The test workflow runs on pull requests and pushes to `main`.
