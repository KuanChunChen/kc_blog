---
layout: post
title: "Jetpack Compose：使用 LazyColumn + ViewModel で動的に更新されるリストデータを簡単に実現"
date: 2021-09-28 11:03:41 +0800
image: cover/ea-website-lazy-colume-cover-photo-new-1.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
permalink: /android-kt-jetpack-compose-list
excerpt: "この記事では、Jetpack Compose の LazyColumn と ViewModel を使用して、動的に更新されるリストデータを簡単に実現する方法を紹介します。"
---
<div class="c-border-main-title-2">前書き</div>
過去に ListView -> RecyclerView -> 異なる Adapter を使用してリストビューを作成してきましたが、今では Jetpack Compose を使用して簡単にリストを作成できるようになりました。<br>
実際に実装してみたところ、<br>
このプロセスは非常に簡単でした。<br>
今、私の経験を皆さんと共有したいと思います。<br>
参考にしてください。<br>
主な難点は、ViewModel を Jetpack Compose のコードにどのように接続するかです。<br>

<h2>実装効果：リストと動的データ変更</h2>
<div align="center">
  <img src="/mov/jetpack/ea_list_app.gif" width="50%"/>
</div>

<br>

<div class="c-border-content-title-4">関連知識</div>
* JetpackCompose
* Viewmodel


<div class="c-border-main-title-2">実装</div>
<div class="c-border-content-title-4">第一歩：リストのアイテムを作成する</div>
このステップは、以前の RecyclerView で XML を作成するのと非常に似ています。<br>
まず、各アイテムの見た目を実装します。<br>
前のいくつかの記事で同様の概念について説明しているので、<br>
ここでは詳しく説明しません。<br>
興味がある方は前の記事を参照してください。<br>

<div align="start">
  <a href="{{site.baseurl}}/android-kt-jetpack-compose-base">
    <img src="/images/cover/ea-website-base-cover-photo-new-1.png" alt="Cover" width="40%" >
  </a>
  <a align="right" href="{{site.baseurl}}/android-kt-jetpack-compose-base/">Android Jetpack Compose 基本応用チュートリアル</a><br><br>

  <a href="{{site.baseurl}}/2021/09/17/android-kt-jetpack-compose-splash">
    <img src="/images/cover/ea-website-splash-cover-photo-new-1.png" alt="Cover" width="40%" >
  </a>

  <a align="right" href="{{site.baseurl}}/2021/09/17/android-kt-jetpack-compose-splash/">Jetpack Compose でスプラッシュ画面にアニメーションを追加しよう！</a><br>


</div>

<br>
アイテムの実装例を直接見てみましょう：<br>
<br>

<script src="https://gist.github.com/waitzShigoto/90340f7ddf11897d221d12b87bab4782.js"></script>
<br>
主にアイテムを実装します。<br>
カスタムデータモデル、ナビゲーションガイドなどと組み合わせることができます。<br>
各コンポーネントの配置場所を設定し、<br>
データを適用します。
<br>

<div class="c-border-content-title-4">第二歩：LazyColumn を使用してリストを実現する</div>

次に、LazyColumn を使用して先ほど作成したアイテムを呼び出します。<br>
これでリストを実装できます。<br>
以下のように：
<script src="https://gist.github.com/waitzShigoto/691f335e74c0ba919d159065ce9d70de.js"></script>

<div class="c-border-content-title-4">第三步：ViewModelを追加してデータを変更する</div>
これはこの実装のViewModelです<br>
そしてLiveDataを使ってデータの変化を観察します<br>
<script src="https://gist.github.com/waitzShigoto/3fd3912e5202073418e05e8c5057fac3.js"></script>
<br>
<br>

<div class="c-border-content-title-1">ヒント(hint)</div>

```
常常在code看到用底線_命名變數
例如上面這個例子就是
_devices 與 devices
但卻不懂為何要用這樣同名的變數只加一個底線
或取成不同名字的兩個變數
這是我之前剛開始寫code會有的疑問
後來我終於明白
所以這邊來分享下
```

ここでは_devicesをprivateとして定義します<br>
devicesをpublicとして定義します<br>
`private`変数はクラス内部で操作するために使用します<br>
他の外部クラスがdevicesを操作したい場合はpublic変数を使って呼び出します<br><br>
上記の例のように<br>
_devicesはクラス内部で呼び出すために使用します<br>
通常は内部のビジネスロジックがこの値を変更します<br>
`多くの場所で重複操作を避ける`<br>
または混乱を引き起こすことを避けます<br>
後続のメンテナンスを容易にします<br><br>

ここではLiveDataを使用しています<br>
公開されたpublic変数が外部クラスから観察され使用されることができます 例：devices<br>
公開されたgetter / setter関数を通じて外部から直接変更できます<br>
多くの場所で重複操作を避けることができます<br>
将来的にこの機能を削除または修正する必要がある場合、長時間かかることを避けます<br>

<div class="c-border-content-title-4">第四步：ViewModelをComposeに導入する</div>
<br>
前に実装したリストのComposeとViewModelを統合します:<br>
<script src="https://gist.github.com/waitzShigoto/6bae5c6238ec34c9c01b35a5f1144259.js"></script>
<br>
<br>
この行を追加します<br>
ViewModelのdevicesがComposeでUIを変更できるstateになります<br>

```kotlin
val devices: List<BleDevice> by deviceViewModel.devices.observeAsState(listOf())
```

これはコンテンツとしてパッケージ化された例です、参考にしてください：<br>
<script src="https://gist.github.com/waitzShigoto/b544ff8031746459060be65333bb222b.js"></script><br>

<div class="c-border-content-title-4">第五步：実際にFragmentで試してみましょう</div>

<br>
ViewModelを導入することを忘れないでください<br>

```kotlin
val model: DeviceViewModel by activityViewModels()
```

その後、先ほど完成したコンテンツに導入します<br>
例を見てください：<br>

<script src="https://gist.github.com/waitzShigoto/93bf9336cded4dd003e6aa5f7b54d18b.js"></script>

そのため、ViewModel内のLiveDataに変化があると<br>
画面が自動的に更新されます<br>
本当に便利ですね！<br>

次に紹介するのは<br>
プルダウンリフレッシュの追加方法です<br><br>

<a href="{{site.baseurl}}/2021/10/28/android-kt-jetpack-compose-swiperefresh/">
  <img src="/images/cover/ea_swiperefresh_app-new-1.png" alt="Cover" width="30%" >
</a>

<a align="right" href="{{site.baseurl}}/android-kt-jetpack-compose-swiperefresh/">Android Jetpack Compose SwipeRefresh：リストのプルダウンリフレッシュ機能を簡単に実現！</a><br>
