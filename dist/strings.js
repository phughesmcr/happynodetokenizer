import he from "he";
import { AMP_STRING, AND_STRING, EMPTY_STRING, HEX_PATTERN, HTML_ALPHA_PATTERN, HTML_DIGIT_PATTERN, SPECIAL_CHARS } from "./constants.js";
import { cloneRegExp, getEmoticonPattern, memoize, noop, pipe } from "./utils.js";
export function normalizeStr(form) {
    return (str) => str.normalize(form).replace(SPECIAL_CHARS, EMPTY_STRING);
}
export function removeHex(str) {
    return str.replace(HEX_PATTERN, EMPTY_STRING);
}
export function replaceAmp(str) {
    return str.replace(AMP_STRING, AND_STRING);
}
function getChar(match) {
    return parseInt(match.substring(2), 10);
}
function parseDigit(match) {
    return String.fromCharCode(getChar(match));
}
export function replaceDigits(str) {
    return str.replace(HTML_DIGIT_PATTERN, parseDigit);
}
function decode(match) {
    return he.decode(match);
}
export function replaceAlpha(str) {
    return str.replace(HTML_ALPHA_PATTERN, decode);
}
export const htmlToUnicode = pipe(replaceAmp, replaceDigits, replaceAlpha);
/** Creates a function that will normalize a string if a valid form is given */
function createNormalizer(form) {
    return form ? normalizeStr(form) : noop;
}
/** Creates a function that replaces hex codes in dlatk mode */
function createHexReplacer(mode) {
    return mode === "dlatk" ? removeHex : noop;
}
/** Avoid mutating the original string by creating a copy */
function clone(str) {
    return String(str);
}
/** @throws if str is not typeof string */
function isString(str) {
    if (typeof str === "string")
        return str;
    throw new TypeError("HappyNodeTokenizer: input must be a string.");
}
/** Creates a function that handles case preservation */
export function createCaseHandler(preserveCase, mode) {
    const clonePattern = cloneRegExp(getEmoticonPattern(mode));
    return memoize((str) => (clonePattern.test(str) ? str : preserveCase ? str : str.toLowerCase()));
}
export function createCleaner(mode, normalize = null) {
    const replaceHex = createHexReplacer(mode);
    const normalizer = createNormalizer(normalize);
    return pipe(isString, clone, htmlToUnicode, replaceHex, normalizer);
}
//# sourceMappingURL=strings.js.map