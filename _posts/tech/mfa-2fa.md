---
title: '多重要素驗證 / 雙重認證 (MFA / 2FA)'
excerpt: '認識多重要素驗證 / 雙重認證。'
coverImage: '/assets/posts/tech/mfa_2fa.png'
date: '2021-08-24T00:00:00.000Z'
labels: [
    'MFA',
    '2FA',
    '多重要素驗證',
    '雙重認證',
]
---

近來我們會發現有越來越多的網站開始支援`雙重認證`甚至是`多重驗證`，這是因為`單一要素驗證` -- 也就是我們常見的`輸入帳號密碼`的這種驗證方式，他的安全度已經遠遠不足了。

試想一下，如果駭客透過不法手段竊取了你的帳號及密碼，那麼他就可以輕易地登入你的帳號獲取你的資料，甚至是進入你的公司網路造成更大的損失。

但是這類的事情實在防不慎防，為了降低風險&提升帳號安全，開始出現了`雙重認證`以及`多重驗證`。

### 名詞解釋

- 多重驗證 (Multi-factor authentication,縮寫為MFA): 又稱為`多因子認證`, `多因素驗證`, `多因素認證`, 使用者需要透過兩種以上的認證機制才能得到授權，使用電腦資源。
- 雙重認證 (Two-factor authentication，縮寫為2FA): 又稱為`雙重驗證`, `雙因子認證`, `雙因素認證`或`二元認證`。是多重要素驗證中的一個特例，使用兩種不同的元素，合併在一起，來確認使用者的身分。

### 驗證因子
驗證因子是使用者用來驗證自己的身分而提供的片段資訊，目前有以下5種：

- 知識因子 (Knowledge Factor): 驗證你知道什麼， e.g. `密碼`
- 持有因子 (Possession Factor): 驗證是否持有， e.g. `手機`， `security token`, `OTP (一次性密碼)`
- 固有因子 (Inherence Factor): 驗證你的身分， e.g. `指紋`， `虹膜`
- 地域因子 (Location Factor): 驗證你的地理位置，e.g. `IP`。舉例來說，平常你都是在台灣登入帳號，如果突然間登入的位置出現在美國，那麼就會視為異常登入。
- 時間因子 (Time Factor): 驗證你的時間，假設對公司電腦的預期登入時間是早上9點到下午6點，如果出現了不在這個時間範圍的登入紀錄就會判定為非預期登入。

### 雙重認證的種類

###### 1. SMS 2FA

###### 2. TOTP 2FA
基於時間的一次性密碼演算法, Time-based One-Time Password

###### 3. Push-Based 2FA

###### 4. U2F tokens

###### 5. WebAuthn

### 資料來源

- <a href='https://zh.wikipedia.org/wiki/%E5%A4%9A%E9%87%8D%E8%A6%81%E7%B4%A0%E9%A9%97%E8%AD%89' target="_blank">維基百科 - 多重要素驗證</a>
- <a href='https://duo.com/product/multi-factor-authentication-mfa/two-factor-authentication-2fa' target="_blank">Two-Factor Authentication (2FA) from Duo</a>