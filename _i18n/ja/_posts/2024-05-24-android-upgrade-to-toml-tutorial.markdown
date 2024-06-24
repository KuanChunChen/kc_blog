---
layout: post
title: "Androidプロジェクトを.tomlに移行する際に直面する問題"
date: 2024-05-24 18:24:24 +0800
image: cover/android-upgrade-to-toml-tutorial.png
tags: [Kotlin]
permalink: /android-upgrade-to-toml-tutorial
categories: Kotlin
excerpt: ""
---

<div class="c-border-content-title-4">前書き</div>
* 以前のプロジェクトを`.kts`に変更してビルドするようになってから<br>
公式もプロジェクトをversion catalogsバージョンディレクトリに移行することを目的とした記事を公開しました<br>
追加すると、Android StudioでAndroidをディレクトリとして表示する際に下部に表示されます<br>
<img src="/images/toml/001.png" width="40%"><br>
これで一手間省けます（ダブルShiftで検索する必要がなくなりますXD）<br>
クリックするだけで内容が見られます<br>

* 以前はDependence.ktのようなものを作成すると、ダブルShiftで検索するか<br>
`../Dependence.kt`で探す必要がありました<br>

<div class="c-border-content-title-1">適用されるAGPバージョン</div>

* 新しいバージョンのAndroid Studioでは<br>
IDEの新しいプロジェクトを通じて直接設定できますが<br>
古いプロジェクトに遭遇した場合<br>
手動で移行する際に`AGPバージョン`を更新する必要があるかどうかが気になります<br>
通常、古いプロジェクトは長い年月が経っている可能性があり<br>
更新に時間がかかるか、短期間で最適化するコストがない場合<br>
元のバージョンを維持することを考慮することがあります<br><br>

* そこで少し調べてみました<br>
手元のASで作成したAGPでtomlが設定されているものを適当に選びました<br>
バージョンは8.4.0でした<br>
<img src="/images/toml/002.png" width="50%"><br><br>
<img src="/images/toml/003.png" width="50%"><br><br>
<img src="/images/toml/004.png" width="50%"><br><br>

* Gradle公式ドキュメントを調べたところ、`7.0`のドキュメントで
`7.0のリリースでversion catalogsの実験的機能がサポートされた`と記載されています
<img src="/images/toml/005.png" width="50%"><br><br>
<a href="https://docs.gradle.org/7.0/release-notes.html">Gradle 7.0 リリースノート</a>
つまり、tomlは7.xで使用できるということです

<div class="c-border-content-title-1">移行時に直面する可能性のある問題</div>
* プロジェクトでこのような方法でライブラリを導入している場合があります<br>
```
implement("com.orhanobut:dialogplus:1.11@aar")
```
後ろに@aarが付いていますが<br>
tomlのversionsでは後ろに@aarを追加することがサポートされていないため<br>
ビルドが通りません<br>
<img src="/images/toml/009.png" width="50%"><br><br>
以下のように変更すれば問題ありません<br>
<script src="https://gist.github.com/KuanChunChen/c019662550b3ae9c8ab2a685ee3644a7.js"></script>

* 過去にはkotlinオブジェクトを使用してバージョンパラメータを設定していました、以下のように<br>
<script src="https://gist.github.com/KuanChunChen/e529bd12f84310a4c1f05c237850f1ba.js"></script>
すべてを.tomlに変更したい場合
外部から.tomlで設定されたバージョンにアクセスする実験を行いましたが<br>
libsのように直接使用することはできません<br>
`libs.xx.xx.xxx`でバージョンを取得することはできません<br><br>
直接`get()`を使用して.toml内のVersionsの値を取得する必要があります<br>
例：`libs.versions.minSdk.get().toInt()`<br>
<script src="https://gist.github.com/KuanChunChen/950ea155ac70ee87ce9b2060667027fa.js"></script><br>
ただし、この方法で設定すると<br>
.toml内でどこで使用されているかが見えません<br>
<img src="/images/toml/013.png" width="50%"><br><br>
`aapt dump badging appName.apk`を使用してビルドされたものと`libs.versions.minSdk.get()`で設定されたものが一致するかを検証します<br>
<img src="/images/toml/010.png" width="100%"><br><br>

