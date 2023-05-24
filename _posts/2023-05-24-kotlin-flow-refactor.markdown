---
layout: post
title: "使用 Kotlin Flow 重構網路連線請求，取代 RxJava 或 Retrofit callback"
date: 2023-05-24 15:56:16 +0800
image: cover/navigation_with_kotlin-1.png
tags: [Kotlin,Android]
permalink: /kotlin_flow_refactor
categories: Kotlin
excerpt: "本次文章旨在修改和重構現有的 網路請求 程式碼，並使用 Kotlin Flow 取代原本的 Retrofit 回調函式(callback) 或是RxJava"
---


<div class="c-border-main-title-2">前言</div>
<div class="c-border-content-title-4">
    Kotlin提供了一個強大的工具Flow
</div>

<p>
    Kotlin Flow 是一個基於協程的異步編程庫，<br>
    它提供了一種響應式的方式來處理資料流，<br>
    並能與異步操作無縫集成。<br><br>

    將 Kotlin Flow 應用於網路請求，<br>
    我們可以以一種優雅而簡潔的方式處理異步任務，<br>
    並使程式碼更具可讀性和可維護性。<br><br>

    <div class="c-border-content-title-4">
        幾年前，我也曾經分享過RxJava的版本，如果有興趣可以再回頭看一下
    </div>

    <div class="card-columns">
      <div class="card border-0">
        <div class="position-relative text-white">

          <div class="card-img-overlay three" style="background: url(/images/cover/navigation_with_kotlin-1.png) !important;"><span class="badge badge-light text-uppercase">review</span></div>

          <div class="card-smooth-caption">
            <div class="d-flex justify-content-between align-items-center">
              <div class="mr-auto">
                <h5 class="card-title text-white">Android</h5>
                <h6 class="card-subtitle text-white"> RxJava搭配網路請求：實現Token重取與重新執行網路請求</h6>
              </div>
            </div>
          </div>
        </div>

        <div class="card-body">
          <p class="card-text">
            本文將介紹如何使用 RxJava 實現 Token 的重取並重新執行網路請求的方法，這將有助於提升應用程式的使用體驗
          </p>
        </div>

        <div class="card-footer">
          <div class="media align-items-center">
            <div class="media-body"><a class="card-link text-primary read-more" href="{{site.baseurl}}/android-kt-rxjava">Read More</a></div>
          </div>
        </div>

      </div>
    </div>

</p>

<div class="c-border-main-title-2">Kotlin flow實際使用</div>
<div class="c-border-content-title-4">
    在實際呼叫 Flow 並進行收集（collect）時，需要在 Coroutine Scope 中加入它，如下所示：<br>
</div>
<p>
  <script src="https://gist.github.com/KuanChunChen/6922457ce9a309d18258b1ac50ed77a6.js"></script>
</p>
<div class = "table_container">
  <p>程式碼解說</p>
  在上述程式碼中，我們使用 Coroutine Scope 的 lifecycleScope 來操作我們的flow。<br>
  透過我們寫好的api來獲取一個flow 並進行collect<br>
  中途我們也加入checkStatusAndRefreshToken 去檢查 token過期與否<br>
  若成立時會自動刷新跟重發請求<br><br>
  接著，我們使用 catch 函式來捕捉可能發生的異常，<br>
  並在異常處理中執行相應的操作<br>
  若前述步驟接成功則可在<br>
  <b>collect</b> 中取得返回值，<br>
  並進行我們的邏輯處理。<br>
</div><br>


<div class="c-border-main-title-2">Kotlin flow 實際開發</div>
<div class="c-border-content-title-4">使用Kotlin flow 取代原本的retrofit call 的callback或RxJava操作符，程式碼如下</div>
<p>
  <script src="https://gist.github.com/KuanChunChen/d5a3acb5f2b90bee2cd8b60c54adfcab.js"></script>
</p>

