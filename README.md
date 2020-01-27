# kyujitai.js

[![Build Status](https://travis-ci.org/hakatashi/kyujitai.js.svg)](https://travis-ci.org/hakatashi/kyujitai.js)
[![Greenkeeper badge](https://badges.greenkeeper.io/hakatashi/kyujitai.js.svg)](https://greenkeeper.io/)

Utility collections for making Japanese text old-fashioned.

## install

    npm install kyujitai

## Use

```javascript
const Kyujitai = require('kyujitai');
const kyujitai = new Kyujitai((error) => {
    kyujitai.encode('旧字体'); //=> '舊字體'
});
```

## Usage

### new Kyujitai([options], [callback])

Constructor.

* `options`: [Object]
* `callback`: [Function(error)] Called when construction completed.
  - `error`: [Error] Supplied if construction failed.

### kyujitai.encode(string, [options])

Encode string from shinjitai to kyujitai.

* `string`: [String] Input string
* `options`: [Object]
  - `options.IVD`: [Boolean] `true` if you want to allow IVS for the encoded string. Default is false.
* Returns: [String] Output string

```javascript
kyujitai.encode('旧字体'); //=> '舊字體'

kyujitai.encode('画期的図画'); //=> '劃期的圖畫'

kyujitai.encode('弁明'); //=> '辯明'
kyujitai.encode('弁償'); //=> '辨償'
kyujitai.encode('花弁'); //=> '花瓣'
kyujitai.encode('弁髪'); //=> '辮髮'
```

### kyujitai.decode(string, [options])

Decode string from kyujitai to shinjitai.

* `string`: [String] Input string
* `options`: [Object]
* Returns: [String] Output string
