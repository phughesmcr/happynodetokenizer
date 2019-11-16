/**
 * @preserve
 * HappyNodeTokenizer
 * v1.0.0
 *
 * A basic, Twitter-aware tokenizer.
 *
 * Help me make this better:
 * https://github.com/phugh/happynodetokenizer
 *
 * Based on HappierFunTokenizing.py - Copyright 2011, Christopher Potts
 * by: Christopher Potts, updated: H. Andrew Schwartz (www.wwbp.org)
 *
 * (C) 2017-19 P. Hughes
 * Licence : Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 * http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 * @name         HappyNodeTokenizer
 * @file         index.js
 * @description  A basic, Twitter-aware tokenizer.
 * @version      1.0.0
 * @exports      (tokenize|tokenizeSync)
 * @requires     he
 * @author       P. Hughes <peter@phugh.es> (https://www.phugh.es)
 * @copyright    2017-19 P. Hughes. All rights reserved.
 * @license      CC-BY-NC-SA-3.0
 *
 * Default options (opts):
 *  {
 *    "output": "array",  // output tokens as an "array" (default) or "string"
 *    "delim": ","        // delimiter for string outputs (default = ",")
 *    "escape": 0         // when outputting to a string, escape commas and
 *                        //  quote marks with double-quotes, e.g.
 *                        //  '"hello, you" he said' becomes:
 *                        //  '",hello,,,you,",he,said' when escape = false, or
 *                        //  '""",hello,",",you,""",he,said' when true
 *                        // 0 = don't escape anything (default)
 *                        // 1 = escape the delimiter only
 *                        // 2 = escape the delimiter, quotes and commas
 *    "logs": 2,          // 0 = suppress all logs
 *                        // 1 = print errors only
 *                        // 2 = print errors and warnings (default)
 *                        // 3 = print all console logs
 *    "strict": false     // true = functions throw errors
 *                        // false = functions return gracefully on errors
 *    "normalize": true   // Replace unicode characters (accents etc.)
 *                        // true = replace input with the Unicode Normalization Form of the string (default)
 *                        // false = do not normalize strings - N.B. may cause problems with accented characters etc.
 *  }
 *
 * @example
 *  const tokenizer = require("happynodetokenizer");
 *  const text = "A big long string of text...";
 *  const opts = {"output": "array", "escape": 0, "logs": 2}
 *  const tokens = tokenizer(text, opts);
 *  console.log(tokens)
 */

