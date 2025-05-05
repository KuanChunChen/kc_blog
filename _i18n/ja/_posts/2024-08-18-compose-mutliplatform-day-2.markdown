---
layout: post
title: "Compose Multiplatform 実践：初戦、CMP環境をインストールしよう"
date: 2024-08-18 17:13:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-2
categories: ComposeMultiplatform
excerpt: "このシリーズのテーマはCompose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。"
---

<div class="c-border-main-title-2">はじめに</div>

`Compose Multiplatform (略称CMP)` UIフレームワークは、Kotlinコード共有能力を新たな高みへと押し上げます<br>
一度ユーザーインターフェースを実装すれば<br>
iOS、Android、デスクトップ、Webを含むすべてのターゲットプラットフォームで使用できます<br>
今日は環境のインストールを一歩一歩進めていきます<br><br>

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">目標</div>
`マルチプラットフォーム`（Android、iOS、Web、Desktop）アプリケーションを作成できるCMPプロジェクトを構築します<br>
まずはCMPプロジェクトの作成方法を理解する必要があります<br><br>

以下にリストアップした項目に従ってインストールできます<br>
一部はオプションですので<br>
`自分のニーズ`に応じてインストールしてください<br>
  * Android Studio
  * Java and JDK
  * Xcode
  * Kotlin plugins
  * (Optional) Kotlin Multiplatform plugin
  * (Optional) CocoaPods
  * (Optional) kdoctor
  * (Optional) Browsers

<div class="c-border-main-title-2">CMP環境インストール - 必要なツールのインストール</div>
<div class="c-border-content-title-1">まずkdoctorのインストールをお勧めします (Optional)</div>
`kdoctor`は公式が推奨するプラグインです<br>
環境内の必要項目が`準備完了しているか`をチェックしてくれます<br>

ターミナルでコマンドを使用してkdoctorをインストールします<br>
```
brew install kdoctor
```
<img src="/images/compose/019.png" alt="Cover" width="100%" /><br />

その後、`kdoctor`を実行するだけでチェックできます<br>
例えば、私の環境では<br>
Kotlin Multiplatform Pluginがインストールされていませんが<br>
それも検出してくれます<br>

```
kdoctor
```
<img src="/images/compose/020.png" alt="Cover" width="100%" /><br />

要するに<br>
すべてが`[v]`と表示されていれば<br>
`環境が正しく`設定されています<br>

もし`kdoctor`が環境チェック中に問題を診断した場合：<br>

`[x]`：修正が必要な失敗したチェック<br>
*マークの後に問題の説明と潜在的な解決策が表示されます。<br>

`[!]`：警告チェック<br>
必ずしもインストールする必要はないかもしれません<br>
インストールできると通知しているだけかもしれません<br>

<div class="c-border-content-title-1">Android Studioのインストール</div>
CMPを便利に作成するために`Android Studio`のインストールが必要です<br>

