---
layout: post
title: Android 用Jektpack Compose 來開発app【02】 - DI注入篇
date: 2024-05-27 15:27:05 +0800
image: cover/android-jetpack-compose-structure-part2.png
tags: [Android,Kotlin]
permalink: /android-jetpack-compose-structure-part2
categories: JetpackCompose
excerpt: ""
---

<div class="c-border-content-title-4">前言</div>
* これはこのシリーズの第二篇<br>
前回の続き<br>
主に初期構築プロジェクトの基本的な建設<br>
その後の開発のために<br>
DI注入を導入し始めることを考えています<br>
今回はHiltを採用します<br>

<div class="c-border-content-title-1">プロジェクト構築</div>
* 使用するライブラリは以下の通り：
<div id="category">
    {% include table/compose-use.html %}
    {% include table/compose-category.html %}
</div>

<div class="c-border-content-title-4">DI注入の導入 - Hilt</div>
<div class="c-border-content-title-1">step1. Hilt & KSPの導入</div>
* Hiltを使用するためには以下のtomlを設定する必要があります<br>
主にhiltライブラリと、hiltを導入するためにkspを使用します<br>
<script src="https://gist.github.com/KuanChunChen/a529e6aef2c4cb054a593689b86ab962.js"></script>

* build.gradle.kts(:app)にプラグインを追加
<script src="https://gist.github.com/KuanChunChen/ca4d1179d072db1f781831ce3ae367a6.js"></script>

* build.gradle.kts(:yourAppName)に導入：
<script src="https://gist.github.com/KuanChunChen/0cecaed97e600ccd7069722e2cc62c42.js"></script>

* build.gradle.kts(:app)に導入：
<script src="https://gist.github.com/KuanChunChen/a40eb48d1b2a7f6e4e59041fa4cff3b5.js"></script>

<div class="c-border-content-title-1">step2. Hiltアプリケーションの実装</div>
* 公式ドキュメントに記載されています<br>
Hiltを導入するには必ず`@HiltAndroidApp`を含める必要があります<br>
そのため、Applicationを実装します<br>
<script src="https://gist.github.com/KuanChunChen/648bd2e1d642c5ea108af87e7700a7de.js"></script>

実際に追加しないと、以下のエラーが発生します：<br>
`Caused by: java.lang.IllegalStateException: Hilt Activity must be attached to an @HiltAndroidApp Application. Did you forget to specify your Application's class name in your manifest's application 's android:name attribute?`

<div class="c-border-content-title-1">step3. クラスの注入を開始できます</div>
* 上記の設定が完了したら<br>
hiltはクラスの先頭に`@AndroidEntryPoint`を追加した場所でinject機能を提供します<br>

* それでは、Hiltを使用したViewmodelを試してみましょう
<script src="https://gist.github.com/KuanChunChen/c76e7ce4bc7743832372ae66ae651f03.js"></script>

実際の使用例：
<script src="https://gist.github.com/KuanChunChen/412d3db62610456139c5231632f5d2dd.js"></script>

<div class="c-border-content-title-1">モジュールの追加</div>
* DIは必要なクラスを提供するためにモジュールを追加できます<br>
DIを通じてインスタンスを生成してくれます<br>
以下の例のように<br>
主にネットワークリクエスト関連のモジュールとして使用されます<br>
`provideKotlinxJsonConverter`はJson形式を解析するコンバータを提供します<br>
`provideCustomConverter`はHTTPリクエストのレスポンス形式を定義するためのものです<br>
`provideBaseRetrofitBuilder`はRetrofitのインスタンスを提供します<br>
<script src="https://gist.github.com/KuanChunChen/1127653dde42bc2bca111e274a7ba521.js"></script>

上記のソースコードには`@Named("xxx")`という行があります<br>
これはインスタンスの名前を示すためのものです<br>
例えば、プロジェクトに複数の異なる設定が必要な場合<br>
関数の最上部に@Named("yourName")を追加することで<br>
Hiltがコンパイル時にどのインスタンスを注入するかを判断できます<br>
社内のバックエンドが提供するAPIや外部の第三者サービスが提供するAPIなど<br>
異なるレスポンス状況のAPIに遭遇する可能性があります<br>
このような形式でインスタンスを生成することができます<br> <br>

@Namedを追加しなくてもビルドは可能です<br>
ただし、Hiltは唯一のインスタンスを見つけて注入します<br>

実際の使用例：<br>
<script src="https://gist.github.com/KuanChunChen/a1b8b91295e8016cabc733463f6db0c9.js"></script>
* DIを使用して注入すると、自分でクラスのインスタンスを初期化する必要がなくなります<br>
DIを通じて処理され、うまく使用すれば<br>
コードがよりシンプルで読みやすくなります<br>
上記の例では、`kotlinx.serializer`を定義して固定のJsonをクラスに解析します<br>
`old-custom`環境には旧サーバーからの内容が残っています<br> 
そのため、旧版の定義された形式で解析します<br>
`un-auth`はOkHttpClientを定義し、Debug環境でのみHttpLoggingInterceptorを追加してログを解析します<br> <br>
最終的に `provideFeedbackUcService`が提供するAPIサービスには、上記の特性が含まれています<br>

* この例を通じて理解できることは<br>
サーバーがどのように変化しても <br><br>
上記の方法を使用することで簡単に<br>
望む最終形を組み立てることができます<br><br>
一度書いてしまえば<br>
多くの重複したコードを書くことを避けることができます<br>
例えば、ネットワークリクエスト<br>
サーバーが提供する仕様が同じであれば<br>
APIサービスの開発に集中するだけで済みます
<script src="https://gist.github.com/KuanChunChen/9fa177e6b7043a59f5d3841ee11fe2a4.js"></script>

* 最後に、これらのインスタンスを使用する必要がある場合は、コンストラクトで直接注入するだけで使用できます
<script src="https://gist.github.com/KuanChunChen/dae78780c5be26f1cba9b780f0c9f23c.js"></script>

<a class="link" href="#category" data-scroll>目次に戻る</a>
