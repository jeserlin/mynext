---
title: 'Note - 重新認識javascript (3)'
desc: '函式 / 全域變數 / 區域變數'
type: 'tech'
coverImage: '/assets/posts/tech/javascript.png'
date: '2021-12-10T00:00:00.000Z'
labels: [
  'javascript',
  '函式',
  '全域變數',
  '區域變數'
]
---

### 函式

#### 定義函式的方式
- 函式宣告（Function Declaration）
```javascript
function functionName([arguments]) {
  // ...
}
```
- 函式運算式（Function Expressions）
```javascript
const functionName = () => {
  // ...
}
```
- `new Function` （運作效能較差，實務上也較少會這樣做。）
```javascript
const functionName = new Function('number', 'return number * number');
```

#### Scope

- 切分變數有效範圍的最小單位是 `"function"`
- 沒有用 `var` 宣告的變數會是全域變數

#### Hoisting

- 變數提升（Variables Hoisting）：javascript會把宣告的語法移到 `scope的最上層`
```javascript
var x = 1;

var doSomeThing = function(y) {
  console.log(x);   // undefined

  x = 100;
  return x + y;
};

console.log( doSomeThing(50) );   // 150
console.log( x );                 // 1
```
- 函數提升：透過 `函式宣告` 方式定義的函式可以在宣告前使用，而 `函式運算式` 定義的的函式會出現錯誤
```javascript
printBunny('yuan');    // yuan

function printBunny(bunny) {
  console.log(bunny)
}

printRabbit('yuan');    // TypeError: printRabbit is not a function

const printRabbit = function (rabbit) {
  console.log(rabbit)
};
```

### 全域變數與區域變數

- 全域變數： 全域物件/頂層物件，指的是 `window`, node環境裡面叫 `global`
- 變數有效範圍 (scope) 的最小切分單位是 function (ES6 的 let 與 const 例外)
- 即使是寫在函式內，沒有 var 的變數會變成「全域變數」
- 全域變數指的是全域物件 (頂層物件) 的「屬性」

### 資料來源
- <a href='https://ithelp.ithome.com.tw/articles/10191549' target="_blank">重新認識 JavaScript: Day 10 函式 Functions 的基本概念</a>