---
layout: post
title: "Android Jetpack Compose 基本アプリケーションチュートリアル"
date: 2021-09-13 16:00:48 +0800
image: cover/ea-website-base-cover-photo-new-1.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
permalink: /android-kt-jetpack-compose-base
excerpt: "Android Jetpack Compose 基本アプリケーションチュートリアルへようこそ！このチュートリアルでは、Jetpack Compose の世界に入り、ステップバイステップのガイドを通じて Compose の基本概念とスキルを習得します。"

---

<div class="c-border-main-title-2">前書き</div>
2021/7/28に<br>
Google公式がついにJetpack Compose 安定版1.0をリリースしました <br>
公式発表文を見たい方は <a href = "https://android-developers.googleblog.com/2021/07/jetpack-compose-announcement.html">こちら</a> をご覧ください <br>

<br>
今日は、Jetpack Compose を使って Android アプリに使用するコンポーネントを作成する基本的な方法を共有したいと思います。
<br>
<br>
Jetpack Compose は完全に Kotlin コードを使用して <br>
従来の .xml ファイルで記述されたビューやレイアウトを置き換えます <br>
生成されるのは .kt ファイルのみです <br>
大部分の .xml ファイルを削減します。 <br>

<div class="c-border-content-title-4">Jetpack Compose には Kotlin 独自の特徴が多く使用されています</div><br>

<div class="table_container">
  <p>Kotlin の基本概念</p>
  <ol class="rectangle-list">
    <li><a href="javascript:void(0)">ラムダ式</a></li>
    <li><a href="javascript:void(0)">関数型</a></li>
    <li><a href="javascript:void(0)">拡張関数</a></li>
    <li><a href="javascript:void(0)">名前付き引数</a></li>
  </ol>
</div>

<br>
したがって、上記の Kotlin 概念に既に精通している場合、<br>
Jetpack Compose の学習に大きな利点があります。<br>
迅速に習得できると予想されます。<br>



<div class="c-border-content-title-4">まず、両者の違いを見てみましょう</div>

例えば、これは xml を使用してシンプルなツールバーを作成する方法です：<br>
<script src="https://gist.github.com/KuanChunChen/46bbdced14c9e3c26023854bed33c60d.js"></script><br>

そして、こちらは Jetpack Compose を使用してツールバーを作成する方法です<br>

<script src="https://gist.github.com/KuanChunChen/80743e79901a8c98b87655ff8f020193.js"></script><br>


このような変更により、完全にコードでビューを制御できるようになります。<br>
同時に、<br>
関数型の変数を使用することがより便利になり、<br>
ビューの実現に必要な機能を制御できます。<br>
純粋な Kotlin コードを使用して実装するため、<br>
条件式を使用してビューの表示を制御することがより柔軟になります。<br>
これにより、アプリケーションの設計時により大きな柔軟性が得られます。<br>

<div class="c-border-main-title-2">具体的な方法</div>

ここでは、<br>
いくつかの基本的なウィジェットを作成しました。<br>
実際に Activity や Fragment で使用する際には、<br>
必要に応じて再利用できます。<br>
これにより、アプリケーションの開発と管理がより効率的になります。<br>
このモジュール化された設計方法により、機能豊富で再利用可能なインターフェース要素を迅速に構築でき、<br>
開発時間を大幅に節約し、コードの保守性を向上させます。<br>

<br>
最後に、IDEでのプレビューはこのようになるかもしれません<br>
左側にコードを書き、右側にプレビュー画面が表示されます<br>

<div align="center">
    <img src="/images/jetpack_compose/jc01.png" alt="Cover" width="100%" >  
</div>


<div class="c-border-content-title-4">前期準備作業</div>

Android StudioをArctic Foxバージョンに更新する必要があります<br>
そうすることでIDEを通じてComposableコンポーネントをプレビューできます<br>

公式ダウンロード場所：
<a href="https://developer.android.com/studio?hl=zh-cn" class="btn btn-primary" role="button">Android Studio Arctic Foxをダウンロード</a>
<br>
<br>

<div class="c-border-content-title-4">第一歩</div>
まず関連libをgradle dependenciesに追加します:<br>
<script src="https://gist.github.com/KuanChunChen/c18119da90591482e2f6f5b6cb67bdec.js"></script>
<br>
<br>
<br>

