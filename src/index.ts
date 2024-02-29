/**!
 * HappyNodeTokenizer
 *
 * A basic Twitter-aware tokenizer.
 *
 * Help to make this better:
 * https://github.com/phughesmcr/happynodetokenizer
 *
 * Based on:
 * HappyFunTokenizer.py by Christopher Potts (C) 2011
 * and
 * HappierFunTokenizing.py by H. Andrew Schwartz (www.wwbp.org)
 *
 * @name         HappyNodeTokenizer
 * @file         index.js
 * @description  A basic Twitter-aware tokenizer.
 * @exports      tokenize
 * @author       P. Hughes <github@phugh.es> (https://www.phugh.es)
 * @copyright    2017-2024 P. Hughes. All rights reserved.
 * @license      CC-BY-NC-SA-3.0
 *
 * Default options (opts):
 * {
 *    "mode":         "stanford"  // Switch between variations of implementation of HappierFunTokenizing.py
 *                                // "stanford" = https://github.com/stanfordnlp/python-stanford-corenlp/blob/master/tests/happyfuntokenizer.py
 *                                // "dlatk"    = https://github.com/dlatk/happierfuntokenizing/blob/master/happierfuntokenizing.py
 *
 *    "normalize":    null        // Normalize unicode characters @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
 *                                // null   = do not normalize strings - N.B. may cause problems with accented characters etc.
 *                                // "NFC"  = Canonical Decomposition, followed by Canonical Composition.
 *                                // "NFD"  = Canonical Decomposition.
 *                                // "NFKC" = Compatibility Decomposition, followed by Canonical Composition.
 *                                // "NFKD" = Compatibility Decomposition.
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
 *      "normalize": null,
 *      "preserveCase": true,
 *  };
 *  const tokenize = tokenizer(opts);  // (input: string) => IterableIterator<Token>;
 *  const tokens = tokenize(text);     // IterableIterator<Token>;
 *  const strings = Array.from(tokens, (token) => token.value); // string[]
 *  console.log(values); // ["a", "big", "long", "string", "of", "text", "..."]
 */

export { tokenizer } from "./tokenizer.js";
export type { Token, TokenTag, TokenizerMode, TokenizerNormalizationForm } from "./types.js";

