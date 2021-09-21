/** Token type tagger */
"use strict";

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
} from "./patterns";

const TAG_PATTERN = /[a-zA-Z]{2,}/g;
const WORD_PATTERN = /\w/;

function getDlatkTag(token: string): string {
  if (dlatkPhoneNumbers.test(token)) {
    return "phone";
  } else if (dlatkWebAddressFull.test(token)) {
    return "url";
  } else if (dlatkWebStart.test(token)) {
    return "url_scheme";
  } else if (dlatkCommand.test(token)) {
    return "url_authority";
  } else if (dlatkHttpGet.test(token)) {
    return "url_path_query";
  } else if (
    dlatkHtmlTags.test(token) &&
    (!dlatkEmoticons.test(token) || (dlatkEmoticons.test(token) && TAG_PATTERN.test(token)))
  ) {
    return "htmltag";
  } else if (dlatkEmoticons.test(token)) {
    return "emoticon";
  } else if (dlatkTwitterUsernames.test(token)) {
    return "username";
  } else if (dlatkHashtags.test(token)) {
    return "hashtag";
  } else if (dlatkRemaining.test(token)) {
    if (WORD_PATTERN.test(token)) {
      return "word";
    } else {
      return "punct";
    }
  } else {
    return "<UNK>";
  }
}

function getStanfordTag(token: string): string {
  if (stanfordPhoneNumbers.test(token)) {
    return "phone";
  } else if (
    stanfordHtmlTags.test(token) &&
    (!stanfordEmoticons.test(token) || (stanfordEmoticons.test(token) && TAG_PATTERN.test(token)))
  ) {
    return "htmltag";
  } else if (stanfordEmoticons.test(token)) {
    return "emoticon";
  } else if (stanfordTwitterUsernames.test(token)) {
    return "username";
  } else if (stanfordHashtags.test(token)) {
    return "hashtag";
  } else if (stanfordRemaining.test(token)) {
    if (WORD_PATTERN.test(token)) {
      return "word";
    } else {
      return "punct";
    }
  } else {
    return "<UNK>";
  }
}

export function getTag(token: string, mode: "stanford" | "dlatk"): string {
  if (mode === "dlatk") {
    return getDlatkTag(token);
  } else {
    return getStanfordTag(token);
  }
}
