/** Token type tagger */

import type { TokenizerMode } from "./types.js";
import { memoize } from "./utils.js";
import {
  dlatkPhoneNumbers,
  dlatkWebAddressFull,
  dlatkWebStart,
  dlatkCommand,
  dlatkHttpGet,
  dlatkHtmlTags,
  dlatkEmoticons,
  dlatkTwitterUsernames,
  dlatkHashtags,
  dlatkRemaining,
  stanfordEmoticons,
  stanfordHashtags,
  stanfordHtmlTags,
  stanfordPhoneNumbers,
  stanfordRemaining,
  stanfordTwitterUsernames,
} from "./patterns.js";
import {
  DLATK,
  EMOTICON_TAG,
  HASHTAG_TAG,
  HTMLTAG_PATTERN,
  HTMLTAG_TAG,
  PHONE_TAG,
  PUNCT_TAG,
  UNK_TAG,
  URL_AUTHORITY_TAG,
  URL_PATH_QUERY_TAG,
  URL_SCHEME_TAG,
  URL_TAG,
  USERNAME_TAG,
  WORD_PATTERN,
  WORD_TAG,
} from "./constants.js";

function getDlatkTag(token: string): string {
  switch (true) {
    case dlatkPhoneNumbers.test(token):
      return PHONE_TAG;
    case dlatkWebAddressFull.test(token):
      return URL_TAG;
    case dlatkWebStart.test(token):
      return URL_SCHEME_TAG;
    case dlatkCommand.test(token):
      return URL_AUTHORITY_TAG;
    case dlatkHttpGet.test(token):
      return URL_PATH_QUERY_TAG;
    case dlatkHtmlTags.test(token) &&
      (!dlatkEmoticons.test(token) || (dlatkEmoticons.test(token) && HTMLTAG_PATTERN.test(token))):
      return HTMLTAG_TAG;
    case dlatkEmoticons.test(token):
      return EMOTICON_TAG;
    case dlatkTwitterUsernames.test(token):
      return USERNAME_TAG;
    case dlatkHashtags.test(token):
      return HASHTAG_TAG;
    case dlatkRemaining.test(token):
      if (WORD_PATTERN.test(token)) {
        return WORD_TAG;
      } else {
        return PUNCT_TAG;
      }
    default:
      return UNK_TAG;
  }
}

function getStanfordTag(token: string): string {
  switch (true) {
    case stanfordPhoneNumbers.test(token):
      return PHONE_TAG;
    case stanfordHtmlTags.test(token) &&
      (!stanfordEmoticons.test(token) || (stanfordEmoticons.test(token) && HTMLTAG_PATTERN.test(token))):
      return HTMLTAG_TAG;
    case stanfordEmoticons.test(token):
      return EMOTICON_TAG;
    case stanfordTwitterUsernames.test(token):
      return USERNAME_TAG;
    case stanfordHashtags.test(token):
      return HASHTAG_TAG;
    case stanfordRemaining.test(token):
      if (WORD_PATTERN.test(token)) {
        return WORD_TAG;
      } else {
        return PUNCT_TAG;
      }
    default:
      return UNK_TAG;
  }
}

export function createTagger(mode: TokenizerMode): (str: string) => string {
  return mode === DLATK ? memoize<string, string>(getDlatkTag) : memoize<string, string>(getStanfordTag);
}
