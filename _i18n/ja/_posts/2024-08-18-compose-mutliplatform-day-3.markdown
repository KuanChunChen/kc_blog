---
layout: post
title: "Compose Multiplatform 実践：続戦、Wizardを使ってCMPプロジェクトを作成"
date: 2024-08-18 17:13:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-3
categories: ComposeMultiplatform
excerpt: "このシリーズのテーマはCompose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。"
---

<div class="c-border-main-title-2">はじめに</div>


`Compose Multiplatform (略称CMP)`<br>
昨日はCMP環境のインストールを完了したばかりです<br>

プログラミングの観点から見ると<br>
実際には任意のファイルや構造を<br>
完全にゼロから自分で作成することも可能です<br>
すべてのファイルを自分で作成し<br>
コマンドを使って書くこともできます<br>
例えば<br>
`touch xxx.kt`<br>
そして`vim`で各ファイルを編集する<br>

しかしこれは非常に面倒です<br>
そのためプロジェクト作成時には<br>
通常、すでに設定されたプロジェクト構造を使用します<br>

`CMP`に関しては<br>
公式が提供する`Wizard`を使用してプロジェクトを作成できます<br>

今日は<br>
`Wizard`を使ってCMPプロジェクトを作成する方法と<br>
いくつかの一般的な問題について学びましょう<br>

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">CMPプロジェクト作成</div>
<div class="c-border-content-title-1">プロジェクトの作成</div>
実はとても簡単です<br>
JetBrain公式のウェブページを使用します<br> 
[Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/#newProject)

このウェブページにアクセスすると<br>
以下のような画面が表示されます<br>
<img src="/images/compose/027.png" alt="Cover" width="50%" /><br />

自分のニーズに合わせてプロジェクト名、パッケージ名などを変更します<br>

> 上の図に基づいて、設定を簡単に説明します

`Project Name`：このプロジェクトの名前を設定します<br>
主に`ビルドされるアプリの名前`に影響します<br>
プロジェクトの`ルートフォルダ名`にもなります<br>

`Project ID` : ビルドされるアプリのPackage Nameです<br>
プロジェクトのパッケージパスにも影響します<br>

また、下にはいくつかのチェックボックスがあります<br>
`Android`、`iOS`、`Desktop`、`Web`、`Server`<br>
`自分のニーズ`に応じて、ウェブページに設定してもらいたい基本項目を選択できます<br>

ここは分かりやすいです<br>
例えば今回の目標が`Android`と`iOS`なら、この2つのプラットフォームを選択します<br>
そしてiOSの下に2つのオプションが表示されます<br>
どのUIコンフィギュレーションを使用するかを選択するためのものです<br>
> Share UI (with Compose Multiplatform UI framework)
Do not share UI (use only SwiftUI)

iOSでもComposeを使いたい場合は<br>
`Share UI (with Compose Multiplatform UI framework)`を選択します<br>
逆にネイティブのSwiftUIを使いたい場合は他方を選びます<br>

ただし、これらは設定に基づいて`デフォルト`設定されるだけです<br>
調整が必要な場合は`後で手動で変更する`ことができます<br><br>

完了したらDownloadをクリックします<br>
作成されたプロジェクトをダウンロードできます<br>
<img src="/images/compose/028.png" alt="Cover" width="70%" /><br/>

<div class="c-border-content-title-1">IDEにインポート</div>

前のステップでダウンロードした`Zipファイル`を解凍します<br>
その後、`Android Studio`の`import project`を使って<br>
IDEにインポートできます<br>
これによりIDEで編集できるようになります<br>

`File > New > import project`を探します<br>
<img src="/images/compose/029.png" alt="Cover" width="50%" /><br/>

表示されるファイル選択ダイアログで<br>
先ほど解凍した`フォルダ`を選択します<br>
<img src="/images/compose/030.png" alt="Cover" width="70%" /><br/>

<div class="c-border-content-title-1">追加情報【Compose Multiplatform Wizard】</div>
前日にも触れましたが、CMP関連のコミュニティは現在非常に活発です<br>
また、主要開発会社である`JetBrains`も<br>
継続的にメンテナンスやアップデートを行っています<br>
これは比較的新しい機能で、`JetBrainsの社員`によって開発されました<br>
[Compose Multiplatform Wizard](https://www.jetbrains.com/zh-cn/lp/compose-multiplatform/)
ただし公式ドキュメントには含まれていません<br>
これはGitHubをブラウジング中に偶然見つけたものです<br>

上記の`Kotlin Multiplatform Wizard`と実際には類似したツールです<br>
`Compose Multiplatform Wizard`も、ウェブページを通じて`Compose`をUIとするプロジェクトを生成するためのものです<br>
さらにCMPでよく使用されるライブラリをインポートするオプションがいくつか追加されています<br>

<img src="/images/compose/031.png" alt="Cover" width="50%" /><br />

上記と同様に<br>
希望のProject NameとProject IDを入力し<br>
必要なライブラリを選択して<br>
ダウンロードをクリックした後、解凍してIDEにインポートします<br><br>

また、この開発者`terrakok`のGitHubリポジトリも興味があれば見てみてください<br>
GitHub Pagesを使って構築されているようです<br>
[Compose-Multiplatform-Wizard github](https://github.com/terrakok/Compose-Multiplatform-Wizard-App) 