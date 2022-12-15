/** String tokenizer */

import { normalizeOpts } from "./options.js";
import { dlatkEmoticons, dlatkTokenizerPattern, stanfordEmoticons, stanfordTokenizerPattern } from "./patterns.js";
import { htmlToUnicode, normalizeStr, removeHex } from "./strings.js";
import { createTagger } from "./tagger.js";
import { memoize, noop, pipe } from "./utils.js";
import type { TokenizerMode, TokenMatchData, TokenizerNormalization, TokenizerOptions, Token } from "./types.js";

/** Creates a function that handles case preservation */
function createCaseHandler(preserveCase: boolean) {
  return (emoticons: RegExp) => {
    return memoize((str: string) => (emoticons.test(str) ? str : preserveCase ? str : str.toLowerCase()));
  };
}

/** Creates a function that returns an array of all RegExp matches */
function createMatcher(mode: TokenizerMode): (str: string) => Generator<TokenMatchData, void, unknown> {
  const pattern = mode === "dlatk" ? dlatkTokenizerPattern : stanfordTokenizerPattern;
  return function* (str: string) {
    pattern.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(str))) {
      yield {
        match: m,
        start: pattern.lastIndex - m[0].length,
        end: pattern.lastIndex - 1,
      };
    }
  };
}

/** Creates a function that will normalize a string if a valid form is given */
function createNormalizer(form?: TokenizerNormalization): (str: string) => string {
  return form ? normalizeStr(form) : noop;
}

/** Creates a function that replaces hex codes in dlatk mode */
function createHexReplacer(mode: TokenizerMode): (str: string) => string {
  return mode === "dlatk" ? removeHex : noop;
}

/** Avoid mutating the original string by creating a copy */
function clone(str: string): string {
  return String(str);
}

/** @throws if str is not typeof string */
function isString(str: string): string {
  if (typeof str === "string") return str;
  throw new TypeError("HappyNodeTokenizer: input must be a string.");
}

/**
 * Create a tokenizer with a given set of options configured
 * @param opts optional tokenizer options
 * @param opts.mode Tokenization mode, "stanford" | "dlatk". Defaults to "stanford".
 * @param opts.normalize Normalization form, disabled if undefined | null. Available options: "NFC" | "NFD" | "NFKC" | "NFKD". Defaults to undefined.
 * @param opts.preserveCase Preserve the tokens' case; does not affect emoticons. Defaults to `true`.
 * @returns the tokenizer function
 */
export function tokenizer(opts: TokenizerOptions = {}): (input: string) => () => Generator<Token, void, unknown> {
  const { mode, normalize, preserveCase } = normalizeOpts({ ...opts });

  // string cleaning functions
  const replaceHex = createHexReplacer(mode);
  const normalizer = createNormalizer(normalize);
  const cleaner = pipe<string>(isString, clone, htmlToUnicode, replaceHex, normalizer);
  // RegExp matching and tagging
  const match = createMatcher(mode);
  const tag = createTagger(mode);
  // case handling
  const emoticons = mode === "dlatk" ? dlatkEmoticons : stanfordEmoticons;
  const handleCase = createCaseHandler(preserveCase)(emoticons);

  return function (input: string) {
    const matches = match(cleaner(input));
    return function* () {
      for (const { match, start, end } of matches) {
        const orig = match[0];
        const value = handleCase(orig);
        const token: Token = {
          end,
          start,
          tag: tag(value),
          value,
        };
        if (value !== orig) {
          token.variation = orig;
        }
        yield token;
      }
    };
  };
}
