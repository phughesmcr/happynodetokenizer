/**
 * HappyNodeTokenizer
 * v0.4.1
 *
 * A basic, Twitter-aware tokenizer.
 *
 * Help me make this better:
 * https://github.com/phugh/happynodetokenizer
 *
 * Based on HappierFunTokenizing.py - Copyright 2011, Christopher Potts
 * by: Christopher Potts, updated: H. Andrew Schwartz (www.wwbp.org)
 *
 * (C) 2017-18 P. Hughes
 * Licence : Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 * http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 * Default options (opts):
 *  {
 *    "output": "array",  // output tokens as an "array" (default) or "string"
 *    "delim": ","        // delimiter for string outputs (default = ",")
 *    "escape": 2         // when outputting to a string, escape commas and
 *                        //  quote marks with double-quotes, e.g.
 *                        //  '"hello, you" he said' becomes:
 *                        //  '",hello,,,you,",he,said' when escape = false, or
 *                        //  '""",hello,",",you,""",he,said' when true
 *                        // 0 = don't escape anything
 *                        // 1 = escape the delimiter only
 *                        // 2 = escape the delimiter, quotes and commas
 *    "logs": 3,          // 0 = suppress all logs
 *                        // 1 = print errors only
 *                        // 2 = print errors and warnings
 *                        // 3 = print all console logs
 *  }
 *
 * Usage example:
 * const tokenizer = require("happynodetokenizer");
 * const text = "A big long string of text...";
 * const opts = {"output": "array", "delim": ",", "escape": 2, "logs": 3}
 * const tokens = tokenizer(text, opts);
 * console.log(tokens)
 *
 * @param {string} str    string to tokenize
 * @param {Object} [opts]   options object
 * @return {(Array|string)}   array of tokens or delimited string
 */

(function() {
  'use strict';
  const he = require('he');

  /**
   * @function tokenizer
   * @param  {string} str  string to tokenize
   * @param  {Object} [opts] options object
   * @return {(Array|string)} array of tokens or delimited string
   */
  const tokenizer = (str, opts = {}) => {
    // default options
    opts.output = (typeof opts.output === 'undefined') ? 'array' : opts.output;
    opts.delim = (typeof opts.delim === 'undefined') ? ',' : opts.delim;
    opts.escape = (typeof opts.escape === 'undefined') ? 2 : opts.escape;
    opts.logs = (typeof opts.logs === 'undefined') ? 3 : opts.logs;
    // if there is no string return null
    if (!str) {
      if (opts.output.match(/string/gi)) {
        if (opts.logs > 0) console.error('HappyNodeTokenizer: no input! Returning empty string.');
        return '';
      } else {
        if (opts.logs > 0) console.error('HappyNodeTokenizer: no input! Returning empty array.');
        return [];
      }
    }
    // ensure we're dealing with a string
    if (typeof str !== 'string') str = str.toString();
    // main tokenizer regex
    const reg = new RegExp(/(?:(?:\+?[01][\-\s.]*)?(?:[\(]?\d{3}[\-\s.\)]*)?\d{3}[\-\s.]*\d{4})|(?:[<>]?[:;=8>][\-o\*\']?[\)\]\(\[dDpPxX\/\:\}\{@\|\\]|[\)\]\(\[dDpPxX\/\:\}\{@\|\\][\-o\*\']?[:;=8<][<>]?|<3|\(?\(?\#?\(?\(?\#?[>\-\^\*\+o\~][\_\.\|oO\,][<\-\^\*\+o\~][\#\;]?\)?\)?)|(?:(?:http[s]?\:\/\/)?(?:[\w\_\-]+\.)+(?:com|net|gov|edu|info|org|ly|be|gl|co|gs|pr|me|cc|us|gd|nl|ws|am|im|fm|kr|to|jp|sg))|(?:http[s]?\:\/\/)|(?:\[[a-z_]+\])|(?:\/\w+\?(?:\;?\w+\=\w+)+)|<[^>]+>|(?:@[\w_]+)|(?:\#+[\w_]+[\w\'_\-]*[\w_]+)|(?:[a-z][a-z'\-_]+[a-z])|(?:[+\-]?\d+[,\/.:-]\d+[+\-]?)|(?:[\w_]+)|(?:\.(?:\s*\.){1,})|(?:\S)/, 'gmi'); // eslint-disable-line
    // fix HTML elements
    let tokens = he.decode(str);
    // tokenize!
    tokens = tokens.match(reg);
    // if there's nothing there return empty string or array
    if (!tokens) {
      if (opts.output.match(/string/gi)) {
        if (opts.logs > 1) console.warn('HappyNodeTokenizer: no tokens found. Returning empty string.');
        return '';
      } else {
        if (opts.logs > 1) console.warn('HappyNodeTokenizer: no tokens found. Returning empty array.');
        return [];
      }
    }
    // handle double-quote escapes if selected
    if (opts.escape > 0 && opts.output.match(/string/gi)) {
      let l = tokens.length;
      let i = 0;
      for (i = 0; i < l; i++) {
        let token = tokens[i];
        token = token.replace(opts.delim, `"${opts.delim}"`);
        if (opts.escape > 1) token = token.replace(/"/gm, '"""').replace(/,/gm, '","');
        tokens[i] = token;
      }
    }
    // else return what was requested
    if (opts.output.match(/string/gi)) {
      // make the tokens array into a string and return
      return tokens.join(opts.delim);
    } else {
      // return the tokens array
      return tokens;
    }
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = tokenizer;
    }
    exports.tokenizer = tokenizer;
  } else {
    global.tokenizer = tokenizer;
  }
})();
