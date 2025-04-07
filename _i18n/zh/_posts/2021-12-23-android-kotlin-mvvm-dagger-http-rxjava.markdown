---
layout: post
title: "打造流暢自動加載分頁的Github API Demo：MVVM、DI、RxJava與Paging在Android Kotlin的實踐教學"
date: 2021-12-23 13:06:12 +0800
image: cover/kotlin-mvvm+rxjava+retrofit+okHttp+dagger.png
tags: [Android]
categories: Android實作
excerpt: "在這個教學中，我們將探索如何使用MVVM、DI、RxJava和Paging這些技術在Android Kotlin上打造一個Github API Demo。通過這個Demo，你將學會如何建立一個流暢自動加載分頁的應用程式，同時也能了解到如何在Kotlin上使用這些重要的技術。"
---

<div class="c-border-main-title-2">前言</div>

今天我要分享的是使用以下架構，<br>
來串接Github API來實作流暢自動加載分頁的範例。<br>
 1.透過mvvm架構<br>
 2.RxJava控制網路請求<br>
 3.dependency injection<br>
 4.使用paging來呈現recycler view 分頁<br>
 5.資料串接github api<br>

<div class="c-border-content-title-4">最後實際出來的畫面長這樣：</div><br>
<div align="center">
  <img src="/mov/paging/mvvm-paging-dagger2.gif" width="30%"/>
</div>

<div class="c-border-content-title-4">使用的是api的是Github提供的/search/users</div><br>

```shell
curl \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/search/users
```

<div class="c-border-content-title-4">實現的功能是</div><br>
在搜尋欄位輸入搜尋文字<br>
透過建好的data class去打API
並依照指定數量顯示出返回的結果

<div class="c-border-main-title-2">前期架構思想(TL;DR)</div>

首先 開始必需規劃架構<br>
這邊使用的是mvvm為主<br>
心中會先有大概的圖譜<br>
但不會一開始就全部用出來<br>
會先一層一層架<br>
這邊是我簡略的範例：<br>

<div align="start">
  <img src="/images/paging/project-struct.png" width="30%"/>
</div>

<br>


<div class="c-border-content-title-4">預想開發步驟</div><br>

1.首先，我們先著手處理一些基本的共用類別，<br>
例如 base 資料夾、Android Application 以及基本的 XML 配置等等。<br>
這些類別在後續的開發中可能會被多次使用，<br>
因此我們先完成這些基礎建設的工作。<br>

2-a.這次決定使用 Jetpack ViewModel 和 Dagger2。<br>
開發 DI 資料夾主要針對 Application 做 component，<br>
裡面是其他模組可以使用的一些共用方法，<br>
例如提供 Application / Context 或提供新的共用方法等等。<br>
<br>

2-b.在開始建構 HTTP 模組前，<br>
我已經想好要使用哪些 Library，<br>
包括 OkHttp、Retrofit 和 RxJava。<br>
接著我開始建構 HTTP 模組，<br>
實作了 Retrofit client，<br>
主要是為了提供 Retrofit 實例，像這樣：<br>
<script src="https://gist.github.com/waitzShigoto/442337c7fa413741c5e15451827e2c74.js"></script>
<br>
之後就裝進HttpModule提供給未來其他頁面的module用<br>
<br>

3.開始建構頁面的component 與 module<br>
前面所需的基本類別都建好後<br>
就可以開始建立新的 module 來實作主要功能<br>
這裡可以搭配寫好的 HttpModule，只需要再寫一些對外打 request 的 API 即可。

4.開始建構 viewmodel 與 repository 相關的部分，<br>
思考之後需要哪些資料以及如何更新資料來制訂你的 viewmodel，<br>
再搭配 repository 來執行 http request。<br>

建好上述功能後，<br>
回到module中新增需要提供給di自動注入的類。<br>

5.前面的準備工作都完成後，現在可以開始撰寫畫面了。<br>
使用Navigation Graph配置Activity與Fragment，<br>
並將之前建立的DI類別注入到要執行的Activity或Fragment中，<br>
讓它們可以使用DI的功能。<br>

以上是這次預先思考整個開發流程的思想<br>
到這，<br>
才是真正開始談怎麼寫程式碼！<br>
之前的部分只是我的一些經驗分享和建議，<br>
現在讓我們正式進入主題。
<span id="TLDR"></span>

<div class="c-border-main-title-2">實作開始</div>

<div class="c-border-content-title-4">建一些基本類</div><br>
像BaseApplicaiont , Constants , BaseActivity..等等<br>
用意是設計一些通用的程式碼<br>
一些常用需要init的東西寫在這<br>
也能讓你主要那個applicaion / BaseActivity 類看起來程式碼更少 更好讀 或之後少寫code<br>
<br>
<div align="center">
  <img src="/images/paging/base_directory.png" width="35%"/>
  &ensp;
  <img src="/images/paging/base_application.png" width="30%"/>
