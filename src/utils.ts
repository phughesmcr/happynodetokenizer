/* eslint-disable @typescript-eslint/no-explicit-any */

export function pipe<R>(...fns: ((...args: any[]) => any)[]) {
  return <T>(value: T): T & R => fns.reduce((acc: T & R, fn: (...args: any[]) => T & R) => fn(acc), value as T & R);
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

export function noop(str: string): string {
  return str;
}