(() => {
  'use strict';
  const he = require('he');

  /**
   * @function _validateOpts
   * @private
   * @param  {Object} opts options object
   * @return {Object} validated options
   */
  const _validateOpts = (opts) => {
    if (!opts || opts === null) {
      return {
        delim: ',',
        escape: 0,
        logs: 2,
        normalize: true,
        output: 'array',
        strict: false,
      };
    }
    // deliminator
    opts.delim = (typeof opts.delim === 'undefined') ? ',' : opts.delim;
    opts.delim = (typeof opts.delim !== 'string') ? ',' : opts.delim;
    // escape
    opts.escape = (typeof opts.escape === 'undefined') ? 0 : opts.escape;
    opts.escape = (typeof opts.escape !== 'number') ? 0 : opts.escape;
    // logs
    opts.logs = (typeof opts.logs === 'undefined') ? 2 : opts.logs;
    opts.logs = (typeof opts.logs !== 'number') ? 2 : opts.logs;
    // normalize
    opts.normalize = (typeof opts.normalize === 'undefined') ? true : opts.normalize;
    opts.normalize = (typeof opts.normalize !== 'boolean') ? true : opts.normalize;
    // output
    opts.output = (typeof opts.output === 'undefined') ? 'array' : opts.output;
    opts.output = (typeof opts.output !== 'string') ? 'array' : opts.output;
    opts.output = (opts.output.match(/str/gi)) ? 'string' : 'array';
    // strict
    opts.strict = (typeof opts.strict === 'undefined') ? false : opts.strict;
    opts.strict = (typeof opts.strict !== 'boolean') ? false : opts.strict;
    return opts;
  };

  /**
   * @function tokenizer
   * @public
   * @async
   * @param  {string} str  string to tokenize
   * @param  {Object} [opts] options object
   * @return {Promise} array of tokens or delimited string
   */
  const tokenizer = async (str, opts) => {
    return tokenizerSync(str, opts, (err, data) => {
      if (err) throw new Error(err);
      return data;
    });
  };

  /**
   * @function tokenizerSync
   * @public
   * @param {string}   str    string to tokenize
   * @param {Object}   [opts] options object
   * @param {function} [cb]   callback function
   * @return {(Array|string)} array of tokens or delimited string
   */
  const tokenizerSync = (str, opts, cb) => {
    // manage options
    opts = _validateOpts(opts);
    // handle invalid input
    if (!str) {
      if (opts.strict) {
        if (cb && typeof cb === 'function') {
          return cb('HappyNodeTokenizer: no input.');
        } else {
          throw new Error('HappyNodeTokenizer: no input.');
        }
      }
      if (opts.output === 'string') {
        if (opts.logs > 1) console.warn('HappyNodeTokenizer: no input! Returning empty string.');
        if (cb && typeof cb === 'function') {
          return cb(null, '');
        } else {
          return '';
        }
      } else {
        if (opts.logs > 1) console.warn('HappyNodeTokenizer: no input! Returning empty array.');
        if (cb && typeof cb === 'function') {
          return cb(null, []);
        } else {
          return [];
        }
      }
    }
    // ensure we're dealing with a string
    if (typeof str !== 'string') str = str.toString();
    // main tokenizer RegExp
    const reg = new RegExp(/(?:(?:\+?[01][\-\s.]*)?(?:[\(]?\d{3}[\-\s.\)]*)?\d{3}[\-\s.]*\d{4})|(?:[<>]?[:;=8>][\-o\*\']?[\)\]\(\[dDpPxX/\:\}\{@\|\\]|[\)\]\(\[dDpPxX/\:\}\{@\|\\][\-o\*\']?[:;=8<][<>]?|<[/\\]?3|\(?\(?\#?[>\-\^\*\+o\~][\_\.\|oO\,][<\-\^\*\+o\~][\#\;]?\)?\)?)|(?:(?:http[s]?\:\/\/)?(?:[\w\_\-]+\.)+(?:com|net|gov|edu|info|org|ly|be|gl|co|gs|pr|me|cc|us|gd|nl|ws|am|im|fm|kr|to|jp|sg)(?:\/[\s\b$])?)|(?:http[s]?\:\/\/)|(?:\[[\w_]+\])|(?:\/\w+\?(?:\;?\w+\=\w+)+)|(?:<[^>]+\w=[^>]+>|<[^>]+\s\/>|<[^>\s]+>?|<?[^<\s]+>)|(?:@[\w_]+)|(?:\#+[\w_]+[\w\'_\-]*[\w_]+)|(?:[\w][\w'\-_]+[\w])|(?:[+\-]?\d+[,/.:-]\d+[+\-]?)|(?:[\w_]+)|(?:\.(?:\s*\.){1,})|(?:\S)/, 'gmi'); // eslint-disable-line
    // fix HTML elements
    let tokens = he.decode(str);
    if (opts.normalize) tokens = tokens.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // tokenize!
    tokens = tokens.match(reg);
    // if there's nothing there, return empty string or array
    if (!tokens) {
      if (opts.strict) {
        if (cb && typeof cb === 'function') {
          return cb('HappyNodeTokenizer: no tokens found.');
        } else {
          throw new Error('HappyNodeTokenizer: no tokens found.');
        }
      } else {
        if (opts.output === 'string') {
          if (opts.logs > 1) console.warn('HappyNodeTokenizer: no tokens found. Returning empty string.');
          if (cb && typeof cb === 'function') {
            return cb(null, '');
          } else {
            return '';
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
    }
    // handle double-quote escapes if selected
    if (opts.escape > 0 && opts.output === 'string') {
      const l = tokens.length;
      let i = 0;
      for (i = 0; i < l; i++) {
        let token = tokens[i];
        token = token.replace(opts.delim, `"${opts.delim}"`);
        if (opts.escape > 1) token = token.replace(/"/gm, '"""').replace(/,/gm, '","');
        tokens[i] = token;
      }
    }
    // else return what was requested
    if (opts.output === 'string') {
      // make the tokens array into a string and return
      if (cb && typeof cb === 'function') {
        return cb(null, tokens.join(opts.delim));
      } else {
        return tokens.join(opts.delim);
      }
    } else {
      // return the tokens array
      if (cb && typeof cb === 'function') {
        return cb(null, tokens);
      } else {
        return tokens;
      }
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
    }
    exports.tokenize = tokenizer;
    exports.tokenizeSync = tokenizerSync;
    exports.tokenise = tokenizer;
    exports.tokeniseSync = tokenizerSync;
  } else {
    global.tokenize = tokenizer;
    global.tokenizeSync = tokenizerSync;
    global.tokenise = tokenizer;
    global.tokeniseSync = tokenizerSync;
  }
})();
