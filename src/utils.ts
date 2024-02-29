/* eslint-disable @typescript-eslint/no-explicit-any */

import { DLATK, STANFORD } from "./constants.js";
import { TokenizerMode } from "./types.js";

export function pipe<T, R>(...fns: ((...args: any[]) => any)[]) {
  return (value: T): T & R => fns.reduce((acc: T & R, fn: (...args: any[]) => T & R) => fn(acc), value as T & R);
}

export function memoize<T, R>(fn: (...args: T[]) => R): (...args: T[]) => R {
  const cache: Record<string, R> = {};
  return (...args: T[]): R => {
    const key = JSON.stringify(args);
    const cached = cache[key];
    if (typeof cached === "undefined") {
      const res = fn(...args);
      cache[key] = res;
      return res;
    } else {
      return cached;
    }
  };
}

export function noop<T>(input: T): T {
  return input;
}

export function cloneRegExp(pattern: RegExp): RegExp {
  return new RegExp(pattern.source, pattern.flags);
}

export function getEmoticonPattern(mode: TokenizerMode): RegExp {
  return mode === "dlatk" ? DLATK.emoticons : STANFORD.emoticons;
}

export function getPattern(mode: TokenizerMode): RegExp {
  return mode === "dlatk" ? DLATK.pattern : STANFORD.pattern;
}
