---
title: 'Next.js #1( 建立 )'
excerpt: 'Next.js是React官方推薦作為server side rendering的框架！'
coverImage: '/assets/posts/tech/nextjs.png'
date: '2019-11-18T00:00:00.000Z'
ogImage:
  url: ''
---

### 前言

在我們建立一個React的專案時，一般都會使用官方提供的create-react-app。 雖然可以快速的建立一個React的專案，但是學習曲線還是偏高。 比如說設定webpack，router等等。更別說如果你需要處理SEO的話， 還需要server-side render你的頁面。Next.js是一個React Framework，他提供了許多功能可以輕鬆解決剛剛提到的困擾：

- `Server-side rendering`
- `Routing System`
- `CSS-in-JS`
- `Static Exporting`
- ...

### 建立

其實官網提供了很不錯的step by step的教學， 在每完成一步之後都會得到一些點數，目前不是很清楚這些點數能幹嘛XDD， 但是似乎給了一些繼續往下學習的動力lol

<img src='/assets/posts/tech/nextjs1/nextjs1_1.png'/>

以下紀錄建立過程的重點（手動建立）：

```bash
mkdir hello-next
cd hello-next
npm init -y
npm install --save react react-dom next
mkdir pagess
```

然後開啟package.json做一下的修改：

```json
{ "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
    }
}
```

設定好之後用以下指令把project run起來：

```bash
npm run dev
```

開啟 http://localhost:3000 你會看到404的畫面，如下：

<img src='/assets/posts/tech/nextjs1/nextjs1_2.png'/>

還記得我們剛剛有建立一個pages的folder嗎？會出現以上的畫面是因為，我們沒建立任何的頁面。現在來建立一個簡單的index頁面在pages folder下：

```javascript
// pages/index.js
const Index = () => (
  <div>
    <p>Hello Next.js</p>
  </div>
);
export default Index;
```

再次refresh頁面就會看到index頁面了！

<img src='/assets/posts/tech/nextjs1/nextjs1_3.png'/>

如果你有開發過react專案的話，此時此刻一定會感受到Next.js中router的強大之處。 我們只要export一個React Component然後把他放在pages folder下，就可以得到一個以檔案名一樣的固定URL，完全不需要額外的處理。 不過這邊的render方式是server-side renderding，下一篇會主要紀錄server-side rendering跟client-side rendering。

### 資料來源

- <a href='https://nextjs.org/#features' target="_blank">https://nextjs.org/#features</a>
- <a href='https://nextjs.org/learn/basics/getting-started' target="_blank">https://nextjs.org/learn/basics/getting-started</a>