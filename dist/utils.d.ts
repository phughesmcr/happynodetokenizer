import { TokenizerMode } from "./types.js";
export declare function pipe<T, R>(...fns: ((...args: any[]) => any)[]): (value: T) => T & R;
export declare function memoize<T, R>(fn: (...args: T[]) => R): (...args: T[]) => R;
export declare function noop<T>(input: T): T;
export declare function cloneRegExp(pattern: RegExp): RegExp;
export declare function getEmoticonPattern(mode: TokenizerMode): RegExp;
export declare function getPattern(mode: TokenizerMode): RegExp;
//# sourceMappingURL=utils.d.ts.map