import assert from 'node:assert/strict';
import test from 'node:test';
import { offlineEduGuideReply } from '../src/offlineEduGuide.ts';

test('answers a packet question with relevant details', () => {
  const reply = offlineEduGuideReply('What is a data packet?');

  assert.match(reply, /small unit of information/);
  assert.match(reply, /header, a payload/);
});

test('offers hints tailored to the current room', () => {
  const reply = offlineEduGuideReply('hello', 'netiquette');

  assert.match(reply, /What is netiquette\?/);
});

test('keeps unrelated questions within the museum topic', () => {
  const reply = offlineEduGuideReply('Who won the football match?');

  assert.match(reply, /only share information about computer networks/i);
});
