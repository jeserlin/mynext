---
title: 'React Bootstrap - WHY & HOW'
excerpt: 'React-Bootstrap的簡單介紹 & 範例。'
coverImage: '/assets/posts/tech/react_bootstrap.png'
date: '2019-08-14T00:00:00.000Z'
labels: [
  'react-bootstrap',
  'bootstrap'
]
---

### WHY?

當你開始寫react之後你一定會開始很煩惱，現在html都要寫在js裡面了(JXS)， 完全顛覆了以前的想法與習慣，到底可不可以繼續用bootstrap？

先別煩惱，`bootstrap當然是可以繼續用的`，只要我們把他import進來， 一切的寫法就跟以前一樣。但是你知道react-bootstrap嗎？

既然我們可以繼續用原本的bootstrap為什麼要選擇react-bootstrap呢？

當我們要在頁面上做一些互動效果，比如：動態新增或刪除，ajax等，這些都需要操作DOM元素。 然而這些動作在前端來說是很耗效能的，當然這些效能的差異都是在大量操作下才會感受的出來。 為了解決這個問題，React在與DOM溝通之間增加了一層虛擬DOM。這個虛擬DOM是由javascript模擬出來的， 他可以提升效能，實際上是怎麼做到的有興趣可以搜尋一下。

`簡單來說，在React中我們要避免直接操作實體DOM。`

如果大家還有印象的話，在bootstrap中要使用他提供的javascript元件是需要jquery的，然而jquery會直接操作實體DOM。這就是我們選擇react-bootstrap而不用bootstrap的最關鍵因素。 使用react-bootstrap其實是有很多好處的：
1. 不會直接操作DOM
2. 直接使用component，減少程式複雜度
3. 加快開發速度(畢竟什麼都自己刻是很累的XD)

***

### HOW?

使用react-bootstrap需要import react-bootstrap和bootstrap v3.的css。（現在已經有beta版支援v4嘍）
首先，加入react-bootstrap:

```bash
npm install --save react-bootstrap
```

再加入Bootstrap v3. 的css：

```bash
npm install bootstrap@3
```

當然你也可以手動地把bootstrap.css放在你的static路徑裡面，這就看個人習慣。 如果是選擇用webpack的話，最後應該會在dist裡面，可以去找找看 最後我們在index.html中讀取就ok了。 以下提供一個使用範例：

<Iframe width="100%" height="350" scrolling="no" title="react-bootstrap example" src="//codepen.io/jeserlin/embed/rXVxRp/?height=265&theme-id=dark&default-tab=js,result" frameBorder="no" allowtransparency="true" allowFullScreen={true}>
            See the Pen <a href='https://codepen.io/jeserlin/pen/rXVxRp/'>react-bootstrap example</a> by jeserlin chiu
            (<a href='https://codepen.io/jeserlin'>@jeserlin</a>) on <a href='https://codepen.io'>CodePen</a>.
          </Iframe>