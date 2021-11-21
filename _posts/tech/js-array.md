---
title: 'javascript - Array'
desc: '紀錄array的常用methods，方便查看。'
type: 'tech'
coverImage: '/assets/posts/tech/array.png'
date: '2021-11-21T00:00:00.000Z'
labels: [
  'javascript',
  'Array'
]
---

### 讀取資料

- 知道index，時間複雜度 --> `Big O(1)`
- 不知道index，時間複雜度 --> `Big O(n)`

### 建立Array

```javascript
// 1. literal
const arr = [item1, item2, ...];

// 2. Using the JavaScript Keyword new
// *For simplicity, readability and execution speed, use the array literal method.*
const arr = new Array("Saab", "Volvo", "BMW");
```

### 常使用的methods

| Method                                       | description                                                                      | return                                              | change original array |
| -------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------- |
| push(element)                                | 添加一個或多個元素至陣列的`末端`                                                 | 陣列的新長度                                        | yes                   |
| unshift(element)                             | 添加一個或多個元素至陣列的`開頭`                                                 | 陣列的新長度                                        | yes                   |
| pop()                                        | 移除並回傳陣列的`最後一個元素`                                                   | 陣列的`最後一個元素`                                | yes                   |
| shift()                                      | 移除並回傳陣列的`第一個元素`                                                     | 陣列的`第一個元素`                                  | yes                   |
| concat(array)                                | 合併兩個或多個陣列                                                               | 合併後的`新陣列`                                    | no                    |
| findIndex(item, index, array)                | 依據提供的測試函式，尋找陣列中符合的元素                                         | 符合的元素`index`或`-1`                             | no                    |
| find(item, index, array)                     | 回傳第一個滿足所提供之測試函式的元素值                                           | `第一個滿足`所提供之測試函式的`元素值`或`undefined` | no                    |
| filter(item, index, array)                   | 建立一個經指定之函式運算後，由原陣列中通過該函式檢驗之元素所構成的新陣列         | 通過函式之元素構成的`新陣列`                        | no                    |
| forEach(item, index, array)                  | 將陣列內的每個元素，皆傳入並執行給定的函式一次                                   | -                                                   | no                    |
| map(item, index, array)                      | 建立一個新的陣列，其內容為原陣列的每一個元素經由回呼函式運算後所回傳的結果之集合 | 呼叫函式後的`新陣列`                                | no                    |
| some(item, index, array)                     | 透過給定函式、測試陣列中是否至少有一個元素，通過該函式所實作的測試               | `Boolean`                                           | no                    |
| every(item, index, array)                    | 測試陣列中的所有元素是否都通過了由給定之函式所實作的測試                         | `Boolean`                                           | no                    |
| reduce(acc, cur, curIndex, [, initialValue]) | 將一個累加器及陣列中每項元素（由左至右）傳入回呼函式，將陣列化為單一值           | 最後的`結果`                                        | no                    |
| sort(compareFunction)                        | 對一個陣列的所有元素進行排序,預設的排序順序是根據字串的`Unicode`編碼位置而定     | `原本的陣列`                                        | yes                   |
| reverse()                                    | 反轉陣列 (陣列中的第一個元素變為最後一個，而最後一個元素則變成第一個)            | 反轉過後的`原本的陣列`                              | yes                   |
| slice(begin, end)                            | 擷取從`begin(包含)`到`end(不包含)`                                               | `新陣列`                                            | no                    |
| splice(start, deleteCount, item1, item2)     | 藉由刪除既有元素並／或加入新元素來改變一個陣列的內容                             | 改變後的`原本的陣列`                                | yes                   |
| indexOf(element)                             | 回傳給定元素於陣列中第一個被找到之索引                                           | 給定元素於陣列中`第一個被找到之索引`或`-1`          | no                    |
| join(separator)                              | 將陣列中所有的元素連接、合併成一個字串，並回傳此字串                             | `String`                                            | no                    |
| includes(element, fromIndex)                 | 判斷陣列是否包含特定的元素                                                       | `Boolean`                                           | no                    |


### 資料來源
- <a href='https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array' target="_blank">MDN Web Docs</a>
