/**
 * @preserve
 * HappyNodeTokenizer
 * v3.0.0
 *
 * A basic Twitter-aware tokenizer.
 *
 * Help me make this better:
 * https://github.com/phugh/happynodetokenizer
 *
 * Based on:
 * HappyFunTokenizer.py by Christopher Potts (C) 2011
 * and
 * HappierFunTokenizing.py by H. Andrew Schwartz (www.wwbp.org)
 *
 * @name         HappyNodeTokenizer
 * @file         index.js
 * @description  A basic Twitter-aware tokenizer.
 * @version      3.0.0
 * @exports      tokenize
 * @author       P. Hughes <peter@phugh.es> (https://www.phugh.es)
 * @copyright    2017-21 P. Hughes. All rights reserved.
 * @license      CC-BY-NC-SA-3.0
 *
 * Default options (opts):
 *  {
 *    "mode": "stanford"    // Switch between variations of implementation of HappierFunTokenizing.py
 *                          // "stanford" = https://github.com/stanfordnlp/python-stanford-corenlp/blob/master/tests/happyfuntokenizer.py
 *                          // "dlatk"    = https://github.com/dlatk/happierfuntokenizing/blob/master/happierfuntokenizing.py
 *
 *    "normalize": false    // Replace unicode characters (accents etc.)
 *                          // true   = replace input with the Unicode Normalization Form of the string
 *                          // false  = do not normalize strings - N.B. may cause problems with accented characters etc.
 *
 *    "preserveCase": true // Preserves the case of the input string. Does not affect emoticons.
 *                          // true   = preserve case
 *                          // false  = tokens are returned in lower case
 *
 *    "tag": false          // Return an array of token objects instead of just an array of tokens
 *                          // true   = return an array of token objects: [ {value: 'token', tag: 'word' }, ... ]
 *                          // false  = return an array of tokens: [ 'token', 'another', 'word', ... ]
 *  }
 *
 * @example
 *  import { tokenize } from "happynodetokenizer";
 *  const text = "A big long string of text...";
 *  const opts = {
 *      "mode": "stanford",
 *      "normalize": false,
 *      "preserveCase": true,
 *      "tag": false,
 *  };
 *  const tokens = tokenize(text, opts);
 *  console.log(tokens); // ["a", "big", "long", "string", "of", "text", "..."]
 */
"use strict";
import { entities } from './entities';

//#region RegExp Patterns

/**
 * @see accentedChars:
 * Javascript doesn't match accented characters like Python
 * so this additional code has been inserted into both
 * the Stanford and DLATK regexps, in the "Remaining" item:
 * accentedChars = \u00C0-\u00FF
 */

