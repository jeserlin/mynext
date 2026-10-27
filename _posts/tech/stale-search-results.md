---
title: '搜尋結果被舊請求覆蓋：重現 race condition 與取消請求'
desc: '用可操作的延遲搜尋範例，觀察舊回應覆蓋新結果，並用 AbortController 修正。'
type: 'tech'
coverImage: '/assets/posts/tech/stale-search-results.svg'
date: '2026-10-27T00:00:00.000Z'
labels: [
  'javascript',
  'react'
]
---

## 先看錯誤發生

搜尋「台」後很快改成「台灣」，不代表「台」的請求會先完成。如果第一筆比較慢，它可能在「台灣」結果顯示後才回來，把畫面改回舊結果。

上方範例的兩欄會同時送出相同請求：「台」等 900ms，「台灣」等 180ms。按「重現問題」就能看到左欄最後顯示錯誤的舊結果，右欄則保持「台灣」的結果。[在新分頁打開完整範例](/demos/stale-search/index.html)，用「檢視原始碼」可看到可獨立執行的 HTML、CSS 和 JavaScript。延遲與資料都在本機模擬，不會呼叫外部 API。

## 最小重現：最後回來的請求不一定是最新的

```javascript
async function searchWithoutProtection(query) {
  const results = await fetchResults(query);
  renderResults(results); // 舊請求若最後完成，仍會覆蓋畫面
}

searchWithoutProtection("台");
searchWithoutProtection("台灣");
```

請求的**發送順序**和**完成順序**是兩回事。不要只在送出時檢查輸入框；真正更新畫面時，也必須確認這筆結果仍屬於目前的 query。

## 修正：取消上一筆請求

實際使用 `fetch` 時，把 `AbortController.signal` 傳進去。每次開始新搜尋，先取消舊請求；`AbortError` 是預期情況，不需要顯示錯誤訊息。

```javascript
let currentController;

async function search(query) {
  currentController?.abort();
  const controller = new AbortController();
  currentController = controller;

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Search failed: ${response.status}`);
    const results = await response.json();
    if (controller === currentController) renderResults(results);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return;
    showError(error);
  }
}
```

`controller === currentController` 是額外的保險：即使資料來自無法真正取消的 Promise，舊結果也不能更新畫面。若只是要防止舊結果覆蓋，單獨使用請求序號或 React effect 的 `ignore` 旗標也可以；取消請求則還能避免不必要的網路與解析工作。

## React：在 effect 清理時取消

```jsx
import { useEffect, useState } from "react";

function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Search failed: ${response.status}`);
        const data = await response.json();
        if (!controller.signal.aborted) setResults(data);
      } catch (error) {
        if (controller.signal.aborted) return;
        // 在這裡顯示真正的網路錯誤。
      }
    }

    void load();
    return () => controller.abort();
  }, [query]);

  return <ul>{results.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
}
```

這個 effect 的清理會在 query 改變或元件卸載時執行。搜尋欄若支援中文輸入法，先依[選字完成再搜尋](/tech/ime-search-composition)處理 composition；兩種問題不同：composition 決定**何時發送**，取消請求決定**哪筆回應可以更新畫面**。

## 下次檢查

1. 讓短 query 的回應故意比長 query 慢，確認畫面最後仍顯示最新 query。
2. 清空輸入框或離開頁面後，舊回應不得再更新結果。
3. 取消造成的 `AbortError` 不應當成搜尋失敗提示。
4. 真正的 4xx/5xx 或網路錯誤仍應顯示；不要把所有錯誤都吞掉。

參考：[React 的 race condition 範例](https://react.dev/learn/you-might-not-need-an-effect)、[MDN AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort)。
