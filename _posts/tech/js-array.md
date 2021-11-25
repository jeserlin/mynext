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

<div style='overflow-x:auto;'>
  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>description</th>
        <th>return</th>
        <th>change original array</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>push(element)</td>
        <td>添加一個或多個元素至陣列的<code>末端</code></td>
        <td>陣列的新長度</td>
        <td>yes</td>
      </tr>
      <tr>
        <td>unshift(element)</td>
        <td>添加一個或多個元素至陣列的<code>開頭</code></td>
        <td>陣列的新長度</td>
        <td>yes</td>
      </tr>
      <tr>
        <td>pop()</td>
        <td>移除並回傳陣列的<code>最後一個元素</code></td>
        <td>陣列的<code>最後一個元素</code></td>
        <td>yes</td>
      </tr>
      <tr>
        <td>shift()</td>
        <td>移除並回傳陣列的<code>第一個元素</code></td>
        <td>陣列的<code>第一個元素</code></td>
        <td>yes</td>
      </tr>
      <tr>
        <td>concat(array)</td>
        <td>合併兩個或多個陣列</td>
        <td>合併後的<code>新陣列</code></td>
        <td>no</td>
      </tr>
      <tr>
        <td>findIndex(item, index, array)</td>
        <td>依據提供的測試函式，尋找陣列中符合的元素</td>
        <td>符合的元素<code>index</code>或<code>-1</code></td>
        <td>no</td>
      </tr>
      <tr>
        <td>find(item, index, array)</td>
        <td>回傳第一個滿足所提供之測試函式的元素值</td>
        <td><code>第一個滿足</code>所提供之測試函式的<code>元素值</code>或<code>undefined</code></td>
        <td>no</td>
      </tr>
      <tr>
        <td>filter(item, index, array)</td>
        <td>建立一個經指定之函式運算後，由原陣列中通過該函式檢驗之元素所構成的新陣列</td>
        <td>通過函式之元素構成的<code>新陣列</code></td>
        <td>no</td>
      </tr>
      <tr>
        <td>forEach(item, index, array)</td>
        <td>將陣列內的每個元素，皆傳入並執行給定的函式一次</td>
        <td>-</td>
        <td>no</td>
      </tr>
      <tr>
        <td>map(item, index, array)</td>
        <td>建立一個新的陣列，其內容為原陣列的每一個元素經由回呼函式運算後所回傳的結果之集合</td>
        <td>呼叫函式後的<code>新陣列</code></td>
        <td>no</td>
      </tr>
      <tr>
        <td>some(item, index, array)</td>
        <td>透過給定函式、測試陣列中是否至少有一個元素，通過該函式所實作的測試</td>
        <td><code>Boolean</code></td>
        <td>no</td>
      </tr>
      <tr>
        <td>every(item, index, array)</td>
        <td>測試陣列中的所有元素是否都通過了由給定之函式所實作的測試</td>
        <td><code>Boolean</code></td>
        <td>no</td>
      </tr>
      <tr>
        <td>reduce(acc, cur, curIndex, [, initialValue])</td>
        <td>將一個累加器及陣列中每項元素（由左至右）傳入回呼函式，將陣列化為單一值</td>
        <td>最後的<code>結果</code></td>
        <td>no</td>
      </tr>
      <tr>
        <td>sort(compareFunction)</td>
        <td>對一個陣列的所有元素進行排序,預設的排序順序是根據字串的<code>Unicode</code>編碼位置而定</td>
        <td><code>原本的陣列</code></td>
        <td>yes</td>
      </tr>
      <tr>
        <td>reverse()</td>
        <td>反轉陣列 (陣列中的第一個元素變為最後一個，而最後一個元素則變成第一個)</td>
        <td>反轉過後的<code>原本的陣列</code></td>
        <td>yes</td>
      </tr>
      <tr>
        <td>slice(begin, end)</td>
        <td>擷取從<code>begin(包含)</code>到<code>end(不包含)</code></td>
        <td><code>新陣列</code></td>
        <td>no</td>
      </tr>
      <tr>
        <td>splice(start, deleteCount, item1, item2)</td>
        <td>藉由刪除既有元素並／或加入新元素來改變一個陣列的內容</td>
        <td>改變後的<code>原本的陣列</code></td>
        <td>yes</td>
      </tr>
      <tr>
        <td>indexOf(element)</td>
        <td>回傳給定元素於陣列中第一個被找到之索引</td>
        <td>給定元素於陣列中<code>第一個被找到之索引</code>或<code>-1</code></td>
        <td>no</td>
      </tr>
      <tr>
        <td>join(separator)</td>
        <td>將陣列中所有的元素連接、合併成一個字串，並回傳此字串</td>
        <td><code>String</code></td>
        <td>no</td>
      </tr>
      <tr>
        <td>includes(element, fromIndex)</td>
        <td>判斷陣列是否包含特定的元素</td>
        <td><code>Boolean</code></td>
        <td>no</td>
      </tr>
    </tbody>
  </table>
</div>

### 資料來源
- <a href='https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array' target="_blank">MDN Web Docs</a>
