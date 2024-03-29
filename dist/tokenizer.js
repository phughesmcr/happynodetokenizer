import { DEFAULT_OPTS } from "./constants.js";
import { normalizeOpts } from "./options.js";
import { createCaseHandler, createCleaner } from "./strings.js";
import { createTagger } from "./tagger.js";
import { cloneRegExp, getPattern } from "./utils.js";
/** Creates a function that returns an array of all RegExp matches */
function createMatcher(mode) {
    const pattern = cloneRegExp(getPattern(mode));
    return function* (str) {
        pattern.lastIndex = 0;
        let m = null;
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
 */
export function tokenizer(opts = DEFAULT_OPTS) {
    const { mode, normalize, preserveCase } = normalizeOpts(opts);
    const caseHandler = createCaseHandler(preserveCase, mode);
    const cleaner = createCleaner(mode, normalize);
    const matcher = createMatcher(mode);
    const tagger = createTagger(mode);
    return (input) => {
        const matches = matcher(cleaner(input));
        return function* () {
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
//# sourceMappingURL=tokenizer.js.map