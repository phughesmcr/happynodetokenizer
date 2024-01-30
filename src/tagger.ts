import { DLATK, UTIL_PATTERNS, STANFORD, TOKENIZER_MODE, TOKEN_TAG } from "./constants.js";
import { memoize } from "./utils.js";
import type { TokenTag, TokenizerMode } from "./types.js";

export function getDlatkTag(token: string): TokenTag {
  switch (true) {
    case DLATK.phoneNumbers.test(token):
      return TOKEN_TAG.PHONE;
    case DLATK.webAddressFull.test(token):
      return TOKEN_TAG.URL;
    case DLATK.webStart.test(token):
      return TOKEN_TAG.URL_SCHEME;
    case DLATK.command.test(token):
      return TOKEN_TAG.URL_AUTHORITY;
    case DLATK.httpGet.test(token):
      return TOKEN_TAG.URL_PATH_QUERY;
    case DLATK.htmlTags.test(token) &&
      (!DLATK.emoticons.test(token) || (DLATK.emoticons.test(token) && UTIL_PATTERNS.HTMLTAG.test(token))):
      return TOKEN_TAG.HTMLTAG;
    case DLATK.emoticons.test(token):
      return TOKEN_TAG.EMOTICON;
    case DLATK.twitterUsernames.test(token):
      return TOKEN_TAG.USERNAME;
    case DLATK.hashtags.test(token):
      return TOKEN_TAG.HASHTAG;
    case DLATK.remaining.test(token):
      if (UTIL_PATTERNS.WORD.test(token)) {
        return TOKEN_TAG.WORD;
      } else {
        return TOKEN_TAG.PUNCTUATION;
      }
    default:
      return TOKEN_TAG.UNKNOWN;
  }
}

export function getStanfordTag(token: string): TokenTag {
  switch (true) {
    case STANFORD.phoneNumbers.test(token):
      return TOKEN_TAG.PHONE;
    case STANFORD.htmlTags.test(token) &&
      (!STANFORD.emoticons.test(token) || (STANFORD.emoticons.test(token) && UTIL_PATTERNS.HTMLTAG.test(token))):
      return TOKEN_TAG.HTMLTAG;
    case STANFORD.emoticons.test(token):
      return TOKEN_TAG.EMOTICON;
    case STANFORD.twitterUsernames.test(token):
      return TOKEN_TAG.USERNAME;
    case STANFORD.hashtags.test(token):
      return TOKEN_TAG.HASHTAG;
    case STANFORD.remaining.test(token):
      if (UTIL_PATTERNS.WORD.test(token)) {
        return TOKEN_TAG.WORD;
      } else {
        return TOKEN_TAG.PUNCTUATION;
      }
    default:
      return TOKEN_TAG.UNKNOWN;
  }
}

export function createTagger(mode: TokenizerMode): (str: string) => TokenTag {
  return mode === TOKENIZER_MODE.DLATK
    ? memoize<string, TokenTag>(getDlatkTag)
    : memoize<string, TokenTag>(getStanfordTag);
}
