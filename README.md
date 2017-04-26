# HappyNodeTokenizer

A basic, Twitter-aware tokenizer.

Based on HappierFunTokenizing.py - Copyright 2011, Christopher Potts
by: Christopher Potts, updated: H. Andrew Schwartz

## Usage
```Javascript
const hnt = require('happynodetokenizer')
let text = "A long string of text...."
let options = {
  "output": "array",
  "delim": ","
}
let tokens = htn(text, options)
```

### Options
```Markdown
output: "array" or "string" - type of element to return
delim: " " - delimiter for string outputs, can be any string
```

## Licence
[Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported](http://creativecommons.org/licenses/by-nc-sa/3.0/)