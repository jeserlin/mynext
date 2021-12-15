---
title: 'Note - 重新認識javascript (5)'
desc: '函式 / Callback Function / 立即被呼叫的特殊函式'
type: 'tech'
coverImage: '/assets/posts/tech/javascript.png'
date: '2021-12-15T00:00:00.000Z'
labels: [
  'javascript',
  '函式',
  'Callback Function',
  '立即被呼叫的特殊函式'
]
---

### 函式

#### `arguments` 物件

- 函式被呼叫時會產生 `arguments` 物件，這個物件的內容就是呼叫函式時所代如的 `參數`
- `arguments` 物件是個帶有 `索引` 特性的物件（不是陣列類型）
- ES6 的`箭頭函式` (Arrow Function) `沒有提供 arguments 物件`
  ```javascript
  const sum = function (numA, numB) {
    console.log( arguments ); // Object { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5 }

    return numA + numB;
  };

  sum(1, 2, 3, 4, 5);
  ```

#### 參數的預設檢查

- 防止接不到值的參數們變成 `undefined`，可以先做檢查
  ```javascript
  const sum = function (numA, numB) {
    numA = (typeof numA !== 'undefined') ? numA : 0;
    numB = (typeof numB !== 'undefined') ? numB : 0;

    return numA + numB;
  };
  ```
- ES6可以替參數指定 `預設值`
  ```javascript
  const sum = function (numA = 0, numB = 0) {
    return numA + numB;
  };
  ```

#### Callback Function

- 把函式當作另一個函式的參數，透過另一個函式來呼叫它
- 使用情境：控制多個函式間執行的順序

#### 立即被呼叫的函式 (Immediately Invoked Function Expression, IIFE)

- JavaScript 變數有效範圍的最小單位是以 function 做分界的，並且是一種 `非同步` 的語言
  ```javascript
  for( var i = 0; i < 5; i++ ) {
    window.setTimeout(function() {
      console.log(i);
    }, 1000);
  }

  // 5
  // 5
  // 5
  // 5
  // 5
  ```
- 立即被呼叫的特殊函式
  ```javascript
  //(function(){
    // 做某事...
  // })();

  for( var i = 0; i < 5; i++ ) {
    (function(x){ 
      window.setTimeout(function() {
        console.log(x);
      }, 1000 * x);
    })(i);
  }
  ```
- 減少「全域變數」的產生，同時也避免了變數名稱衝突的機會
- ES6 新增了 `let` 跟 `const`，並且改以 `{}` 做為 `Scope`，所以在 `for迴圈` 中可以保留 `i的值`：
  ```javascript
  for( let i = 0; i < 5; i++ ) {
    window.setTimeout(function() {
      console.log(i);
    }, 1000 * i);
  }

  // 0
  // 1
  // 2
  // 3
  // 4
  ```

### 資料來源
- <a href='https://ithelp.ithome.com.tw/articles/10192368' target="_blank">重新認識 JavaScript: Day 17 函式裡的「參數」</a>
- <a href='https://ithelp.ithome.com.tw/articles/10192739' target="_blank">重新認識 JavaScript: Day 18 Callback Function 與 IIFE</a>