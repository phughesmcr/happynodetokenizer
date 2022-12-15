/** Tokenizer options object handling. */

import { MODE_PATTERN, NORM_PATTERN } from "./constants.js";
import type { TokenizerOptions, TokenizerMode, TokenizerNormalization } from "./types.js";

export function normalizeOpts(opts: TokenizerOptions): Required<TokenizerOptions> {
  const { mode = "stanford", normalize = null, preserveCase = true } = opts;

  if (typeof mode !== "string") {
    throw new TypeError(`"mode" must be a string. Found "${typeof mode}".`);
  }
  const _mode = mode.toLowerCase();
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
