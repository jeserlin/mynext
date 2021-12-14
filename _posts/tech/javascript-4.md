---
title: 'Note - 重新認識javascript (4)'
desc: 'DOM 的新增 / 修改 / 刪除'
type: 'tech'
coverImage: '/assets/posts/tech/javascript.png'
date: '2021-12-14T00:00:00.000Z'
labels: [
  'javascript',
]
---

### DOM

#### DOM 節點的新增

- document.createElement(tagName)
- document.createTextNode()
- document.createDocumentFragment()
  - `DocumentFragment` 是一種沒有父節點的 `最小化文件物件`
  - `DocumentFragment` 不是真的DOM，因此在變動時不會影響目前的網頁文件，也不會reflow或影響效能
  ```javascript
  var ul = document.getElementById("list");

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < 5; i++){
    let li = document.createElement("li");
    li.appendChild(document.createTextNode("Item " + (i+1)));
    fragment.appendChild(li);
  }

  ul.appendChild(fragment);
  ```
  - document.write()
    - 當網頁已經讀取完成後才執行 `document.write()`，內容會完全覆蓋掉目前的網頁

#### DOM 節點的修改與刪除

- NODE.appendChild(childNode)
  - 將指定的 `childNode` 增加到 `Node` 父容器結點的末端
- NODE.insertBefore(newNode, refNode)
  - 將新節點 `newNode` 插入至指定的 `refNode` 節點的前面
- NODE.replaceChild(newChildNode, oldChildNode)
  - 將原本的 `oldChildNode` 替換成指定的 `newChildNode`
- NODE.removeChild(childNode)

### 資料來源
- <a href='https://ithelp.ithome.com.tw/articles/10191867' target="_blank">重新認識 JavaScript: Day 13 DOM Node 的建立、刪除與修改</a>

