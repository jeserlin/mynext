---
title: 'Note - 重新認識javascript (2)'
desc: '算術運算子 / 一元運算子 / 比較運算子'
type: 'tech'
coverImage: '/assets/posts/tech/javascript.png'
date: '2021-12-08T00:00:00.000Z'
labels: [
  'javascript',
  '算術運算子',
  '一元運算子',
  '比較運算子',
]
---

### 算術運算子

#### 加號 (+)

- `Infinity`
```javascript
Infinity + Infinity      // Infinity
-Infinity + -Infinity    // -Infinity
-Infinity + Infinity     // NaN
```
- `NaN`：則是只要有其中一個是 `NaN`，那麼結果就必定是 `NaN`
```javascript
10 + NaN            // NaN
Infinity + NaN      // NaN
-Infinity + NaN     // NaN
```
- 當加號 + 兩側的其中一方是字串的情況下，另一端會被自動轉型（`toString()` / `String()`）

#### 減號 (-)

- `Infinity`
```javascript
Infinity - Infinity      // NaN
-Infinity - -Infinity    // NaN

-Infinity - Infinity     // -Infinity
Infinity - -Infinity     // Infinity
```
- `NaN`：只要有其中一個是 `NaN`，那麼結果就必定是 `NaN`
- 相減時，如果其中一方不是數字會主動轉型
  - `Number()`：string 、 boolean 、 undefined 與 null
  - `valueOf()`：物件型別，如果沒有 `valueOf()` 回先 `toString()` 再用 `Number()` 來取得value
```javascript
100 - "50"        // 50
100 - "bunny"     // NaN

// convert with Number()
100 - true        // 99
100 - false       // 100

100 - undefined   // NaN
100 - null        // 100
```

#### 乘號 (*)

- 如果計算結果超出 JavaScript 的數字範圍，那麼就會看結果是正數或負數來決定是 `Infinity` 或是 `-Infinity`
- 要有其中一個是 `NaN`，那麼結果就必定是 `NaN`
- 相乘時，如果其中一方不是數字會主動用 `Number()` 轉型

#### 除號 (/)

- 正數 / 0：`Infinity`
- 負數 / 0：`-Infinity`
- 0 / 0：`NaN`
- 要有其中一個是 `NaN`，那麼結果就必定是 `NaN`
- 相除時，如果其中一方不是數字會主動用 `Number()` 轉型

#### 取餘數 (%)

- 被除數是 `Infinity` 或 `-Infinity` 的情況下，則取餘數後結果都會是 `NaN`
```javascript
Infinity % 0              // NaN
Infinity % 100            // NaN
Infinity % Infinity       // NaN
Infinity % -Infinity      // NaN
```
- 除數為 `Infinity`，取餘數結果為被除數
```javascript
100 % Infinity       // 100
0 % Infinity         // 0
```
- 要有其中一個是 `NaN`，那麼結果就必定是 `NaN`
- 如果其中一方不是數字會主動用 `Number()` 轉型

### 一元運算子

#### 正號 `+` 與負號 `-`

- 如果正號 `+` 與負號 `-` 後面帶的不是數字型態的值，會先用 `Number()` 轉型
```javascript
let a = "+1";
let b = "-1";
let c = "Bunny";

console.log( +a );      // 1
console.log( -a );      // -1
console.log( +b );      // -1
console.log( -b );      // 1
console.log( +c );      // NaN
console.log( -c );      // NaN
```
- 物件型別會先用 `valueOf()` 取得對應的數值
```javascript
+true       // 1
+false      // 0
+null       // 0
+function(value){ return value; }    //NaN
```

***因此可以用 `+` 來做數字轉型**
```javascript
let a = '1';

console.log(Number(a))  //1
console.log(+a)         //1
```

#### 遞增 `++` 與遞減 `--`

```javascript
let a = 10;

a++;
console.log(a);    // 11 : a = a + 1

a--;
console.log(a);    // 10: a = a - 1
```

- 運算子的位置在`前面`時，回傳原本的數值；位置在`後面`時，回傳運算後的結果
```javascript
let a = 10;

console.log(a++);    // 10
console.log(++a);    // 12
```

### 比較運算子

比較兩側數值（純值，物件，運算式，函式回傳的結果），return `true` 或 `false`。

#### `==` & `===`

- `==`： 相等，會替數值做自動轉型
- `===`： 全等，不會替數值做自動轉型

#### 自動轉型的規則

`==` 兩側資料型態不同時，會進行自動轉型：

- `Boolean` 會轉成數字，`true` --> `1`，`false` --> `0`
- `數字` 與 `字串` 做比較時，會將字串用 `Number()` 轉型，再進行比較
- 其中一方是`物件`，而另一方是基本型別時，`物件`  會用 `valueOf()` 取得對應的基本型別，再進行比較
- `NaN` 無論用 `==` 或 `===` 都不等於 `NaN`
- 兩個物件做比較時，是在比較兩者是否 `指向同一個物件`

#### `>` & `<`

- `>` / `<` / `>=` / `<=`
- 遇到不同型別也會 `自動轉型`
- 其中一個是數字而另一個不是，會嘗試將另一個 `轉成數字` 再比較
- 兩個都是字串會會照 `字母順序` 比較
- `物件` 會先用 `valueOf()` 取得對應的數值，如果沒有則會透過 `toString()` 轉型再比較
### 資料來源
- <a href='https://ithelp.ithome.com.tw/articles/10191180' target="_blank">重新認識 JavaScript: Day 06 運算式與運算子</a>
- <a href='https://ithelp.ithome.com.tw/articles/10191254' target="_blank">重新認識 JavaScript: Day 07 「比較」與自動轉型的規則</a>