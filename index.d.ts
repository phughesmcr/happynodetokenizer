/** @async */
export function tokenise(
  str: string,
  opts?: {
    logs?: number,
    mode?: 'stanford' | 'dlatk',
    normalize?: boolean,
    preserveCase?: boolean,
    strict?: boolean,
    tag?: boolean,
  }): Promise<string[] | {value: string, type: string}>;

export function tokeniseSync(
  str: string,
  opts?: {
    logs?: number,
    mode?: 'stanford' | 'dlatk',
    normalize?: boolean,
    preserveCase?: boolean,
    strict?: boolean,
    tag?: boolean,
  },
  cb?: Function): string[] | {value: string, type: string};

/** @async */
export function tokenize(
  str: string,
  opts?: {
    logs?: number,
    mode?: 'stanford' | 'dlatk',
    normalize?: boolean,
    preserveCase?: boolean,
    strict?: boolean,
    tag?: boolean,
  }): Promise<string[] | {value: string, type: string}>;

export function tokenizeSync(
  str: string,
  opts?: {
    logs?: number,
    mode?: 'stanford' | 'dlatk',
    normalize?: boolean,
    preserveCase?: boolean,
    strict?: boolean,
    tag?: boolean,
  }, cb?: Function): string[] | {value: string, type: string};

