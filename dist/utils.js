/* eslint-disable @typescript-eslint/no-explicit-any */
import { DLATK, STANFORD } from "./constants.js";
export function pipe(...fns) {
    return (value) => fns.reduce((acc, fn) => fn(acc), value);
}
export function memoize(fn) {
    const cache = {};
    return (...args) => {
        const key = JSON.stringify(args);
        const cached = cache[key];
        if (typeof cached === "undefined") {
            const res = fn(...args);
            cache[key] = res;
            return res;
        }
        else {
            return cached;
        }
    };
}
export function noop(input) {
    return input;
}
export function cloneRegExp(pattern) {
    return new RegExp(pattern.source, pattern.flags);
}
export function getEmoticonPattern(mode) {
    return mode === "dlatk" ? DLATK.emoticons : STANFORD.emoticons;
}
export function getPattern(mode) {
    return mode === "dlatk" ? DLATK.pattern : STANFORD.pattern;
}
//# sourceMappingURL=utils.js.map