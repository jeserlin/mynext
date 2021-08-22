---
title: '事件捕捉 & 事件冒泡 (Event capturing & event bubbling)'
excerpt: '事件捕捉 & 事件冒泡的運作原理以及使用情境。'
coverImage: '/assets/posts/tech/event_capturing_bubbling.png'
date: '2021-08-22T00:00:00.000Z'
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
    window["Window"] --> document["Document"]
    document["Document"] -.-> window["Window"]
    document --- html["Element html"]
    html["Element html"] -.-> document
    html --- body["Element body"]
    body["Element body"] -.-> html
    body --- div["Element div"]
    div["Element div"] -.-> body
</div>

### 事件傳遞順序

把以上兩種機制合在一起看的話，事件傳遞的順序就會是`由上而下`再`由下而上`， 也就是說`先捕捉後冒泡`：
而這是因為當年兩大龍頭 Microsoft 跟 Netscape 分別提出了不同的處理順序，最後 W3C 決定把兩種機制合在一起同時支援並且把
`先捕捉後冒泡`設定為預設行為。因此當一個事件發生時，他的傳遞順序會是如圖：

<div class="mermaid">
graph TD
    window["Window"] -- 1. capture --> document["Document"]
    document["Document"] -. 8. bubble .-> window["Window"]
    document -- 2. capture --> html["Element html"]
    html["Element html"] -. 7. bubble .-> document
    html  -- 3. capture --> body["Element body"]
    body["Element body"] -. 6. bubble .-> html
    body  -- 4. capture --> div["Element div"]
    div["Element div"] -. 5. bubble .-> body
</div>

同樣我們也可以從事件傳遞的階段常數(Event Phase)了解到他的順序：

常數           | 值
------------- | -------------
none          | 0
capturing     | 1
at target     | 2
bubbling      | 3

### EventTarget.addEventListener()

```javascript
target.addEventListener(type, listener, useCapture)
```
`addEventListener`是大家很常使用的一個api, 但是我們很少會注意到第三個參數上：
- `useCapture (optional)`： boolean， default是false，用來指定這個event是使用`捕捉(capturing)`還是`冒泡(bubbling)`

#### 事件冒泡 (useCapture: false, Event bubbling)
在這個範例中，我們使用`useCapture`的default value，試著點擊`Layer`可以看到event是使用 `冒泡(bubbling)`機制：

<Iframe width="100%" height="500" scrolling="no" title="Event bubbling" src="//codepen.io/jeserlin/embed/GREKQJQ?default-tab=result" frameBorder="no" allowtransparency="true" allowFullScreen={true}>
  See the Pen <a href="https://codepen.io/jeserlin/pen/GREKQJQ">
  Event bubbling</a> by jeserlin chiu (<a href="https://codepen.io/jeserlin">@jeserlin</a>)
  on <a href="https://codepen.io">CodePen</a>.
</Iframe>

#### 事件捕捉 (useCapture: true, Event capturing)
而以下的範例是使用`useCapture: true`，試著點擊`Layer`可以看到event是使用 `捕捉(capturing)`機制：

<Iframe width="100%" height="500" scrolling="no" title="Event capturing" src="//codepen.io/jeserlin/embed/WNOeyQL?default-tab=result" frameBorder="no" allowtransparency="true" allowFullScreen={true}>
  See the Pen <a href="https://codepen.io/jeserlin/pen/WNOeyQL">
  Event bubbling</a> by jeserlin chiu (<a href="https://codepen.io/jeserlin">@jeserlin</a>)
  on <a href="https://codepen.io">CodePen</a>.
</Iframe>

### Event.stopPropagation()
// TODO
### 資料來源

- <a href='https://javascript.info/ui' target="_blank">https://javascript.info/ui</a>
- <a href='https://developer.mozilla.org/zh-TW/docs/Web/API/Event/eventPhase' target="_blank">https://developer.mozilla.org/zh-TW/docs/Web/API/Event/eventPhase</a>
- <a href='https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener' target="_blank">https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener</a>