// Stanford
const _stanfordPhoneNumbers = /(?:(?:\+?[01][-\s.]*)?(?:[(]?\d{3}[-\s.)]*)?\d{3}[-\s.]*\d{4})/;
const _stanfordEmoticons = /(?:[<>]?[:;=8][-o*']?[)\]([dDpP/:}{@|\\]|[)\]([dDpP/:}{@|\\][-o*']?[:;=8][<>]?)/;
const _stanfordHtmlTags = /<[^>]+>/;
const _stanfordTwitterUsernames = /(?:@[\w_]+)/;
const _stanfordHashtags = /(?:#+[\w_]+[\w'_-]*[\w_]+)/;
const _stanfordRemaining = /(?:[a-z\u00C0-\u00FF][a-z\u00C0-\u00FF'_-]+[a-z\u00C0-\u00FF])|(?:[+-]?\d+[,/.:-]\d+[+-]?)|(?:[\w_]+)|(?:\.(?:\s*\.){1,})|(?:\S)/u; // see "accentedChars" above
export const stanfordTokenizerPattern = new RegExp(
    _stanfordPhoneNumbers.source + '|' +
    _stanfordEmoticons.source + '|' +
    _stanfordHtmlTags.source + '|' +
    _stanfordTwitterUsernames.source + '|' +
    _stanfordHashtags.source + '|' +
    _stanfordRemaining.source,
    'gi');

// DLATK
const _dlatkPhoneNumbers = /(?:(?:\+?[01][-\s.]*)?(?:[(]?\d{3}[-\s.)]*)?\d{3}[-\s.]*\d{4})/;
const _dlatkEmoticons = /(?:[<>]?[:;=8>][-o*']?[)\]([dDpPxX/:}{@|\\]|[)\]([dDpPxX/:}{@|\\][-o*']?[:;=8<][<>]?|<[/\\]?3|\(?\(?#?[>\-^*+o~][_.|oO,][<\-^*+o~][#;]?\)?\)?)/;
const _dlatkWebAddressFull = /(?:(?:http[s]?:\/\/)?(?:[\w_-]+\.)+(?:com|net|gov|edu|info|org|ly|be|gl|co|gs|pr|me|cc|us|gd|nl|ws|am|im|fm|kr|to|jp|sg)(?:\/[\s\b$])?)/;
const _dlatkWebStart = /(?:http[s]?:\/\/)/;
const _dlatkCommand = /(?:\[[\w_]+\])/;
const _dlatkHttpGet = /(?:\/\w+\?(?:;?\w+=\w+)+)/;
const _dlatkHtmlTags = /(?:<[^>]+\w=[^>]+>|<[^>]+\s\/>|<[^>\s]+>?|<?[^<\s]+>)/;
const _dlatkTwitterUsernames = /(?:@[\w_]+)/;
const _dlatkHashtags = /(?:#+[\w_]+[\w'_-]*[\w_]+)/;
const _dlatkRemaining = /(?:[\w\u00C0-\u00FF][\w\u00C0-\u00FF'_-]+[\w\u00C0-\u00FF])|(?:[+-]?\d+[,/.:-]\d+[+-]?)|(?:[\w_]+)|(?:\.(?:\s*\.){1,})|(?:\S)/u; // see "_accentedChars" above
export const dlatkTokenizerPattern = new RegExp(
    _dlatkPhoneNumbers.source + '|' +
    _dlatkEmoticons.source + '|' +
    _dlatkWebAddressFull.source + '|' +
    _dlatkWebStart.source + '|' +
    _dlatkCommand.source + '|' +
    _dlatkHttpGet.source + '|' +
    _dlatkHtmlTags.source + '|' +
    _dlatkTwitterUsernames.source + '|' +
    _dlatkHashtags.source + '|' +
    _dlatkRemaining.source,
    'gi');

//#endregion RegExp Patterns

//#region options

export interface TokenizerOptions {
  mode: 'stanford' | 'dlatk',
  normalize?: 'NFC' | 'NFD' | 'NFKC' | 'NFKD',
  preserveCase: boolean,
  tag: boolean,
}

const _defaultOptions: TokenizerOptions = {
  mode: 'stanford',
  normalize: undefined,
  preserveCase: true,
  tag: false,
};

function _validateOpts(opts: Partial<TokenizerOptions>): TokenizerOptions {
  const output: TokenizerOptions = {..._defaultOptions, ...opts};
  // MODE
  const mode = (typeof output.mode !== 'string') ? 'stanford' : output.mode.toLowerCase();
  if (!/dlatk|stanford/.exec(mode)) {
    throw new SyntaxError(`Tokenizer mode must be "stanford" or "dlatk", found "${output.mode}".`);
  }
  output.mode = mode as "stanford" | "dlatk";
  // NORMALIZE
  const normalize = (typeof output.normalize !== 'string') ? undefined : output.normalize.toUpperCase();
  if (normalize && !/NFK?(C|D)/.exec(normalize)) {
    throw new SyntaxError(`Tokenizer "normalize" option must be undefined | 'NFC' | 'NFD' | 'NFKC' | 'NFKD', found "${output.normalize ?? ''}".`);
  }
  output.normalize = normalize as 'NFC' | 'NFD' | 'NFKC' | 'NFKD' | undefined;
  // PRESERVECASE
  output.preserveCase = (
    output.preserveCase === undefined ||
    typeof output.preserveCase !== 'boolean'
  ) ? true : output.preserveCase;
  // TAG
  output.tag = (
    output.tag === undefined ||
    typeof output.tag !== 'boolean'
  ) ? false : output.tag;
  return output;
}

//#endregion options

//#region string cleaning

function _removeHex(str: string): string {
  return str.replace(/\\x[0-9a-z]{1,4}/g, '');
}

function _html2unicode(str: string): string {
  str = str.replace('&amp;', ' and ');

  const decode = (token: string): string => {
    return (entities[token] !== undefined) ? String.fromCodePoint(...entities[token].codepoints) : token;
  };

  const digitMatches = /&#\d+;/.exec(str);
  if (digitMatches && digitMatches.length > 0) {
    digitMatches.forEach((token) => {
      str = str.replace(token, String.fromCharCode(parseInt(token.substring(2), 10)));
    });
  }

  const alphaMatches = /&\w+;/.exec(str);
  if (alphaMatches && alphaMatches.length > 0) {
    alphaMatches.forEach((token) => {
      str = str.replace(token, decode(token));
    });
  }

  return str;
}

//#endregion string cleaning

//#region Tagging

function _getTag(token: string, mode: 'stanford' | 'dlatk') {
  if (mode === 'dlatk') {
    if (_dlatkPhoneNumbers.test(token)) {
      return 'phone';
    } else if (_dlatkWebAddressFull.test(token)) {
      return 'url';
    } else if (_dlatkWebStart.test(token)) {
      return 'url_scheme';
    } else if (_dlatkCommand.test(token)) {
      return 'url_authority';
    } else if (_dlatkHttpGet.test(token)) {
      return 'url_path_query';
    } else if (_dlatkHtmlTags.test(token) && (!_dlatkEmoticons.test(token) || (_dlatkEmoticons.test(token) && /[a-zA-Z]{2,}/g.test(token)))) {
      return 'htmltag';
    } else if (_dlatkEmoticons.test(token)) {
      return 'emoticon';
    } else if (_dlatkTwitterUsernames.test(token)) {
      return 'username';
    } else if (_dlatkHashtags.test(token)) {
      return 'hashtag';
    } else if (_dlatkRemaining.test(token)) {
      if (/\w/.test(token)) {
        return 'word';
      } else {
        return 'punct';
      }
    } else {
      return '<UNK>';
    }
  } else {
    if (_stanfordPhoneNumbers.test(token)) {
      return 'phone';
    } else if (_stanfordHtmlTags.test(token) && (!_stanfordEmoticons.test(token) || (_stanfordEmoticons.test(token) && /[a-zA-Z]{2,}/g.test(token)))) {
      return 'htmltag';
    } else if (_stanfordEmoticons.test(token)) {
      return 'emoticon';
    } else if (_stanfordTwitterUsernames.test(token)) {
      return 'username';
    } else if (_stanfordHashtags.test(token)) {
      return 'hashtag';
    } else if (_stanfordRemaining.test(token)) {
      if (/\w/.test(token)) {
        return 'word';
      } else {
        return 'punct';
      }
    } else {
      return '<UNK>';
    }
  }
}

function _createTokenObject(tokens: string[], mode: 'stanford' | 'dlatk'): Record<string, string>[] {
  return tokens.map((token) => {
    return {
      value: token,
      tag: _getTag(token, mode),
    };
  });
}

//#endregion Tagging

//#region tokenizer

export function tokenize(
    input: string,
    opts: Partial<TokenizerOptions>,
    cb?: (err?: string, res?: string[] | Record<string, string>[]) => void
  ): string[] | Record<string, string>[] | void {
  // validate input
  if (!input || typeof input !== 'string') {
    if (cb && typeof cb === 'function') {
      return cb('HappyNodeTokenizer: input must be a string.', []);
    } else {
      throw new TypeError('HappyNodeTokenizer: input must be a string.');
    }
  }

  // validate options
  const options = _validateOpts(opts);

  // avoid mutating the original input
  const text = input;

  // handle special characters
  let decoded = _html2unicode(text);
  if (options.mode === 'dlatk') decoded = _removeHex(decoded);
  if (options.normalize && typeof options.normalize === 'string') decoded = decoded.normalize(options.normalize).replace(/[\u0300-\u036f]/g, '');

  // tokenize!
  let tokens;
  if (options.mode === 'dlatk') {
    tokens = Array.from(decoded.matchAll(dlatkTokenizerPattern), (m) => m[0]);
  } else {
    tokens = Array.from(decoded.matchAll(stanfordTokenizerPattern), (m) => m[0]);
  }

  // return early if no tokens
  if (!tokens || tokens.length === 0) {
    if (cb && typeof cb === 'function') {
      return cb(undefined, []);
    } else {
      return [];
    }
  }

  // handle preserveCase option
  if (options.preserveCase === false) {
    const emoticons = (options.mode === 'dlatk') ? _dlatkEmoticons : _stanfordEmoticons;
    tokens = tokens.map((token) => {
      if (emoticons.test(token)) {
        return token;
      } else {
        return token.toLowerCase();
      }
    });
  }

  // tag
  if (options.tag === true) {
    tokens = _createTokenObject(tokens, options.mode);
  }

  // return the tokens array
  if (cb && typeof cb === 'function') {
    return cb(undefined, tokens);
  } else {
    return tokens;
  }
}

//#endregion tokenizer
