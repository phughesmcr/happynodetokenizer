/**
 * HappyNodeTokenizer
 * v0.0.4
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

'use strict'
;(function () {
  const root = this
  const previous = root.tokenizer

  const hasRequire = typeof require !== 'undefined'

  let he = root.he

  if (typeof _ === 'undefined') {
    if (hasRequire) {
      he = require('he')
    } else throw new Error('happynodetokenizer requires "he" module.')
  }

  const tokenizer = (str, opts) => {
    // if there is no string return null
    if (str == null) return null

    // set default options if none are provided
    if (opts == null) {
      opts = {
        'output': 'array',
        'delim': ','
      }
    }
    // if no output type is specified default to array
    opts.output = opts.output || 'array'
    // if string output is chosen but no delimiter is given default to csv
    opts.delim = opts.delim || ','

    // ensure we're dealing with a string
    if (typeof str !== 'string') str = str.toString()

    // define regular expressions
    /* eslint-disable no-useless-escape */
    let phoneNumber = new RegExp(/(?:(?:\+?[01][\-\s.]*)?(?:[\(]?\d{3}[\-\s.\)]*)?\d{3}[\-\s.]*\d{4})/, 'g')
    let emoticon = new RegExp(/(?:[<>]?[:;=8>][\-o\*\']?[\)\]\(\[dDpPxX/\:\}\{@\|\\]|[\)\]\(\[dDpPxX/\:\}\{@\|\\][\-o\*\']?[:;=8<][<>]?|<3|\(?\(?\#?\(?\(?\#?[>\-\^\*\+o\~][\_\.\|oO\,][<\-\^\*\+o\~][\#\;]?\)?\)?)/, 'g')
    let webAddress = new RegExp(/(?:(?:http[s]?\:\/\/)?(?:[\w\_\-]+\.)+(?:com|net|gov|edu|info|org|ly|be|gl|co|gs|pr|me|cc|us|gd|nl|ws|am|im|fm|kr|to|jp|sg))/, 'gi')
    let webProtocol = new RegExp(/(?:http[s]?\:\/\/)/, 'gi')
    let parens = new RegExp(/(?:\[[a-z_]+\])/, 'gi')
    let httpGet = new RegExp(/(?:\/\w+\?(?:\;?\w+\=\w+)+)/, 'gi')
    let htmlTags = new RegExp(/<[^>]+>/, 'gi')
    let twitterName = new RegExp(/(?:@[\w_]+)/, 'gi')
    let hashtag = new RegExp(/(?:\#+[\w_]+[\w\'_\-]*[\w_]+)/, 'gi')
    let remains = new RegExp(/(?:[a-z][a-z'\-_]+[a-z])|(?:[+\-]?\d+[,/.:-]\d+[+\-]?)|(?:[\w_]+)|(?:\.(?:\s*\.){1,})|(?:\S)/, 'gi')
    /* eslint-enable no-useless-escape */

    // combine all the RegExps into a super expression
    let fullExp = new RegExp(
      phoneNumber.source + '|' +
      emoticon.source + '|' +
      webAddress.source + '|' +
      webProtocol.source + '|' +
      parens.source + '|' +
      httpGet.source + '|' +
      htmlTags.source + '|' +
      twitterName.source + '|' +
      hashtag.source + '|' +
      remains.source, 'gi')

    // fix HTML elements
    let unicode = he.decode(str)

    // tokenize!
    let tokens = unicode.match(fullExp)

    if (opts.output === 'string') {
      // make the tokens array into a string and return
      return tokens.join(opts.delim)
    } else {
      // return the tokens array
      return tokens
    }
  }

  tokenizer.noConflict = function () {
    root.tokenizer = previous
    return tokenizer
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = tokenizer
    }
    exports.tokenizer = tokenizer
  } else {
    root.tokenizer = tokenizer
  }
}).call(this)
