/*! *****************************************************************************
 *
 * happynodetokenizer
 * v3.0.0
 *
 ****************************************************************************** */

declare const stanfordTokenizerPattern: RegExp;
declare const dlatkTokenizerPattern: RegExp;
interface TokenizerOptions {
    mode: 'stanford' | 'dlatk';
    normalize?: 'NFC' | 'NFD' | 'NFKC' | 'NFKD';
    preserveCase: boolean;
    tag: boolean;
}
declare function tokenize(input: string, opts: Partial<TokenizerOptions>, cb?: (err?: string, res?: string[] | Record<string, string>[]) => void): string[] | Record<string, string>[] | void;

export { TokenizerOptions, dlatkTokenizerPattern, stanfordTokenizerPattern, tokenize };
