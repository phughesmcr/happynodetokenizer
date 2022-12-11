/**!
 * @preserve
 * HappyNodeTokenizer
 * v5.0.2
 *
 * A basic Twitter-aware tokenizer.
 *
 * Help to make this better:
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
 * @version      5.0.2
 * @exports      tokenize
 * @author       P. Hughes <peter@phugh.es> (https://www.phugh.es)
 * @copyright    2017-22 P. Hughes. All rights reserved.
 * @license      CC-BY-NC-SA-3.0
 *
 * Default options (opts):
 *  {
 *    "mode":         "stanford"  // Switch between variations of implementation of HappierFunTokenizing.py
 *                                // "stanford" = https://github.com/stanfordnlp/python-stanford-corenlp/blob/master/tests/happyfuntokenizer.py
 *                                // "dlatk"    = https://github.com/dlatk/happierfuntokenizing/blob/master/happierfuntokenizing.py
 *
 *    "normalize":    false       // Replace unicode characters (accents etc.)
 *                                // true   = replace input with the Unicode Normalization Form of the string
 *                                // false  = do not normalize strings - N.B. may cause problems with accented characters etc.
 *
 *    "preserveCase": true        // Preserves the case of the input string. Does not affect emoticons.
 *                                // true   = preserve case
 *                                // false  = tokens are returned in lower case
 * }
 *
 * @example
 *  import { tokenizer } from "happynodetokenizer";
 *  const text = "A big long string of text...";
 *  const opts = {
 *      "mode": "stanford",
 *      "normalize": undefined,
 *      "preserveCase": true,
 *  };
 *  const tkn = tokenizer(ops); // (input: string) => Token[];
 *  const tokens = tkn(text);   // Token[];
 *  const values = Array.from(tokens, (token) => token.value); // turn array of tokens into array of strings
 *  console.log(values); // ["a", "big", "long", "string", "of", "text", "..."]
 */

export type { Token } from "./types.js";
export { tokenizer } from "./tokenizer.js";
