import { DEFAULT_OPTS } from "./constants.js";
import { normalizeOpts } from "./options.js";
import { createCaseHandler, createCleaner } from "./strings.js";
import { createTagger } from "./tagger.js";
import type { Token, TokenMatchData, Tokenizer, TokenizerMode, TokenizerOptions } from "./types.js";
import { cloneRegExp, getPattern } from "./utils.js";

/** Creates a function that returns an array of all RegExp matches */
function createMatcher(mode: TokenizerMode) {
  const pattern = cloneRegExp(getPattern(mode));
  return function* (str: string): IterableIterator<TokenMatchData> {
    pattern.lastIndex = 0;
    let m: RegExpExecArray | null = null;
    while ((m = pattern.exec(str))) {
      yield {
        match: m,
        start: pattern.lastIndex - m[0].length,
        end: pattern.lastIndex - 1,
      };
    }
  };
}

/**
 * Create a tokenizer with a given set of options configured
 * @param opts optional tokenizer options
 * @param opts.mode Tokenization mode, "stanford" | "dlatk". Defaults to "stanford".
 * @param opts.normalize Normalization form, disabled if null. Available options: "NFC" | "NFD" | "NFKC" | "NFKD". Defaults to null.
 * @param opts.preserveCase Preserve the tokens' case; does not affect emoticons. Defaults to `true`.
 * @returns the tokenizer function
 *
 * @example
 * import { tokenizer } from "happynodetokenizer";
 * const text = "A big long string of text...";
 * const opts = {
 *     "mode": "stanford",
 *     "normalize": null,
 *     "preserveCase": true,
 * };
 * const tokenize = tokenizer(opts);  // (input: string) => IterableIterator<Token>;
 * const tokens = tokenize(text);     // IterableIterator<Token>;
 * const strings = Array.from(tokens, (token) => token.value); // string[]
 * console.log(values); // ["a", "big", "long", "string", "of", "text", "..."]
 */
export function tokenizer(opts: TokenizerOptions = DEFAULT_OPTS): Tokenizer {
  const { mode, normalize, preserveCase } = normalizeOpts(opts);
  const caseHandler = createCaseHandler(preserveCase, mode);
  const cleaner = createCleaner(mode, normalize);
  const matcher = createMatcher(mode);
  const tagger = createTagger(mode);
  return (input: string) => {
    const matches = matcher(cleaner(input));
    return function* (): IterableIterator<Token> {
      for (const { match, start, end } of matches) {
        const original = match[0];
        const value = caseHandler(original);
        yield {
          end,
          start,
          tag: tagger(value),
          value,
          variation: value !== original ? original : undefined,
        };
      }
    };
  };
}
