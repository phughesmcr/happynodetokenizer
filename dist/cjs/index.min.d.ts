type TokenizerMode = "stanford" | "dlatk";
type TokenizerNormalization = "NFC" | "NFD" | "NFKC" | "NFKD" | null;
interface TokenizerOptions {
    /** Defaults to "stanford" */
    mode?: TokenizerMode;
    /** Defaults to `undefined` */
    normalize?: TokenizerNormalization;
    /** Defaults to `true` */
    preserveCase?: boolean;
}
type Token = {
    /** The end position of the match. 0 based. */
    end: number;
    /** The starting position of the match. 0 based. */
    start: number;
    /** The token's type (e.g., "punct" for punctuation) */
    tag: string;
    /** The token itself */
    value: string;
};

/** String tokenizer */

/**
 * Create a tokenizer with a given set of options configured
 * @param opts optional tokenizer options
 * @param opts.mode Tokenization mode, "stanford" | "dlatk". Defaults to "stanford".
 * @param opts.normalize Normalization form, disabled if undefined | null. Available options: "NFC" | "NFD" | "NFKC" | "NFKD". Defaults to undefined.
 * @param opts.preserveCase Preserve the tokens' case; does not affect emoticons. Defaults to `true`.
 * @returns the tokenizer function
 */
declare function tokenizer(opts?: TokenizerOptions): (input: string) => () => Generator<Token, void, unknown>;

export { Token, tokenizer };
