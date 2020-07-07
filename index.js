/**
 * @preserve
 * HappyNodeTokenizer
 * v2.0.0
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
 * (C) 2017-20 P. Hughes. All rights reserved.
 * License : Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 * http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 * @name         HappyNodeTokenizer
 * @file         index.js
 * @description  A basic Twitter-aware tokenizer.
 * @version      2.0.0
 * @exports      (tokenize|tokenizeSync)
 * @requires     he
 * @author       P. Hughes <peter@phugh.es> (https://www.phugh.es)
 * @copyright    2017-20 P. Hughes. All rights reserved.
 * @license      CC-BY-NC-SA-3.0
 *
 * Default options (opts):
 *  {
 *    "logs": 2,            // 0 = suppress all logs
 *                          // 1 = print errors only
 *                          // 2 = print errors and warnings
 *                          // 3 = print all console logs
 *
 *    "mode": "stanford"    // Switch between variations of implementation of HappierFunTokenizing.py
 *                          // "stanford" = https://github.com/stanfordnlp/python-stanford-corenlp/blob/master/tests/happyfuntokenizer.py
 *                          // "dlatk"    = https://github.com/dlatk/happierfuntokenizing/blob/master/happierfuntokenizing.py
 *
 *    "normalize": false    // Replace unicode characters (accents etc.)
 *                          // true   = replace input with the Unicode Normalization Form of the string
 *                          // false  = do not normalize strings - N.B. may cause problems with accented characters etc.
 *
 *    "preserveCase": false // Preserves the case of the input string. Does not affect emoticons.
 *                          // true   = preserve case
 *                          // false  = tokens are returned in lower case
 *
 *    "strict": false       // Strict mode will throw errors a lot - useful for debugging
 *                          // true   = enable strict mode
 *                          // false  = disable strict mode
 *
 *    "tag": false          // Return an array of token objects instead of just an array of tokens
 *                          // true   = return an array of token objects: [ {value: 'token', tag: 'word' }, ... ]
 *                          // false  = return an array of tokens: [ 'token', 'another', 'word', ... ]
 *  }
 *
 * @example
 *  const tokenizer = require("happynodetokenizer");
 *  const text = "A big long string of text...";
 *  const opts = {
 *      "logs": 2,
 *      "mode": "stanford",
 *      "normalize": false,
 *      "preserveCase": false,
 *      "strict": false,
 *      "tag": false,
 *  };
 *  const tokens = tokenizer(text, opts);
 *  console.log(tokens); // ["a", "big", "long", "string", "of", "text", "..."]
 */
