---
layout: post
title: "【Compose Multiplatform】SqlDelightデータベースの実装"
date: 2024-07-10 15:38:40 +0800
image: cover/compose_multiplatform_sqldelight.png
tags: [Kotlin, Compose Multiplatform, SqlDelight]
permalink: /compose-multiplatform-sqldelight
categories: ComposeMultiplatform
excerpt: "この記事では、Compose Multiplatformプロジェクトでクロスプラットフォームのデータベース操作を実装するためのSqlDelightの使用方法について詳しく説明します。ライブラリのインポート、テーブルの実装、プラットフォーム固有の実装、および実際の使用方法を含みます。"
---

<div class="c-border-main-title-2">はじめに</div>

Compose Multiplatformプロジェクトでは<br>
クロスプラットフォームのデータベース操作をどのように実装できるでしょうか？<br>
SqlDelightは強力なソリューションを提供します<br>
本記事では、クロスプラットフォーム環境で<br>
SqlDelightを使用してデータベース操作を行う方法を紹介します<br>

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>


<div class="c-border-main-title-2">実装手順</div>
<div class="c-border-content-title-1">1. SqlDelightのインポート</div>
まず、プロジェクトにSqlDelightをインポートします：<br>
.tomlファイルに追加：<br>
<script src="https://gist.github.com/waitzShigoto/212a3f263b6f8bd8d89dd7a41278cf15.js"></script>

build.gradle.ktsにプラグインと依存関係を追加：<br>
 - まずプラグインを追加<br>
<script src="https://gist.github.com/waitzShigoto/d1f759b755844594d9b0a566c070274e.js"></script>
 - 次に各環境に対応するライブラリを追加<br>
<script src="https://gist.github.com/waitzShigoto/961acd32138dd067fb890b238b9574ea.js"></script>
 - 最後にkotlinの下にSqlDelightの設定を追加<br>
 これは、`test.your.package.db`パッケージに`AppDatabase`という操作可能なクラスが作成されると理解できます<br>
<script src="https://gist.github.com/waitzShigoto/34c9aeaa5ed7a5899b1ed281b0ddafca.js"></script>

<div class="c-border-content-title-1">2. データベーステーブルの実装</div>
 - commonMain/`sqldelight`/databaseディレクトリに.sqファイルを作成：<br>
 現在のバージョンでは、次のステップでビルドプロセスが操作可能なクラスを正常に生成するためには、
 上記のパスにsqldelightフォルダを追加する必要があることを確認しました
![截圖 2024-07-09 下午3.11.59.png](/images/compose/007.png)
<script src="https://gist.github.com/waitzShigoto/1ba4ff8058e91955208ff66625cdae30.js"></script>

 - (オプション) 同名の`SqlDelight`プラグインをダウンロードすると、右クリックで.sqファイルを生成できます（マーケットプレイスからダウンロード可能）<br>
  [参考 sqldelight](https://plugins.jetbrains.com/plugin/8191-sqldelight)<br>
  ![截圖 2024-07-09 下午3.11.59.png](/images/compose/008.png)
 - 上記のように設定し、ビルドした後<br>
   `/build/generated/sqldelight/code/..`パスに対応するクラスが生成されます<br><br>
 - またはコマンドを使用してビルドすることもできます<br>
   `./gradlew generateCommonMainAppDatabaseInterface`<br><br>
 - iOSのビルドが失敗する場合は、build.gradle.ktsのisStaticをfalseに変更できます<br>
    <script src="https://gist.github.com/waitzShigoto/d212905eb22f1a29896d8d3699baefe3.js"></script>

<div class="c-border-content-title-1">3. プラットフォーム固有の実装作成</div>
異なるプラットフォーム用のDatabaseDriverFactoryを作成：<br>
<script src="https://gist.github.com/waitzShigoto/04d780bfc000ef0a802557555ea721d3.js"></script>

<div class="c-border-content-title-1">4. 実際の使用法</div>
生成されたDBクラスを使用してビジネスロジックを実装：<br>
<script src="https://gist.github.com/waitzShigoto/e35ce1a2ca45daf6070ecbedb093ca93.js"></script>

<div class="c-border-content-title-1">5. Koinの注入（オプション）</div>
依存性注入にKoinを使用する場合<br>
このように設定できます<br>
<script src="https://gist.github.com/waitzShigoto/6894df15e9d1e293fda291a23faf0d6f.js"></script>

<div class="c-border-main-title-2">注意点</div>
1. SqlDelightバージョン2.0.0のiOSビルド失敗の既知の問題を避けるため、バージョン2.0.1を使用することをお勧めします<br>
詳細については、こちらのディスカッションスレッドをご覧ください：[こちらをクリック](https://github.com/cashapp/sqldelight/issues/4357)<br>
2. iOSビルドが失敗する場合は、isStaticをfalseに設定してみてください<br>
なぜこの変更が必要なのかは不明です<br>
おそらく公式の回避策です<br>
公式ドキュメントには直接この方法が記載されています<br>

<div class="c-border-main-title-2">まとめ</div>
- SqlDelightは強力なクロスプラットフォームデータベースソリューションを提供します
- 適切なカプセル化により、異なるプラットフォーム間で統一されたデータベースAPIを使用できます
- Koinなどの依存性注入フレームワークと組み合わせることで、データベースインスタンスをより適切に管理できます
- クロスプラットフォームの互換性を確保するために、バージョン選択とプラットフォーム固有の実装に注意してください 