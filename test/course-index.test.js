import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateCourseIndex } from '../scripts/validate-course-index.js';

const index = JSON.parse(readFileSync(new URL('../content/course-index.json', import.meta.url), 'utf8'));
const copy = () => structuredClone(index);

test('reviewed content index is valid and nonempty', () => {
  assert.deepEqual(validateCourseIndex(index), []);
  assert.equal(index.documents.find(d => d.id === 'L13').figures[0].page, 9);
  assert.equal(index.documents.find(d => d.id === 'D10').figure_audit, 'verified_none_found');
});
test('duplicate identifiers are rejected', () => {
  const d = copy(); d.documents[1].sections[0].id = d.documents[0].sections[0].id;
  assert.ok(validateCourseIndex(d).some(e => e.includes('duplicate') || e.includes('invalid')));
});
test('out of range pages are rejected', () => {
  const d = copy(); d.documents[2].figures[0].page = 12;
  assert.ok(validateCourseIndex(d).some(e => e.includes('figure page')));
});
test('unreviewed documents cannot claim verified no figures', () => {
  const d = copy(); d.documents[0].audit = 'not_visually_audited';
  assert.ok(validateCourseIndex(d).some(e => e.includes('cannot verify')));
});
test('private links and unsafe publication strings fail', () => {
  const d = copy(); d.description = 'https://' + 'drive.google.com/file/d/private';
  assert.ok(validateCourseIndex(d).some(e => e.includes('disallowed')));
});
test('source kind and document ID must agree', () => {
  const d = copy(); d.documents[3].source_kind = 'lecture';
  assert.ok(validateCourseIndex(d).some(e => e.includes('mismatch')));
});
