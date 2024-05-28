---
layout: post
title: Android 用Jektpack Compose 來開發app【02】 - DI注入篇
date: 2024-05-27 15:27:05 +0800
image: cover/
tags: [Android,Kotlin]
permalink: /android-jetpack-compose-structure-part2
categories: JetpackCompose
excerpt: ""
---

<div class="c-border-content-title-4">前言</div>
* 這是這個系列的第二篇<br>
接入上集<br>
主要是開發一些初期建構專案的基本建設<br>
為了之後開發<br>
我會考慮開始接入DI注入<br>
這次我採用的是Hilt<br>

<div class="c-border-content-title-1">專案建置</div>
* 使用的library如下：
{% include table/compose-use.html %}

{% include table/compose-category.html %}

<div class="c-border-content-title-4">導入DI注入 - Hilt</div>
<div class="c-border-content-title-1">step1. 導入Hilt & KSP</div>
* 為了使用Hilt 所以需要配置以下的toml<br>
主要是hilt library跟 導入hilt會用到ksp<br>
<script src="https://gist.github.com/KuanChunChen/a529e6aef2c4cb054a593689b86ab962.js"></script>

* 在build.gradle.kts(:app)中 加入plugin
<script src="https://gist.github.com/KuanChunChen/ca4d1179d072db1f781831ce3ae367a6.js"></script>

* 在build.gradle.kts(:yourAppName)中導入：
<script src="https://gist.github.com/KuanChunChen/0cecaed97e600ccd7069722e2cc62c42.js"></script>

* 在build.gradle.kts(:app)中導入：
<script src="https://gist.github.com/KuanChunChen/a40eb48d1b2a7f6e4e59041fa4cff3b5.js"></script>

<div class="c-border-content-title-1">step2. 實作Hilt application</div>
* 官方文件有提到<br>
加入Hilt一定要包含	`@HiltAndroidApp`<br>
所以實作一個Application<br>
<script src="https://gist.github.com/KuanChunChen/648bd2e1d642c5ea108af87e7700a7de.js"></script>

實測若沒加，會報錯如下：<br>
`Caused by: java.lang.IllegalStateException: Hilt Activity must be attached to an @HiltAndroidApp Application. Did you forget to specify your Application's class name in your manifest's application 's android:name attribute?`

<div class="c-border-content-title-1">step3. 可以開始注入class了</div>
* 當上面配置好之後<br>
hilt會在class頭有加入`@AndroidEntryPoint`的地方提供inject的功能<br>

* 那就來試試吧做一個使用Hilt的Viewmodel
<script src="https://gist.github.com/KuanChunChen/c76e7ce4bc7743832372ae66ae651f03.js"></script>

實際使用：
<script src="https://gist.github.com/KuanChunChen/412d3db62610456139c5231632f5d2dd.js"></script>

<div class="c-border-content-title-1">加入module</div>
* DI可以加入module來提供需要的class<br>
並透過DI幫你產生instance<br>
像是下面這個例子<br>
主要是拿來做網路請求相關的module<br>
`provideKotlinxJsonConverter`這個就是拿來提供一個解析Json格式的converter<br>
`provideCustomConverter`是拿來提供定義http request的response格式<br>
`provideBaseRetrofitBuilder`是拿來提供Retrofit的instance<br>
<script src="https://gist.github.com/KuanChunChen/1127653dde42bc2bca111e274a7ba521.js"></script>

上面的source code都會看到有一行`@Named("xxx")`<br>
這個是用來標示這個instance的名字是哪個<br>
假設今天你的專案剛好有多個不同的配置要產生<br>
可以在function最上面加入@Named("yourName") <br>
則可以讓Hilt在編譯的時候判斷你要注入的是哪個instance<br>
不管是公司內部Backend提供的Api或是外部第三方服務提供的api<br>
可能會遇到不同response情況的API<br>
所以就可以透過這種形式幫你產生instance<br> <br>

沒加@Named也可以build<br>
不過Hilt就是找到唯一有的那個幫你注入<br>

實際使用：<br>
<script src="https://gist.github.com/KuanChunChen/a1b8b91295e8016cabc733463f6db0c9.js"></script>
* 使用DI注入後面就可以不用自己主動去初始化取得class的instance<br>
透過DI幫你處理，若使用的不錯<br>
也會讓code看起來更簡潔、更易讀<br>
像是上面這個例子我定義了`kotlinx.serializer`用來解析固定的Json to class<br>
`old-custom`環境中有舊的服務端留下來的內容<br> 
所以我用舊版定義的格式去解他<br>
`un-auth`定義一個OkHttpClient其中只在Debug環境中加入HttpLoggingInterceptor來解析log<br> <br>
最終在 `provideFeedbackUcService`提供的API Service則有我上面提到的這些特性<br>

* 透過這個例子了解到<br>
不管服務端再怎麼變化 <br><br>
我們透過上面這種方法就能輕鬆<br>
把想要的最後形狀組出來<br><br>
寫好之後<br>
也能避免寫很多重複的代碼<br>
例如：網路請求<br>
如果服務端提供的規格都一樣<br>
那只需要專注於開發API service就可以
<script src="https://gist.github.com/KuanChunChen/9fa177e6b7043a59f5d3841ee11fe2a4.js"></script>

* 最後 當你需要取用這些instance只要直接在construct那邊inject 就可以用了
<script src="https://gist.github.com/KuanChunChen/dae78780c5be26f1cba9b780f0c9f23c.js"></script>

