# HappyNodeTokenizer

A basic Twitter aware tokenizer.

A Javascript port of [HappyFunTokenizer.py](https://github.com/stanfordnlp/python-stanford-corenlp/blob/master/tests/happyfuntokenizer.py) by Christopher Potts and  [HappierFunTokenizing.py](https://github.com/dlatk/happierfuntokenizing) by H. Andrew Schwartz.

## Install
```bash
  npm install --save happynodetokenizer
```

## Usage
HappyNodeTokenizer exposes an asynchronous function called `tokenize()` and a synchronous function called `tokenizeSync()`. `tokenizeSync()` can also take a callback function as its third argument. The en-GB spelling can be used as well (i.e. `tokenise()` and `tokeniseSync()`).


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
  'tag': false,
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
  'tag': false,
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
  'tag': false,
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
  'tag': false,
};
const tokens = tokenizer.tokenizeSync(text, opts);
console.log(tokens);
```

## Output Examples
### Default (opts.tag = false)
Input = "RT @ #happyfuncoding: this is a typical Twitter tweet :-)"
```javascript
['rt', '@', '#happyfuncoding', ':', 'this', 'is', 'a', 'typical', 'twitter', 'tweet', ':-)']
```

### opts.tag = true
Input = "RT @ #happyfuncoding: this is a typical Twitter tweet :-)"
```javascript
[
  { value: 'rt', tag: 'word' },
  { value: '@', tag: 'punct' },
  { value: '#happyfuncoding', tag: 'hashtag' },
  { value: ':', tag: 'punct' },
  { value: 'this', tag: 'word' },
  { value: 'is', tag: 'word' },
  { value: 'a', tag: 'word' },
  { value: 'typical', tag: 'word' },
  { value: 'twitter', tag: 'word' },
  { value: 'tweet', tag: 'word' },
  { value: ':-)', tag: 'emoticon' }
]
```
See [tags]() below for more detail.

## The Options Object
The options object and its properties are optional. The defaults are:

```javascript
{
  'logs': 2,
  'mode': 'stanford',
  'normalize': false,
  'preserveCase': false,
  'strict': false,
  'tag': false,
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

[Normalize](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) strings. E.g. when set to `true`, mañana becomes manana.

### preserveCase
**boolean - valid options: `true`, or `false` (default)**

Preserves the case of the input string. Does not affect emoticons.

### strict
**boolean - valid options: `true`, or `false` (default)**

When `strict` is set to `true`, functions `throw` errors over very minor things. Good for debugging.
* `false` = functions fail gracefully
* `true`  = functions `throw` lots of errors

### tag
**boolean - valid options: `true`, or `false` (default)**

Return an array of tagged token objects instead of just an array of tokens
 * `true` = return an array of token objects: [ {value: 'token', tag: 'word' }, ... ]
 * `false` = return an array of tokens: [ 'token', 'another', 'word', ... ]

## Tags
When `opts.tag === true`, HappyNodeTokenizer will output an array of token objects. Each token object has two properties: `value` and `tag`. The `value` is the token itself, the `tag` is a descriptor based on one of the following depending on which `opt.mode` you are using:

| Tag            | Stanford           | DLATK              | Example  |
| -------------  |-------------       | -----              | -------- |
| phone          | :heavy_check_mark: | :heavy_check_mark: | +1 (800) 123-4567
| url            | :x:                | :heavy_check_mark: | http://www.youtube.com
| url_scheme     | :x:                | :heavy_check_mark: | http://
| url_authority  | :x:                | :heavy_check_mark: | [0-3]
| url_path_query | :x:                | :heavy_check_mark: | /index.html?s=search
| htmltag        | :x:                | :heavy_check_mark: | \<em class='grumpy'>
| emoticon       | :heavy_check_mark: | :heavy_check_mark: | >:(
| username       | :heavy_check_mark: | :heavy_check_mark: | @phughesmcr
| hashtag        | :heavy_check_mark: | :heavy_check_mark: | #tokenizing
| punct          | :heavy_check_mark: | :heavy_check_mark: | ,
| word           | :heavy_check_mark: | :heavy_check_mark: | hello
| \<UNK>         | :heavy_check_mark: | :heavy_check_mark: | (anthing left unmatched)

## Testing
To compare the results of HappyNodeTokenizer against HappyFunTokenizer and HappierFunTokenizing, run:
```bash
npm run test
```
The goal of this project is to provide a Node.js port of HappyFunTokenizer and HappierFunTokenizing. Therefore, any pull requests with test failures will not be accepted.

## License
(C) 2017-20 [P. Hughes](https://www.phugh.es). All rights reserved.

Shared under the [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported](http://creativecommons.org/licenses/by-nc-sa/3.0/) license.