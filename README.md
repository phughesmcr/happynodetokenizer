# HappyNodeTokenizer

A basic Twitter aware tokenizer.

Based on [HappierFunTokenizing.py - Copyright 2011, Christopher Potts](http://sentiment.christopherpotts.net/code-data/happyfuntokenizing.py).

## Usage
```javascript
const tokenizer = require('happynodetokenizer');
const text = 'A big long string of text...';
const opts = {
  'output': 'array',
  'delim': ',',
  'escape': 2,
  'logs': 3
}
const tokens = tokenizer(text, opts);
console.log(tokens)
```

If no tokens are found, happynodetokenizer will return either an empty array or an empty string, depending on opts.output.

## The Options Object
The options object is optional, the defaults are:

```javascript
  'output': 'array',
  'delim': ','
  'escape': true,
  'logs': 3
```

### 'output'
**String - valid options: 'array' (default), or 'string'**

The type of element to return: an array of tokens or a deliminated string.

### 'delim'
**String - ',' (default)**
The delimiter for string outputs, can be any string.

### 'escape'
**Number - valid options: 0, 1, 2 (default)**
When outputting to a string, escape will add double-quotes to commas quote marks and your chosen delimiter, e.g:

*'"hello, you" he said'*, becomes:

*",hello,,,you,",he,said'*, when escape = false

or

*'""",hello,",",you,""",he,said'*, when true

This helps programs like Excel read your output properly when handling CSVs.

* 0 = don't escape anything
* 1 = escape the delimiter only
* 2 = escape the delimiter, quotes and commas

### 'logs'
**Number - valid options: 0, 1, 2, 3 (default)**
Used to control console.log, console.warn, and console.error outputs.
* 0 = suppress all logs
* 1 = print errors only
* 2 = print errors and warnings
* 3 = print all console logs

## License
(C) 2017-18 [P. Hughes](https://www.phugh.es). All rights reserved.

Shared under the [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported](http://creativecommons.org/licenses/by-nc-sa/3.0/) license.