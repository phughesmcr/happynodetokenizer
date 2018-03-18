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

If no tokens are found, happynodetokenizer will return either an empty array or an empty string, depending on opts.output.

## The Options Object
The options object is optional, the defaults are:

```javascript
  'output': 'array',
  'delim': ','
```

### 'output'
**String - valid options: 'array' (default), or 'string'**

The type of element to return: an array of tokens or a deliminated string.

### 'delim'
**String - ',' (default)**
The delimiter for string outputs, can be any string.

## License
(C) 2017-18 [P. Hughes](www.phugh.es). All rights reserved.

Shared under the [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported](http://creativecommons.org/licenses/by-nc-sa/3.0/) license.