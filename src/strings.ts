/** String cleaning */

import * as he from "he";
import { pipe } from "./utils";

const HEX_PATTERN = /\\x[0-9a-z]{1,4}/g;
const HTML_DIGIT_PATTERN = /&#\d+;/g;
const HTML_ALPHA_PATTERN = /&\w+;/g;
const AMP_STRING = "&amp;";
const AND_STRING = " and ";
const EMPTY_STRING = "";
const SPECIAL_CHARS = /[\u0300-\u036f]/g;

export function normalizeStr(form?: string): (str: string) => string {
  return (str: string) => str.normalize(form).replace(SPECIAL_CHARS, EMPTY_STRING);
}

export function removeHex(str: string): string {
  return str.replace(HEX_PATTERN, EMPTY_STRING);
}

export function replaceAmp(str: string): string {
  return str.replace(AMP_STRING, AND_STRING);
}

function _parseDigit(match: string): string {
  const char = parseInt(match.substring(2), 10);
  return String.fromCharCode(char);
}

export function replaceDigits(str: string): string {
  return str.replace(HTML_DIGIT_PATTERN, _parseDigit);
}

function _decode(match: string): string {
  return he.decode(match);
}

export function replaceAlpha(str: string): string {
  return str.replace(HTML_ALPHA_PATTERN, _decode);
}

export const htmlToUnicode = pipe<string>(replaceAmp, replaceDigits, replaceAlpha);
