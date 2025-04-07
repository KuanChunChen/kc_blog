---
layout: post
title: "Androidアプリで要素間のマージンを調整する方法 - Kotlin拡張コードを使用してマージンを設定"
date: 2022-12-25 17:05:12 +0800
image: cover/kotlin-clear-code-maring-layout-xml-constarint-layout-1.png
tags: [Android,Kotlin,Extension]
permalink: /clear_use_extension_to_set_margin
categories: Kotlin
excerpt: "Androidアプリで要素間のマージンを調整することは一般的なニーズです。Kotlin拡張コードを使用してマージンを設定することで、この目的を迅速かつ簡単に達成できます。この記事では、このテクニックを一歩一歩学び、アプリをより美しくプロフェッショナルに見せる方法を紹介します。"
---

<h1 style="background-color:powderblue;">&nbsp;&nbsp;前書き</h1>

今日は、超簡単な小技を皆さんに共有します。<br>
Androidアプリを設計する際に、`コード`を使って要素のマージンを調整する方法です。<br>
この方法は便利なだけでなく、デザインをより美しくすることができます。<br>
初心者のエンジニアでも簡単にマスターできます！<br>
一緒に学びましょう！<br>

<h1 style="background-color:powderblue;">&nbsp;&nbsp;基本的な方法</h1>

Androidで要素間のマージンを調整する方法は複数ありますが、この記事ではKotlin拡張コードを使用してマージンを設定する方法を紹介します。<br>
その前に、<br>
xmlでviewのマージンを設定する場合、<br>
最も直接的な方法は一行だけです。<br>
`android:layout_marginLeft="30dp"`<br>

場合によっては、<br>
要求者がAndroid View要素間のマージンを動的に設定するよう求めることがあります。<br>
通常、以下の方法を使用できます。<br>
<script src="https://gist.github.com/waitzShigoto/60e47ade8cf051643f9075e8157c6ded.js"></script>
<br>
この方法では、LayoutParamsをインスタンス化し、<br>
上下左右のマージンを設定してからViewにセットする必要があります。<br>
しかし、複数の場所でこのマージン設定方法を使用する必要がある場合、<br>
コードが冗長になり、保守が難しくなります。<br>

この問題を解決するために、<br>
Kotlin Extensionを使用してマージン設定方法を実装できます。<br>
これにより、コードがより簡潔で保守しやすくなります。<br>

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Kotlin Extensionを使用して実装</h1>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;ステップ0. まずは完全な拡張関数を示します</h4>
<script src="https://gist.github.com/waitzShigoto/b884affe0c15221ec627ae3faa3c1dfa.js"></script>

<p class="table_container">
  このコードはすでに直接使用できます。<br>
  プロジェクトにコピーして、<br>
  直接viewを呼び出すだけです！<br>
  vb.btConfirmZero.margin(top = 0F)<br>
  vb.btConfirmOne.margin(bottom = 30F,right = 2F)<br>
  vb.btConfirmTwo.margin(bottom = 10F,left = 3F) <br>
  <a class="link" href="#step5" data-scroll>ここまで理解できたら、直接ステップ5に進んでください。</a>
</p><br>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;ステップ1. どのように実装するか？</h4>
<div class="c-border-content-title-4">
  まず、以下のように関数を作成します。
</div><br>
<script src="https://gist.github.com/waitzShigoto/9aec2350bcd7231a162da047508d76be.js"></script><br>

<div class="table_container">
  <p>上記のコードの説明</p>
  <ol class="rectangle-list">
    <li>
      <a href="https://kotlinlang.org/docs/lambdas.html#function-types" target="_blank">
        ここでは、blockという名前のfunction typeを渡します。<br>
        これはKotlinの変数の一種です（他の言語にもあるかもしれませんが、Javaはまだサポートしていません）。<br>
          <b style="color:blue;">（Function typeの説明はこちらを参照:クリック）</b><br>
          Function typeを使用すると、lambdaを操作できます（Javaにもlambdaがありますが、現在のところfunction typeはありません）。
      </a>
    </li>

<li>
  <a href="javascript:void(0)">
    我々はここでジェネリックを使用しています<br>
    そして型変換を使用してジェネリックを変換しました<br>
    コンパイル時に暗黙の型キャストと見なされてエラーが発生する可能性があります<br>
    したがって、明確なクラスがない場合<br>
    直接キャストすると<br>
    <b style="color:red;">`xxxxClass cannot be cast to zzzzClass` </b>のようなエラーが発生する可能性があります<br>
    または、一部のコンパイラは直接<b style="color:red;">`unchecked cast`</b>警告を表示します<br><br>

    もちろん、clazz: Classのようなものを渡して実際のクラスを判断することもできます<br>
    しかし、そうするとコードが増えます<br>
    クラスが多くなると、さらに多くのコードを書き、同じことを繰り返すことになります...など<br><br>

    したがって、ここでは`reified`を解決策として使用しました<br>
    これは、この種の問題を解決するためにKotlinが提供する使い方の一つです<br>
    -> reifiedを使用するには`inline`を付ける必要があります<br>
  </a>
</li>
</ol>
</div><br>

<div class="c-border-content-title-4">
  その後、次のように呼び出すことができます
</div><br>
<script src="https://gist.github.com/waitzShigoto/c5ef3ee7159011e92c8d17be233cf6a8.js"></script>
<div class="table_container">
  <p>上記のコードの説明</p>
  <span>
    ここでは、異なる<b>ViewGroup.LayoutParams</b>に対応するためです<br>
    将来、<b>ViewGroup.LayoutParams</b>を継承する実体クラスが増えた場合<br>
    より柔軟に操作できるようにします<br>
  </span>
</div><br>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step2. dpをpxに変換するメソッドを書く</h4>
<script src="https://gist.github.com/waitzShigoto/52153b7712fde5257aaeab83b3c2ce7f.js"></script>

- ここは非常に簡単です
  主に間隔を設定する際にピクセルを使用するため
  変換メソッドを書きました

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step3. 拡張したlayoutParamsを使用してレイアウトのパラメータを変更する</h4>
<script src="https://gist.github.com/waitzShigoto/b64909a750c6a73306a1d1885f763f67.js"></script>
<div class="table_container">
  <p>上記のコードの説明</p>
  <span>
    ここでは、先ほど書いた<b>View.layoutParams</b>を使用して設定したいビューを操作します<br><br>

    以前はJavaで設定する際、必ず上下左右の4つのパラメータを一度に入力する必要がありました<br>
    したがって、ここでは<br>
    <b>left: Float? = null, top: Float? = null, right: Float? = null, bottom: Float? = null</b><br>
    として、4つの位置の間隔をすべてnullに設定します<br>
    そしてKotlinのnull安全の特性を使用してチェックします。例えば<br>
    <b>left?.run { leftMargin = convertDpToPixel(this) }</b><br>
    値がある場合にのみマージンの間隔値を設定します<br>
    null例外を心配する必要がなく、変更したい位置だけを柔軟に入力できます<br>
  </span>
</div><br>

<h4 id="step5" style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step5. 最後に簡単に使用する</h4>

<script src="https://gist.github.com/waitzShigoto/6e721513ab6c92dc05ab2e61ef716c1f.js"></script>