まず[Android Studio 公式サイト](https://developer.android.com/studio?hl=zh-tw)に行き<br>
IDEをダウンロードします<br>
<img src="/images/compose/021.png" alt="Cover" width="50%" /><br />

次に`MacOS`の場合はダウンロードした`.dmg`を開き<br>
IDEをApplicationフォルダにドラッグします<br>
`Windows`の場合は`.exe`でディレクトリを選択してインストールします<br>

<img src="/images/compose/022.png" alt="Cover" width="50%" /><br />
（Macのインストール例）



<div class="c-border-content-title-1">Kotlin Pluginのチェック</div>
`CMP`は主に`Kotlin`を使用して開発します<br>
そのためKotlin Pluginは`必須`です<br>
ただし、現在のAndroid Studioではすべて統合されているため<br>
インストールするとKotlin Pluginも一緒にインストールされます<br>
（新しいバージョンのIDEではインストール済みです）<br>

次に`Android Studio`を開きます<br>

もし問題が発生した場合は<br>
`Tool > Kotlin > Configt Kotlin in Project`を選択して<br>
IDEにインストール状況をチェックさせることができます<br>
<img src="/images/compose/023.png" alt="Cover" width="50%" /><br />



<div class="c-border-content-title-1">Java JDK環境のチェック</div>
実はこのステップも上記と同様です<br>
新しい`Android Studio IDE`ではすでにインストールされています<br><br>

もし`不確か`な場合は<br>
IDEに組み込まれたものをダウンロードできます<br>
以下の場所でJDKがインストールされているか確認できます<br>
`Android Studio > Setting`をクリックするか、ショートカット`Command + ,`を使用します<br>
<img src="/images/compose/024.png" alt="Cover" width="50%" /><br />

`Build, Execution Deployment >Build Tools > Gradle`を探します<br>
<img src="/images/compose/025.png" alt="Cover" width="50%" /><br />

ドロップダウンメニューをクリックして環境内の既存のものを確認する<br>
またはDownload JDKをクリックしてダウンロードします<br>
<img src="/images/compose/026.png" alt="Cover" width="50%" /><br />


また<br>
ここでは`sdkman`の使用をお勧めします（Optional）<br>
コマンドを通じて環境内の`SDKを管理`できます<br>
ただし`CMPの紹介`が主題なので<br>
`よく使われる`コマンドをいくつか紹介します<br>
興味がある方はネットで詳細を調べてください<br><br>

現在設定されているsdkを確認する<br>
```
sdk current
```

利用可能およびダウンロード可能なJava SDKをリストアップする<br>
```
sdk ls java
```

JAVA環境を設定する（xxxの名前は上記のsdk lsで見つけることができます）<br>
```
sdk using java xxx
```

<div class="c-border-content-title-1">Kotlin Multiplatform plugin (Optional)</div>
Android StudioがMultiplatformをより良くサポートするために<br>
`Kotlin Multiplatform plugin`をダウンロードする必要があります<br>
同様にSetting > Plugin > Marketplaceを開きます<br>
<img src="/images/compose/017.png" alt="Cover" width="50%" /><br />

`install`をクリックしてダウンロードします<br>
完了したら`Apply`をクリックし、IDEを`Restart`します<br>

これにより、Android StudioでCreate New Projectを使用して<br>
自動的に`KMPの基本的なプロジェクト内容`を作成できます<br>
`template`を作成する概念に似ています<br>
<img src="/images/compose/018.png" alt="Cover" width="50%" /><br />

> [KMM Plugin公式リリース](https://kotlin.liying-cn.net/docs/reference_zh/multiplatform/multiplatform-plugin-releases.html)
必要に応じて参照してください

また、`CMPに関して`<br>
公式はオンラインでCMP基本プロジェクトを作成する方法も提供しています<br>
（KMPとCMPの違いを忘れた方は`1日目`の記事を参照してください、<a href="{{site.baseurl}}/compose-multiplatform-day-1">Compose Multiplatform 実践：リラックスして、CMPの初歩を探る</a>）<br>

オンラインWebページ<br>
[Wizard](https://kmp.jetbrains.com/#newProject)<br>
を使用して作成し、IDEにインポートします<br>

どちらの方法を使うかは<br>
開発上の主な違いは<br>
`KMP`：`KMM plugin`プラグインを使用して作成、`Native UI` + `common logic`の開発方法に焦点を当てています<br>
`CMP`：オンラインWebページ`KMM Wizard`を使用して作成しIDEにインポート、`Compose UI` + `common logic`でマルチプラットフォーム開発に焦点を当てています<br>

ここでは簡単に紹介しました<br>
後で詳細なプロジェクト開発時に<br>
`Wizard`の使用方法について簡単に説明します<br>

<div class="c-border-content-title-1">Xcodeのインストール</div>

macOSのMacを使用していて<br>
iOSアプリを実行したい場合は<br>
Xcodeが必要です<br><br>

方法は非常に簡単です<br>
App StoreでXcodeを検索して<br>
ダウンロードするだけです<br>
<img src="/images/compose/016.png" alt="Cover" width="50%" /><br />


他のオペレーティングシステムを使用している場合は<br>
このステップをスキップできますが<br>
iOSアプリをビルドすることはできないかもしれません<br>
解決方法（ワークアラウンド）もあるかもしれませんが<br>
正規の方法ではないかもしれませんXD<br>

<div class="c-border-content-title-1">CocoaPodsのインストール (Optional)</div>

将来的にiOSのフレームワークを使用したい場合は事前にインストールできます<br>
必要ない場合は、後で必要になった時にインストールしても大丈夫です<br><br>

コマンドを使用してCocoaPodsをインストールします<br>

```
brew install cocoapods
```

ただし、brewでインストールするには<br>
より高いバージョンのrubyが必要です<br><br>

公式サイトによると、少なくとも`3.3.4`バージョンが必要です<br>
> Depends on:
ruby	3.3.4	Powerful, clean, object-oriented scripting language

そこで、以下のコマンドで<br>
環境内のバージョンを確認できます<br>

```
ruby -v 
```

バージョンが足りない場合は<br>
まず`reinstall`します<br>
```
brew reinstall ruby
```

最後に`brew install cocoapods`を実行します<br>

<div class="c-border-content-title-1">ブラウザのチェック (Optional)</div>

Webアプリケーションを作成する場合<br>
`Wasmガベージコレクション（GC）`機能をサポートするブラウザが必要です。<br>

これは公式サイトが提供する情報です<br>
OS内の`ブラウザのバージョン`を確認する必要があります<br>
`現在サポートされている環境`に関する説明です<br>

`Chrome`と`Chromium`：バージョン119からサポート。<br>
`Firefox`：バージョン120からサポート。<br>
`Safari/WebKit`：Wasm GCは現在開発中です<br><br>

Safariなどはサポートしていないようです<br>
そのため完全に実行できない可能性があります<br>
Webアプリの開発が必要な場合は<br>
上記の情報に基づいて試してみてください<br>

<div class="c-border-content-title-1">結語</div>
我總覺得開始一個新的程式語言 或 框架<br>
通常你會`不太熟悉`怎麼配置他的環境<br>
不過若有人能稍微提點<br>
就能更容易上手<br>

總體來說<br>
不需要之前有Compose Multiplatform、Android或iOS的經驗<br>
從零一步一步開始熟悉Kotlin再到整個CMP也可以慢慢上手<br>

若有任何疑問或問題，歡迎在評論區討論，我們一起學習成長。<br>
這次的內容就到這裡，感謝大家的閱讀和支持！<br>

