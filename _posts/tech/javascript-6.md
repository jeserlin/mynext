---
title: 'Note - 重新認識javascript (6)'
desc: 'What is "this" in javascript?'
type: 'tech'
coverImage: '/assets/posts/tech/javascript.png'
date: '2021-12-17T00:00:00.000Z'
labels: [
  'javascript',
  'this'
]
---

#### this

- `this` 是 JavaScript 的一個 `關鍵字`
- `this` 是 function 執行時，自動生成的一個 `內部物件`
- 隨著 function 執行場合的不同，`this` 所指向的值，也會有所不同
- 在大多數的情況下， `this` 代表的就是呼叫 function 的物件 (Owner Object of the function)

```javascript
const getName = function() {
  return this.name;
}

const bunny1 = {
  name: 'yuan',
  getName: getName
}

const bunny2 = {
  name: 'bao fen',
  getName: getName
}

console.log(bunny1.getName());    // yuan
console.log(bunny2.getName());    // bao fen
```

#### this 不等於 function

```javascript
var foo = function() {
  // 此時的this是window，因此this.count++的結果為NaN
  this.count++;
};

foo.count = 0;

for( var i = 0; i < 5; i++ ) {
  foo();
}

console.log(foo.count)    // 0
```

```javascript
var bar = function() {
  // 此時的this是window
  console.log( this.a );
};

var foo = function() {
  var a = 123;
  this.bar();
};

foo();    // undefined
```

#### 巢狀迴圈中的 this

- JavaScript 中，用來切分變數的最小作用範圍 (scope) 是 `function`
- 當`沒有特定指明` this 的情況下，預設綁定 (Default Binding) this 為 `「全域物件」`，也就是 `window`

```javascript
var obj = {

  func1: function(){
    // 因為func1是被obj呼叫，因此這時候的this是obj本身
    console.log( this === obj );    // true

    var func2 = function(){
      // 此時的this會是window
      console.log( this === obj );  //  false
    };

    func2();
  }
};

obj.func1();
```

#### 強制指定 this 的方式

- 強制指定 this 的方式，分別是 `call()` 、 `apply()` 以及 `bind()`
```javascript
var bunny = {
  name: 'yuan',
  age: 10
};

var getAge = function () {
  console.log(this.age);
};

getAge();              // undefined
getAge.bind(bunny)();  // 10
```

- `.call()` 與 `.apply()` 的作用完全一樣，差別只在傳入參數的方式有所不同:
```javascript
function func( arg1, arg2, ... ){
  // do something
}

func.call( context, arg1, arg2, ... );
func.apply( context, [ arg1, arg2, ... ]);
```

- `bind()` 讓 function 在`呼叫前`先綁定某個物件，使它不管怎麼被呼叫都能`有固定的this`
- `.call()` 與 `.apply()` 是使用在 context `較常變動`的場景，依照呼叫時的需要帶入不同的物件作為該 function 的 this，在呼叫的當下就立即執行

#### this 與前後文本 (context) 綁定的基本原則

- 預設綁定 (Default Binding)
  - 當 function 是在普通、未經修飾的情況下被呼叫，此時裡面的 `this` 會自動指定至`全域物件`
  - 若是加上 `"use strict"` 宣告成`嚴格模式`後，原本預設將 `this` 綁定至全域物件的行爲，會轉變成 `undefined`
- 隱含式綁定 (Implicit Binding)
  - 即使 function 被宣告的地方是在 `global scope` 中，只要它成為某個物件的`參考屬性` (reference property)，在那個 function 被呼叫的當下，該 function 即被那個物件所包含
  ```javascript
  function func() {
    console.log( this.a );
  }

  var obj = {
    a: 2,
    foo: func
  };

  obj.foo();  // 2

  var func2 = obj.foo;
  func2();    // undefined
  ```
- 顯式綁定 (Explicit Binding)
  - 透過 `.bind()` / `.call()` / `.apply()` 這類`直接指定` this 的 function
- 「new」關鍵字綁定
  ```javascript
  function foo(a) {
    this.a = a;
  }

  var obj = new foo( 123 );
  console.log( obj.a );      // 123
  ```

### 歸納 this

- function是被 `new` 出來的 --->  this 是 `被建構出來的物件`
- function是以`.call()` / `.apply()` / `.bind()` 呼叫 ---> this 是 `被指定的物件`
- function `被呼叫時存在於物件` ---> this 是 `那個物件`
- others ---> this 是 `window`，嚴格模式下是 `undefined`

### 資料來源
- <a href='https://ithelp.ithome.com.tw/articles/10193193' target="_blank">重新認識 JavaScript: Day 20 What's "THIS" in JavaScript (鐵人精華版)</a>