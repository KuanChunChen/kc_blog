---
layout: post
title: "流暢な自動ページングを実現するGithub APIデモの作成：MVVM、DI、RxJava、Pagingを用いたAndroid Kotlinの実践ガイド"
date: 2021-12-23 13:06:12 +0800
image: cover/kotlin-mvvm+rxjava+retrofit+okHttp+dagger.png
tags: [Android]
categories: Android實作
excerpt: "このチュートリアルでは、MVVM、DI、RxJava、Pagingといった技術を使用して、Android KotlinでGithub APIデモを作成する方法を探ります。このデモを通じて、スムーズな自動ページングアプリケーションの構築方法を学び、Kotlinでこれらの重要な技術を使用する方法を理解できます。"
---

<div class="c-border-main-title-2">前書き</div>

今日は以下のアーキテクチャを使用して、<br>
Github APIを接続し、スムーズな自動ページングの例を実装する方法を共有します。<br>
 1.mvvmアーキテクチャを通じて<br>
 2.RxJavaでネットワークリクエストを制御<br>
 3.依存性注入<br>
 4.pagingを使用してrecycler viewのページングを表示<br>
 5.Github APIとのデータ接続<br>

<div class="c-border-content-title-4">最終的な画面はこのようになります：</div><br>
<div align="center">
  <img src="/mov/paging/mvvm-paging-dagger2.gif" width="30%"/>
</div>

<div class="c-border-content-title-4">使用するAPIはGithubが提供する/search/usersです</div><br>

```shell
curl \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/search/users
```

<div class="c-border-content-title-4">実現する機能は</div><br>
検索フィールドに検索文字を入力し、<br>
作成したdata classを通じてAPIを呼び出し、<br>
指定された数の結果を表示します。

<div class="c-border-main-title-2">前期アーキテクチャの考え方(TL;DR)</div>

まず、アーキテクチャを計画する必要があります。<br>
ここでは主にmvvmを使用します。<br>
心の中で大まかな図を持っていますが、<br>
最初からすべてを実装するわけではありません。<br>
一層ずつ構築していきます。<br>
ここに簡略な例を示します：<br>

<div align="start">
  <img src="/images/paging/project-struct.png" width="30%"/>
</div>

<br>

<div class="c-border-content-title-4">開発手順の予想</div><br>

1.まず、基本的な共通クラスを処理します。<br>
例えば、baseフォルダ、Android Application、基本的なXML設定などです。<br>
これらのクラスは後の開発で何度も使用される可能性があるため、<br>
まずこれらの基礎作業を完了させます。<br>

2-a.今回はJetpack ViewModelとDagger2を使用することにしました。<br>
DIフォルダを開発し、主にApplicationのコンポーネントを作成します。<br>
ここには他のモジュールが使用できる共通メソッドが含まれています。<br>
例えば、Application / Contextの提供や新しい共通メソッドの提供などです。<br>
<br>

2-b.HTTPモジュールの構築を開始する前に、<br>
使用するライブラリを決定しました。<br>
OkHttp、Retrofit、RxJavaを含みます。<br>
次にHTTPモジュールを構築し、<br>
Retrofitクライアントを実装しました。<br>
これはRetrofitインスタンスを提供するためのものです。以下のように：<br>
<script src="https://gist.github.com/waitzShigoto/442337c7fa413741c5e15451827e2c74.js"></script>
<br>
その後、HttpModuleに組み込み、将来の他のページのモジュールで使用できるようにします。<br>
<br>

3.ページのコンポーネントとモジュールの構築を開始します。<br>
必要な基本クラスがすべて揃ったら、<br>
新しいモジュールを作成して主要な機能を実装します。<br>
ここでは、作成したHttpModuleを使用し、外部リクエストのAPIをいくつか追加するだけで済みます。

4.開始建構 viewmodel と repository に関連する部分を構築します。<br>
必要なデータとその更新方法を考え、viewmodel を設計します。<br>
次に、repository を使用して HTTP リクエストを実行します。<br>

上記の機能を構築した後、<br>
モジュールに戻り、DI 自動注入のために必要なクラスを追加します。<br>

5.前準備が完了したら、画面の作成を開始します。<br>
Navigation Graph を使用して Activity と Fragment を設定し、<br>
前に作成した DI クラスを実行する Activity または Fragment に注入します。<br>
これにより、DI の機能を使用できるようになります。<br>

以上が今回の開発プロセス全体を事前に考えるためのアイデアです。<br>
ここからが、<br>
実際にコードを書く話になります！<br>
前の部分は私の経験と提案に過ぎません。<br>
それでは、本題に入りましょう。
<span id="TLDR"></span>

<div class="c-border-main-title-2">実装開始</div>

<div class="c-border-content-title-4">基本的なクラスを作成</div><br>
BaseApplication、Constants、BaseActivity など<br>
共通のコードを設計するためのものです。<br>
よく使う初期化が必要なものをここに書きます。<br>
これにより、メインの Application / BaseActivity クラスのコードが少なくなり、読みやすくなります。<br>
また、後でコードを書く手間も省けます。<br>
<br>
<div align="center">
  <img src="/images/paging/base_directory.png" width="35%"/>
  &ensp;
  <img src="/images/paging/base_application.png" width="30%"/>
</div>
<br>

<div class="c-border-content-title-4">主要な構造</div>
#### a.まずは application 関連の DI コンポーネントとモジュールを開発<br>
基本的な DI モジュールを作成します。<br>

