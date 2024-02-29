import { PatternContainer, TokenizerMode, TokenizerNormalizationForm, TokenizerOptions } from "./types.js";

export class UTIL_PATTERNS {
  static HTMLTAG = /[a-zA-Z]{2,}/g;
  static MODE = /dlatk|stanford/;
  static NORM = /NFK?(C|D)/;
  static WORD = /\w/;
}

export class DEFAULTS {
  static MODE: TokenizerMode = "stanford";
  static NORMALIZE: TokenizerNormalizationForm = null;
  static PRESERVE_CASE = true;
}

export const DEFAULT_OPTS: Readonly<TokenizerOptions> = Object.freeze({
  mode: DEFAULTS.MODE,
  normalize: DEFAULTS.NORMALIZE,
  preserveCase: DEFAULTS.PRESERVE_CASE,
});

/**
 * RegExp patterns for DLATK tokenizing.
 *
 * @see accentedChars:
 * Javascript doesn't match accented characters like Python
 * so this additional code has been inserted into both
 * the Stanford and DLATK regexps, in the "remaining" pattern:
 * accentedChars = \u00C0-\u00FF
 */
/* eslint-disable prettier/prettier */
export class DLATK extends PatternContainer {
  static phoneNumbers = /(?:(?:\+?[01][-\s.]*)?(?:[(]?\d{3}[-\s.)]*)?\d{3}[-\s.]*\d{4})/;
  static emoticons = /(?:[<>]?[:;=8>][-o*']?[)\]([dDpPxX/:}{@|\\]|[)\]([dDpPxX/:}{@|\\][-o*']?[:;=8<][<>]?|<[/\\]?3|\(?\(?#?[>\-^*+o~][_.|oO,][<\-^*+o~][#;]?\)?\)?)/;
  static webAddressFull = /(?:(?:http[s]?:\/\/)?(?:[\w_-]+\.)+(?:com|net|gov|edu|info|org|ly|be|gl|co|gs|pr|me|cc|us|gd|nl|ws|am|im|fm|kr|to|jp|sg)(?:\/[\s\b$])?)/;
  static webStart = /(?:http[s]?:\/\/)/;
  static command = /(?:\[[\w_]+\])/;
  static httpGet = /(?:\/\w+\?(?:;?\w+=\w+)+)/;
  static htmlTags = /(?:<[^>]+\w=[^>]+>|<[^>]+\s\/>|<[^>\s]+>?|<?[^<\s]+>)/;
  static twitterUsernames = /(?:@[\w_]+)/;
  static hashtags = /(?:#+[\w_]+[\w'_-]*[\w_]+)/;
  /** @see "accentedChars" above */
  static remaining = /(?:[\w\u00C0-\u00FF][\w\u00C0-\u00FF'_-]+[\w\u00C0-\u00FF])|(?:[+-]?\d+[,/.:-]\d+[+-]?)|(?:[\w_]+)|(?:\.(?:\s*\.){1,})|(?:\S)/u;
  static override pattern = new RegExp(`${DLATK.phoneNumbers.source}|${DLATK.emoticons.source}|${DLATK.webAddressFull.source}|${DLATK.webStart.source}|${DLATK.command.source}|${DLATK.httpGet.source}|${DLATK.htmlTags.source}|${DLATK.twitterUsernames.source}|${DLATK.hashtags.source}|${DLATK.remaining.source}`, 'giu');
}

/**
 * RegExp patterns for Stanford tokenizing.
 *
 * @see accentedChars:
 * Javascript doesn't match accented characters like Python
 * so this additional code has been inserted into both
 * the Stanford and DLATK regexps, in the "remaining" pattern:
 * accentedChars = \u00C0-\u00FF
 */
/* eslint-disable prettier/prettier */
export class STANFORD extends PatternContainer {
  static phoneNumbers = /(?:(?:\+?[01][-\s.]*)?(?:[(]?\d{3}[-\s.)]*)?\d{3}[-\s.]*\d{4})/;
  static emoticons = /(?:[<>]?[:;=8][-o*']?[)\]([dDpP/:}{@|\\]|[)\]([dDpP/:}{@|\\][-o*']?[:;=8][<>]?)/;
  static htmlTags = /<[^>]+>/;
  static twitterUsernames = /(?:@[\w_]+)/;
  static hashtags = /(?:#+[\w_]+[\w'_-]*[\w_]+)/;
  /** @see "accentedChars" above */
  static remaining = /(?:[a-z\u00C0-\u00FF][a-z\u00C0-\u00FF'_-]+[a-z\u00C0-\u00FF])|(?:[+-]?\d+[,/.:-]\d+[+-]?)|(?:[\w_]+)|(?:\.(?:\s*\.){1,})|(?:\S)/u;
  static override pattern = new RegExp(`${STANFORD.phoneNumbers.source}|${STANFORD.emoticons.source}|${STANFORD.htmlTags.source}|${STANFORD.twitterUsernames.source}|${STANFORD.hashtags.source}|${STANFORD.remaining.source}`, 'giu');
}

export const HEX_PATTERN = /\\x[0-9a-z]{1,4}/g;

export const HTML_DIGIT_PATTERN = /&#\d+;/g;

export const HTML_ALPHA_PATTERN = /&\w+;/g;

export const AMP_STRING = "&amp;";

export const AND_STRING = " and ";

export const EMPTY_STRING = "";

export const SPECIAL_CHARS = /[\u0300-\u036f]/g;
