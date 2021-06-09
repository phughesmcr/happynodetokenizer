/*! *****************************************************************************
 *
 * happynodetokenizer
 * v3.1.0
 *
 ****************************************************************************** */

declare const stanfordTokenizerPattern: RegExp;
declare const dlatkTokenizerPattern: RegExp;
interface TokenizerOptions {
    locale: string;
    mode: 'stanford' | 'dlatk';
    normalize: 'NFC' | 'NFD' | 'NFKC' | 'NFKD' | undefined;
    preserveCase: boolean;
    tag: boolean;
}
interface TokenTagObject {
    value: string;
    tag: string;
}
declare type TokenizerCallback = (err?: string, res?: string[] | TokenTagObject[]) => void;
declare function tokenize(input: string, opts: Partial<TokenizerOptions>, cb?: TokenizerCallback): string[] | TokenTagObject[] | void;

export { TokenTagObject, TokenizerCallback, TokenizerOptions, dlatkTokenizerPattern, stanfordTokenizerPattern, tokenize };