<script src="https://gist.github.com/waitzShigoto/eb5864c365e4e4b184b3084deb41d060.js"></script>
<br>
コンポーネントを作成します：<br>
<script src="https://gist.github.com/waitzShigoto/a6ddb1250a9d8df5ab18488f35df38ad.js"></script>
<br>

#### b. HTTP リクエスト用のモジュールを開発
次に HTTP 接続モジュールを開発します。<br>
後でアプリが HTTP 接続を主に使用する可能性があるため、<br>
まず HTTP モジュールを構築します。<br>
HTTP モジュールは次のようになります：

<script src="https://gist.github.com/waitzShigoto/6d73385fd8aca0b3ee372100c1a2e1b0.js"></script>

RetrofitClient は私が独自にラップしたクラスで、<br>
Retrofit を返します。<br>
ビルダーと独自の OkHttp ビルダーを介して<br>
この Retrofit インスタンスを構築します。<br>
<br>
後で RxJava の Observable を使用するため、<br>
構築時に RxJava2CallAdapterFactory を追加します。<br>
```Kotlin
.addCallAdapterFactory(RxJava2CallAdapterFactory.create())
```
これにより、Retrofit が RxJava をサポートできるようになります。<br>
<script src="https://gist.github.com/waitzShigoto/442337c7fa413741c5e15451827e2c74.js"></script>

<br>

<div class="c-border-content-title-4">機能開発</div>

#### c-1.Retrofit 用の API インターフェースを作成<br>

<script src="https://gist.github.com/waitzShigoto/a63ac4066bfed42d4bd909ed644e23c9.js"></script>

#### c-2.実際に API を呼び出す Reposity を作成<br>

<script src="https://gist.github.com/waitzShigoto/ea939951bca958c6c983a1bb8bd226a2.js"></script>

#### c-3. viewmodelを作成し、どのデータを観察するかを予測する<br>{/*examples*/}

本例では、以下のデータの変化を観察する必要があります。<br>
1. UI表示状態<br>
2. ページング時に表示するリストデータ<br>

<script src="https://gist.github.com/waitzShigoto/3a8b6ec9c0ce4ca6bfd3c5c7d2653748.js"></script>

#### c-4. moduleを作成する<br>{/*examples*/}

<script src="https://gist.github.com/waitzShigoto/f27a22b68b240cc95bc05bb3d2af19be.js"></script>

ここでの@Provides | @Module | @InjectはDIに必要なアノテーションです。<br>
したがって、状況や場所に応じて関連するアノテーションを追加する必要があります。<br>

#### c-5. http moduleを追加する<br>{/*examples*/}

前に書いたhttp moduleが役に立ちます。<br>
使用するmoduleの前に以下のコードを追加します。<br>
```Kotlin
@Module(includes = [HttpModule::class])
```

#### c-6. 表示画面のfragmentを作成する<br>{/*examples*/}

fragmentを作成し、viewmodelを注入します。<br>
<script src="https://gist.github.com/waitzShigoto/b131256f8612877c48eba6c05c58e4b6.js"></script>

#### c-7. 使用するmoduleを作成する<br>{/*examples*/}

ここではDagger Componentを作成する手順です。<br>
1. componentを書く<br>
2. contextを使用する必要がある場合は、前に作成したapp componentを導入する<br>
3. 使用するmoduleを追加する<br>
<script src="https://gist.github.com/waitzShigoto/63c03346e0d17b76019d9308051904b6.js"></script>
<br>

#### c-8. アプリのviewを作成する<br>{/*examples*/}

残りはアプリのviewとページング機能を作成することです。<br>

ここでは、Android公式のpagingを使用してページングを行います。<br>
recycler viewとpaging libraryを組み合わせて使用します。<br>

まず、PagedListAdapterクラスを作成します。<br>
次に、getItemViewType、onBindViewHolder、onCreateViewHolderを作成します。<br>
<script src="https://gist.github.com/waitzShigoto/680faa718048a164879e9926c84d16b6.js"></script>
DiffUtil.ItemCallbackを作成し、新しいデータと古いデータの違いを判断します。<br>
異なる場合は更新されます。<br>

次に、ページングで使用するDataSource.Factoryを作成します。<br>
<script src="https://gist.github.com/waitzShigoto/27a1befa148117fa009005bd8fae312e.js"></script>
これはPageKeyedDataSourceの使用に関するもので、<br>
このクラスには3つのoverride methodがあります。<br>
loadInitial、loadAfter、loadBeforeなどのoverride methodがあり、<br>
それぞれ初期化時、データを読み込む前、後を表します。<br>

カスタムデータをpagelistに追加することで、<br>
これらのメソッド内でビジネスロジックを実装できます。<br>
例えば、初期化時にhttpリクエストを実行するなどです。<br>

例えば、onResultコールバックインターフェースを作成し、<br>
実際にloadAfterに遭遇したときにこのメソッドを呼び出して、<br>
データを呼び出し元に返すことができます。<br>
```kotlin
callback.onResult(listSearchUser, initPage, nextKey)
```

もちろん、ここでのメソッドの書き方は、<br>
各自の状況に応じて調整できます。<br>
結果も異なる場合があります。<br>

これは私の例です。<br>
<script src="https://gist.github.com/waitzShigoto/95e205701044eb49b16031c4f771df71.js"></script>
