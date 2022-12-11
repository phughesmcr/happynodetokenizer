/** Token type tagger */

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
import type { TokenizerMode } from "./types.js";

const TAG_PATTERN = /[a-zA-Z]{2,}/g;
const WORD_PATTERN = /\w/;

function getDlatkTag(token: string): string {
  switch (true) {
    case dlatkPhoneNumbers.test(token):
      return "phone";
    case dlatkWebAddressFull.test(token):
      return "url";
    case dlatkWebStart.test(token):
      return "url_scheme";
    case dlatkCommand.test(token):
      return "url_authority";
    case dlatkHttpGet.test(token):
      return "url_path_query";
    case dlatkHtmlTags.test(token) &&
      (!dlatkEmoticons.test(token) || (dlatkEmoticons.test(token) && TAG_PATTERN.test(token))):
      return "htmltag";
    case dlatkEmoticons.test(token):
      return "emoticon";
    case dlatkTwitterUsernames.test(token):
      return "username";
    case dlatkHashtags.test(token):
      return "hashtag";
    case dlatkRemaining.test(token):
      if (WORD_PATTERN.test(token)) {
        return "word";
      } else {
        return "punct";
      }
    default:
      return "<UNK>";
  }
}

function getStanfordTag(token: string): string {
  switch (true) {
    case stanfordPhoneNumbers.test(token):
      return "phone";
    case stanfordHtmlTags.test(token) &&
      (!stanfordEmoticons.test(token) || (stanfordEmoticons.test(token) && TAG_PATTERN.test(token))):
      return "htmltag";
    case stanfordEmoticons.test(token):
      return "emoticon";
    case stanfordTwitterUsernames.test(token):
      return "username";
    case stanfordHashtags.test(token):
      return "hashtag";
    case stanfordRemaining.test(token):
      if (WORD_PATTERN.test(token)) {
        return "word";
      } else {
        return "punct";
      }
    default:
      return "<UNK>";
  }
}

export function createTagger(mode: TokenizerMode): (str: string) => string {
  return mode === "dlatk" ? memoize<string, string>(getDlatkTag) : memoize<string, string>(getStanfordTag);
}
