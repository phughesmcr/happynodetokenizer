declare const enum Mode {
    stanford = "stanford",
    dlatk = "dlatk"
}
declare const enum NormalizationForm {
    NFC = "NFC",
    NFD = "NFD",
    NFKC = "NFKC",
    NFKD = "NFKD"
}

interface TokenizerOptions {
    /** Defaults to "stanford" */
    mode?: Mode;
    /** Defaults to `null` */
    normalize?: NormalizationForm | null;
    /** Defaults to `true` */
    preserveCase?: boolean;
}

interface Token {
    /** The tokens index (begins at 0) */
    idx: number;
    /** The token's type (e.g., "punct" for punctuation) */
    tag: string;
    /** The token itself */
    value: string;
}
/**
 * Create a tokenizer with a given set of options configured
 * @param opts optional tokenizer options
 * @param opts.mode Tokenization mode, "stanford" | "dlatk". Defaults to "stanford".
 * @param opts.normalize Normalization form, disabled if undefined | null. Available options: "NFC" | "NFD" | "NFKC" | "NFKD". Defaults to undefined.
 * @param opts.preserveCase Preserve the tokens' case; does not affect emoticons. Defaults to `true`.
 * @returns the tokenizer function
 */
declare function tokenizer(opts?: TokenizerOptions): (input: string) => Token[];

export { tokenizer };
