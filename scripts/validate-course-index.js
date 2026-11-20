import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const VALID_KINDS = new Set(['lecture', 'discussion']);
const VALID_AUDITS = new Set(['visually_audited', 'not_visually_audited']);
const VALID_FIGURE_AUDITS = new Set(['verified_none_found', 'figures_cataloged', 'not_checked']);
const PRIVACY_PATTERNS = [/https?:\/\//i, /drive\.google\.com/i, /docs\.google\.com/i, /\b(?:github_pat_|ghp_|sk-)\S+/i, /(?:answer.key|homework.solution|exam.solution)/i];

export function validateCourseIndex(index) {
  const errors = [];
  const error = (where, message) => errors.push(`${where}: ${message}`);
  if (!index || index.schema_version !== 1 || !Array.isArray(index.documents)) return ['root: unsupported schema or missing documents'];
  const ids = new Set();
  for (const [i, doc] of index.documents.entries()) {
    const at = `documents[${i}]`;
    if (!doc || !/^[LD][0-9]+$/.test(doc.id || '')) { error(at, 'invalid document ID'); continue; }
    if (ids.has(doc.id)) error(at, 'duplicate ID');
    ids.add(doc.id);
    if (!VALID_KINDS.has(doc.source_kind)) error(at, 'invalid source kind');
    if ((doc.source_kind === 'lecture' ? 'L' : 'D') !== doc.id[0]) error(at, 'source kind/ID mismatch');
    if (!Number.isSafeInteger(doc.pages) || doc.pages <= 0) error(at, 'invalid total page count');
    if (!VALID_AUDITS.has(doc.audit)) error(at, 'invalid audit state');
    if (!VALID_FIGURE_AUDITS.has(doc.figure_audit)) error(at, 'invalid figure audit');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(doc.source_reviewed_at || '')) error(at, 'missing ISO review date');
    if (typeof doc.source_title !== 'string' || !doc.source_title.toLowerCase().endsWith('.pdf')) error(at, 'invalid source title');
    const okRange = range => Array.isArray(range) && range.length === 2 && range.every(Number.isSafeInteger) && range[0] >= 1 && range[0] <= range[1] && range[1] <= doc.pages;
    if (!okRange(doc.visually_audited_pages)) error(at, 'invalid audited page range');
    if (doc.audit === 'visually_audited' && (doc.visually_audited_pages?.[0] !== 1 || doc.visually_audited_pages?.[1] !== doc.pages)) error(at, 'complete visual audit must cover all pages');
    if (!Array.isArray(doc.sections) || !Array.isArray(doc.figures)) { error(at, 'missing sections or figures array'); continue; }
    for (const section of doc.sections) {
      if (!section || typeof section.id !== 'string' || !section.id.startsWith(doc.id + '-S') || ids.has(section.id)) error(at, 'invalid or duplicate section ID');
      else ids.add(section.id);
      if (!okRange(section.pages)) error(at, 'invalid section pages');
      if (typeof section.name !== 'string' || section.name.trim().length < 8) error(at, 'invalid section title');
      if (typeof section.math_verified !== 'boolean') error(at, 'missing independent math verification state');
    }
    for (const figure of doc.figures) {
      if (!figure || typeof figure.id !== 'string' || !figure.id.startsWith(doc.id + '-F') || ids.has(figure.id)) error(at, 'invalid or duplicate figure ID');
      else ids.add(figure.id);
      if (!Number.isSafeInteger(figure.page) || figure.page < 1 || figure.page > doc.pages) error(at, 'invalid figure page');
      if (figure.kind !== 'source_drawing' || (figure.label !== 'unnumbered' && !/^[a-zA-Z0-9 .-]+$/.test(figure.label || ''))) error(at, 'invalid figure kind/label');
      if (typeof figure.description !== 'string' || figure.description.length < 15) error(at, 'missing figure description');
    }
    if (doc.figures.length === 0 && doc.figure_audit === 'figures_cataloged') error(at, 'no cataloged figures');
    if (doc.figures.length > 0 && doc.figure_audit !== 'figures_cataloged') error(at, 'figure audit status mismatch');
    if (doc.audit !== 'visually_audited' && doc.figure_audit === 'verified_none_found') error(at, 'cannot verify no drawings without visual audit');
  }
  const publicText = JSON.stringify(index);
  for (const pattern of PRIVACY_PATTERNS) if (pattern.test(publicText)) error('root', `disallowed private reference or unsafe text (${pattern.source})`);
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = path.resolve(process.argv[2] || 'content/course-index.json');
  const errors = validateCourseIndex(JSON.parse(fs.readFileSync(target, 'utf8')));
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log('Course index passed schema, linkage, page range and publication checks.');
}
