import he from "he";
import {
  AMP_STRING,
  AND_STRING,
  EMPTY_STRING,
  HEX_PATTERN,
  HTML_ALPHA_PATTERN,
  HTML_DIGIT_PATTERN,
  SPECIAL_CHARS
} from "./constants.js";
import { TokenizerMode, TokenizerNormalizationForm } from "./types.js";
import { cloneRegExp, getEmoticonPattern, memoize, noop, pipe } from "./utils.js";

export function normalizeStr(form?: string): (str: string) => string {
  return (str: string) => str.normalize(form).replace(SPECIAL_CHARS, EMPTY_STRING);
}

export function removeHex(str: string): string {
  return str.replace(HEX_PATTERN, EMPTY_STRING);
}

export function replaceAmp(str: string): string {
  return str.replace(AMP_STRING, AND_STRING);
}

function getChar(match: string) {
  return parseInt(match.substring(2), 10);
}

function parseDigit(match: string): string {
  return String.fromCharCode(getChar(match));
}

export function replaceDigits(str: string): string {
  return str.replace(HTML_DIGIT_PATTERN, parseDigit);
}

function decode(match: string): string {
  return he.decode(match);
}

export function replaceAlpha(str: string): string {
  return str.replace(HTML_ALPHA_PATTERN, decode);
}

export const htmlToUnicode = pipe<string, string>(replaceAmp, replaceDigits, replaceAlpha);

/** Creates a function that will normalize a string if a valid form is given */
function createNormalizer(form?: TokenizerNormalizationForm): (str: string) => string {
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

/** Creates a function that handles case preservation */
export function createCaseHandler(preserveCase: boolean, mode: TokenizerMode) {
  const clonePattern = cloneRegExp(getEmoticonPattern(mode));
  return memoize((str: string) => (clonePattern.test(str) ? str : preserveCase ? str : str.toLowerCase()));
}

export function createCleaner(
  mode: TokenizerMode,
  normalize: TokenizerNormalizationForm = null
): (input: string) => string {
  const replaceHex = createHexReplacer(mode);
  const normalizer = createNormalizer(normalize);
  return pipe<string, string>(isString, clone, htmlToUnicode, replaceHex, normalizer);
}
