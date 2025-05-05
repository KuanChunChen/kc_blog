---
layout: post
title: "【Compose Multiplatform】プロジェクト移行の検討と開発ガイド"
date: 2024-07-11 18:30:20 +0800
image: cover/compose_multiplatform_guide.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-guide
categories: ComposeMultiplatform
excerpt: "この記事では、ComposeプロジェクトからCompose Multiplatformへの移行プロセスを詳しく説明し、初期移行コスト、ライブラリの対応関係、潜在的な問題、および将来の展望について解説します。"
---

<div class="c-border-main-title-2">はじめに</div>

Compose Multiplatform（CMP）は開発者にクロスプラットフォーム開発の強力なツールを提供します<br>
しかし、ComposeプロジェクトからCMPへの移行にはいくつかの課題もあります<br>
本記事では移行プロセスにおける重要なポイントと注意点を詳しく説明します<br>

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

<div class="c-border-main-title-2">初期移行コスト</div>

最初に、CMPがどのようにクロスプラットフォームを実現しているかを理解する必要があります<br>
そのため、プロジェクト構造を<br>
理解するのに少し時間がかかります<br>
以下で簡単に確認していきましょう<br>

CMP開発では、複数のフォルダ構造に慣れる必要があります：<br>
<img src="/images/compose/009.png" alt="Cover" width="30%"/><br>

共通コードはcommonMainに配置します：<br>
<img src="/images/compose/010.png" alt="Cover" width="30%"/><br>

各環境で必要なライブラリをインポートします：<br>
<img src="/images/compose/011.png" alt="Cover" width="50%"/><br>

デフォルトではlib.version.tomlを使用して設定するため<br>
.tomlについて理解する必要がありますが<br>
実際には非常に簡単です<br>
公式のデフォルト設定で十分機能します<br>
特別な設定が必要でない限り<br><br>

以前書いたメモがこちらにあります<br>
<a href="{{site.baseurl}}/android-upgrade-to-toml-tutorial">参考まで</a>

<div class="c-border-main-title-2">ComposeプロジェクトからCMPプロジェクトへのライブラリ移行参考</div><br>
* 元々Androidプロジェクトでよく使われるライブラリや公式推奨のライブラリを使用していた場合（表の左側）<br>
  CMPで開発を試みた後、使用するライブラリの移行コストにいくつかのメリットを見つけることができます（表の右側）<br>
  これは、Compose開発でほとんど使用したことのあるものだからです<br>
{% include table/compose-multiplatform-compare.html %}

<div class="c-border-main-title-2">発生する可能性のある問題</div>

1. クロスプラットフォームの要件の違い：<br>
   例えば、AndroidはContextが必要ですが、iOSは必要ありません：<br>
   <script src="https://gist.github.com/waitzShigoto/d4594b6b1b1e92509fa34c67233b301d.js"></script><br>
   完全なメモ：<a href="{{site.baseurl}}/compose-multiplatform-di-context">【Compose Multiplatform】KoinでAndroidのContextを扱うクロスプラットフォームアプリの実装</a><br>
2. プラットフォーム固有の実装：<br>
   例えば、モバイルではローカルの永続ストレージがよく使われます<br>
   Androidでは、この問題を処理するためにDataStoreを使用します<br>
   では、複数のプラットフォームでどのように使用すればよいでしょうか？<br>
   expectとactualキーワードの使用：<br>
   <script src="https://gist.github.com/waitzShigoto/99f7bc0f32960a1af80971e8f68a8b0d.js"></script>
   <script src="https://gist.github.com/waitzShigoto/171b2f873713be2da5214a5450e1f2a4.js"></script>
   <script src="https://gist.github.com/waitzShigoto/3a1379e63db12a23997c21d7f632d8fa.js"></script>
   個別に実装する必要があるにもかかわらず<br>
   いくつかの一般的なライブラリは<br>
   CMPがKotlin実装でサポートしています<br>
   そのため、プラットフォーム別の実装でも、純粋な.ktで書くことができます<br>
   上記のiosMainで実装されたDataStoreのように<br><br>

   完全なメモ：<a href="{{site.baseurl}}/compose-multiplatform-datastore">【Compose Multiplatform】ローカル永続ストレージをDataStoreで実装する方法</a><br>

3. CMPライブラリの互換性問題やバグが継続的に修正されている：<br>
   例えば、SQLDelight 2.0.0バージョンではiOSでビルドエラーが発生します：<br>
    - 解決策1：stately-commonをインポートする<br>
    - 解決策2：バージョン2.0.1以上にアップグレードする<br>
   理由はこちらのディスカッションスレッドで確認できます：[こちらをクリック](https://github.com/cashapp/sqldelight/issues/4357)<br>
   SQLDelightの完全なメモ：<a href="{{site.baseurl}}/compose-multiplatform-sqldelight">【Compose Multiplatform】SqlDelightデータベースの実装</a>
<div class="c-border-main-title-2">将来の展望</div>

Googleは2024年5月14日のブログでKMPへのサポートについて言及しています：<br>
<img src="/images/compose/012.png" alt="Cover" width="50%"/><br>
これは将来的により多くのライブラリがサポートされる可能性があることを意味するかもしれません。

<div class="c-border-main-title-2">まとめ</div>

- CMPは強力なクロスプラットフォーム開発機能を提供しますが、新しいプロジェクト構造への適応が必要です
- ほとんどの一般的なライブラリには対応するCMPバージョンがあります<br>
例えば、Compose Appの開発でよく使用されるものは直接使用できます<br>
DataStore、Roomなど
- プラットフォームの違いを処理する際、expectとactualキーワードが非常に役立ちます
- ライブラリのバージョン互換性の問題に注意してください<br>
現在の開発では<br>
いくつかの設定互換性の問題に遭遇しています<br>
例：Kotlin 2.0.0でのRoom互換性の問題<br>
CMPでCocoaPodsを設定する際のembedAndSignエラーなど<br>

- Googleの最新アップデートに注目して、さらなるサポートとリソースを得ましょう<br>
GPTに直接尋ねてみましたが<br>
それほど正確ではないかもしれません<br>
多くの互換性問題は自分で調査する必要があります<br>
あるいは将来的にデータがより豊富になれば、より正確な回答が得られるかもしれません<br> 