</div>
<br>

<div class="c-border-content-title-4">主要架構</div>
#### a.先開發application相關di的component與module<br>
先把基本的di module建出來<br>

<script src="https://gist.github.com/waitzShigoto/eb5864c365e4e4b184b3084deb41d060.js"></script>
<br>
component建出來 :<br>
<script src="https://gist.github.com/waitzShigoto/a6ddb1250a9d8df5ab18488f35df38ad.js"></script>
<br>


#### b. 開發http請求用的module
再開發http的連線模組<br>
因為想到後面app可能是以http連線為主<br>
所以先架http module<br>
http module長這樣：

<script src="https://gist.github.com/waitzShigoto/6d73385fd8aca0b3ee372100c1a2e1b0.js"></script>


RetrofitClient是我自行封裝的類，br>
返回一個Retrofit<br>
中間透過builder 與自製okhttp builder<br>
去建製這個Retrofit實例<br>
<br>
因後續會用到Rxjava的Observable<br>
所以在建置的時候先加入<br>
RxJava2CallAdapterFactory<br>
```Kotlin
.addCallAdapterFactory(RxJava2CallAdapterFactory.create())
```
讓retrofit能支持Rxjava<br>
<script src="https://gist.github.com/waitzShigoto/442337c7fa413741c5e15451827e2c74.js"></script>


<br>


<div class="c-border-content-title-4">開發功能</div>

#### c-1.建立 Retrofit 用的 API interface<br>

<script src="https://gist.github.com/waitzShigoto/a63ac4066bfed42d4bd909ed644e23c9.js"></script>

#### c-2.建立 Reposity 到時候實際呼叫api的地方<br>

<script src="https://gist.github.com/waitzShigoto/ea939951bca958c6c983a1bb8bd226a2.js"></script>

#### c-3.建立 viewmodel 並預想到時候有哪些資料要觀察變化的<br>

以本例來看的話<br>
就是以下需要觀察資料變化<br>
1.ui顯示狀態   <br>
2.paging時要顯示的list資料<br>

<script src="https://gist.github.com/waitzShigoto/3a8b6ec9c0ce4ca6bfd3c5c7d2653748.js"></script>

#### c-4.建立module<br>

<script src="https://gist.github.com/waitzShigoto/f27a22b68b240cc95bc05bb3d2af19be.js"></script>

這邊的@Provides | @Moduel | @Inject 是DI需加的一些Annotations<br>
所以根據不同情況或地方 需加入相關Annotations<br>

#### c-5.加入http module<br>
前面寫的http module 派上用場了<br>
在你要調用的module前面加入下方code<br>
```Kotlin
@Module(includes = [HttpModule::class])
```

#### c-6.建立顯示畫面的fragment<br>
開始建立fragment並注入viewmodel<br>
<script src="https://gist.github.com/waitzShigoto/b131256f8612877c48eba6c05c58e4b6.js"></script>

#### c-7.建立欲使用的module<br>

這裡是一個建立 Dagger Component 的步驟<br>
1.寫一個component<br>
2.如果需要使用到 context，則可以導入之前建立的 app component<br>
3.加入欲使用的 module<br>
<script src="https://gist.github.com/waitzShigoto/63c03346e0d17b76019d9308051904b6.js"></script>
<br>

#### c-8. 刻app的view<br>

剩下就是要開始去刻app的view與分頁功能了<br>

我這邊則是用android官方paging去做分頁<br>
用recycler view 搭配 paging library<br>

首先寫一個class PagedListAdapter<br>
接著建立 getItemViewType、onBindViewHolder、onCreateViewHolder：<br>
<script src="https://gist.github.com/waitzShigoto/680faa718048a164879e9926c84d16b6.js"></script>
建立DiffUtil.ItemCallback 用來判斷新的資料與舊的資料差異<br>
不同的話就會更新<br>

再來建立 pageing會用到的DataSource.Factory<br>
<script src="https://gist.github.com/waitzShigoto/27a1befa148117fa009005bd8fae312e.js"></script>
這段是關於PageKeyedDataSource的使用，<br>
該類別內有三個override method，<br>
裡面有 loadInitial、loadAfter、loadBefore等override method<br>
可以分別代表初始化時、讀到資料前、後<br>

透過自定義資料加入pagelist內，<br>
你可以在這幾個method內實現你的業務邏輯，<br>
例如在初始化時去執行http request。<br>

例如製作一個onResult callback interface<br>
當實際遇到loadAfter時再call此方法<br>
來把資料傳回呼叫點<br>
```kotlin
callback.onResult(listSearchUser, initPage, nextKey)
```

當然這邊的方法怎麼寫<br>
可以根據各自情況調整<br>
出來的結果也可能不同<br>

這是我的範例：<br>
<script src="https://gist.github.com/waitzShigoto/95e205701044eb49b16031c4f771df71.js"></script>
