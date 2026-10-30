import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const {validateNotes, validateActions, buildExport, MAX_NOTES_CHARS} = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`,
);
const notes = 'Primero debemos medir la latencia. Después revisaremos el resumen con las notas originales.';
const action = {text: 'Medir la latencia.', evidence: 'Primero debemos medir la latencia.'};

test('valida las notas sin recortar silenciosamente la entrada', () => {
  assert.match(validateNotes(''), /Escribe/);
  assert.match(validateNotes('a'.repeat(MAX_NOTES_CHARS + 1)), /límite/);
  assert.equal(validateNotes('Una charla sobre interfaces. '.repeat(5)), '');
});

test('valida JSON, límites y citas literales de las propuestas', () => {
  assert.deepEqual(validateActions(JSON.stringify({actions: [action]}), notes), [action]);
  assert.deepEqual(validateActions('{"actions":[]}', notes), []);
  assert.throws(() => validateActions('no json', notes), /formato/);
  assert.throws(() => validateActions('{"actions":[{"text":"Comprar GPU","evidence":"Hay que comprar una GPU"}]}', notes), /evidencia/);
  assert.throws(() => validateActions(JSON.stringify({actions: [{...action, executable: true}]}), notes), /formato/);
  assert.throws(() => validateActions(JSON.stringify({actions: Array(6).fill(action)}), notes), /formato/);
  assert.throws(() => validateActions(JSON.stringify({actions: [{text: '', evidence: action.evidence}]}), notes), /formato/);
});

test('exporta las notas, el resumen y las revisiones del usuario', () => {
  const exported = buildExport(notes, 'Resumen revisado', [{...action, reviewed: true}]);
  assert.ok(exported.includes(notes));
  assert.ok(exported.includes('Resumen revisado'));
  assert.ok(exported.includes('[x] Medir la latencia.'));
  assert.ok(exported.includes(action.evidence));
});
