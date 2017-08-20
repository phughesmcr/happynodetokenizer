# HappyNodeTokenizer

A basic, Twitter-aware tokenizer.

Based on HappierFunTokenizing.py - Copyright 2011, Christopher Potts
by: Christopher Potts, updated: H. Andrew Schwartz

## Usage
```javascript
const hnt = require("happynodetokenizer");
const text = "A big long string of text...";
const opts = {"output": "array", "delim": ","}
const tokens = hnt(text, opts);
console.log(tokens)
```

The opts object is optional.

If no tokens are found, happynodetokenizer will return null.

## Options
### "output"
The type of element to return.

Valid options: "array" (default) or "string"

### "delim"
The delimiter for string outputs, can be any string.

Default: ","

## Licence
(C) 2017 [P. Hughes](www.phugh.es)

[Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported](http://creativecommons.org/licenses/by-nc-sa/3.0/).