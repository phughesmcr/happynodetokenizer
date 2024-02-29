import { PatternContainer } from "./types.js";
export class UTIL_PATTERNS {
}
UTIL_PATTERNS.HTMLTAG = /[a-zA-Z]{2,}/g;
UTIL_PATTERNS.MODE = /dlatk|stanford/;
UTIL_PATTERNS.NORM = /NFK?(C|D)/;
UTIL_PATTERNS.WORD = /\w/;
export class DEFAULTS {
}
DEFAULTS.MODE = "stanford";
DEFAULTS.NORMALIZE = null;
DEFAULTS.PRESERVE_CASE = true;
export const DEFAULT_OPTS = Object.freeze({
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
}
DLATK.phoneNumbers = /(?:(?:\+?[01][-\s.]*)?(?:[(]?\d{3}[-\s.)]*)?\d{3}[-\s.]*\d{4})/;
DLATK.emoticons = /(?:[<>]?[:;=8>][-o*']?[)\]([dDpPxX/:}{@|\\]|[)\]([dDpPxX/:}{@|\\][-o*']?[:;=8<][<>]?|<[/\\]?3|\(?\(?#?[>\-^*+o~][_.|oO,][<\-^*+o~][#;]?\)?\)?)/;
DLATK.webAddressFull = /(?:(?:http[s]?:\/\/)?(?:[\w_-]+\.)+(?:com|net|gov|edu|info|org|ly|be|gl|co|gs|pr|me|cc|us|gd|nl|ws|am|im|fm|kr|to|jp|sg)(?:\/[\s\b$])?)/;
DLATK.webStart = /(?:http[s]?:\/\/)/;
DLATK.command = /(?:\[[\w_]+\])/;
DLATK.httpGet = /(?:\/\w+\?(?:;?\w+=\w+)+)/;
DLATK.htmlTags = /(?:<[^>]+\w=[^>]+>|<[^>]+\s\/>|<[^>\s]+>?|<?[^<\s]+>)/;
DLATK.twitterUsernames = /(?:@[\w_]+)/;
DLATK.hashtags = /(?:#+[\w_]+[\w'_-]*[\w_]+)/;
/** @see "accentedChars" above */
DLATK.remaining = /(?:[\w\u00C0-\u00FF][\w\u00C0-\u00FF'_-]+[\w\u00C0-\u00FF])|(?:[+-]?\d+[,/.:-]\d+[+-]?)|(?:[\w_]+)|(?:\.(?:\s*\.){1,})|(?:\S)/u;
DLATK.pattern = new RegExp(`${DLATK.phoneNumbers.source}|${DLATK.emoticons.source}|${DLATK.webAddressFull.source}|${DLATK.webStart.source}|${DLATK.command.source}|${DLATK.httpGet.source}|${DLATK.htmlTags.source}|${DLATK.twitterUsernames.source}|${DLATK.hashtags.source}|${DLATK.remaining.source}`, 'giu');
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
}
STANFORD.phoneNumbers = /(?:(?:\+?[01][-\s.]*)?(?:[(]?\d{3}[-\s.)]*)?\d{3}[-\s.]*\d{4})/;
STANFORD.emoticons = /(?:[<>]?[:;=8][-o*']?[)\]([dDpP/:}{@|\\]|[)\]([dDpP/:}{@|\\][-o*']?[:;=8][<>]?)/;
STANFORD.htmlTags = /<[^>]+>/;
STANFORD.twitterUsernames = /(?:@[\w_]+)/;
STANFORD.hashtags = /(?:#+[\w_]+[\w'_-]*[\w_]+)/;
/** @see "accentedChars" above */
STANFORD.remaining = /(?:[a-z\u00C0-\u00FF][a-z\u00C0-\u00FF'_-]+[a-z\u00C0-\u00FF])|(?:[+-]?\d+[,/.:-]\d+[+-]?)|(?:[\w_]+)|(?:\.(?:\s*\.){1,})|(?:\S)/u;
STANFORD.pattern = new RegExp(`${STANFORD.phoneNumbers.source}|${STANFORD.emoticons.source}|${STANFORD.htmlTags.source}|${STANFORD.twitterUsernames.source}|${STANFORD.hashtags.source}|${STANFORD.remaining.source}`, 'giu');
export const HEX_PATTERN = /\\x[0-9a-z]{1,4}/g;
export const HTML_DIGIT_PATTERN = /&#\d+;/g;
export const HTML_ALPHA_PATTERN = /&\w+;/g;
export const AMP_STRING = "&amp;";
export const AND_STRING = " and ";
export const EMPTY_STRING = "";
export const SPECIAL_CHARS = /[\u0300-\u036f]/g;
//# sourceMappingURL=constants.js.map