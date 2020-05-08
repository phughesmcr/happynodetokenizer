# HappyNodeTokenizer

A basic Twitter aware tokenizer.

A Javascript port of  [HappierFunTokenizing.py](https://github.com/dlatk/happierfuntokenizing) by Christopher Potts and H. Andrew Schwartz.

## Install
```bash
  npm install --save happynodetokenizer
```

## Usage
HappyNodeTokenizer exports an asynchronous function called `tokenize` and a synchronous function called `tokenizeSync`. `tokenizeSync` can also take a callback function as its third argument.


### Async/Await
```javascript
const tokenizer = require('happynodetokenizer');
const text = 'A big long string of text...';
const opts = {
  'logs': 2,
  'mode': 'stanford',
  'normalize': false,
  'preserveCase': false,
  'strict': false,
};
const getTokens = async (text) => {
  const tokens = await tokenizer.tokenize(text, opts);
  console.log(tokens);
};
```

If no tokens are found and `opts.strict = false`, happynodetokenizer will return an empty array.

### Async .then().catch()
```javascript
const tokenizer = require('happynodetokenizer');
const text = 'A big long string of text...';
const opts = {
  'logs': 2,
  'mode': 'stanford',
  'normalize': false,
  'preserveCase': false,
  'strict': false,
};
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
  'logs': 2,
  'mode': 'stanford',
  'normalize': false,
  'preserveCase': false,
  'strict': false,
};
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
  'logs': 2,
  'mode': 'stanford',
  'normalize': false,
  'preserveCase': false,
  'strict': false,
};
const tokens = tokenizer.tokenizeSync(text, opts);
console.log(tokens);
```

## The Options Object
The options object is optional, the defaults are:

```javascript
{
  'logs': 2,
  'mode': 'stanford',
  'normalize': false,
  'preserveCase': false,
  'strict': false,
};
```

### logs
**Number - valid options: 0, 1, 2 (default), 3**

Used to control console.log, console.warn, and console.error outputs.
* 0 = suppress all logs
* 1 = print errors only
* 2 = print errors and warnings
* 3 = print all console logs

### mode
**string - valid options: `stanford` (default), or `dlatk`**

`stanford` mode uses the original HappyFunTokenizer pattern. See [Github](https://github.com/stanfordnlp/python-stanford-corenlp).

`dlatk` mode uses the modified HappierFunTokenizing pattern. See [Github](https://github.com/dlatk/happierfuntokenizing/).

### normalize
**boolean - valid options: `true`, or `false` (default)**

[Normalise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) strings. E.g. when set to `true`, mañana becomes manana.

### preserveCase
**boolean - valid options: `true`, or `false` (default)**

Preserves the case of the input string. Does not affect emoticons.

### strict
**boolean - valid options: `true`, or `false` (default)**

When `strict` is set to `true`, functions `throw` errors over very minor things. Good for debugging.
* `false` = functions fail gracefully
* `true`  = functions `throw` lots of errors

## Testing
To compare the results of HappyNodeTokenizer against HappyFunTokenizer and HappierFunTokenizing, run:
```bash
npm run test
```
The goal of this project is to provide a Node.js port of HappyFunTokenizer and HappierFunTokenizing. Therefore, any pull requests which test failures will not be accepted.

## License
(C) 2017-20 [P. Hughes](https://www.phugh.es). All rights reserved.

Shared under the [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported](http://creativecommons.org/licenses/by-nc-sa/3.0/) license.