/** String tokenizer */
"use strict";

import { Mode, NormalizationForm } from "./constants";
import { normalizeOpts, TokenizerOptions } from "./options";
import { dlatkEmoticons, dlatkTokenizerPattern, stanfordEmoticons, stanfordTokenizerPattern } from "./patterns";
import { htmlToUnicode, normalizeStr, removeHex } from "./strings";
import { getTag } from "./tagger";
import { pipe } from "./utils";

export interface Token {
  /** The tokens index (begins at 0) */
  idx: number;
  /** The token's type (e.g., "punct" for punctuation) */
  tag: string;
  /** The token itself */
  value: string;
}

/** Creates a function that maps token strings to a token object */
function createWrapper(mode: Mode) {
  const wrapper = (token: string, idx: number) => ({ idx, tag: getTag(token, mode), value: token });
  return function wrap(tokens: string[]): Token[] {
    return tokens.map(wrapper);
  };
}

/** @returns the first item of an array */
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

/** Creates a function that handles case preservation */
function createCaseHandler(preserveCase: boolean) {
  return function (emoticons: RegExp) {
    const _m = (token: string) => (emoticons.test(token) ? token : token.toLowerCase());
    return function (tokens: string[]): string[] {
      return preserveCase ? tokens : tokens.map(_m);
    };
  };
}

/** Creates a function that returns an array of all RegExp matches */
function createMatcher(dlatk = false) {
  const pattern = dlatk ? dlatkTokenizerPattern : stanfordTokenizerPattern;
  return function (str: string) {
    return Array.from(str.matchAll(pattern), getFirst);
  };
}

/** Creates a function that will normalize a string if a valid form is given */
function createNormalizer(form: NormalizationForm | null) {
  return function (str: string): string {
    return form ? normalizeStr(str, form) : str;
  };
}

/** Creates a function that replaces hex codes in dlatk mode */
function createHexReplacer(dlatk = false) {
  return function (str: string): string {
    return dlatk ? removeHex(str) : str;
  };
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
export function tokenizer(opts: TokenizerOptions = {}): (input: string) => Token[] {
  const { mode, normalize, preserveCase } = normalizeOpts({ ...opts });
  const dlatkMode = mode === "dlatk";
  const emoticons = dlatkMode ? dlatkEmoticons : stanfordEmoticons;

  const handleCase = createCaseHandler(preserveCase)(emoticons);
  const replHex = createHexReplacer(dlatkMode);
  const normalizer = createNormalizer(normalize);
  const match = createMatcher(dlatkMode);
  const wrap = createWrapper(mode);

  /**
   * @param input the string to tokenize
   * @returns an array of Token objects
   */
  return pipe<Token[]>(
    isString, // check input is a string
    clone, // avoid mutating input string
    htmlToUnicode, // convert html chars to unicode
    replHex, // replace hex codes
    normalizer, // normalize string
    match, // match input against patterns
    handleCase, // convert to lowercase except emoticons
    wrap // turn matches into tokens
  );
}
