---
layout: post
title: "[Android][Memory]記憶体最適化+GC管理関連概念の共有"
date: 2021-10-05 17:42:21 +0800
image: cover/ea-website-android-memory.png
tags: [Android,Kotlin]
categories: Android教學
---


今日のこの投稿<br>
メモを書く方法を通じて<br>
私が理解しているAndroidのメモリ管理について記録しようと思います<br>
ここでは同じメモに継続的に更新する予定です<br>
もしもっとAndroidのメモリ管理知識を読んだら<br>
それを一つの投稿に集中させたいと思います<br>


<h2>Android Memory Note</h2>
<br>
heap：<br>
Android仮想マシンはheap内のメモリ割り当てを継続的に追跡します<br>
heapはシステムが割り当てたjava/kotlinオブジェクトを格納するためのメモリ領域です<br>

garbage collection(gc):<br>
 その目的は以下を達成するためです：
<br>

* 使用されていないオブジェクトを探す
* これらのオブジェクトが使用しているメモリを回収し、heapに返す

マルチタスク環境では<br>
Androidは各heapのサイズを制限します<br>
このサイズはAndroidデバイスの利用可能なRAMの量に基づいて決定されます
<br><br>

さらに<br>
heap容量がいっぱいになると<br>
システムがまだメモリを割り当てようとすると<br>
OutOfMemoryErrorが発生する可能性があります<br>


<h2>Frequent Garbage Collection</h2>
<br>
以前、海外の記事でGCをmemory churnとも呼んでいました<br>
言い換えれば<br>
GCは通常、短時間でメモリが必要なときに発生します<br>
heap空間が不足しているため<br>
アプリにheapを割り当てる必要があると同時に<br>
heap空間を解放して不足を補う必要があります<br>
したがって、頻繁にGCが発生するとメモリ関連の問題が発生する可能性があります

例を挙げると：<br>
同時に<br>
アプリが大量のメモリ空間をオブジェクトの作成に割り当てる必要がある場合<br>
しかしheap空間が不足しているため<br>
GCがトリガーされてheap空間を回収します<br><br>
しかし、この繰り返しの過程で<br>
アプリがフリーズすることがあります<br>
この時点では通常、oomは表示されません<br><br>
しかし、フリーズやクラッシュが発生し<br>
ユーザー体験が悪化します<br>


コード付きの例を挙げると：

<script src="https://gist.github.com/waitzShigoto/5654e03a5aa77334bf536c298fe0df88.js"></script><br>
これは一般的なRecyclerViewの実装アダプタです<br>
その中のbind()は新しいデータが生成されるときのロジックを実現するためのものです<br>

```
val demoBitmap = BitmapFactory.decodeResource(itemView.context.resources, R.drawable.bg_demo_photo)
```
このbind()内には固定の画像をitemに読み込むコードがあります<br>
ここに置くと<br>
bindされるたびにitemが再度bitmap画像を読み込むことになります<br>
少量の画像や小規模なプロジェクトでは違いを感じないかもしれませんが<br>
大量に繰り返し読み込む場合や<br>
itemが100個、1000個ある場合<br>
それぞれが繰り返し読み込むと<br>
heap容量の消費が非常に大きくなります<br>

したがって、最も簡単な方法は固定のものを一度だけ読み込むように変更することです<br>
<script src="https://gist.github.com/waitzShigoto/baac7167d917ce9633f7d9346b3244ed.js"></script>

または、サードパーティのライブラリを使用して画像をキャッシュに保存し<br>
読み込み回数を減らすこともできます<br>
もちろん、キャッシュを使用するとOOMが発生する可能性もあるため<br>
特定の条件下でキャッシュをクリアする必要があります<br>
プロジェクトで遭遇する問題に応じて最適化できます<br>


<h2>Android Memory Leak</h2>
<br>


gcが解放できないオブジェクトの参照漏れ<br>
それはどこかでこの参照がまだ必要だと考えているためです<br>
このような状況は通常、メモリリークと呼ばれます<br>

Inner Classes : 内部クラスと外部クラスが参照を持つと、メモリリークが発生する可能性があります<br>
例：
<script src="https://gist.github.com/waitzShigoto/f7cf2cefdda47552aef1ea21ac0f1e37.js"></script>
上記のコードのように<br>
内部クラスが外部のshowResultを参照しているため<br>
AsyncTaskがバックグラウンドで実行されると<br>
activityが終了しても<br>
AsyncTaskがまだ実行されている可能性があり<br>
そのためメモリリークが発生する可能性があります<br>

問題を解決するためのアプローチ<br>
外部クラスのメソッド呼び出しを削除する<br>
または他の方法で外部クラスにアクセスする<br>
例えば弱参照を使用する<br>
<script src="https://gist.github.com/waitzShigoto/14c2eb371a77d2a2425180dd865a2ebe.js"></script>

弱参照を使用しても外部クラスにアクセスできます<br>
しかし、強参照のように強力ではないため、メモリ内に持続的に保持されることはありません<br>
ガベージコレクタがオブジェクトの強参照を見つけられない場合、それを探してnullに設定します<br>

匿名クラス: 一部の匿名クラスは外部クラスよりも長く生存することがあります<br>
これがメモリリークを引き起こします<br>

静的変数: companion objectやstaticを使用してクラスを修飾すると<br>
オブジェクトが最初からロードされ<br>
その後解放されない<br>
これがメモリリークを引き起こします<br>
例えば static activity
