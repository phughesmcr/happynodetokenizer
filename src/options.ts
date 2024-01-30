import { DEFAULTS, DEFAULT_OPTS, TOKENIZER_MODE, UTIL_PATTERNS } from "./constants.js";
import type { TokenizerMode, TokenizerNormalizationForm, TokenizerOptions } from "./types.js";

function normalizeMode(mode: TokenizerMode): TokenizerMode {
  if (typeof mode !== "string") {
    throw new TypeError(`"mode" must be a string. Found "${typeof mode}".`);
  }
  const _mode = mode.toLowerCase();
  if (!UTIL_PATTERNS.MODE.exec(_mode)) {
    throw new SyntaxError(`"mode" must be "${TOKENIZER_MODE.STANFORD}" or "${TOKENIZER_MODE.DLATK}". Found "${mode}".`);
  }
  return _mode as TokenizerMode;
}

function normalizeNormalize(normalize: TokenizerNormalizationForm): TokenizerNormalizationForm {
  if (!normalize) return null;
  if (typeof normalize !== "string") {
    throw new TypeError(`"normalize" must be a string. Found "${typeof normalize}".`);
  }
  const _normalize = normalize.toUpperCase();
  if (_normalize && !UTIL_PATTERNS.NORM.exec(_normalize)) {
    throw new SyntaxError(
      `"normalize" option must be 'NFC' | 'NFD' | 'NFKC' | 'NFKD' | null. Found "${String(normalize)}".`
    );
  }
  return _normalize as TokenizerNormalizationForm;
}

export function normalizeOpts(opts: TokenizerOptions): Required<TokenizerOptions> {
  const {
    mode = DEFAULTS.MODE,
    normalize = DEFAULTS.NORMALIZE,
    preserveCase = DEFAULTS.PRESERVE_CASE,
  } = { ...DEFAULT_OPTS, ...opts };
  return {
    mode: normalizeMode(mode),
    normalize: normalizeNormalize(normalize),
    preserveCase: !!preserveCase,
  };
}
