---
layout: post
title: "Android開發 - RxJava搭配網路請求：實現Token重取與重新執行網路請求"
date: 2021-02-19 21:37:48 +0800
image: cover/ea-website-rxjava-cover-photo-new-1.png
tags: [Android,Kotlin]
categories: Android
permalink: /android-kt-rxjava
excerpt: "本文將介紹如何使用 RxJava 實現 Token 的重取並重新執行網路請求的方法，這將有助於提升應用程式的使用體驗"
---

<div class="c-border-main-title-2">前言</div>
大家好！<br>
很久沒發文了，<br>
今天要分享一個在使用RxJava搭配網路請求（如：OkHttp + Retrofit）時，<br>
解決重取Token並重新請求同一個連線的方法。<br>
這個問題在需要大量連線的APP中很常見。<br>
當我們需要與伺服器進行請求時，<br>
為了確保使用者的合法性，<br>
通常會使用Token機制來驗證登入或存取API的權限。<br>
而Token通常有有效期限，<br>
為了提供良好的使用體驗，<br>
我們需要在未意識到某個網路請求中Token已過期時，<br>
實現更完善的流程。<br>

<div class="c-border-content-title-4">用到相關知識</div><br>
在本篇，我會用到相關知識列出如下，<br>
但本篇主要想分享實現Token重取網路連線重連的過程，<br>
故不會特別一一細聊，如果大家有興趣可以去查，或者發訊息給我討論：

* Genetic
* Kotlin extension
* Kotlin function type
* RxJava
* Retrofit
* Okhttp

<div class="c-border-main-title-2">思路</div>

<br>
通常，在應用程式中串接帶有擁有Token機制的請求API時，，<br>
若未進行相應的處理，實際執行流程可能如下：

```
App網路請求 -> Token過期 -> Server回傳存取過期 -> App根據錯誤做出對應處理
```
<br>

在這種情況下，<br>
儘管有進行錯誤處理，<br>
但每當Token過期時，<br>
會觸發錯誤處理（例如：通知使用者Token已超時），<br>
一兩次可能還可以被視為偶發狀況，<br>
但多次後，<br>
使用者可能會認為你的應用程式有問題，<br>
無法順利執行，<br>
從而降低使用體驗，<br>引發更多後續問題。<br><br>

因此，<br>
我期望實現以下類似的流程，<br>
使得Token重新取得後，<br>
原始的網路連線能夠重新執行：<br>

```
App網路請求 -> Token過期 -> Server回傳存取過期 -> 執行重取Token流程 -> App重新執行同個網路請求
```
<br>

<div class="c-border-main-title-2">實際開發</div>
在這篇，我主要使用的連線請求方式是 RxJava 的操作符，<br>
封裝Retrofit並套用OkHttp去請求網路Api，這邊分享一種我網路請求的方式：<br>

<script src="https://gist.github.com/KuanChunChen/5724788a6a2efa973eb31b497ffb65df.js"></script><br>


如果有人使用 RxJava 來操作網路請求，<br>
通常會使用一個 Rx 操作符來控制它。<br>
在這裡，<br>
我使用的是 Observable。而上面這段程式碼中的：<br>

```
repo.getPaymentData(paymentRequest)
```


返回的結果是一個 Observable。<br>
如果只按照我之前所說的方式進行，<br>
可能會出現第一種情況，<br>
即網路請求後 Token 失效，<br>
只進行了錯誤處理然後重取token，<br>
並沒有重新請求api。<br>

為了解決這個問題，<br>
我開始研究如何使用 RxJava 在執行過程中重新取得 Token，<br>
並使用新的 Token 重新連線到原本的 API。<br>
因此，<br>
我撰寫了一個 Kotlin 的擴展函式（extension function），<br>
以實現這個功能：<br>

<script src="https://gist.github.com/KuanChunChen/889f4e67cf5edae25cffc006a25032dd.js"></script>

<div class="c-border-content-title-4">程式碼解說</div><br>
**1.當實際應用這個extension時，會像是這樣：**<br>

<script src="https://gist.github.com/KuanChunChen/8ef1124c7d67d02b7e3024fc56735bc8.js"></script>
使用起來非常方便，<br>
只需在需要重新取得 Token 的地方加入該擴展函式，<br>
不需要重新取得 Token 的地方則繼續使用原本的方式執行。<br>
這個擴展函式的應用非常靈活，<br>
只需加入以下程式碼即可：<br>

```
.retryNoKeyWhenError(resetRequest = {                       
     repo.getPaymentData(resetRequestToken(paymentRequest))})
```

**2. 我們將擴充的function單獨拉出來看**

我用了flapmap去解析Obserable<T>內返回的數據，<br>
又因為是連線請求，故通常server會有固定格式返回result，<br>
那就透過這裡解析請求結果的狀態，<br>
如果是success，那就直接將原本的整個respone傳回給observer，<br>
如果是錯誤狀況，就根據實際需求去寫你要的處理模式，如：<br>

遇到這幾種狀況<br>
 (這邊是自行定義的enum類，主要是簽章或token過期的情況，這邊大家可以自行定義)<br>

 ```
 State.FAIL_SIGNATURE_ERROR.value
 State.FAIL_SIGNATURE_EXPIRED.value
 State.FAIL_KEY_TOKEN_EXPIRED.value
 ```
 就會執行重取token的API並儲存想要的資料後，再返回對應的資料，再把原先錯誤情形回傳給observer


 **3. 這時候，使用了 retryWhen**

 因為前面回傳了錯誤情形，<br>
 所以會觸發retryWhen，<br>
 這裡我也定義了一個retry次數的Obserable以及隔幾秒重試，<br>
 會根據前面 input的Int來判斷如果遇到失敗情況幾秒要重試一次。<br>

而最主要的是，前面使用的function type，<br>
在這裡擔任重要角色，因為他就是你request失敗後，<br>
你預期要執行的方法會寫在這裡：<br>
```
resetRequest.invoke().delay(delayInSeconds, TimeUnit.SECONDS)
```
<br>

那因為這邊定義了extension 的return type是Observable < T >
<br>
所以又能接回原本的訂閱中，我認為還算滿方便的，<br>
提供給大家參考看看。<br>

最後，<br>
你可以根據其他情況需要定義特定的錯誤常數和處理流程，<br>
並在這個擴展函式中新增相應的處理邏輯。<br>
無論遇到什麼情況，<br>
只要事先定義好相應的錯誤常數和處理流程，<br>
這樣擴展函式都能幫助你執行相應的處理。<br>
你可以根據自己的需求在這個函式中進行擴充，<br>
讓它更適應你的應用場景。<br>
