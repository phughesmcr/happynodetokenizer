/* jshint node: true, esversion:6 */
/**
 * HappyNodeTokenizer
 * v0.0.2
 *
 * A basic, Twitter-aware tokenizer.
 *
 * Help me make this better:
 * https://github.com/phugh/happynodetokenizer
 *
 * Based on HappierFunTokenizing.py - Copyright 2011, Christopher Potts
 * by: Christopher Potts, updated: H. Andrew Schwartz
 *
 * (C) 2017 P. Hughes
 * Licence : Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 * http://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 * Default options (opts):
 *  {
 *    "output": "array",  // output end result as an "array" or "string"
 *    "delim": ","        // delimiter for string outputs
 *  }
 *
 * Useage example:
 * const hnt = require('happynodetokenizer);
 * const text = "A big long string of text...";
 * let tokens = hnt(text, {"output": "string", "delim": " "});
 * console.log(tokens)
 *
 * @param {string} str  {input string to tokenize}
 * @param {object} opts {options}
 * @return {array}
 */

;(function () {
  const root = this;
  const previous = root.tokenizer;

  const he = require('he');

  const tokenizer = (str, opts) => {
    // make sure there is input before proceeding
    if (str == null) throw new Error('Whoops! No input string found!');

    // set default options if none are provided
    if (opts == null) {
      opts = {
        'output': 'array',
        'delim': ','
      };
    }
    // if no output type is specified default to array
    opts.output = opts.output || 'array';
    // if string output is chosen but no delimiter is given default to csv
    opts.delim = opts.delim || ',';

    // ensure we're dealing with a string
    if (typeof str !== 'string') str = str.toString();

    // define regular expressions
    var phoneNumber = new RegExp(/(?:(?:\+?[01][\-\s.]*)?(?:[\(]?\d{3}[\-\s.\)]*)?\d{3}[\-\s.]*\d{4})/, "g");
    var emoticon = new RegExp(/(?:[<>]?[:;=8>][\-o\*\']?[\)\]\(\[dDpPxX/\:\}\{@\|\\]|[\)\]\(\[dDpPxX/\:\}\{@\|\\][\-o\*\']?[:;=8<][<>]?|<3|\(?\(?\#?\(?\(?\#?[>\-\^\*\+o\~][\_\.\|oO\,][<\-\^\*\+o\~][\#\;]?\)?\)?)/, "g");
    var webAddress = new RegExp(/(?:(?:http[s]?\:\/\/)?(?:[\w\_\-]+\.)+(?:com|net|gov|edu|info|org|ly|be|gl|co|gs|pr|me|cc|us|gd|nl|ws|am|im|fm|kr|to|jp|sg))/, "gi");
    var webProtocol = new RegExp(/(?:http[s]?\:\/\/)/, "gi");
    var parens = new RegExp(/(?:\[[a-z_]+\])/, "gi");
    var httpGet = new RegExp(/(?:\/\w+\?(?:\;?\w+\=\w+)+)/, "gi");
    var htmlTags = new RegExp(/<[^>]+>/, "gi");
    var twitterName = new RegExp(/(?:@[\w_]+)/, "gi");
    var hashtag = new RegExp(/(?:\#+[\w_]+[\w\'_\-]*[\w_]+)/, "gi");
    var remains = new RegExp(/(?:[a-z][a-z'\-_]+[a-z])|(?:[+\-]?\d+[,/.:-]\d+[+\-]?)|(?:[\w_]+)|(?:\.(?:\s*\.){1,})|(?:\S)/, "gi");
    var fullExp = new RegExp(
      phoneNumber.source + "|" +
      emoticon.source + "|" +
      webAddress.source + "|" +
      webProtocol.source + "|" +
      parens.source + "|" +
      httpGet.source + "|" +
      htmlTags.source + "|" +
      twitterName.source + "|" +
      hashtag.source + "|" +
      remains.source, "gi");

    // fix HTML elements
    var unicode = he.decode(str);

    // tokenize!
    var tokens = unicode.match(fullExp);

    if (opts.output == 'string') {
      // make the tokens array into a string and return
      return tokens.join(opts.delim);
    } else {
      // return the tokens array
      return tokens;
    }
  };

  tokenizer.noConflict = function () {
    root.tokenizer = previous;
    return tokenizer;
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = tokenizer;
    }
    exports.tokenizer = tokenizer;
  } else {
    root.tokenizer = tokenizer;
  }
}).call(this);
