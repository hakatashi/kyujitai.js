node-kyujitai
=============

Utility collections for making Japanese text old-fashioned.

```
var kyujitai = require('kyujitai');
```

## install

    npm install kyujitai

## Usage

### kyujitai.encode(string, [options])

Convert string from shinjitai to kyujitai.

```
kyujitai.encode('旧字体'); // -> '舊字體'

kyujitai.encode('画期的図画'); // -> '劃期的圖畫'

kyujitai.encode('弁明'); // -> '辯明'
kyujitai.encode('弁償'); // -> '辨償'
kyujitai.encode('花弁'); // -> '花瓣'
kyujitai.encode('弁髪'); // -> '辮髮'
```

#### options

Currently no options available.
