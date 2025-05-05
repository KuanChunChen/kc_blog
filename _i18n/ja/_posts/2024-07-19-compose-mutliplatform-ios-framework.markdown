---
layout: post
title: "【Compose Multiplatform】CMPプロジェクトでのCocoaPodsの使用とCocoaPodsなしでiOS Swift/Obj-Cを使用する方法"
date: 2024-07-18 21:30:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-ios-cocoapods
categories: ComposeMultiplatform
excerpt: "この記事では、ComposeプロジェクトからCompose Multiplatformへの移行プロセスを詳細に説明し、iOSのネイティブコードを統合する方法に焦点を当てています。"
---

<div class="c-border-main-title-2">はじめに</div>

両プラットフォーム向けのクロスプラットフォームアプリを開発する際
現在の公式ソリューションは
まだ完全に包括的ではないかもしれません
そのため、一部の機能では
元のプラットフォームへブリッジバックし
そのプラットフォームのネイティブコードを使用する必要があります
これをどのように実装できるでしょうか？


<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

<div class="c-border-main-title-2">CocoaPodsの使用</div>
<div class="c-border-content-title-1">CocoaPods設定の追加</div>
libs.version.tomlに設定を追加
<script src="https://gist.github.com/waitzShigoto/14f0d600c186a7e8d32be0d5b96666ae.js"></script>

build.gradle.ktsで<br>
cocoapodsブロックを追加し<br>
使用したいPodライブラリ依存関係 `pod("Google-Mobile-Ads-SDK")` を追加<br>
および `PodFile` の場所 `podfile = project.file("../iosApp/Podfile")` を指定<br>
通常はiOSプロジェクトの下にあります<br>
KMM公式サイトでプロジェクトを生成した場合<br>
デフォルト名は `iosApp` です<br>
<script src="https://gist.github.com/waitzShigoto/b6c7c751d9e203f71422c98ab512dcb4.js"></script><br>

公式サイトでは、以下のタイプのPodライブラリ依存関係を追加できると記載されています<br>
- CocoaPodsリポジトリから
- ローカルに保存されたライブラリ
- カスタムGitリポジトリ
- カスタムPodspecリポジトリ
- カスタムcinteropオプション付き

iosAppプロジェクトの下でPodfileを設定
<script src="https://gist.github.com/waitzShigoto/419374bf1bfe829fb5c2cbc3ae79a5a8.js"></script>

その後<br>
iosAppプロジェクトで `pod install` を使用して設定をインストール<br>
既にインストールされている場合は `pod install --repo-update` を使用<br>
または `pod deintegrate` してから再インストール<br><br>
最後に `./gradlew build` を実行<br>
成功すれば、KotlinからiOSのブリッジコードをインポートできます<br>
<script src="https://gist.github.com/waitzShigoto/13e7f746a07dd30247ad1850946dadc3.js"></script><br>

<div class="c-border-main-title-2">CocoaPodsなしでKotlinでiOSフレームワークを使用する</div>
CocoaPodsを使用したくない場合<br>
cinteropを使用してObjective-CまたはSwift宣言用のKotlinブリッジを作成できます<br>
これによりKotlinからそれらを呼び出すことができます<br><br>

ステップ1. <br>
`../composeApp/nativeInterop/cinterop/xxx.def` に `.def` ファイルを作成<br>
（実際のニーズに応じて内容を記述）<br>
<script src="https://gist.github.com/waitzShigoto/bb0cdcf859ca450bacbf3b888b49e02a.js"></script>

ステップ2.<br>
`Build.gradle.kts` のiOS設定に以下のコードを追加<br>
使用したいフレームワークはcocoapodsでインストール後にパスを見つけることもできます<br>
または独自の.swiftブリッジを実装することもできます<br>

<script src="https://gist.github.com/waitzShigoto/60fad794cafa8b4c067297035aea7128.js"></script>

<div class="c-border-main-title-2">まとめ</div>

- しかし、現在のテストに基づくと<br>
cocoapods設定を通じて直接転送されたiOSネイティブコードは<br>
現段階では完全に転送できません<br>
例えば、`Google-Mobile-Ads-SDK`を使用する場合、すべての機能が解決できるわけではありません<br>
- そのため、.defを使用して自分で転送する必要があります<br>
しかしこれは結局iOSネイティブコードを書く必要があることと同じです<br> 