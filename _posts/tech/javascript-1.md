---
title: 'Note - 重新認識javascript (1)'
desc: '變數 / 資料型別 / 物件 / 陣列 / 型別判斷'
type: 'tech'
coverImage: '/assets/posts/tech/javascript.png'
date: '2021-12-02T00:00:00.000Z'
labels: [
  'javascript',
  '變數',
  '資料型別',
  '物件',
  '陣列',
  '型別判斷'
]
---

### 變數

- 命名
	- 第一個字母必須為英文字母，底線`_`或錢字號`$`，後面可以是英文字母、底線`_`或是錢字號`$`以及數字
	- 變數名稱不能是保留字或關鍵字
	- JavaScript 1.3 之後開始支援 Unicode

- 宣告
	- ES6之前：透過`var`
	- ES6之後：透過`let` / `const`
	- 沒有透過`var` / `let` / `const`宣告的變數都會自動變成`全域變數`

- 變數的資料型別
	- 基本型別 (Primitives)
		- string
		- number
		- boolean
		- null
		- undefined
		- symbol (ES6)
	- 物件型別 (Object)
		- array
		- object
		- function

***

### number 數字

- 特殊的數字
  - `Infinity`：無限大，一個正數除以 0，結果會得到是 `Infinity`
  - `-Infinity` ：負無限大，負數除以 0 會得到 `-Infinity`
  - `NaN`：不是數值(Not a Number)，`0 / 0`，`Infinity / Infinity`，`-Infinity / -Infinity` 會得到 `NaN`

  ```javascript
  typeof(NaN);    // "number"

  NaN === NaN;    // false

  isNaN(NaN);     // true
  isNaN("NaN");   // true, 因為字串 "NaN" 無法轉成數字
  ```

***

### null 與 undefined

- `undefined`： 變數還沒有給值，所以不知道是什麼
- `null`： 變數現在沒有值

  ```javascript
  Number( null );  // 0
  Number( undefined );  // NaN
  ```

***

### 物件 Object

"An object is a collection of properties and has a single prototype object."

#### 存取屬性

```javascript
const bunny = {
  name: 'yuan yuan',
  age: 10,
  weight: 1.5,
  favFood: 'apple',
  sayName: () => {
    alert( this.name );
  }
}

bunny.name;  // 'yuan yuan'
bunny["age"];  // 10

bunny.sayName();  // the same as below
bunny["sayName"]();
```

#### 新增屬性

```javascript
const bunny = { };

bunny.name = 'yuan yuan';
bunny.name;  // 'yuan yuan'
```

#### 刪除屬性

```javascript
const bunny = { };

bunny.name = 'yuan yuan';
bunny.name;  // 'yuan yuan'

delete bunny.name;
bunny.name;  // undefined
```

#### 判斷屬性是否存在

```javascript
const bunny = {
  name: 'yuan yuan',
};

// in
console.log('name' in bunny);  // true
console.log('favFood' in bunny);  // false

// hasOwnProperty()
bunny.hasOwnProperty('name');  // true
bunny.hasOwnProperty('favFood');  // false
```

***

### 陣列 Array

#### 建立Array

```javascript
const a = new Array();
a[0] = "a";
a[1] = "b";
a[2] = "c";
console.log(a.length);  // 3

const b = [];  // Array literal
b[0] = "a";
b[1] = "b";
console.log(b.length);  // 3

const c = ["a", "b", "c"];
console.log(b.length);  // 3
```

#### Array的長度

```javascript
const fruits = ["apple", "banana", "pear"];
console.log(fruits);

// array.length 是可以被覆寫的
fruits.length = 1;
console.log(fruits); // ["apple"];

fruits.length = 2;
console.log(fruits); // ["apple", undefined];
```

#### 判別是否為陣列

```javascript
Array.isArray([]);            // true
Array.isArray(["bunny"]);     // true
Array.isArray(new Array());   // true

Array.isArray();              // false
Array.isArray({});            // false
Array.isArray(null);          // false
Array.isArray(undefined);     // false
```

***

### typeof

```javascript
typeof  true;         // 'boolean'
typeof  'Bunny';   // 'string'
typeof  123;          // 'number'
typeof  NaN;          // 'number'
typeof  { };          // 'object'
typeof  [ ];          // 'object'
typeof undefined;     // 'undefined'

typeof window.alert;  // 'function'
typeof null;          // 'object'
```

- typeof `"function"` 其實也是一種 `"object"`
- typeof null 因為歷史因素所以是 `"object"`

### 資料來源
- <a href='https://ithelp.ithome.com.tw/users/20065504/ironman/1259' target="_blank">重新認識 JavaScript</a>