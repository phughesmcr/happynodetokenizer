export type Tokenizer = (input: string) => () => Generator<Token, void, unknown>;

export type TokenizerTag =
  | "phone"
  | "url"
  | "url_scheme"
  | "url_authority"
  | "url_path_query"
  | "htmltag"
  | "emoticon"
  | "username"
  | "hashtag"
  | "word"
  | "punct"
  | "<UNK>";

export type TokenizerMode = "stanford" | "dlatk";

export type TokenizerNormalization = "NFC" | "NFD" | "NFKC" | "NFKD" | null;

export interface TokenizerOptions {
  /** Defaults to "stanford" */
  mode?: TokenizerMode;
  /** Defaults to `null` */
  normalize?: TokenizerNormalization;
  /** Defaults to `true` */
  preserveCase?: boolean;
}

export type Token = {
  /** The end position of the match. 0 based. */
  end: number;
  /** The starting position of the match. 0 based. */
  start: number;
  /** The token's type (e.g., "punct" for punctuation) */
  tag: string;
  /** The token itself */
  value: string;
  /**
   * Only present when preserveCase === true.
   * The token's original value as matched, without any case modification.
   */
  variation?: string;
};

export type TokenMatchData = {
  /** The end position of the match. 0 based. */
  end: number;
  /** The original match data */
  match: RegExpExecArray;
  /** The starting position of the match. 0 based. */
  start: number;
};
