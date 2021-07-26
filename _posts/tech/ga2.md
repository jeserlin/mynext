---
title: '在React上設定GA Part2'
excerpt: '在Google Analytics也能讀取react-router的路徑！'
coverImage: '/assets/posts/tech/google_analytics.png'
date: '2019-08-14T00:00:00.000Z'
ogImage:
  url: ''
---

在<a href='/tech/ga1'>上一篇文章</a>中已經設定好可以在GA dashboard上看總覽人數了, 但由於我是使用react-router，在沒有多做一些處理的前提下只能抓到index的路徑。

<img src='/assets/posts/tech/ga2/ga2_1.png'/>

今天這邊文章會紀錄如何讓GA能讀取react-router的路徑！

### 第一步：實作withTracker

```json
react: ^16.8.5
react-router: ^4.0.0
```

以下code是使用react hook實作：

```javascript
import React, { useEffect } from "react";
import ReactGA from "react-ga";

const withTracker = (WrappedComponent, options = {}) => {
  const trackPage = page => {
    ReactGA.set({
      page,
      ...options
    });
    ReactGA.pageview(page);
  };
  const HOC = props => {
    useEffect(() => trackPage(`MyTechBlog${props.location.pathname}`), [
      props.location.pathname
    ]);
    return <WrappedComponent {...props} />;
  };
  return HOC;
};

export default withTracker;
```

如果你的domain有多個page的話，為了較好地在GA上區分user瀏覽的頁面，你可以在trackPage這邊加入上一層的路徑（底線+墨綠色部分）。 以上是react-ga提供的方法，可以在這邊看更多資訊：

<a href='https://github.com/react-ga/react-ga/wiki/React-Router-v4-withTracker' target="_blank">https://github.com/react-ga/react-ga/wiki/React-Router-v4-withTracker</a>

### 第二步：在router中導入withTracker

首先在App.js 中import withTracker (或者是你的index container)

```javascript
import withTracker from './withTracker';
```

然後在route的component中把要導的頁面用withTracker包起來

```javascript
<Router>
  <Route path="/" exact component={withTracker(this.index)} />
  <Route path="/ga1/" component={withTracker(this.ga1)} />
</Router>
```

### 第三步：在Dashboard上看結果

接下來開啟隨便一個router的路徑，然後到google analytics的dashboard，就可以看到成果了喔～！

<img src='/assets/posts/tech/ga2/ga2_2.png'/>

從上圖我們可以看到原本顯示的是 ‘/MyTechBlog’，現在則是直接顯示我們在react-router中設定的路徑。

如此以來我們就可以很清楚的查看user到底在瀏覽哪一頁。

設定好GA也過了3個禮拜了，雖然來的人不多但是感覺能看到實際的數字蠻有趣的。接下來的目標就是研究如何提升人數！
