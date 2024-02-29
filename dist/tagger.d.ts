import type { TokenTag, TokenizerMode } from "./types.js";
export declare function getDlatkTag(token: string): TokenTag;
export declare function getStanfordTag(token: string): TokenTag;
export declare function createTagger(mode: TokenizerMode): (str: string) => TokenTag;
//# sourceMappingURL=tagger.d.ts.map