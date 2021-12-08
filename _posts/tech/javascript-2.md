---
title: 'Note - 重新認識javascript (2)'
desc: '算術運算子'
type: 'tech'
coverImage: '/assets/posts/tech/javascript.png'
date: '2021-12-03T00:00:00.000Z'
labels: [
  'javascript',
  '算術運算子',
  '加號',
  '減號',
  '乘號',
  '除號',
  '取餘數',
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
- `NaN`：則是只要有其中一個是 `NaN`，那麼結果就必定是 `NaN`
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

- 如果計算結果超出 JavaSCript 的數字範圍，那麼就會看結果是正數或負數來決定是 `Infinity` 或是 `-Infinity`
- 要有其中一個是 `NaN`，那麼結果就必定是 `NaN`
- 相乘時，如果其中一方不是數字會主動用`Number()`轉型

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

### 資料來源
- <a href='https://ithelp.ithome.com.tw/users/20065504/ironman/1259' target="_blank">重新認識 JavaScript</a>