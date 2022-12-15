/** Tokenizer options object handling. */

import {
  DEFAULT_MODE,
  DEFAULT_NORMALIZE,
  DEFAULT_OPTS,
  DEFAULT_PRESERVE_CASE,
  DLATK,
  MODE_PATTERN,
  NORM_PATTERN,
  STANFORD,
} from "./constants.js";
import type { TokenizerOptions, TokenizerMode, TokenizerNormalization } from "./types.js";

export function normalizeOpts(opts: TokenizerOptions): Required<TokenizerOptions> {
  const {
    mode = DEFAULT_MODE,
    normalize = DEFAULT_NORMALIZE,
    preserveCase = DEFAULT_PRESERVE_CASE,
  } = { ...DEFAULT_OPTS, ...opts };

  if (typeof mode !== "string") {
    throw new TypeError(`"mode" must be a string. Found "${typeof mode}".`);
  }
  const _mode = mode.toLowerCase();
  if (!MODE_PATTERN.exec(_mode)) {
    throw new SyntaxError(`"mode" must be "${STANFORD}" or "${DLATK}". Found "${mode}".`);
  }

  if (normalize && typeof normalize !== "string") {
    throw new TypeError(`"normalize" must be a string. Found "${typeof normalize}".`);
  }
  const _normalize = normalize?.toUpperCase() ?? null;
  if (normalize && !NORM_PATTERN.exec(normalize)) {
    throw new SyntaxError(`"normalize" option must be 'NFC' | 'NFD' | 'NFKC' | 'NFKD' | null. Found "${normalize}".`);
  }

  return {
    mode: _mode as TokenizerMode,
    normalize: _normalize as TokenizerNormalization,
    preserveCase: !!preserveCase,
  };
}
