# HappyNodeTokenizer

A basic, Twitter-aware tokenizer.

Based on [HappierFunTokenizing.py - Copyright 2011, Christopher Potts](http://sentiment.christopherpotts.net/code-data/happyfuntokenizing.py).

## Usage
```javascript
const hnt = require('happynodetokenizer');
const text = 'A big long string of text...';
const opts = {
  'output': 'array',
  'delim': ','
}
const tokens = hnt(text, opts);
console.log(tokens)
```

If no tokens are found, happynodetokenizer will return null.

## The Options Object
The options object is optional.

### 'output'
**String - valid options: 'array' (default), or 'string'**

The type of element to return: an array of tokens or a deliminated string.

### 'delim'
**String - ',' (default)**
The delimiter for string outputs, can be any string.

## Licence
(C) 2017 [P. Hughes](www.phugh.es)

[Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported](http://creativecommons.org/licenses/by-nc-sa/3.0/).