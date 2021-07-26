---
title: 'Bootstrap 4 – Cards (card columns)'
excerpt: 'Bootstrap 4 提供了類似Masonry的排列方式，讓大家用CSS就能達到類似的效果。本篇文章紀錄新component -- Cards Columns在畫面上的呈現，以及如何設定一些客製化的樣式。'
coverImage: '/assets/posts/tech/bootstrap4.png'
date: '2019-08-14T00:00:00.000Z'
ogImage:
  url: ''
---

Bootstrap 4 中的Cards 取代了 Bootstrap 3中的 panels、wells、thumbnails。

Card columns 可以將cards瀑布版的排列，

順序是`從上到下，再從左到右`

也就是說假設我們寫了9個cards，最後呈現的順序會如下：

<Iframe width="100%" height="350" scrolling="no" title="Bootstrap 4.0 Cards" src="//codepen.io/jeserlin/embed/XwqYXr/?height=265&theme-id=0&default-tab=result" frameBorder="no" allowtransparency="true" allowFullScreen={true}>
            See the Pen
            <a href='https://codepen.io/jeserlin/pen/XwqYXr/'>Bootstrap 4.0 Cards</a>
            by jeserlin chiu
            (<a href='https://codepen.io/jeserlin'>@jeserlin</a>) on <a href='https://codepen.io'>CodePen</a>.
          </Iframe><br />

目前似乎沒辦法透過css調整他的排序(? 如果有找到再來更新)

官網中有提到另寫scss調整不同解析度下，每行顯示的cards數量：

<Iframe width="100%" height="350" scrolling="no" title="Bootstrap 4 - Cards  Columns break point (css)" src="//codepen.io/jeserlin/embed/vwjrvR/?height=265&theme-id=0&default-tab=css" frameBorder="no" allowtransparency="true" allowFullScreen={true}>
            See the Pen <a href='https://codepen.io/jeserlin/pen/vwjrvR/'>Bootstrap 4 - Cards  Columns break point (css)</a> by jeserlin chiu
            (<a href='https://codepen.io/jeserlin'>@jeserlin</a>) on <a href='https://codepen.io'>CodePen</a>.
          </Iframe>

其中的column-count就是在設定每行要顯示的cards數量。

以下提供css的寫法 :

<Iframe width="100%" height="350" scrolling="no" title="Boostrap 4 - Cards Columns break point (css)" src="//codepen.io/jeserlin/embed/pmVZJj/?height=329&theme-id=0&default-tab=css,result" frameBorder="no" allowtransparency="true" allowFullScreen={true}>
            See the Pen <a href='https://codepen.io/jeserlin/pen/pmVZJj/'>Boostrap 4 - Cards Columns break point (css)</a> by jeserlin chiu
            (<a href='https://codepen.io/jeserlin'>@jeserlin</a>) on <a href='https://codepen.io'>CodePen</a>.
          </Iframe><br />