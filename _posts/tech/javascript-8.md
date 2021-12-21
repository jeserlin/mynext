---
title: 'Note - 重新認識javascript (8)'
desc: '物件與原型鏈'
type: 'tech'
coverImage: '/assets/posts/tech/javascript.png'
date: '2021-12-21T00:00:00.000Z'
labels: [
  'javascript',
  '原型鏈'
]
---

### 原型鏈 Prototype Chain

- 透過「原型」繼承可以讓本來沒有某個屬性的物件去存取其他物件的屬性
- 同一個物件無法指定兩種原型物件
  ```javascript
  var yuan = { eat: true };
  var baoFen = { hug: true };
  var baoNii = { sleep: true };

  console.log('eat' in yuan);  // true
  console.log('hug' in yuan);  // false

  Object.setPrototypeOf(yuan, baoFen);
  Object.setPrototypeOf(baoFen, baoNii);

  console.log('hug' in yuan);    // true
  console.log('sleep' in yuan);  // true
  ```

### 最頂層的原型物件: Object.prototype

- 當我們嘗試在某個物件存取一個不存在該物件的屬性時，它會繼續往它的 `「原型物件」[[prototype]] ` 去尋找
- `Object.prototype` 是 JavaScript 所有物件的起源
  - `Object.prototype.hasOwnProperty()`
  - `Object.prototype.toString()`
  - `Object.prototype.valueOf()`

### 建構式與原型

- 當物件實體與它的原型 `同時擁有同樣的屬性或方法` 時，會 `優先存取自己的屬性或方法`，如果沒有才會再順著原型鏈向上尋找
  ```javascript
  var Bunny = function() {
    this.sayHello = function() {
      return "Hello!";
    };
  };

  Bunny.prototype.sayHello = function() {
    return "Hi ~!";
  }

  var bunny = new Bunny();
  console.log(bunny.sayHello());  // Hello!
  ```
- 透過 `hasOwnProperty()` 可以判斷某個屬性是透過「原型」繼承來的，或是物件本身所有的
  ```javascript
  var yuan = { eat: true };
  var baoFen = { hug: true };

  Object.setPrototypeOf(yuan, baoFen);

  console.log(yuan.hasOwnProperty('eat'));  // true
  console.log(yuan.hasOwnProperty('hug'));  // false
  ```

### 資料來源
- <a href='https://ithelp.ithome.com.tw/articles/10194154' target="_blank">重新認識 JavaScript: Day 24 物件與原型鏈</a>