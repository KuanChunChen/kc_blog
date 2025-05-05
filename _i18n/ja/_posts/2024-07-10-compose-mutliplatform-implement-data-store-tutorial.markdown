---
layout: post
title: "【Compose Multiplatform】ローカル永続ストレージをDataStoreで実装する方法"
date: 2024-07-10 13:10:10 +0800
image: cover/compose_multiplatform_datastore.png
tags: [Kotlin, Compose Multiplatform, DataStore]
permalink: /compose-multiplatform-datastore
categories: ComposeMultiplatform
excerpt: "この記事では、Compose MultiplatformプロジェクトでクロスプラットフォームのDataStoreローカルストレージを実装する方法を紹介します。ライブラリのインポート、各プラットフォーム向けのDataStore実装、およびcommonMainでDataStoreを使用する方法を含みます。"
---

<div class="c-border-main-title-2">はじめに</div>

純粋なAndroidプロジェクトでは<br>
ネイティブのDataStoreを直接使用できますが<br>
Compose Multiplatformプロジェクトでは<br>
どのようにDataStoreをシームレスに使い続けることができるでしょうか？<br>
本記事では、クロスプラットフォーム環境で<br>
DataStoreによるローカルストレージの実装方法を紹介します<br>

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

<div class="c-border-main-title-2">実装手順</div>
<div class="c-border-content-title-1">1. ライブラリのインポート</div>
.tomlファイルに追加：<br>
<script src="https://gist.github.com/waitzShigoto/64fbb0e57e0aae819f214a001a2ad618.js"></script>

build.gradle.ktsに追加：<br>
<script src="https://gist.github.com/waitzShigoto/072a8d5fb78c251d75bff786043e7b4e.js"></script>

<div class="c-border-content-title-1">2. 各プラットフォーム向けDataStoreの実装</div>
expect関数とローカルストレージ名の作成：<br>
<script src="https://gist.github.com/waitzShigoto/8296380fb742aa1610f47e03ddc9c9ad.js"></script>

Androidプラットフォームの実装：<br>
<script src="https://gist.github.com/waitzShigoto/614b088bdf6023183b0dee650b5649ee.js"></script>

iOSプラットフォームの実装：<br>
<script src="https://gist.github.com/waitzShigoto/d0e2b82e2d755d318e328aaa8e0d226d.js"></script>

<div class="c-border-content-title-1">3. commonMainでDataStoreを使用する</div>
上記で実装したインターフェースを使用して
commonMainでDataStoreを使用できます：<br>
<script src="https://gist.github.com/waitzShigoto/aad753fa1e7571946cee9a1fb768e4ff.js"></script>

<div class="c-border-content-title-1">4. Koinモジュールの追加（オプション）</div>
依存性注入にKoinを使用したい場合は、次のように設定できます：<br>
<script src="https://gist.github.com/waitzShigoto/cec17b93139a5431fdf2ca437f71de02.js"></script>

<div class="c-border-main-title-2">まとめ</div>
- Compose Multiplatformでは、クロスプラットフォームプロジェクトでDataStoreを使用できます
- 適切なカプセル化により、異なるプラットフォーム間で統一されたDataStore APIを使用できます
- DataStoreを使用することで、ローカルデータの永続化の実装が簡素化されます
- Koinなどの依存性注入フレームワークと組み合わせることで、DataStoreインスタンスをより適切に管理できます

<div class="c-border-main-title-2">参考資料</div>
[Android Developer 公式](https://developer.android.com/kotlin/multiplatform/datastore) 