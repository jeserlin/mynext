---
title: 'Note - 重新認識javascript (7)'
desc: '物件屬性 / Object.defineProperty / Object.getOwnPropertyDescriptor'
type: 'tech'
coverImage: '/assets/posts/tech/javascript.png'
date: '2021-12-20T00:00:00.000Z'
labels: [
  'javascript',
  '物件屬性'
]
---

### 屬性描述器 (Property descriptor)

屬性描述器一共可以分為六種：
- `value`: 屬性的值
- `writable`: 定義屬性是否可以改變，如果是 `false` 那就是唯讀屬性
- `enumerable`: 定義物件內的屬性是否可以透過 `for-in` 語法來迭代
- `configurable`: 定義屬性是否可以被刪除、或修改屬性內的 `writable`、`enumerable` 及 `configurable` 設定
- `get`: 物件屬性的 getter function
- `set`: 物件屬性的 setter function

### Object.defineProperty 與 Object.getOwnPropertyDescriptor

```javascript
var rabbit = { name: 'yuan' };
console.log(Object.getOwnPropertyDescriptor(bunny, 'name'))
// {"value": "yuan",
// "writable": true,
// "enumerable": true,
// "configurable": true }

var bunny = {};
Object.defineProperty(bunny, 'name', {
  value: 'yuan'
});

console.log(Object.getOwnPropertyDescriptor(bunny, 'name'))
// {"value": "yuan",
// "writable": false,
// "enumerable": false,
// "configurable": false }
```

`defineProperty` 可以針對物件一次設定多個屬性描述：
```javascript
var bunny = {};

Object.defineProperty(bunny, 'name', {
  value: 'yuan',
  writable: false,
  enumerable: false,
  configurable: false
});

console.log(delete bunny.name)  // false
```

### 屬性的 get 與 set 方法

 ```javascript
var bunny = {};

Object.defineProperty(person, 'name', {
  get: function(){
    console.log('get');
    return this._name_;
  },
  set: function(name){
    console.log('set');
    this._name_ = name;
  }
});

bunny.name = 'yuan';     // 'set'
console.log(bunny.name); // 'get' 'yuan'
```

### 資料來源
- <a href='https://ithelp.ithome.com.tw/articles/10193747' target="_blank">重新認識 JavaScript: Day 22 深入理解 JavaScript 物件屬性</a>