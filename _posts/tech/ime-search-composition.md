---
title: '中文輸入法搜尋：等 compositionend 再篩選'
desc: '用可操作範例比較即時篩選與等待輸入法選字的搜尋欄位。'
type: 'tech'
coverImage: '/assets/posts/tech/ime-search-composition.svg'
date: '2026-10-26T00:00:00.000Z'
labels: [
  'javascript',
  'react'
]
---

## 要解決的問題

用中文輸入法打字時，鍵入的注音或拼音還不是最後要搜尋的字。如果每次 `input` 都立刻篩選，選字期間列表可能先顯示「沒有結果」，或跳到不相關的項目。

上方範例有兩個欄位：左邊每次輸入都篩選，右邊等選字完成才篩選。可以用中文輸入法分別輸入「台灣」試試；沒有中文輸入法時，按「模擬選字過程」也能看到差異。[在新分頁打開完整範例](/demos/ime-search/index.html)，用「檢視原始碼」查看可獨立執行的 HTML、CSS 和 JavaScript。

## Vanilla JavaScript 的關鍵

`compositionstart` 表示開始組字；這段期間照常顯示使用者輸入的文字，但先不要改搜尋用的 `query`。`compositionend` 再用輸入框當下的值搜尋：

```javascript
let isComposing = false;
let query = "";

input.addEventListener("compositionstart", () => {
  isComposing = true;
});

input.addEventListener("input", (event) => {
  if (!isComposing) search(event.currentTarget.value);
});

input.addEventListener("compositionend", (event) => {
  isComposing = false;
  search(event.currentTarget.value);
});

function search(value) {
  query = value.trim().toLocaleLowerCase();
  renderResults(query);
}
```

不要在 `compositionend` 只讀前一次的 state；直接取 `event.currentTarget.value`，才不會碰到更新時序問題。不同瀏覽器可能在 `compositionend` 前後各送一次 `input`，上面的處理可能重複搜尋同一個值；若搜尋會發網路請求，可在 `search` 裡比較新舊 query，避免重複請求。

## React：顯示值和篩選值分開

在可搜尋的國碼選單中，`input` 是畫面上的字，`query` 才是用來篩選選項的字。組字期間只更新前者：

```jsx
import { useRef, useState } from "react";

function SearchInput({ onQueryChange }) {
  const [input, setInput] = useState("");
  const isComposing = useRef(false);

  return (
    <input
      value={input}
      onChange={(event) => {
        const next = event.currentTarget.value;
        setInput(next);
        if (!isComposing.current) onQueryChange(next);
      }}
      onCompositionStart={() => {
        isComposing.current = true;
      }}
      onCompositionEnd={(event) => {
        isComposing.current = false;
        onQueryChange(event.currentTarget.value);
      }}
      aria-label="Search country"
    />
  );
}
```

## 下次怎麼驗證

1. 開始輸入注音或拼音、但還沒選字時，欄位文字會變；結果列表保持不動。
2. 選字送出後，列表才依完整文字更新。
3. 英文、貼上、刪除文字仍應立即篩選。
4. 用測試事件送出 `compositionStart` → `change` → `compositionEnd`，確認中間結果數量不變，最後才更新。
