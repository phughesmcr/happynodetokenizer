/* eslint-disable @typescript-eslint/no-explicit-any */
"use strict";

export function pipe<R>(...fns: ((...args: any[]) => any)[]) {
  return <T>(value: T): T & R => fns.reduce((acc: T & R, fn: (...args: any[]) => T & R) => fn(acc), value as T & R);
}
