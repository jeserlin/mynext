---
title: 'Next.js #2 (Router)'
excerpt: 'Next.js提供了Link API，讓我們輕鬆處理server side和client side的routing。'
coverImage: '/assets/posts/tech/nextjs.png'
date: '2019-11-24T00:00:00.000Z'
ogImage:
  url: ''
---

### 前言

在<a href="/tech/nextjs1" target="_blank">上一篇文章</a>中我們建立了一個Next.js的專案。 Next.js有包裝好的router功能，除了能提供client-side navigation之外，還能實現server-side navigation。

### 新增頁面

我們只要在pages folder下新增react component並且export就完成頁面的新增了，比如說我們來建立一個about頁面：

```jsx
// pages/about.js
export default function About() {
  return (
    <div>
      <p>This is the about page</p>
    </div>
  );
}
```

把專案run起來之後，我們就能在 http://localhost:3000/about 看到畫面了。

<img src='/assets/posts/tech/nextjs2/nextjs2_1.png'/>

這個時候我們打開browser的console可以看到，這個頁面是server-side rendering。(第一行的about)

<img src='/assets/posts/tech/nextjs2/nextjs2_2.png'/>

### 連結頁面

既然我們已經有頁面的url了那我們就可以直接用HTML的`<a>`來連接頁面了。 但是這樣的做法會是server-side rendering，也就是說瀏覽器會去跟server要頁面然後再更新到畫面上。

為了實現client-side rendering我們要使用Next.js的Link API。首先我們要使用next/link來連結兩個頁面：

```jsx
// This is the Link API
import Link from 'next/link';

const Index = () => (
  <div>
    <Link href="/about" title="About Page">
      <a>About Page</a>
    </Link>
    <p>Hello Next.js</p>
  </div>
);

export default Index;
```

現在我們會看到頁面中多了一個link：

<img src='/assets/posts/tech/nextjs2/nextjs2_3.png'/>

點下link的時候可以從console中觀察到，about頁面不再是從server過來的而使從about.js讀取。

<img src='/assets/posts/tech/nextjs2/nextjs2_4.png'/>

如果你有點client-side routing的陰影，不要擔心。這時候我們按上一頁， 會回到index頁面而且也是client-side rendering。Next.js已經幫我們處理好location.history的問題的了，完全不需要再自己處理了～～

### 限制

next/link是一個HOC，他只接受href及少部分類似的props。 如果我們需要傳遞props的話，應該要在他的chidren中傳遞。以上方的例子來說，我們應該把props寫在`<a>`裡面：

```jsx
<Link href="/about">
  <a title="About Page">About Page</a>
</Link>
```

這時候你會看到`<a>`中多了title:

<img src='/assets/posts/tech/nextjs2/nextjs2_5.png'/>

如果放在<Link>裡面則會得到unknown props的錯誤訊息：

<img src='/assets/posts/tech/nextjs2/nextjs2_6.png'/>

但也不是所有的component都能夠放在next/link裡，他至少需要有onClick這個屬性。

### 資料來源

- <a href='https://nextjs.org/learn/basics/navigate-between-pages' target="_blank">https://nextjs.org/learn/basics/navigate-between-pages</a>