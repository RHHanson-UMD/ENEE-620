import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync(new URL('../site/index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../site/assets/styles.css', import.meta.url), 'utf8');
const section = html.split('<section class="course-section" id="topics">')[1]?.split('<section class="course-section alt">')[0];

test('lecture chapters expand into lesson cards, as in the ENEE 641 catalog', () => {
  assert.ok(section, 'topic section exists');
  const groups = section.match(/<details class="chapter-group(?: roadmap-group)?"[\s\S]*?<\/details>/g) ?? [];
  assert.equal(groups.length, 8, 'seven course chapters plus unverified roadmap');
  for (const group of groups) {
    assert.match(group, /<summary>[\s\S]*?<\/summary>/);
    assert.match(group, /<div class="chapter-lessons">/);
    assert.equal((group.match(/class="lesson-card"/g) ?? []).length, 3);
    assert.match(group, /class="chapter-count"/);
  }
  assert.equal((section.match(/class="lesson-card"/g) ?? []).length, 24);
  assert.equal((section.match(/<\/details>/g) ?? []).length, 8);
});

test('only implemented lessons have launch links', () => {
  const links = [...section.matchAll(/<a class="demo-btn" href="([^"]+)"/g)];
  assert.equal(links.length, 1);
  assert.equal(links[0][1], './visualizations/gaussian-conditioning.html');
  assert.ok(existsSync(new URL('../site/visualizations/gaussian-conditioning.html', import.meta.url)));
  assert.match(section, /Interactive lesson pending/);
  assert.match(section, /not confirmed as already taught/i);
  assert.match(section, /lecture ranges/i);
  assert.match(section, /issues\/23/);
});

test('chapter navigation is keyboard accessible, responsive, and theme-neutral', () => {
  assert.match(section, /Keyboard: <kbd>Tab<\/kbd>/);
  assert.match(css, /\.chapter-group>summary:focus-visible/);
  assert.match(css, /\.chapter-catalog\{display:grid/);
  assert.match(css, /@media\(max-width:700px\)/);
  assert.match(css, /background:var\(--surface\)/);
  assert.match(css, /color:var\(--muted\)/);
});

test('chapter section never links to restricted course storage', () => {
  assert.doesNotMatch(section, /drive\.google\.com|docs\.google\.com|elms\.umd\.edu|github_pat_/i);
  for (const [, dest] of section.matchAll(/href="([^"]+)"/g)) {
    assert.ok(dest.startsWith('./visualizations/') || dest.startsWith('https://github.com/RHHanson-UMD/ENEE-620/'), dest);
  }
});

test('course branding cannot accidentally embed ENEE 630 cover', () => {
  assert.match(html, /COURSE WORKSPACE \/ ENEE 620/);
  assert.doesNotMatch(html, /ENEE 630 Cover|Advanced Digital Signal Processing/i);
});