* AGP 8.1.0未満の設定では、`plugin{}`の上に`@Suppress("DSL_SCOPE_VIOLATION")`を追加する必要があります。
<img src="/images/toml/012.png" width="100%"><br><br>
これはIDE側の問題によるものです。
<a href="https://github.com/gradle/gradle/issues/22797">IDEのKotlinスクリプトエディタでプラグインエイリアスのバージョンカタログアクセサがエラーとして表示される #22797</a>

* 次に、`[plugins]`の下のversion.refについて<br>
nullまたは空に設定することはできません。<br>

一部のプロジェクトでは、plugin + classpathを使用して設定を行います。
<script src="https://gist.github.com/KuanChunChen/d353a385e8942ba88259c2bbb4e03171.js"></script>
<script src="https://gist.github.com/KuanChunChen/29686a0a02bd225c08ca968011f87503.js"></script>
これにより、直接plugins設定を使用すると競合が発生します。<br>
<img src="/images/toml/011.png" width="50%"><br><br>

<div class="c-border-content-title-1">なぜ一部のライブラリはversion.refを設定しなくてもビルドできるのか</div>
* 初めて`.toml`を使用する際、一部のライブラリにversion.refを設定しなくても<br>
正常にビルドできることに気づくでしょう。<br>
<img src="/images/toml/014.png" width="80%"><br><br>
これは、`composeBom`を導入した際に<br>
他の関連ライブラリをバージョン設定なしで導入すると<br>
設定したcomposeBomのバージョンに基づいて<br>
関連ライブラリのバージョンが自動的にマッピングされるためです。<br>
このように、composeBomを設定するだけで、自動導入をサポートする部分が互換性のあるバージョンに設定されます。<br>
非常に便利です！<br>
 - <a href="https://developer.android.com/develop/ui/compose/bom/bom-mapping">Bomマッピングを参照して対応するバージョンを確認</a><br>

<div class="c-border-content-title-4">バージョンカタログの移行方法</div>
<div class = "table_container">
   <p>移行説明</p>
  <b>../gradle</b>ディレクトリの下に<b>lib.version.toml</b>を作成します。<br>
  <img src="/images/toml/006.png" width="35%"><br><br>
  必要に応じて<b>[versions]</b>、<b>[libraries]</b>、<b>[plugins]</b>を追加します。<br>
  公式が推奨する命名方式はケバブケースです。<br>
  これによりコード補完がより良くなります。<br>
  <img src="/images/toml/008.png" width="100%">
  以下のコード例を参照してください：
</div>
<script src="https://gist.github.com/KuanChunChen/ca2178bad03c6ee04618a575a7751334.js"></script>

<div class = "table_container">
   <p>実際の使用例</p>
  tomlを追加した後、sync nowを押して同期します。<br>
  その後、build.gradle.ktsで直接使用できます。<br>
  以下のコード例を参照してください：<br>
</div>
<script src="https://gist.github.com/KuanChunChen/5be8ba888fa9e64287f8a33636fa533b.js"></script>
<div class="c-border-content-title-1">参考資料</div>
- <a href="https://developer.android.com/build/migrate-to-catalogs?hl=zh-cn#kts">Android developer公式ドキュメント</a><br>
- <a href="https://docs.gradle.org/7.5/userguide/version_catalog_problems.html#unsupported_format_version">Gradleバージョンカタログのトラブルシューティング</a><br>
- <a href="https://github.com/gradle/gradle/issues/22797">IDEのKotlinスクリプトエディタでプラグインエイリアスのバージョンカタログアクセサがエラーとして表示される #22797</a><br>
