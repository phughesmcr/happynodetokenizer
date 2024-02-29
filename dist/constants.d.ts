import { PatternContainer, TokenizerMode, TokenizerNormalizationForm, TokenizerOptions } from "./types.js";
export declare class UTIL_PATTERNS {
    static HTMLTAG: RegExp;
    static MODE: RegExp;
    static NORM: RegExp;
    static WORD: RegExp;
}
export declare class DEFAULTS {
    static MODE: TokenizerMode;
    static NORMALIZE: TokenizerNormalizationForm;
    static PRESERVE_CASE: boolean;
}
export declare const DEFAULT_OPTS: Readonly<TokenizerOptions>;
/**
 * RegExp patterns for DLATK tokenizing.
 *
 * @see accentedChars:
 * Javascript doesn't match accented characters like Python
 * so this additional code has been inserted into both
 * the Stanford and DLATK regexps, in the "remaining" pattern:
 * accentedChars = \u00C0-\u00FF
 */
export declare class DLATK extends PatternContainer {
    static phoneNumbers: RegExp;
    static emoticons: RegExp;
    static webAddressFull: RegExp;
    static webStart: RegExp;
    static command: RegExp;
    static httpGet: RegExp;
    static htmlTags: RegExp;
    static twitterUsernames: RegExp;
    static hashtags: RegExp;
    /** @see "accentedChars" above */
    static remaining: RegExp;
    static pattern: RegExp;
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
export declare class STANFORD extends PatternContainer {
    static phoneNumbers: RegExp;
    static emoticons: RegExp;
    static htmlTags: RegExp;
    static twitterUsernames: RegExp;
    static hashtags: RegExp;
    /** @see "accentedChars" above */
    static remaining: RegExp;
    static pattern: RegExp;
}
export declare const HEX_PATTERN: RegExp;
export declare const HTML_DIGIT_PATTERN: RegExp;
export declare const HTML_ALPHA_PATTERN: RegExp;
export declare const AMP_STRING = "&amp;";
export declare const AND_STRING = " and ";
export declare const EMPTY_STRING = "";
export declare const SPECIAL_CHARS: RegExp;
//# sourceMappingURL=constants.d.ts.map