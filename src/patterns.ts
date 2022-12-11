/**
 * RegExp patterns for Stanford and DLATK tokenizing.
 *
 * @see accentedChars:
 * Javascript doesn't match accented characters like Python
 * so this additional code has been inserted into both
 * the Stanford and DLATK regexps, in the "Remaining" item:
 * accentedChars = \u00C0-\u00FF
 */

//#region Stanford
export const stanfordPhoneNumbers = /(?:(?:\+?[01][-\s.]*)?(?:[(]?\d{3}[-\s.)]*)?\d{3}[-\s.]*\d{4})/;
export const stanfordEmoticons = /(?:[<>]?[:;=8][-o*']?[)\]([dDpP/:}{@|\\]|[)\]([dDpP/:}{@|\\][-o*']?[:;=8][<>]?)/;
export const stanfordHtmlTags = /<[^>]+>/;
export const stanfordTwitterUsernames = /(?:@[\w_]+)/;
export const stanfordHashtags = /(?:#+[\w_]+[\w'_-]*[\w_]+)/;
export const stanfordRemaining =
  /(?:[a-z\u00C0-\u00FF][a-z\u00C0-\u00FF'_-]+[a-z\u00C0-\u00FF])|(?:[+-]?\d+[,/.:-]\d+[+-]?)|(?:[\w_]+)|(?:\.(?:\s*\.){1,})|(?:\S)/u; // see "accentedChars" above

export const stanfordTokenizerPattern = new RegExp(
  stanfordPhoneNumbers.source +
    "|" +
    stanfordEmoticons.source +
    "|" +
    stanfordHtmlTags.source +
    "|" +
    stanfordTwitterUsernames.source +
    "|" +
    stanfordHashtags.source +
    "|" +
    stanfordRemaining.source,
  "gi"
);
//#endregion Stanford

//#region DLATK
export const dlatkPhoneNumbers = /(?:(?:\+?[01][-\s.]*)?(?:[(]?\d{3}[-\s.)]*)?\d{3}[-\s.]*\d{4})/;
export const dlatkEmoticons =
  /(?:[<>]?[:;=8>][-o*']?[)\]([dDpPxX/:}{@|\\]|[)\]([dDpPxX/:}{@|\\][-o*']?[:;=8<][<>]?|<[/\\]?3|\(?\(?#?[>\-^*+o~][_.|oO,][<\-^*+o~][#;]?\)?\)?)/;
export const dlatkWebAddressFull =
  /(?:(?:http[s]?:\/\/)?(?:[\w_-]+\.)+(?:com|net|gov|edu|info|org|ly|be|gl|co|gs|pr|me|cc|us|gd|nl|ws|am|im|fm|kr|to|jp|sg)(?:\/[\s\b$])?)/;
export const dlatkWebStart = /(?:http[s]?:\/\/)/;
export const dlatkCommand = /(?:\[[\w_]+\])/;
export const dlatkHttpGet = /(?:\/\w+\?(?:;?\w+=\w+)+)/;
export const dlatkHtmlTags = /(?:<[^>]+\w=[^>]+>|<[^>]+\s\/>|<[^>\s]+>?|<?[^<\s]+>)/;
export const dlatkTwitterUsernames = /(?:@[\w_]+)/;
export const dlatkHashtags = /(?:#+[\w_]+[\w'_-]*[\w_]+)/;
export const dlatkRemaining =
  /(?:[\w\u00C0-\u00FF][\w\u00C0-\u00FF'_-]+[\w\u00C0-\u00FF])|(?:[+-]?\d+[,/.:-]\d+[+-]?)|(?:[\w_]+)|(?:\.(?:\s*\.){1,})|(?:\S)/u; // see "_accentedChars" above

export const dlatkTokenizerPattern = new RegExp(
  dlatkPhoneNumbers.source +
    "|" +
    dlatkEmoticons.source +
    "|" +
    dlatkWebAddressFull.source +
    "|" +
    dlatkWebStart.source +
    "|" +
    dlatkCommand.source +
    "|" +
    dlatkHttpGet.source +
    "|" +
    dlatkHtmlTags.source +
    "|" +
    dlatkTwitterUsernames.source +
    "|" +
    dlatkHashtags.source +
    "|" +
    dlatkRemaining.source,
  "gi"
);
//#endregion DLATK
