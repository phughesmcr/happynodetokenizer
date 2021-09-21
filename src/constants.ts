"use strict";

export const enum Mode {
  stanford = "stanford",
  dlatk = "dlatk",
}

export const MODE_PATTERN = /dlatk|stanford/;

export const enum NormalizationForm {
  NFC = "NFC",
  NFD = "NFD",
  NFKC = "NFKC",
  NFKD = "NFKD",
}

export const NORM_PATTERN = /NFK?(C|D)/;