<div class="c-border-content-title-4">第二歩</div>
@Composableを追加して、このfunがJetpack Composeのコンポーネントであることを示します<br>
<script src="https://gist.github.com/KuanChunChen/d8ecd7b8977a5d2e11cb89e00b1e2d04.js"></script>
<br>
<br>
<br>
ここでの

```
Modifier
```
これはJetpack Composeでよく使用されるインターフェースで、<br>
コンポーネントの属性を拡張するために使用されます。<br>
ここでは、<br>
変数を関数の引数として使用する形式で、<br>
AppBarコンポーネントを呼び出すときにModifierをカスタマイズでき、<br>
そのコンポーネントの背景色、アニメーション、フォントなどの属性を設定できます。<br>

<h6>(使用する公式コンポーネントに応じて、そのコンポーネントのModifier実装方法に従って異なる内容を設定します。) </h6>
<br>

<div class="c-border-content-title-4"><font color="green">選択肢（オプション）</font></div>

Columnを使用してJetpack Composeで作成したビューを並べ替えることができます。<br>
ColumnはLinearLayoutに似た垂直配置方法を提供し、<br>
複数のコンポーネントを追加する際に非常に便利です。<br>
Columnを使用することで、複数のコンポーネントを垂直に簡単に並べることができ、<br>
インターフェースのレイアウトがより構造化され、管理しやすくなります。<br>
<script src="https://gist.github.com/KuanChunChen/203f5c350db588cc6b3730f9b326710c.js"></script>
---


公式libに内蔵されている関数を使って、すぐにツールバーを作成し始めます<br>
例えばTopAppBar<br>
<script src="https://gist.github.com/KuanChunChen/66d842982f99a753c786594e918abe16.js"></script>

ここでいくつかの<br>

```Kotlin
modifier = ... ,
backgroundColor = ...,
elevation = ...,
contentColor = ...,
```

<br>
これは実際にはktの特性であるNamed argumentやfunction typeなどを利用して、<br>
funを使用する際にコードをより効果的に拡張できるようにするものです<br>

さらに、ここではfunction type変数<font color="red">
content: @Composable RowScope.() -> Unit</font>
を利用して、TopAppBarの左側にImageを追加します:<br>

（ここでcmd+左クリックを押してTopAppBarのソースコードを見て、RowScopeが何をしているかを確認できます）


<script src="https://gist.github.com/KuanChunChen/049c22e6449d00c4aa529c33fc6cb76f.js"></script>

<br>
ここまでで、拡張性が高く、再利用可能なシンプルなウィジェットが迅速に完成しました。
<br>

<div class="c-border-content-title-4">第三歩</div>
プレビューを開始するにはどうすればよいですか？
もう一つfunを書いて@Previewを追加するだけで、refreshを押すとIDEの右側に先ほど作成したビューが表示されます
（表示されない場合は、右側のDesignまたはsplitをクリックしてプレビュー画面を開いてください）

<script src="https://gist.github.com/KuanChunChen/eac588083154d8faf5c8f15fff868798.js"></script>
<br>
<div class="c-border-content-title-4">第四步</div>
実際の応用では<br>
contentとして包んで呼び出すことができます<br>
こうすることで、画面を細かく分けることができ<br>
将来的なメンテナンスがより効率的になります<br>
<br>

このようにして、完全なロジックのレイアウトを包むことができます<br>
将来レイアウトの見た目を変更したい場合は、ここから変更できます<br>
基本的なコンポーネントのいくつかの機能を特に変更する必要はありません<br>
<script src="https://gist.github.com/KuanChunChen/34565f4c1e1394cb2e5b1d50ded7093b.js"></script>

実際に作成したもの：
<div align="center">
    <img src="/images/jetpack_compose/jc02.png" alt="Cover" width="100%" >  
</div>
<br>
<div class="c-border-content-title-4">最後のステップ</div>

上記のステップを完了すると<br>
fragmentやactivityでレイアウトを設定できます<br>
非常にシンプルです<br>
<script src="https://gist.github.com/KuanChunChen/d697201a60570da069cd3cc4f0ce425c.js"></script>
