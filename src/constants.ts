import { TokenizerMode, TokenizerNormalization, TokenizerOptions } from "./types.js";

export const STANFORD = "stanford";

export const DLATK = "dlatk";

export const PHONE_TAG = "phone";

export const URL_TAG = "url";

export const URL_SCHEME_TAG = "url_scheme";

export const URL_AUTHORITY_TAG = "url_authority";

export const URL_PATH_QUERY_TAG = "url_path_query";

export const HTMLTAG_TAG = "htmltag";

export const EMOTICON_TAG = "emoticon";

export const USERNAME_TAG = "username";

export const HASHTAG_TAG = "hashtag";

export const WORD_TAG = "word";

export const PUNCT_TAG = "punct";

export const UNK_TAG = "<UNK>";

export const HTMLTAG_PATTERN = /[a-zA-Z]{2,}/g;

export const WORD_PATTERN = /\w/;

export const MODE_PATTERN = /dlatk|stanford/;

export const NORM_PATTERN = /NFK?(C|D)/;

export const DEFAULT_MODE: TokenizerMode = STANFORD;

export const DEFAULT_NORMALIZE: TokenizerNormalization = null;

export const DEFAULT_PRESERVE_CASE = true;

export const DEFAULT_OPTS: Readonly<TokenizerOptions> = Object.freeze({
  mode: DEFAULT_MODE,
  normalize: DEFAULT_NORMALIZE,
  preserveCase: DEFAULT_PRESERVE_CASE,
});
