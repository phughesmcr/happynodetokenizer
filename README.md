# HappyNodeTokenizer

A basic Twitter aware tokenizer.

Based on [HappierFunTokenizing.py](https://github.com/dlatk/happierfuntokenizing) by Christopher Potts and H. Andrew Schwartz.

## Usage
HappyNodeTokenizer exports an asynchronous function called `tokenize` and a synchronous function called `tokenizeSync`. `tokenizeSync` can also take a callback function as its third argument.


### Async/Await
```javascript
const tokenizer = require('happynodetokenizer');
const text = 'A big long string of text...';
const opts = {
  'delim': ',',
  'escape': 0,
  'logs': 2,
  'normalize': true,
  'output': 'array',
  'strict': false,
}
async function getTokens(text) {
  const tokens = await tokenizer.tokenize(text, opts);
  console.log(tokens);
}
```

If no tokens are found and `opts.strict` = `false`, happynodetokenizer will return either an empty array or an empty string, depending on `opts.output`.

### Async .then().catch()
```javascript
const tokenizer = require('happynodetokenizer');
const text = 'A big long string of text...';
const opts = {
  'delim': ',',
  'escape': 0,
  'logs': 2,
  'normalize': true,
  'output': 'array',
  'strict': false,
}
tokenizer.tokenize(text, opts)
  .then((tokens) => {
    console.log(tokens);
  })
  .catch((err) => {
    throw new Error(err);
  });
```

### Callback
```javascript
const tokenizer = require('happynodetokenizer');
const text = 'A big long string of text...';
const opts = {
  'delim': ',',
  'escape': 0,
  'logs': 2,
  'normalize': true,
  'output': 'array',
  'strict': false,
}
tokenizer.tokenizeSync(text, opts, (err, tokens) => {
  if (err) throw new Error(err);
  console.log(tokens);
});
```

### Sync
```javascript
const tokenizer = require('happynodetokenizer');
const text = 'A big long string of text...';
const opts = {
  'delim': ',',
  'escape': 0,
  'logs': 2,
  'normalize': true,
  'output': 'array',
  'strict': false,
}
const tokens = tokenizer.tokenizeSync(text, opts);
console.log(tokens);
```

## The Options Object
The options object is optional, the defaults are:

```javascript
  'delim': ',',
  'escape': 0,
  'logs': 2,
  'normalize': true,
  'output': 'array',
  'strict': false,
```

### delim
**String - ',' (default)**

The delimiter for string outputs, can be any string.

### escape
**Number - valid options: 0 (default), 1, 2**

When outputting to a string, escape will add double-quotes to commas quote marks and your chosen delimiter, e.g:

*'"hello, you" he said'*, becomes:

*",hello,,,you,",he,said'*, when escape = false

or

*'""",hello,",",you,""",he,said'*, when true

This helps programs like Excel read your output properly when handling CSVs.

* 0 = don't escape anything
* 1 = escape the delimiter only
* 2 = escape the delimiter, quotes and commas

### logs
**Number - valid options: 0, 1, 2 (default), 3**

Used to control console.log, console.warn, and console.error outputs.
* 0 = suppress all logs
* 1 = print errors only
* 2 = print errors and warnings
* 3 = print all console logs

### normalize
**boolean - valid options: `true` (default), or `false`**

[Normalise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) strings. E.g. when set to `true`, 'mañana' become 'manana'.

### output
**String - valid options: 'array' (default), or 'string'**

The type of element to return: an array of tokens or a deliminated string.

### strict
**boolean - valid options: `true`, or `false` (default)**

When `strict` is set to `true` functions `throw` errors.
* `false` = functions fail gracefully
* `true`  = functions `throw` on error

## License
(C) 2017-19 [P. Hughes](https://www.phugh.es). All rights reserved.

Shared under the [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported](http://creativecommons.org/licenses/by-nc-sa/3.0/) license.