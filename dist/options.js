import { DEFAULTS, DEFAULT_OPTS, UTIL_PATTERNS } from "./constants.js";
function normalizeMode(mode) {
    if (typeof mode !== "string") {
        throw new TypeError(`"mode" must be a string. Found "${typeof mode}".`);
    }
    const _mode = mode.toLowerCase();
    if (!UTIL_PATTERNS.MODE.exec(_mode)) {
        throw new SyntaxError(`"mode" must be "stanford" or "dlatk". Found "${mode}".`);
    }
    return _mode;
}
function normalizeNormalize(normalize) {
    if (!normalize)
        return null;
    if (typeof normalize !== "string") {
        throw new TypeError(`"normalize" must be a string. Found "${typeof normalize}".`);
    }
    const _normalize = normalize.toUpperCase();
    if (_normalize && !UTIL_PATTERNS.NORM.exec(_normalize)) {
        throw new SyntaxError(`"normalize" option must be 'NFC' | 'NFD' | 'NFKC' | 'NFKD' | null. Found "${String(normalize)}".`);
    }
    return _normalize;
}
export function normalizeOpts(opts) {
    const { mode = DEFAULTS.MODE, normalize = DEFAULTS.NORMALIZE, preserveCase = DEFAULTS.PRESERVE_CASE, } = { ...DEFAULT_OPTS, ...opts };
    return {
        mode: normalizeMode(mode),
        normalize: normalizeNormalize(normalize),
        preserveCase: !!preserveCase,
    };
}
//# sourceMappingURL=options.js.map