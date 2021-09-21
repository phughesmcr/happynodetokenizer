/** Tokenizer options object handling. */
"use strict";

import { Mode, MODE_PATTERN, NormalizationForm, NORM_PATTERN } from "./constants";

export interface TokenizerOptions {
  /** Defaults to "stanford" */
  mode?: Mode;
  /** Defaults to `undefined` */
  normalize?: NormalizationForm | null;
  /** Defaults to `true` */
  preserveCase?: boolean;
}

export function normalizeOpts(opts: TokenizerOptions): Required<TokenizerOptions> {
  const { mode = Mode.stanford, normalize = null, preserveCase = true } = opts;

  const _mode = mode.toLowerCase();
  const _normalize = normalize?.toUpperCase() ?? null;

  if (!MODE_PATTERN.exec(_mode)) {
    throw new SyntaxError(`Tokenizer "mode" must be "stanford" or "dlatk". Found "${mode}".`);
  }
  if (normalize && !NORM_PATTERN.exec(normalize)) {
    throw new SyntaxError(
      `Tokenizer "normalize" option must be null | undefined | 'NFC' | 'NFD' | 'NFKC' | 'NFKD'. Found "${normalize}".`
    );
  }

  return {
    mode: typeof mode !== "string" ? Mode.stanford : (_mode as Mode),
    normalize: typeof normalize !== "string" ? null : (_normalize as NormalizationForm),
    preserveCase: Boolean(preserveCase),
  };
}
