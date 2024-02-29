export abstract class PatternContainer {
  static pattern: RegExp;
}

export type Tokenizer = (input: string) => () => IterableIterator<Token>;

/** The tokenizer methodology */
export type TokenizerMode = "stanford" | "dlatk";

/**
 * String normalization form
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize}
 */
export type TokenizerNormalizationForm = "NFC" | "NFD" | "NFKC" | "NFKD" | null;

/** The token type */
export type TokenTag = "phone" | "url" | "url_scheme" | "url_authority" | "url_path_query" | "htmltag" | "emoticon" | "username" | "hashtag" | "word" | "punct" | "<UNK>";

export interface TokenizerOptions {
  /** Defaults to "stanford" */
  mode?: TokenizerMode;
  /** Defaults to `null` */
  normalize?: TokenizerNormalizationForm;
  /** Defaults to `true` */
  preserveCase?: boolean;
}

/** The output of the tokenizer */
export type Token = {
  /** The end position of the match. 0 based. */
  end: number;
  /** The starting position of the match. 0 based. */
  start: number;
  /** The token's type (e.g., "punct" for punctuation) */
  tag: TokenTag;
  /** The token itself */
  value: string;
  /**
   * Only present when preserveCase === true.
   * The token's original value as matched, without any case modification.
   */
  variation?: string | undefined;
};

export type TokenMatchData = {
  /** The 0-based end position of the match. */
  end: number;
  /** The original match data */
  match: RegExpExecArray;
  /** The 0-based starting position of the match. */
  start: number;
};
