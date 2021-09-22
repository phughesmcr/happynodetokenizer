/** String tokenizer */
"use strict";

import { normalizeOpts, TokenizerOptions } from "./options";
import { dlatkEmoticons, dlatkTokenizerPattern, stanfordEmoticons, stanfordTokenizerPattern } from "./patterns";
import { htmlToUnicode, normalizeStr, removeHex } from "./strings";
import { createTagger } from "./tagger";
import { memoize, noop, pipe } from "./utils";

export type Token = {
  /** The token's line offset (begins at 0) */
  offset: number;
  /** The token's type (e.g., "punct" for punctuation) */
  tag: string;
  /** The token itself */
  value: string;
};

/** Creates a function that handles case preservation */
function createCaseHandler(preserveCase: boolean) {
  return function (emoticons: RegExp) {
    return memoize((str: string) => (emoticons.test(str) ? str : preserveCase ? str : str.toLowerCase()));
  };
}

/** Creates a function that returns an array of all RegExp matches */
function createMatcher(mode: "stanford" | "dlatk") {
  const pattern = mode === "dlatk" ? dlatkTokenizerPattern : stanfordTokenizerPattern;
  return function* (str: string) {
    pattern.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(str))) {
      yield m;
    }
  };
}

/** Creates a function that will normalize a string if a valid form is given */
function createNormalizer(form?: "NFC" | "NFD" | "NFKC" | "NFKD" | null): (str: string) => string {
  return form ? normalizeStr(form) : noop;
}

/** Creates a function that replaces hex codes in dlatk mode */
function createHexReplacer(mode: "stanford" | "dlatk"): (str: string) => string {
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
      for (const match of matches) {
        const value = handleCase(match[0]);
        const token: Token = {
          offset: match.index,
          tag: tag(value),
          value,
        };
        yield token;
      }
    };
  };
}
