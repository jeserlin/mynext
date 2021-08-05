---
title: '在React上設定GA Part1'
excerpt: '在React框架下輕鬆設定Google Analytics！'
coverImage: '/assets/posts/tech/google_analytics.png'
date: '2019-08-14T00:00:00.000Z'
labels: []
---

開始在github page上建自己的blog有一小段時間了， 雖然沒幾篇文章，但是還是蠻好奇到底有沒有人來看。

### 第一步：GA資源設定

可以看到下圖紅色框框的地方， 追蹤ID是之後我們在code裡面初始化GA需要用的， 預設網址就輸入你要監控的website就好了。

<img src='/assets/posts/tech/ga1/ga1_1.png'/>

### 第二步：載入react-ga

詳細的資訊可以看這邊：

<a href='https://github.com/react-ga/react-ga' target="_blank">https://github.com/react-ga/react-ga</a>

在你的project中加入react-ga

```javascript
import ReactGA from 'react-ga';
```

然後再初始化，記得換成自己的追蹤ID

```javascript
// GA
ReactGA.initialize(${追蹤ID});
ReactGA.pageview(window.location.pathname + window.location.search);
```

### 第三步：在Dashboard上看結果

接下來先開啟你剛剛設定要監控的網址， 然後到google analytics的dashboard， 選擇“即時 > 總覽”，你就可以驗證有沒有設定成功了～

<img src='/assets/posts/tech/ga1/ga1_2.png'/>

目前測試下來這個設定方法只能抓到第一層路徑 (/XXX)，如果有多層的話似乎是需要更多的設定。

我的blog是用react router來做分頁的，大致上看了一下react-ga是有支援router的，就等下次再研究吧～～