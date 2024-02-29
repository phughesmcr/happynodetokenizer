import type { Tokenizer, TokenizerOptions } from "./types.js";
/**
 * Create a tokenizer with a given set of options configured
 * @param opts optional tokenizer options
 * @param opts.mode Tokenization mode, "stanford" | "dlatk". Defaults to "stanford".
 * @param opts.normalize Normalization form, disabled if null. Available options: "NFC" | "NFD" | "NFKC" | "NFKD". Defaults to null.
 * @param opts.preserveCase Preserve the tokens' case; does not affect emoticons. Defaults to `true`.
 * @returns the tokenizer function
 */
export declare function tokenizer(opts?: TokenizerOptions): Tokenizer;
//# sourceMappingURL=tokenizer.d.ts.map