<div class = "table_container">
  <p>程式碼解說</p>
  在上面的程式碼中，<br>
  我們定義了一個 startLogin() 函式，它返回一個 Flow，其中包含目標資料。<br>
  接著新增一個 request body，<br>
  並執行 login API 請求。<br><br>


  在這裡，我們使用 verifyResponse 函式來判斷執行的 API 請求返回值是否符合預期<br>
  <b>（下方會解釋 verifyResponse 的程式碼）。</b><br>
  確認沒問題後，我們使用 emit 將結果發射到 Flow 中。<br><br>

  <b>請注意</b><br>
  我們將這個 Flow 的執行緒切換至 IO 執行緒 （.flowOn(Dispatchers.IO)），<br>
  以確保網路請求在非主執行緒中執行。
</div><br>

<div class="c-border-content-title-4">新增一個verifyResponse 檢查api請求是否如預期</div>
<p>
  <script src="https://gist.github.com/KuanChunChen/4a4daf5c3385a105b92cc642f9c505f5.js"></script>
</p>

<div class = "table_container">
  <p>程式碼解說</p>
  在上面的程式碼中，<br>
  使用泛型 T 來讓函式能夠符合多種 API 返回結果的情況。<br><br>

  首先判斷 API 請求的 HTTP 狀態碼是否介於 200 到 300 之間。<br>
  接著，我們檢查伺服器返回的回應內容是否為空。<br>
  如果以上條件成立，<br>
  則拋出相應的例外異常。<br>
</div><br>


<div class="c-border-content-title-4">新增一個checkStatusAndRefreshToken 當api請求token過期會自動refresh token並重新請求原api</div>
<p>
  <script src="https://gist.github.com/KuanChunChen/e6e0cc122d03f964c1abafda32cd5b02.js"></script>
</p>

<div class = "table_container">
  <p>程式碼解說</p>
  在上面的程式碼中，<br>
  使用extension，<br>
  並定義為Flow&lt;BaseResult&lt;T&gt;&gt;<br><br>

  主要是拿取得api請求的response來做check<br>
  使用泛型返回結果，以符合多api返回可以共用<br><br>

  帶入function type的變數 tokenRefresh 與apiCall，<br>
  分別用來指定重新呼叫取得token 與重叫的目標api接口<br>
  上面程式碼中也做了當條件符合自定義的error code時，則會發emit<br>
</div><br>



<div class="c-border-main-title-2">結論</div>

<div class = "table_container">
  <p>總結</p>
  透過使用 Kotlin Flow 來重構網路請求取代 RxJava 或 Retrofit callback，<br>
  我們可以獲得更強大且彈性的異步編程能力。<br>
  使用 Kotlin Flow 可以使程式碼更具可讀性和可維護性，<br>
  同時提供了更優雅的方式來處理異步操作。<br><br>

  在改動程式碼的過程中，<br>
  我們使用了 Kotlin Flow 來替換原本的 Retrofit callback，將 API 請求封裝在 Flow 中，<br>
  並透過 emit 發出目標資料。同時，我們新增了 verifyResponse 函式來檢查 API 請求是否符合預期，<br>
  包括檢查 HTTP 狀態碼是否在 200~300 範圍內以及檢查回應的內容是否為空。<br><br>

  另外，<br>
  我們也引入了 checkStatusAndRefreshToken 函式，<br>
  當 API 請求的 token 過期時，它能夠自動刷新 token 並重新發起原始的 API 請求，<br>
  透過這個機制可以確保 API 請求的順利執行。<br><br>

  總括而言，<br>
  使用 Kotlin Flow 可以改善網路請求的程式結構，<br>
  使異步操作更加容易管理和處理。<br>
  可以提升程式碼的可讀性、可維護性和可擴展性，同時也帶來了更好的異步編程體驗。<br><br>

  當然可以用的都是好方法<br>
  找到最符合你專案環境的方法並有效率的解決問題也是很重要的！<br>

</div><br>
