---
title: 'pyenv: 輕鬆切換python版本'
excerpt: '使用pyenv輕鬆建立虛擬環境 & 使用設定版本python。'
coverImage: '/assets/posts/tech/pyenv.png'
date: '2019-09-15T00:00:00.000Z'
labels: []
---

pyenv 是一個管理python版本的套件， 在開發不同project的時候常常會遇到使用版本不同的問題。

有了pyenv我們就可以輕鬆地切換不同版本的python。以下主要紀錄：

1. 安裝pyenv / pyenv-virtualenv
2. 安裝與設定設定python版本
3. 建立虛擬環境
4. 進入虛擬環境

***

### 安裝pyenv / pyenv-virtualenv

```bash
$ brew update
$ brew install pyenv
```

brew update也許會需要一點時間，要耐心等一下。

下載好之後，輸入pyenv會看到如下圖的資訊：

<img src='/assets/posts/tech/pyenv/pyenv_1.png'/>

上圖列出了很多有用的commands，等等才會用到。接下來下載pyenv-virtualenv:

```bash
$ brew install pyenv-virtualenv
```

裝好之後設定一下環境變數：

```bash
$ eval "$(pyenv init -)"
$ eval "$(pyenv virtualenv-init -)"
```

這時候使用以下指令會發現多了一些virtualenv相關的commands：

```bash
$ pyenv commands
```

<img src='/assets/posts/tech/pyenv/pyenv_2.png'/>

到這邊安裝就完成嘍～！

### 安裝與設定python版本

接下來要下載特定版本的python，下載之前可以用以下指令來看看有哪些版本可以下載：

```bash
$ pyenv install -l
```

列出可以下載的版本，如圖：

<img src='/assets/posts/tech/pyenv/pyenv_3.png'/>

接下來我們來下載python，示範下載3.4.3：

```bash
$ pyenv install 3.4.3
```

* 這邊下載也需要一點時間

<img src='/assets/posts/tech/pyenv/pyenv_4.png'/>

現在來確認一下有沒有成功：

```bash
$ pyenv versions
```

這個指令會列出你電腦裡面所有的pyton，我電腦裡有兩個，一個是系統預設的，一個是剛剛下載的3.4.3。

<img src='/assets/posts/tech/pyenv/pyenv_5.png'/>

確認看到剛剛下載的版本安裝就完成啦！

### 建立虛擬環境

接下來就是最重要的一步了，為了有一個乾淨的開發環境。

我們一般會幫每個專案建立一個虛擬環境，如此一來每個環境之間就不會互相影響了。

以下指令的意思是：建立一個使用python3.4.3的環境，並命名為env-3.4.3

```bash
$ pyenv virtualenv 3.4.3 env-3.4.3
```

<img src='/assets/posts/tech/pyenv/pyenv_6.png'/>

如果不確定有沒有建立成功，可以下以下指令檢查一下現有的虛擬環境：

```bash
$ pyenv virtualenvs
```

<img src='/assets/posts/tech/pyenv/pyenv_7.png'/>

### 進入虛擬環境

完成以上步驟之後，使用以下指令就可以進入虛擬環境了：

```bash
$ pyenv activate env-3.4.3
```

這邊的*env-3.4.3*是剛建立的虛擬環境的名字，進入之後你會看到你的機器名字前面有一個括號表示目前的虛擬環境，如圖：

<img src='/assets/posts/tech/pyenv/pyenv_8.png'/>

***

整理一下這次用到的pyenv指令：


1. `pyenv commands` /* 列出全部可用指令 */
2. `pyenv install -1` /* 列出全部可下載版本 */
3. `pyenv install (version)` /* 下載特定版本python */
4. `pyenv versions` /* 列出電腦內的全部python版本 */
5. `pyenv virtualenv (version) (environment name)` /* 建立虛擬環境 */
6. `pyenv virtualenvs` /* 列出全部虛擬環境 */
7. `pyenv activate (environment name)` /* 進入特定虛擬環境 */
