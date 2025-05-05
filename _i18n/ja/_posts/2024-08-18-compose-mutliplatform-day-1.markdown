---
layout: post
title: "Compose Multiplatform 実践：リラックスして、CMPの初歩を探る"
date: 2024-08-18 17:12:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-1
categories: ComposeMultiplatform
excerpt: "このシリーズのテーマはCompose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。"
---

<div class="c-border-main-title-2">はじめに</div>

こんにちは<br>
このシリーズのテーマは`Compose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発する`です<br>
今回は`Android`と`iOS`のクロスプラットフォームアプリ開発に焦点を当てます<br>
最終日には研究結果と感想を共有します<br>


<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">Compose Multiplatformの紹介</div>
まずは**Compose Multiplatform**と**Kotlin Multiplatform**について簡単に理解しましょう

`Multiplatform`という言葉自体は`Multi`+`platform`<br>
文字通り`マルチプラットフォーム`という意味です<br>

そして`Compose Multiplatform`は<br>
現在[JetBrainの公式サイト](https://www.jetbrains.com/zh-cn/lp/compose-multiplatform/)の説明によると<br>
KotlinにおけるCompose宣言型UIを使って<br>
アプリケーションを開発することをサポートしています<br>
現在サポートされているプラットフォームは`iOS`、`Android`、`Desktop`、`Web`の4つです<br><br>

また、`KMM (Kotlin mobile multiplatform)`<br>
あるいは`CMP (Compose Multiplatform)`、`KMP (Kotlin Multiplatform)`とも呼ばれています<br>
以下では`CMP`を使ってCompose Multiplatformを表現します<br>
冗長さを避けるためです<br>
ご了承ください！<br>

<div class="c-border-content-title-1">CMPとKMPの違いは何ですか？</div>

実際、両者はクロスプラットフォームプロジェクトの開発を簡素化し<br>
異なるプラットフォーム向けに同じコードを書いて維持する時間を減らすことを目的としています<br>

Gradleの設定を通じて<br>
共通のソースコード開発と組み合わせて開発時間を短縮できます<br>
例えば`commonMain`を通じてクロスプラットフォームコードを開発します<br>
Compose UIはこのレイヤーで開発されます<br><br>

`主な違いは次のとおりです`：<br>

`KMP`では、ターゲットアプリのUIレイアウトを作成するために`ネイティブプラットフォーム`のコードを使用する必要があります<br>
例えば：<br>
Androidでは`xml`を使用してレイアウトを実装するか<br>
最近ではComposeを使用してUIを実装しています<br><br>

`iOS`ではSwiftUIを使用して実装します<br><br>

一方、`CMP`はKMPの概念を拡張し<br>
同様に共通コードを書くことができ<br>
さらに`Compose`を使用して複数のプラットフォーム向けの画面を完成させることができます<br>

<div class="c-border-content-title-1">プレビュー</div>

下の画像のように、Composeだけで`マルチプラットフォームの画面`を一度に作成できます<br>
<img src="/images/compose/015.png" alt="Cover" width="50%" /><br />

もちろん、これは`Material Design 3`で作られた画面です<br>
iOSの規格と異なることを気にする人もいるかもしれません<br>

しかし過去の実務経験から言えば<br>
プロジェクトを行う際<br>
ほとんどのUIデザインは<br>
iOSの画面をベースにすることが多いです<br>

そのため、各プラットフォーム固有のコンポーネントを除けば<br>
丁寧に作り込めばiOSと非常に似た画面を作ることができます<br>

ですから、この部分は各自の`ユースケース`によって<br>
気にするかどうかを決めればいいでしょうXD<br>

<div class="c-border-main-title-2">目標</div>

最後に<br>
この30日間で、以下のテーマを中心に共有していきます<br>

* [CMPの基本環境設定を理解する]()
* CMPの[基本的な作成方法]()と[プロジェクト設定]()、[シミュレータの設定]()をマスターする
* [CMPプログラムのエントリーポイントを理解する]()
* [CMPでMaterial Design3 Themeを使用する]()
* [ComposeでUIを実装する具体的な方法]()
* [expect と actual を使用してクロスプラットフォームコードを実現する]()
* [CMPでKoinを使用してDI注入を行う方法を理解する]()
* CMPで開発するがAndroidプラットフォームでcontextが必要な場合はどうするか？
* CMP開発でのローカル永続ストレージDataStoreの実装
* [CMP開発でのローカルデータベースSqlDelightの実装]()
* [CMP開発でのローカルデータベースRoomの実装]()
  および [KSP2] Annotation value is missing in nested annotationsの解決方法
* CMPプロジェクトにCocoaPodsを導入しiOSのフレームワークを使用する
* CMPプロジェクトでcinteropを使用しiOSのフレームワークを使用する
* ...など

<div class="c-border-main-title-2">まとめ</div>

明日から<br>
`Compose Multiplatform`についてより理解を深めるためのノートを書き始めます<br>

またCMPは常に更新されています<br>
Googleが発表した記事を見ると<br>

CMPに<br>
より多くのサポートが徐々に追加される<br>
可能性があり、期待できます<br>
<img src="/images/compose/014.png" alt="Cover" width="50%" /><br />
（画像出典：Google Blog）<br>


CMPは比較的新しいものなので<br>
様々な状況に遭遇する可能性があります<br>
ネット上の情報もそれほど豊富ではありません<br>
ですから問題に遭遇した場合は議論して、お互いに学び成長しましょう<br> 