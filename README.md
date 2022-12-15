# 😄 HappyNodeTokenizer

A basic Twitter aware tokenizer for Javascript environments.

A Typescript port of [HappyFunTokenizer.py](https://github.com/stanfordnlp/python-stanford-corenlp/blob/master/tests/happyfuntokenizer.py) by Christopher Potts and  [HappierFunTokenizing.py](https://github.com/dlatk/happierfuntokenizing) by H. Andrew Schwartz.

## Features
* Accurate port of both libraries (run `npm run test`)
* Typescript definitions
* Uses generators / memoize for efficiency
* Customizable and easy to use
* Compiled with Babel for extensive browser/environment support

## Install
```bash
  npm install --save happynodetokenizer
```

`UMD`, `IIFE`, `CJS` and `ESM` builds are available in the `./dist` directory.

## Usage
HappyNodeTokenizer exposes a function called `tokenizer()` which takes an optional configuration object *(See "The Options Object" below)*.


### Example
```javascript
import { tokenizer } from 'happynodetokenizer';
// or: const tokenizer = require('happynodetokenizer');

const text = 'RT @ #happyfuncoding: this is a typical Twitter tweet :-)';

// these are the default options
const opts = {
  'mode': 'stanford',
  'normalize': undefined,
  'preserveCase': true,
};

// create a tokenizer instance with our options
const myTokenizer = tokenizer(opts);

// calling myTokenizer returns a generator function
const tokenGenerator = myTokenizer(text);

// you can turn the generator into an array of token objects like this:
const tokens = [...tokenGenerator()];

// you can also convert token objects to array of strings like this:
const values = Array.from(tokens, (token) => token.value);
```
#### Output

The `tokens` variable in the above example will look like this:

```javascript
[
  { end: 1, start: 0, tag: 'word', value: 'rt' },
  { end: 3, start: 3, tag: 'punct', value: '@' },
  { end: 19, start: 5, tag: 'hashtag', value: '#happyfuncoding' },
  { end: 20, start: 20, tag: 'punct', value: ':' },
  { end: 25, start: 22, tag: 'word', value: 'this' },
  { end: 28, start: 27, tag: 'word', value: 'is' },
  { end: 30, start: 30, tag: 'word', value: 'a' },
  { end: 38, start: 32, tag: 'word', value: 'typical' },
  { end: 46, start: 40, tag: 'word', value: 'twitter' },
  { end: 52, start: 48, tag: 'word', value: 'tweet' },
  { end: 56, start: 54, tag: 'emoticon', value: ':-)' }
]
```

Where `preserveCase` in the Options Object is `false`, each result object may also contain a `variation` property which presents the token as originally matched if it differs from the `value` property. E.g.:

```javascript
[
  { end: 1, start: 0, tag: 'word', value: 'rt', variation: 'RT' },
  { end: 3, start: 3, tag: 'punct', value: '@' },
  { end: 19, start: 5, tag: 'hashtag', value: '#happyfuncoding' },
  ...
  { end: 46, start: 40, tag: 'word', value: 'twitter', variation: 'Twitter' },
  ...
]
```

## The Options Object
The options object and its properties are optional. The defaults are:

```javascript
{
  'mode': 'stanford',
  'normalize': undefined,
  'preserveCase': true,
};
```

### mode
**string - valid options: `stanford` (default), or `dlatk`**

`stanford` mode uses the original HappyFunTokenizer pattern. See [Github](https://github.com/stanfordnlp/python-stanford-corenlp).

`dlatk` mode uses the modified HappierFunTokenizing pattern. See [Github](https://github.com/dlatk/happierfuntokenizing/).

### normalize
**string - valid options: "NFC" | "NFD" | "NFKC" | "NFKD" (default = undefined)**

[Normalize](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) strings (e.g., when set, mañana becomes manana).

Normalization is disabled with set to null or undefined (default).

### preserveCase
**boolean - valid options: `true`, or `false` (default)**

Preserves the case of the input string if true, otherwise all tokens are converted to lowercase. Does not affect emoticons.

## Tags
HappyNodeTokenizer outputs an array of token objects. Each token object has three properties: `idx`, `value` and `tag`. The `value` is the token itself, the `idx` is the token's original index in the output, the `tag` is a descriptor based on one of the following depending on which `opt.mode` you are using:

| Tag            | Stanford           | DLATK              | Example  |
| -------------  |-------------       | -----              | -------- |
| phone          | :heavy_check_mark: | :heavy_check_mark: | +1 (800) 123-4567
| url            | :x:                | :heavy_check_mark: | http://www.youtube.com
| url_scheme     | :x:                | :heavy_check_mark: | http://
| url_authority  | :x:                | :heavy_check_mark: | [0-3]
| url_path_query | :x:                | :heavy_check_mark: | /index.html?s=search
| htmltag        | :x:                | :heavy_check_mark: | \<em class='grumpy'>
| emoticon       | :heavy_check_mark: | :heavy_check_mark: | >:(
| username       | :heavy_check_mark: | :heavy_check_mark: | @somefaketwitterhandle
| hashtag        | :heavy_check_mark: | :heavy_check_mark: | #tokenizing
| punct          | :heavy_check_mark: | :heavy_check_mark: | ,
| word           | :heavy_check_mark: | :heavy_check_mark: | hello
| \<UNK>         | :heavy_check_mark: | :heavy_check_mark: | (anything left unmatched)

## Testing
To compare the results of HappyNodeTokenizer against HappyFunTokenizer and HappierFunTokenizing, run:
```bash
npm run test
```
The goal of this project is to provide an accurate port of HappyFunTokenizer and HappierFunTokenizing. Therefore, any pull requests with test failures will not be accepted.

## Acknowledgements
Based on [HappyFunTokenizer.py](https://github.com/stanfordnlp/python-stanford-corenlp/blob/master/tests/happyfuntokenizer.py) by Christopher Potts and  [HappierFunTokenizing.py](https://github.com/dlatk/happierfuntokenizing) by H. Andrew Schwartz.

Uses the ["he" library](https://github.com/mathiasbynens/he) by Mathias Bynens under the MIT license.

## License
(C) 2017-22 [P. Hughes](https://www.phugh.es). All rights reserved.

Shared under the [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported](http://creativecommons.org/licenses/by-nc-sa/3.0/) license.
