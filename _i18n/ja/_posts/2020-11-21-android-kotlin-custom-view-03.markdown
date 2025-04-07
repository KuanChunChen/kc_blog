---
layout: post
title: "Android Kotlin カスタムUIのテクニック－左右スワイプビューとアニメーションのドロップダウンメニューのチュートリアル - 03"
date: 2020-11-21 15:44:20 +0800
image: cover/android-photo.jpg
permalink: /android/custom03
tags: [Android]
categories: Android實作
excerpt: "このチュートリアル記事では、Android Kotlinを使用してカスタムUIのテクニックを学びます。具体的には、左右スワイプビューとアニメーションのドロップダウンメニューを実現する方法について説明します。"
---
Hello, 皆さんこんにちは、Elegant AccessのKCです。<br>
カスタム実装の続きをご覧いただきありがとうございます。<br>
今日は、左右にスワイプするRecyclerViewの実装方法と、その調整方法について説明します。<br>
スワイプ時にページャーのような感覚を持たせ、アイテム間に間隔を設ける調整方法についても触れます。それでは、さっそく見ていきましょう！


<br><br>
効果図：
<br>
<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg08.png" alt="Cover" width="30%"/>
</div>


まず最初のステップは非常に簡単で、RecyclerView用のアダプターを定義することです。ここでは、まずアイテムのXMLを作成することから始めます。以下のようになります：

<script src="https://gist.github.com/waitzShigoto/b1a45501587bf59e8008b261c8439f72.js"></script>


<br><br>


次に、アダプターを定義し、先ほど作成したアイテムをロードします：
<br><br>

私はカスタムのBaseListAdapterを使用するのが好きです。<br>
このクラスではジェネリックを使用して、<br>
後でアダプターに渡すデータを置き換えることができます。<br>
そして、アダプター内でこのアダプター専用のViewHolderを作成します。<br>
同様にジェネリックを使用して、将来的に似たようなコードを書く必要がある場所を置き換えます。<br>
そのため、以下のようになります：<br>

<script src="https://gist.github.com/waitzShigoto/8718aaf48a1806a57d97471fb5b9c7b0.js"></script>
上記のアダプターでは、<br>
コードが非常に少なくなっています。<br>
なぜなら、先に抽象クラスを書いておいたからです。<br>
<br><br>

また、私のベースアダプターは以下のようになります。<br>
主にいくつかのメソッドを抽象化しています：

<script src="https://gist.github.com/waitzShigoto/9e90e3f602e0f4029205fe3d3b3b1155.js"></script>


ここでは、抽象化したメソッドについて説明します。
ItemViewの実装を要求します。<br>

```kotlin
@LayoutRes protected abstract int getItemViewLayout();
```
これは、作成したアイテムのXMLを渡すためのものです。<br>
次回からは同じコードを繰り返し書く必要がなくなります。


次に、ViewHolderを定義し、<br>
BaseListAdapter内のBaseViewHolderを継承します。<br>
これも、将来的に基本的なViewHolderの内容を再度書く必要がないようにするためです。<br>

さらに、このベースアダプターには他の汎用機能もいくつか書いてあります。
必要に応じて参照してください。
必ずしもすべて書く必要はありません。

<br>
結論としては、
上記のコードのようにいくつかの関数をオーバーライドするだけで、<br>
RecyclerViewアダプターの機能を実現できます！<br>
私のBaseListAdapterクラスではRecyclerView.Adapterを継承し、<br>
RecyclerViewアダプターが継承する必要がある以下の関数を実装しています：<br>

*   getItemViewType(position: Int)
*   onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int)
*   getItemViewType(position: Int)
*   getItemCount()
*   onCreateViewHolder(parent: ViewGroup, viewType: Int)...などの関数、<br>
<br>


これらはすべてRecyclerViewを作成する際に必要な継承部分です。<br>
RecyclerViewを頻繁に使用することを考慮し、また怠け者なのでXDD、<br>
将来的に他の場所や他のプロジェクトでも使用する可能性があるため、<br>
将来の拡張性も考慮した抽象クラスを書く習慣があります。<br>
これにより、後で使用する際にも便利に取り扱うことができ、<br>
変更が必要な場合は親クラスで直接変更でき、<br>
継承するだけで使用できるため、<br>
本当に時間を節約し、重複したコードを減らすことができます！

<br>

現在、基本的なRecyclerViewの構築が完了しました。<br>
以下のコードを呼び出すだけで、<br>
基本的なRecyclerViewが得られます:<br>

<script src="https://gist.github.com/waitzShigoto/16987a5a8f9039f913b3e490da226e76.js"></script>

ここでのswitchRecyclerViewは前回の記事
  <a href="{{site.baseurl}}/2020/11/20/android-kotlin-custom-view-02/">[Custom View]カスタムUIの心得共有（1）：実装編</a>
で言及したカスタムビューです。忘れた方はご覧ください。

<br>

次に、RecyclerViewに以下の効果を達成するために:<br>
<ol>
  <li>端までスクロールしたとき、RecyclerViewが端から離れて中央に見えるようにする</li>
  <li>各アイテム間に一定の間隔を設ける</li>
</ol>

そのために、RecyclerView.ItemDecoration()を継承する必要があります。以下のように:

<script src="https://gist.github.com/waitzShigoto/3df59c6aec3f5e11f983b8f0ac811cf3.js"></script>

<br>

ここでは、各アイテム間に間隔を設けるために、<br>
mSpace変数を設定しました。<br>
これはアイテム間の間隔を指定するためのものです。<br>
したがって、override getItemOffsetsの後に、<br>
Rectを使用して各アイテムの間隔を設定します。例えば:<br>
```
outRect.left = mSpace
```
<br>
しかし、端までスクロールしたときにアイテムが中央に見えるようにするために、<br>
sideVisibleWidth変数を定義しました。<br>
この変数の計算方法は以下の通りです:<br>

```
(画面幅のピクセル - 各アイテムのピクセル)/2 - 予期される左/右のマージンのピクセル
```
<br>
この計算方法は少し難しいかもしれませんが、<br>
少し考えれば理解できます。<br>
ここで細かく説明すると、RecyclerViewは最初に画面の左端または上端から始まります。<br>
この例では横向きなので左端から始まります。考え方はこうです:<br>
左端または右端までスクロールしたときに一定の距離を保ち、<br>
RecyclerViewのアイテムが中央に見えるようにしたいので、<br>
画面幅の半分を取得し、アイテムの長さの半分を取得する必要があります。したがって:<br>

```
画面幅のピクセル/2 - 各アイテムのピクセル/2
```
<br>

これは、半分の画面幅と半分のアイテムの距離を計算することを意味します。<br>
これにより、中央に見えるようになりますが、左端または右端にいるときには、<br>
追加のマージンを定義する必要があります。したがって、指定されたピクセルを引く必要があります。<br>
これを組み合わせると、最初に示した計算式になります:<br>

```
(画面幅のピクセル - 各アイテムのピクセル)/2 - 予期される左/右のマージンのピクセル
```

したがって、コードに変換すると:<br>
```
var sideVisibleWidth =      
//整個螢幕width的pixel  
(context.resources.displayMetrics.widthPixels
//每個item的一半
- ScreenUtil().convertDpToPixel(70F, context).roundToInt()) / 2
//預期間隔多少的pixel
- ScreenUtil().convertDpToPixel(28F, context) .roundToInt()
```
<br>

次に、指定された条件下でアイテム間の間隔を指定するだけです。以下のように:<br>

<script src="https://gist.github.com/waitzShigoto/9a7c2bdeb1a7fc034079711d70b64e2a.js"></script>

<br>

上記のコードでは、最初のアイテムのときにsideVisibleWidthと右側の間隔mSpaceのピクセルを設定しています。<br>

ここまでで間隔の設定は完了です。次に、各移動距離を計算し、対応する動作を行うステップに進みます。

<br><br>

次に、RecyclerView.OnScrollListener()を継承してスクロール時のリスナーを計算します:

<script src="https://gist.github.com/waitzShigoto/9e98788c170b119d4da62124eb7523f3.js"></script>

<br>

ここは難しくはありませんが、少し時間がかかるかもしれません。しかし、やるべきことを明確にすれば、すぐに理解できるでしょう。<br>
このクラスでは、アイテムが現在スクロールしている位置を記録します。<br>

また、各RecyclerViewアイテムのピクセルサイズも記録します。<br>
現在のスクロール位置を記録し、スクロール量を計算して各アイテムの割合を算出し、<br>
いくつのアイテムの位置を移動したかを計算します。したがって、コンストラクタで以下を渡します:<br>

```
SwitchRecyclerScrollerListener(private var mPosition: Int, private val itemWith: Int)
```

接着override onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int)，左右にスクロールしたときの移動量を取得します。<br>

<script src="https://gist.github.com/waitzShigoto/f9f16c1c8ac7c55e4c32ffc841b07430.js"></script>

onscroll内でdxを取得します。これは左右のスクロール量を表します。<br>
スクロールするたびに一度トリガーされるので、スクロール中にその値を記録して累積します。<br>
その後、onScrollStateChangedを使用して、スクロールが停止したとき、<br>
つまりSCROLL_STATE_IDLEのときに、総移動量を計算し、移動の割合を算出します。<br>

```
val offset = scrolledWidth.toFloat() / itemWith.toFloat()
```
<br>

算出された割合は、いくつのアイテムを移動したかを示します。この値を使用して、移動ごとに何をするかをトリガーします。<br>
例えば、ここでは、移動したアイテム数が0でない場合、文字の色を変えるように設定します。例えば：

```
if (moveTotalCount != 0) {        
   mPosition += moveTotalCount     
   scrolledWidth -= itemWith * moveTotalCount
   setItemAnim(recyclerView, mPosition)      
}
```

このようにスクロール中に文字の色が変わるアニメーションが見えるようになります！<br>
ここではアニメーションのコードは書きませんが、<br>
興味がある方は私が共有したソースコードを参照してください。詳細な書き方が載っています。<br>
もちろん、あなたのニーズに応じて自分で書くこともできます！<br>
最後に、先ほど書いた継承クラスを使用するだけで、<br>
左右にスクロールできるRecyclerViewが得られます。以下は実際に使用した例です。<br>

<script src="https://gist.github.com/waitzShigoto/13e2e64e8a59b8be7a9c3dcddde81d2e.js"></script>

<br>

