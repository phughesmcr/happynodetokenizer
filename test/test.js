/* eslint-disable max-len */
'use strict';
import { tokenizer } from '../dist/esm/index.min.js';

/**
 * Input strings
 * @type {string[]}
 */
const testStrings = [
  'RT @ #happyfuncoding: this is a typical Twitter tweet :-)',
  'It\'s perhaps noteworthy that phone numbers like +1 (800) 123-4567, (800) 123-4567, and 123-4567 are treated as words despite their whitespace.',
  'Something </sarcasm> about <fails to break this up> <3 </3 <\\3 mañana vergüenza güenza création tonterías tonteréas <em class="grumpy">pain</em> <meta name="viewport" content="width=device-width"> <br />',
  'This is more like a Facebook message with a url: http://www.youtube.com/watch?v=dQw4w9WgXcQ, youtube.com google.com https://google.com/ ',
  'HTML entities &amp; other Web oddities can be an &aacute;cute <em class=\'grumpy\'>pain</em> >:(',
];

/**
 *  Results from the Stanford version of HappyFunTokenizer.py
 *  @type {string[][]}
 */
const stanfordResultStrings = [
  ['rt', '@', '#happyfuncoding', ':', 'this', 'is', 'a', 'typical', 'twitter', 'tweet', ':-)'],
  ['it\'s', 'perhaps', 'noteworthy', 'that', 'phone', 'numbers', 'like', '+1 (800) 123-4567', ',', '(800) 123-4567', ',', 'and', '123-4567', 'are', 'treated', 'as', 'words', 'despite', 'their', 'whitespace', '.'],
  ['something', '</sarcasm>', 'about', '<fails to break this up>', '<3 </3 <\\3 mañana vergüenza güenza création tonterías tonteréas <em class="grumpy">', 'pain', '</em>', '<meta name="viewport" content="width=device-width">', '<br />'],
  ['this', 'is', 'more', 'like', 'a', 'facebook', 'message', 'with', 'a', 'url', ':', 'http', ':/', '/', 'www', '.', 'youtube', '.', 'com', '/', 'watch', '?', 'v', '=d', 'qw4w9wgxcq', ',', 'youtube', '.', 'com', 'google', '.', 'com', 'https', ':/', '/', 'google', '.', 'com', '/'],
  ['html', 'entities', 'and', 'other', 'web', 'oddities', 'can', 'be', 'an', 'ácute', '<em class=\'grumpy\'>', 'pain', '</em>', '>:('],
];

/**
 *  Results from the DLATK version of HappierFunTokenizing.py
 *  @type {string[][]}
 */
const dlatkResultStrings = [
  ['rt', '@', '#happyfuncoding', ':', 'this', 'is', 'a', 'typical', 'twitter', 'tweet', ':-)'],
  ['it\'s', 'perhaps', 'noteworthy', 'that', 'phone', 'numbers', 'like', '+1 (800) 123-4567', ',', '(800) 123-4567', ',', 'and', '123-4567', 'are', 'treated', 'as', 'words', 'despite', 'their', 'whitespace', '.'],
  ['something', '</sarcasm>', 'about', '<fails', 'to', 'break', 'this', 'up>', '<3', '</3', '<\\3', 'mañana', 'vergüenza', 'güenza', 'création', 'tonterías', 'tonteréas', '<em class="grumpy">', 'pain', '</em>', '<meta name="viewport" content="width=device-width">', '<br />'],
  ['this', 'is', 'more', 'like', 'a', 'facebook', 'message', 'with', 'a', 'url', ':', 'http://www.youtube.com', '/watch?v=dQw4w9WgXcQ', ',', 'youtube.com', 'google.com', 'https://google.com/ '],
  ['html', 'entities', 'and', 'other', 'web', 'oddities', 'can', 'be', 'an', 'ácute', '<em class=\'grumpy\'>', 'pain', '</em>', '>:('],
];

const compareResults = (results, opts) => {
  const errors = new Set();
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    for (let j = 0; j < result.length; j++) {
      if (opts && opts.mode && opts.mode === 'dlatk') {
        if (result[j] === dlatkResultStrings[i][j]) continue;
        console.log(`Mismatch in test ${i}: Found "${result[j]}", expected "${dlatkResultStrings[i][j]}".\n`);
      } else {
        if (result[j] === stanfordResultStrings[i][j]) continue;
      }
      errors.add(i);
    }
  }
  for (const err of errors) {
    if (opts && opts.mode && opts.mode === 'dlatk') {
      console.log(`In test ${err}: found:\n${results[err]}\nexpected:\n${dlatkResultStrings[err]}\n`);
    } else {
      console.log(`In test ${err}: found:\n${results[err]}\nexpected:\n${stanfordResultStrings[err]}\n`);
    }
  }
  return errors.size;
};


const syncTests = (opts) => {
  console.log('Running sync tests...\n');
  const tokenize = tokenizer(opts);
  const results = [];
  for (const str of testStrings) {
    const res = tokenize(str, opts);
    results.push(Array.from(res, (m) => m.value));
  }
  const errors = compareResults(results, opts);
  if (errors > 0) {
    console.error(`Tests finished with ${errors} error(s).\n`);
  } else {
    console.log('Sync tests finished with 0 errors.\n');
  }
};

const main = () => {
  console.log('\nStarting Stanford mode tests...\n');
  syncTests({ preserveCase: false });
  console.log('Stanford mode tests finished.\n');

  console.log('Starting DLATK mode tests...\n');
  syncTests({ mode: 'dlatk', preserveCase: false });
  console.log('DLATK mode tests finished.');
};
main();
