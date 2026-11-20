import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync(new URL('../site/index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../site/assets/styles.css', import.meta.url), 'utf8');

test('six accessible major topics each expand into subtopics', () => {
  const groups = html.match(/<details class="topic-group"(?: open)?>[\s\S]*?<\/details>/g) ?? [];
  assert.equal(groups.length, 6, 'expected six native disclosure groups');
  for (const group of groups) {
    assert.match(group, /<summary>[\s\S]*?<\/summary>/);
    assert.match(group, /<ul class="subtopic-list">/);
    assert.ok((group.match(/<li>/g) ?? []).length >= 3, 'every group should have at least three subtopics');
    assert.match(group, /<p class="topic-status">/);
  }
  assert.equal((html.match(/<\/details>/g) ?? []).length, 6);
  assert.equal((html.match(/<li>/g) ?? []).length, 21);
});

test('published lesson stays linked, and planned subjects are not described as verified', () => {
  assert.match(html, /<a class="topic-lesson-link" href="\.\/visualizations\/gaussian-conditioning\.html">/);
  assert.ok(existsSync(new URL('../site/visualizations/gaussian-conditioning.html', import.meta.url)));
  assert.match(html, /Planned roadmap · teaching status unverified/);
  assert.match(html, /topic's appearance here does not establish that every part has been taught/);
  assert.match(html, /issues\/23/);
});

test('topic navigation is keyboard accessible, responsive, and theme neutral', () => {
  assert.match(html, /Keyboard: use <kbd>Tab<\/kbd>/);
  assert.match(css, /\.topic-group summary:focus-visible/);
  assert.match(css, /\.topic-accordion\{display:grid/);
  assert.match(css, /@media\(max-width:800px\)\{\.topic-accordion\{grid-template-columns:1fr\}/);
  assert.doesNotMatch(css, /\.topic-group[^\n]*#[a-fA-F0-9]{6}/, 'topic colors should use theme variables');
});

test('topic section contains only public-safe course links', () => {
  const topicSection = html.split('<section class="course-section" id="topics">')[1]?.split('<section class="course-section alt">')[0];
  assert.ok(topicSection, 'topic section must exist');
  assert.doesNotMatch(topicSection, /drive\.google\.com|docs\.google\.com|elms\.umd\.edu|github_pat_/i);
  for (const [, dest] of topicSection.matchAll(/href="([^"]+)"/g)) {
    assert.ok(dest.startsWith('./visualizations/') || dest.startsWith('https://github.com/RHHanson-UMD/ENEE-620/'), dest);
  }
});
