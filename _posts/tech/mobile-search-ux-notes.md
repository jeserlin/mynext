---
title: '手機搜尋 Overlay：返回鍵、焦點與捲動位置'
desc: 'React Router 手機搜尋畫面的實作範例與檢查清單。'
type: 'tech'
coverImage: '/assets/posts/tech/mobile-search-ux-notes.svg'
date: '2026-10-26T00:00:00.000Z'
labels: [
  'react',
  'ux'
]
---

## 要解決的問題

在手機列表頁打開全螢幕搜尋時，希望同時做到：

1. 點開後立刻能打字，不必再點一次輸入框。
2. 瀏覽器返回鍵先關閉搜尋，而不是離開原本的列表頁。
3. 關閉後回到原本的捲動位置。

上面的互動範例可以直接操作：先捲動列表，再開啟搜尋、輸入關鍵字，最後按「Try browser Back」。也可以[在新分頁打開範例](/demos/mobile-search/index.html)，用瀏覽器真正的返回鍵測試；在那個頁面使用「檢視原始碼」就能看到完整的 HTML／CSS／JavaScript。下面再記錄實際 React Router 專案中使用的對應做法。追蹤事件、搜尋建議與樣式已省略。

## 範例：讓搜尋畫面進入瀏覽器歷史紀錄

```javascript
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router-dom";

export function MobileSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const isOverlayInHistory = location.state?.searchOverlay === true;

  function openSearch() {
    if (isOpen) return;

    // 先掛載真正的輸入框，才能在這次點擊中把焦點移過去。
    flushSync(() => setIsOpen(true));

    // 網址不變，但新增一筆 history：Back 會先退回這筆紀錄。
    navigate(
      {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      },
      { state: { ...location.state, searchOverlay: true } },
    );

    inputRef.current?.focus();
  }

  function closeSearch() {
    if (isOverlayInHistory) navigate(-1);
    else setIsOpen(false); // history 尚未更新時的退路
  }

  // 使用瀏覽器 Back 時，router 會收到 POP。
  useEffect(() => {
    if (navigationType === "POP") setIsOpen(false);
  }, [location, navigationType]);

  return (
    <>
      <button type="button" onClick={openSearch}>Open search</button>
      {isOpen && (
        <div role="dialog" aria-modal="true" aria-label="Search">
          <input ref={inputRef} type="search" aria-label="Search term" />
          <button type="button" onClick={closeSearch}>Close</button>
        </div>
      )}
    </>
  );
}
```

這個範例必須放在 `BrowserRouter` 裡。實際頁面另外有桌面 dropdown；它使用獨立的 `isDropdownOpen`，不與手機 overlay 共用開關。一般 state 更新不需要 `flushSync`；這裡使用它，是因為點擊後要**立即聚焦剛掛載的 input**。

## 如果網站有「換頁捲到頂部」功能

只看 `navigate` 動作就捲到頂部，會讓上面這個「同網址、只改 history state」的動作也把底下頁面捲走。實際專案用 URL 是否變動來判斷：

```javascript
function ScrollToTop() {
  const { pathname, search } = useLocation();
  const navigationType = useNavigationType();
  const previousUrl = useRef(null);

  useEffect(() => {
    const url = pathname + search;
    const hasUrlChanged = previousUrl.current !== url;
    previousUrl.current = url;

    if (hasUrlChanged && navigationType !== "POP") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, search, navigationType]);

  return null;
}
```

把 `<ScrollToTop />` 放在 Router 裡、頁面路由旁邊即可。**同網址的 overlay history 更新不捲動；真正換網址時才捲到頂部。**

## 下次照這個順序檢查

1. 在手機上把列表捲到中間，點「搜尋」：overlay 出現，游標直接進入輸入框。
2. 按瀏覽器返回鍵：overlay 關閉，仍在同一個網址與捲動位置。
3. 再次打開，按畫面上的「Close」：結果應與返回鍵相同。
4. 真正前往另一個網址：新頁面從頂部開始；按返回鍵回列表時，讓瀏覽器恢復原本的捲動位置。

如果第 2 步直接離開列表，先檢查開啟時是否用了 `push`（而不是 `replace`）；如果第 2 步回到頁首，檢查共用的 scroll-to-top 邏輯是否把**同網址的 history 更新**當成換頁。
