---
layout: post
title: "[Android][Kotlin][2021]Android實作-mvvm+di+Rx做出流暢自動加載分頁！"
date: 2021-12-23 13:06:12 +0800
image: cover/kotlin-mvvm+rxjava+retrofit+okHttp+dagger.png
tags: [Android,Kotlin,MVVM,dagger,http,di]
categories: Demo
---

最近
因緣際會下要寫一個
涵蓋以下內容的demo
 1. mvvm架構
 2. 使用RxJava控制耗時的網路請求
 3. dependency injection
 4. 使用paging來呈現recycler view 分頁
 5. 資料串接github api


最後實際出來的畫面長這樣：

<div align="center">
  <img src="/mov/paging/mvvm-paging-dagger2.gif" width="30%"/>
</div>

這邊使用的是github的 @query search user api

```shell
curl \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/search/users
```

在搜尋欄位輸入搜尋文字
再物件化變數
打api

# ---Preview  (TL;DR)---

首先 開始必需規劃架構<br>
這邊使用的是mvvm為主<br>
心中會先有大概的圖譜<br>
但不會一開始就全部用出來<br>
會先一層一層架<br>
但這邊是我的開發心得<br>


[TL;DR!!!! 想看程式碼的可以跳過](#TLDR)


<div align="center">
  <img src="/images/paging/project-struct.png" width="30%"/>
</div>

<br>

以我的demo為例 (請參考上圖程式碼結構)<br>
我的開發步驟：<br>
1.先做基本可能會共用的類先做(base資料夾/ android application / 基本的xml配置...等等)<br>

2-a.想好架構並基礎建設<br>
例如：因為想好會用到jetpack viewmodel跟 dagger2<br>
所以開發di的那個資料夾主要是針對application做的component & <br>
裡面主要可能是之後有可能其他module可以用到的<br><br>
-> 像是提供application / context<br>
或是之後要提供新的共用method可以在這建構<br>
<br>
2-b.因為事前想到會用http連線<br>
想好我要用的library <br>
如 OkHttp + Retrofit + RxJava<br>
開始建構http 模組<br>
實作了Retrofit client<br>
主要做了個method去提供Retrofit實例<br>
如下<br>
<script src="https://gist.github.com/KuanChunChen/442337c7fa413741c5e15451827e2c74.js"></script>
<br>
之後就裝進HttpModule提供給未來其他頁面的module用<br>
<br>

3.開始建構頁面的component 與 module<br>
前面基礎建設都架好後<br>
就開始建立新的module<br>
來實作主要功能<br>
搭上前面寫好的HttpModule<br>
這裡只需要再寫對外打request的api就行<br>

4.開始建構viewmodel與reposity相關<br>
思考之後會想要什麼資料跟怎樣改<br>
來制訂你的viewmodel<br>
並搭配reposity來執行http request<br>

這裡建好之後<br>
就可以回來module去新增要提供給di自動注入的類<br>

5.前面準備就緒<br>
就能開始寫畫面了<br>
用navigation graph配置 activity 與 fragment<br>
先把之前寫的di的類別注入進要執行的activity或fragment<br>

這邊我習慣會先測通<br>
每個類或注入類是否正確依照你的想法 或 專案需求 執行<br>
才開始刻畫面<br>
因為經驗上開發app時<br>
可能會遇到許多因素<br>
如臨時要改某需求<br>
畫面要改<br>
功能要改等等<br>

所以我會習慣先模組化主要的類<br>
等差不多的時候<br>
才開始寫或刻畫面<br>
降低之後變動成本<br>
也讓程式碼更靈活<br>
如果有什麼原本自己沒想透的<br>
如果後來發現<br>
要改也能很快改<br>
變相效率化自己的工作<br>
<br><br><br><br>


<span id="TLDR"></span>
# ---實作開始---
<br>
到這裡才要開始<br>
正式講怎麼寫程式碼的<br>
前面太多算是自己的心得<br>
抱歉讓大家看了那麼多才開始說<br>

<br><br><br>
### 前置作業

建設一些基本類<br>
BaseApplicaiont , Constants , BaseActivity..等等<br>
用意是設計一些基本可能通用的程式碼<br>
之後如果要針對同app設計不用applicaion 也可以用<br>
一些常用需要init的東西寫在這<br>
也能讓你主要那個applicaion / BaseActivity 類看起來程式碼更少 更好讀<br>
<br>
<div align="center">
  <img src="/images/paging/base_directory.png" width="35%"/>
  &ensp;
  <img src="/images/paging/base_application.png" width="30%"/>
</div>
<br>


## 開發主要架構

想好要用的library以及架構<br>
根據這些library設計架構<br>

#### a.先架application相關di的component與module<br>
因為本篇要用到di<br>
所以想要先把基本的di module建出來<br>

<script src="https://gist.github.com/KuanChunChen/eb5864c365e4e4b184b3084deb41d060.js"></script>
<br>
component :<br>
<script src="https://gist.github.com/KuanChunChen/a6ddb1250a9d8df5ab18488f35df38ad.js"></script>
<br>


#### b. 開發http請求用的module
再開發http的連線模組<br>
因為想到後面app可能是以http連線為主<br>
所以先架http module<br>
如果後續使用<br>
能夠方法讓<br>
其他module去相依<br>
http module長這樣：

<script src="https://gist.github.com/KuanChunChen/6d73385fd8aca0b3ee372100c1a2e1b0.js"></script>


RetrofitClient是我自行封裝的類:<br>

<script src="https://gist.github.com/KuanChunChen/442337c7fa413741c5e15451827e2c74.js"></script>

<br>

返回一個Retrofit<br>
中間透過builder 與自製okhttp builder<br>
去建製這個Retrofit實例<br>
<br>
因後續會用到Rxjava的Observable<br>
所以在建置的時候先加入<br>
RxJava2CallAdapterFactory<br>
讓retrofit能支持Rxjava<br>

```Kotlin
.addCallAdapterFactory(RxJava2CallAdapterFactory.create())
```
<br>


## 接著就能接續開發各種主功能

#### c-1.建立 Retrofit 用的 API interface<br>

<script src="https://gist.github.com/KuanChunChen/a63ac4066bfed42d4bd909ed644e23c9.js"></script>

#### c-2.建立 Reposity 到時候實際呼叫api的地方<br>

<script src="https://gist.github.com/KuanChunChen/ea939951bca958c6c983a1bb8bd226a2.js"></script>

#### c-3.建立 viewmodel 並預想到時候有哪些資料要觀察變化的<br>

以本文為例的話<br>
就是<br>
1. ui顯示狀態   <br>
2. paging時要顯示的list資料<br>

<script src="https://gist.github.com/KuanChunChen/3a8b6ec9c0ce4ca6bfd3c5c7d2653748.js"></script>

#### c-4.回來建立module<br>

<script src="https://gist.github.com/KuanChunChen/f27a22b68b240cc95bc05bb3d2af19be.js"></script>

這邊就是前面三個寫的實例<br>
你不用dagger的話<br>
就不用加 @Provides | @Moduel | @Inject 等等<br>
但這邊因使用dagger來自動注入<br>
所以之後使用上<br>
就變成不用自己實例化各物件<br>
相當方便<br>

終於<br>
前面寫的http module 派上用場了<br>
在你要調用的module前面加入下方code<br>
```Kotlin
@Module(includes = [HttpModule::class])
```
<br>


開始建立fragment並注入viewmodel<br>

<script src="https://gist.github.com/KuanChunChen/b131256f8612877c48eba6c05c58e4b6.js"></script>

但是要有DaggerComponent<br>
你必須要建立該Component<br>

寫一個component<br>
如果要有使用到context時<br>
則能導入之前麼app component<br>
再來一樣是加入自己的module<br>
<script src="https://gist.github.com/KuanChunChen/63c03346e0d17b76019d9308051904b6.js"></script>
<br>
主要比較耗時的就這樣完成了<br>
剩下就是要開始去刻app的view與分頁功能了<br>

我這邊則是用android官方paging去做分頁<br>
用recycler view 搭配 paging library<br>

首先建立PagedListAdapter<br>

<script src="https://gist.github.com/KuanChunChen/680faa718048a164879e9926c84d16b6.js"></script><br>

如果使用過ListAdapter的話<br>
這個用起來<br>
寫法跟它基本無異<br>


建立DiffUtil.ItemCallback 用來判斷新的資料與舊的資料差異<br>
不同的話就會更新<br>

接著 getItemViewType、onBindViewHolder、onCreateViewHolder<br>
基本與以前用的差異不大<br>

接著 建立 pageing會用到的DataSource.Factory<br>
<script src="https://gist.github.com/KuanChunChen/27a1befa148117fa009005bd8fae312e.js"></script><br>

這段DataSource<br>
將自定義資料加入pagelist內<br>
這個是到時候會用到PageKeyedDataSource<br>
裡面有 loadInitial、loadAfter、loadBefore等override method<br>
可以繼承分別代表初始化時、初始化往後滑、初始化往前滑要執行的程式碼<br>

到時候你可以在這幾個method內<br>
寫你要做的事情<br>
像是第一次load時<br>
去執行http request<br>

之後如果請求成功
然後在你的code裡面打<br>
```kotlin
callback.onResult(listSearchUser, initPage, nextKey)
```

就表示告訴PageKeyedDataSource成功有值回來<br>
如果值是預期內的<br>
就可以在下次滑到你設定的預讀位置數時<br>
會自動讀取新的分頁資料<br>
相反則不會讀新的資料<br>

當然這邊的每個方法內怎麼寫<br>
可以根據情況去調整<br>
出來的結果也可能不同<br>

這是我的範例：<br>
<script src="https://gist.github.com/KuanChunChen/95e205701044eb49b16031c4f771df71.js"></script>