(() => {
  'use strict';
  const he = require('he');

  /* REGEX PATTERNS */

  /**
   * @see accentedChars:
   * Javascript doesn't match accented characters like Python
   * so this additional code has been inserted into both
   * the Stanford and DLATK regexps, in the "Remaining" item:
   * accentedChars = \u00C0-\u00FF
   */

  // Stanford
  const _stanfordPhoneNumbers = new RegExp(/(?:(?:\+?[01][-\s.]*)?(?:[(]?\d{3}[-\s.)]*)?\d{3}[-\s.]*\d{4})/);
  const _stanfordEmoticons = new RegExp(/(?:[<>]?[:;=8][-o*']?[)\]([dDpP/:}{@|\\]|[)\]([dDpP/:}{@|\\][-o*']?[:;=8][<>]?)/);
  const _stanfordHtmlTags = new RegExp(/<[^>]+>/);
  const _stanfordTwitterUsernames = new RegExp(/(?:@[\w_]+)/);
  const _stanfordHashtags = new RegExp(/(?:#+[\w_]+[\w'_-]*[\w_]+)/);
  const _stanfordRemaining = new RegExp(/(?:[a-z\u00C0-\u00FF][a-z\u00C0-\u00FF'\-_]+[a-z\u00C0-\u00FF])|(?:[+-]?\d+[,/.:-]\d+[+-]?)|(?:[\w_]+)|(?:\.(?:\s*\.){1,})|(?:\S)/);  // see "accentedChars" above
  const stanfordTokenizerPattern = new RegExp(
      _stanfordPhoneNumbers.source + '|' +
      _stanfordEmoticons.source + '|' +
      _stanfordHtmlTags.source + '|' +
      _stanfordTwitterUsernames.source + '|' +
      _stanfordHashtags.source + '|' +
      _stanfordRemaining.source,
      'gi');

  // DLATK
  const _dlatkPhoneNumbers = new RegExp(/(?:(?:\+?[01][-\s.]*)?(?:[(]?\d{3}[-\s.)]*)?\d{3}[-\s.]*\d{4})/);
  const _dlatkEmoticons = new RegExp(/(?:[<>]?[:;=8>][-o*']?[)\]([dDpPxX/:}{@|\\]|[)\]([dDpPxX/:}{@|\\][-o*']?[:;=8<][<>]?|<[/\\]?3|\(?\(?#?[>\-^*+o~][_.|oO,][<\-^*+o~][#;]?\)?\)?)/);
  const _dlatkWebAddressFull = new RegExp(/(?:(?:http[s]?:\/\/)?(?:[\w_-]+\.)+(?:com|net|gov|edu|info|org|ly|be|gl|co|gs|pr|me|cc|us|gd|nl|ws|am|im|fm|kr|to|jp|sg)(?:\/[\s\b$])?)/);
  const _dlatkWebStart = new RegExp(/(?:http[s]?:\/\/)/);
  const _dlatkCommand = new RegExp(/(?:\[[\w_]+\])/);
  const _dlatkHttpGet = new RegExp(/(?:\/\w+\?(?:;?\w+=\w+)+)/);
  const _dlatkHtmlTags = new RegExp(/(?:<[^>]+\w=[^>]+>|<[^>]+\s\/>|<[^>\s]+>?|<?[^<\s]+>)/);
  const _dlatkTwitterUsernames = new RegExp(/(?:@[\w_]+)/);
  const _dlatkHashtags = new RegExp(/(?:#+[\w_]+[\w'_-]*[\w_]+)/);
  const _dlatkRemaining = new RegExp(/(?:[\w\u00C0-\u00FF][\w\u00C0-\u00FF'\-_]+[\w\u00C0-\u00FF])|(?:[+-]?\d+[,/.:-]\d+[+-]?)|(?:[\w_]+)|(?:\.(?:\s*\.){1,})|(?:\S)/); // see "_accentedChars" above
  const dlatkTokenizerPattern = new RegExp(
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

  /**
   * Default tokenizer options
   * @type {{[key: string]: number | string | boolean}} opts options object
   * @private
   */
  const _defaultOptions = {
    logs: 2,
    mode: 'stanford',
    normalize: false,
    preserveCase: false,
    strict: false,
    tag: false,
  };

  /**
   * @function _validateOpts
   * @private
   * @param {object} [opts] options object
   * @param {number} [opts.logs=2] logging level
   * @param {string} [opts.mode="stanford"] matching pattern
   * @param {boolean} [opts.normalize=false] normalize strings
   * @param {boolean} [opts.preserveCase=false] preserve input case
   * @param {boolean} [opts.strict=false] throw errors
   * @param {boolean} [opts.tag=false] return token object with tag attribute
   * @return {object} validated options
   */
  const _validateOpts = (opts) => {
    opts = Object.assign({}, _defaultOptions, opts);
    opts.logs = (
      typeof opts.logs === 'undefined' ||
      typeof opts.logs !== 'number'
    ) ? 2 : opts.logs;
    opts.mode = (
      typeof opts.mode === 'undefined' ||
      typeof opts.mode !== 'string'
    ) ? 'stanford' : opts.mode.toLowerCase();
    opts.normalize = (
      typeof opts.normalize === 'undefined' ||
      typeof opts.normalize !== 'boolean'
    ) ? false : opts.normalize;
    opts.preserveCase = (
      typeof opts.preserveCase === 'undefined' ||
      typeof opts.preserveCase !== 'boolean'
    ) ? false : opts.preserveCase;
    opts.strict = (
      typeof opts.strict === 'undefined' ||
      typeof opts.strict !== 'boolean'
    ) ? false : opts.strict;
    opts.tag = (
      typeof opts.tag === 'undefined' ||
      typeof opts.tag !== 'boolean'
    ) ? false : opts.tag;
    return opts;
  };

  /**
   * Remove hex codes from string
   * @function _removeHex
   * @private
   * @param {string} str
   * @return {string}
   */
  const _removeHex = (str) => str.replace(/\\x[0-9a-z]{1,4}/g, '');

  /**
   * Replace html entities with unicode string
   * @function _html2unicode
   * @private
   * @param {string} str input string
   * @param {number} [logs=2] logging level
   * @return {string}
   */
  const _html2unicode = (str, logs = 2) => {
    str = str.replace('&amp;', ' and ');

    const digitMatches = str.match(/&#\d+;/);
    if (digitMatches && digitMatches.length > 0) {
      digitMatches.forEach((token) => {
        try {
          str = str.replace(token, String.fromCharCode(parseInt(token.substring(2), 10)));
        } catch (_err) {
          if (logs > 1) {
            console.warn(`HappyNodeTokenizer: Couldn't replace "${token}".`);
          }
        }
      });
    }

    const alphaMatches = str.match(/&\w+;/);
    if (alphaMatches && alphaMatches.length > 0) {
      alphaMatches.forEach((token) => {
        try {
          str = str.replace(token, he.decode(token));
        } catch (err) {
          if (logs > 1) {
            console.warn(`HappyNodeTokenizer: Couldn't replace "${token}".`);
          }
        }
      });
    }

    return str;
  };

  /**
   * @private
   * @param {string} token
   * @param {string} mode
   * @return {string}
   */
  const _getTag = (token, mode) => {
    if (mode === 'dlatk') {
      if (_dlatkPhoneNumbers.test(token)) {
        return 'phone';
      } else if (_dlatkWebAddressFull.test(token)) {
        return 'url';
      } else if (_dlatkWebStart.test(token)) {
        return 'url_scheme';
      } else if (_dlatkCommand.test(token)) {
        return 'url_command';
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
  };

  /**
   * @private
   * @param {string[]} tokens
   * @param {string} mode
   * @return {object[]}
   */
  const _createTokenObject = (tokens, mode) => {
    /** @type {Array<{[key: string]: string}>} */
    return tokens.map((token) => {
      return {
        value: token,
        tag: _getTag(token, mode),
      };
    });
  };

  /**
   * @public
   * @async
   * @function tokenizer
   * @param {string} str string to tokenize
   * @param {object} [opts] options object
   * @param {number} [opts.logs=2] logging level
   * @param {"stanford" | "dlatk"} [opts.mode="stanford"] matching pattern
   * @param {boolean} [opts.normalize=false] normalize strings
   * @param {boolean} [opts.preserveCase=false] preserve input case
   * @param {boolean} [opts.strict=false] throw errors
   * @param {boolean} [opts.tag=false] return token object with tag attribute
   * @return {Promise<string[] | object[]>} array of tokens or array of token objects
   */
  const tokenizer = (str, opts) => {
    return new Promise((res, rej) => {
      try {
        const tokens = tokenizerSync(str, opts);
        res(tokens);
      } catch (err) {
        rej(err);
      }
    });
  };

  /**
   * @public
   * @function tokenizerSync
   * @param {string} str string to tokenize
   * @param {object} [opts] options object
   * @param {number} [opts.logs=2] logging level
   * @param {"stanford" | "dlatk"} [opts.mode="stanford"] matching pattern
   * @param {boolean} [opts.normalize=false] normalize strings
   * @param {boolean} [opts.preserveCase=false] preserve input case
   * @param {boolean} [opts.strict=false] throw errors
   * @param {boolean} [opts.tag=false] return token object with tag attribute
   * @param {function} [cb] callback function
   * @return {string[] | object[]} array of tokens or array of token objects
   */
  const tokenizerSync = (str, opts, cb) => {
    // manage options
    opts = _validateOpts(opts);
    // handle invalid input
    if (!str || typeof str !== 'string') {
      if (opts.strict) {
        if (cb && typeof cb === 'function') {
          return cb('HappyNodeTokenizer: no valid input found.', []);
        } else {
          throw new Error('HappyNodeTokenizer: no valid input found.');
        }
      } else {
        if (opts.logs > 1) console.warn('HappyNodeTokenizer: no valid input found. Returning empty array.');
        if (cb && typeof cb === 'function') {
          return cb(null, []);
        } else {
          return [];
        }
      }
    }
    // handle special characters
    let decoded = _html2unicode(str, opts.logs);
    if (opts.mode === 'dlatk') decoded = _removeHex(decoded);
    if (opts.normalize) decoded = decoded.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // tokenize!
    let tokens;
    if (opts.mode === 'dlatk') {
      tokens = decoded.match(dlatkTokenizerPattern);
    } else {
      tokens = decoded.match(stanfordTokenizerPattern);
    }
    // if there are no tokens, return an empty array
    if (!tokens || tokens.length === 0) {
      if (opts.strict) {
        if (cb && typeof cb === 'function') {
          return cb('HappyNodeTokenizer: no tokens found.', []);
        } else {
          throw new Error('HappyNodeTokenizer: no tokens found.');
        }
      } else {
        if (opts.logs > 1) console.warn('HappyNodeTokenizer: no tokens found. Returning empty array.');
        if (cb && typeof cb === 'function') {
          return cb(null, []);
        } else {
          return [];
        }
      }
    }
    // handle preserveCase option
    if (opts.preserveCase === false) {
      const emoticons = (opts.mode === 'dlatk') ? _dlatkEmoticons : _stanfordEmoticons;
      tokens = tokens.map((token) => {
        if (!emoticons.test(token)) {
          return token.toLowerCase();
        } else {
          return token;
        }
      });
    }
    if (opts.tag === true) {
      tokens = _createTokenObject(tokens, opts.mode);
    }
    // return the tokens array
    if (cb && typeof cb === 'function') {
      return cb(null, tokens);
    } else {
      return tokens;
    }
  };
  // export!
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = {
        tokenize: tokenizer,
        tokenizeSync: tokenizerSync,
        tokenise: tokenizer,
        tokeniseSync: tokenizerSync,
      };
    } else {
      exports.tokenize = tokenizer;
      exports.tokenizeSync = tokenizerSync;
      exports.tokenise = tokenizer;
      exports.tokeniseSync = tokenizerSync;
    }
  }
})();
