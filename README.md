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

## Options
### "output"
A string. The type of element to return.

Valid options: "array" (default) or "string"

### "delim"
A string. The delimiter for string outputs, can be any string.

Default: ","

## Licence
[Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported](http://creativecommons.org/licenses/by-nc-sa/3.0/).