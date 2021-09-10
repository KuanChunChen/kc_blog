---
layout: post
title: "[Android][Kotlin][RxJava]「進階篇」RxJava 進階 - 一個extension funcion 實現網路連線Token重取"
date: 2021-02-19 21:37:48 +0800
image: android-photo.jpg
tags: [Android,Kotlin]
categories: Android
---
Hi ，大家好 ，很久沒發文了，<br>
今天要來分享一個自己摸索出來的RxJava搭配網路請求<br>
(如：OkHttp + Retrofit )的情況下，<br>
重取Token並重新請求同一個連線的方法，<br>
當然這個問題，是很常在一個重度連線需求的APP中碰到的，<br>
當需要跟server做請求時，因為需要確認是合法使用者，<br>
通常會使用Token的機制去確認使用者登入或存取Api的合法性，<br>
而通常Token伴隨著過期的設計，<br>
為了讓使用體驗很順，<br>
在沒有意識到app某個網路請求中間做了重取Token的動作，<br>
所以必需要達到一個更完善的流程。<br>


在本篇，我會用到相關知識列出如下，<br>
但本篇主要想分享實現Token重取網路連線重連的過程，<br>
故不會特別一一細聊，如果大家有興趣可以去查，或者私信討論：

* Genetic
* Kotlin extension
* Kotlin function type
* RxJava
* Retrofit
* Okhttp

<br>
通常，當剛開始學會用app串接一個有Token機制的網路連線API時，<br>
在沒有做任何配套措施時，實際跑的流程可能是：<br>

```
App網路請求 -> Token過期 -> Server回傳存取過期 -> App根據錯誤做出對應處理
```
<br>

所以通常這種情況下，雖然有做出錯誤處理，<br>
但是因為只要每當Token過期，<br>
就會跳出錯誤處理（例如：告知使用者超過連線時間等），<br>
可能跳一次兩次還好，使用者以為是偶發狀況，<br>
但當多次後，使用者則可能認為你的App有問題，<br>
沒辦法很順的執行下去，因此使用體驗下降，<br>
造成後續更多問題。<br><br>

所以這邊我預期，能讓Token重取後，<br>
原本的網路連線能夠重新執行，希望有類似如下流程：<br>

```
App網路請求 -> Token過期 -> Server回傳存取過期 -> 執行重取Token流程 -> App重新執行同個網路請求
```
<br>

在這篇，我主要使用的連線請求方式是 RxJava 的操作符，<br>
封裝Retrofit並套用OkHttp去請求網路Api，這邊分享一種我網路請求的方式：<br>

<script src="https://gist.github.com/KuanChunChen/5724788a6a2efa973eb31b497ffb65df.js"></script><br>

如果有人用過，RxJava去操作網路請求，通常會用一個Rx操作符去控制它，<br>
這邊我用的是 Obserable，而上面這段code其中的 ：<br>

```
repo.getPaymentData(paymentRequest)
```


返回的結果是一個Obserable<T> ，<br><br>

而如果只照著我上面那樣做，可能會像我一開始說的第一種情況，網路連線請求且Token失效後，只做了錯誤處理，連線並不會重連。<br><br>

所以為了解決這個問題，我就去研究了Rx要怎樣才能在跑的過程中去重取Token，並以 新的Token 去重連原本的API，因此我寫了個Kotlin的extension function 來達成這件事：<br>

<script src="https://gist.github.com/KuanChunChen/889f4e67cf5edae25cffc006a25032dd.js"></script><br>

這邊我把上面這段程式碼分開來講：<br>
**1.當實際應用這個extension時，會像是這樣：**<br>

<script src="https://gist.github.com/KuanChunChen/8ef1124c7d67d02b7e3024fc56735bc8.js"></script><br>

用起來十分方便，想要有重取Token的時候可以直接加入，<br>
不用的時候就照上方原本的方式也能執行，擴充相當方便，<br>
僅需加入：<br>

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

最後，其實這裡只是一種例子，<br>
如果你想要遇到其他情況時，有特定處理流程，<br>
也能在這裡面新增，<br>
你只要定義好錯誤常數 及 寫好處理流程，同樣能幫你執行處理的。
