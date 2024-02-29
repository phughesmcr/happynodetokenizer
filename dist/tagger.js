import { DLATK, STANFORD, UTIL_PATTERNS } from "./constants.js";
import { memoize } from "./utils.js";
export function getDlatkTag(token) {
    switch (true) {
        case DLATK.phoneNumbers.test(token):
            return "phone";
        case DLATK.webAddressFull.test(token):
            return "url";
        case DLATK.webStart.test(token):
            return "url_scheme";
        case DLATK.command.test(token):
            return "url_authority";
        case DLATK.httpGet.test(token):
            return "url_path_query";
        case DLATK.htmlTags.test(token) &&
            (!DLATK.emoticons.test(token) || (DLATK.emoticons.test(token) && UTIL_PATTERNS.HTMLTAG.test(token))):
            return "htmltag";
        case DLATK.emoticons.test(token):
            return "emoticon";
        case DLATK.twitterUsernames.test(token):
            return "username";
        case DLATK.hashtags.test(token):
            return "hashtag";
        case DLATK.remaining.test(token):
            if (UTIL_PATTERNS.WORD.test(token)) {
                return "word";
            }
            else {
                return "punct";
            }
        default:
            return "<UNK>";
    }
}
export function getStanfordTag(token) {
    switch (true) {
        case STANFORD.phoneNumbers.test(token):
            return "phone";
        case STANFORD.htmlTags.test(token) &&
            (!STANFORD.emoticons.test(token) || (STANFORD.emoticons.test(token) && UTIL_PATTERNS.HTMLTAG.test(token))):
            return "htmltag";
        case STANFORD.emoticons.test(token):
            return "emoticon";
        case STANFORD.twitterUsernames.test(token):
            return "username";
        case STANFORD.hashtags.test(token):
            return "hashtag";
        case STANFORD.remaining.test(token):
            if (UTIL_PATTERNS.WORD.test(token)) {
                return "word";
            }
            else {
                return "punct";
            }
        default:
            return "<UNK>";
    }
}
export function createTagger(mode) {
    return mode === "dlatk"
        ? memoize(getDlatkTag)
        : memoize(getStanfordTag);
}
//# sourceMappingURL=tagger.js.map