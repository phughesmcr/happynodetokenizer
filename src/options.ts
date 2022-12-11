/** Tokenizer options object handling. */

import { MODE_PATTERN, NORM_PATTERN } from "./constants.js";

export function normalizeOpts(opts: TokenizerOptions): Required<TokenizerOptions> {
  const { mode = "stanford", normalize = null, preserveCase = true } = opts;

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
    mode: typeof mode !== "string" ? "stanford" : (_mode as "stanford" | "dlatk"),
    normalize: typeof normalize !== "string" ? null : (_normalize as "NFC" | "NFD" | "NFKC" | "NFKD"),
    preserveCase: Boolean(preserveCase),
  };
}
