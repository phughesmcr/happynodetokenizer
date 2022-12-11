export type TokenizerMode = "stanford" | "dlatk";
export type TokenizerNormalization = "NFC" | "NFD" | "NFKC" | "NFKD" | null;

export interface TokenizerOptions {
  /** Defaults to "stanford" */
  mode?: TokenizerMode;
  /** Defaults to `undefined` */
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
};

export type TokenMatchData = {
  /** The end position of the match. 0 based. */
  end: number;
  /** The original match data */
  match: RegExpExecArray;
  /** The starting position of the match. 0 based. */
  start: number;
};
