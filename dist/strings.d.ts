import { TokenizerMode, TokenizerNormalizationForm } from "./types.js";
export declare function normalizeStr(form?: string): (str: string) => string;
export declare function removeHex(str: string): string;
export declare function replaceAmp(str: string): string;
export declare function replaceDigits(str: string): string;
export declare function replaceAlpha(str: string): string;
export declare const htmlToUnicode: (value: string) => string;
/** Creates a function that handles case preservation */
export declare function createCaseHandler(preserveCase: boolean, mode: TokenizerMode): (...args: string[]) => string;
export declare function createCleaner(mode: TokenizerMode, normalize?: TokenizerNormalizationForm): (input: string) => string;
//# sourceMappingURL=strings.d.ts.map