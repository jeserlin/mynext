---
title: '事件捕捉 & 事件冒泡 (Event capturing & event bubbling)'
excerpt: '事件捕捉 & 事件冒泡的運作原理以及使用情境。'
coverImage: '/assets/posts/tech/event_capturing_bubbling.png'
date: '2021-08-15T00:00:00.000Z'
labels: []
---
### 事件捕捉 (Event capturing)
事件傳遞的順序是從上到下，由最外層的`Window`到`Document`最後到事件發起的`Element`。

<div class="mermaid">
graph TD
    window["Window"] --- document["Document"]
    window["Window"] -.-> document["Document"]
    document --- html["Element html"]
    document -.-> html["Element html"]
    html --- body["Element body"]
    html -.-> body["Element body"]
    body --- div["Element div"]
    body -.-> div["Element div"]
</div>

### 事件冒泡 (Event bubbling)
而事件冒泡(Event bubbling)則是相反，事件傳遞的順序是從下到上，由事件發起的`Element`到`Document`最後再到`Window`。

<div class="mermaid">
graph TD
    window["Window"] --- document["Document"]
    document["Document"] -.-> window["Window"]
    document --- html["Element html"]
    html["Element html"] -.-> document
    html --- body["Element body"]
    body["Element body"] -.-> html
    body --- div["Element div"]
    div["Element div"] -.-> body
</div>

### 事件傳遞順序

以上面的流程圖當範例的話，當我們點擊了`Element div`，事件的傳遞順序到底是`捕捉`還是`冒泡`呢？

// TODO: add example

事件傳遞的階段常數(Event Phase)：

常數           | 值
------------- | -------------
none          | 0
capturing     | 1
at target     | 2
bubbling      | 3
### 資料來源

- <a href='https://developer.mozilla.org/zh-TW/docs/Web/API/Event/eventPhase' target="_blank">https://developer.mozilla.org/zh-TW/docs/Web/API/Event/eventPhase</a>
