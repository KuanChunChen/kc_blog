---
layout: post
title: "[Android][Memory]記憶體優化+GC管理相關概念分享"
date: 2021-10-05 17:42:21 +0800
image: cover/ea-website-android-memory.png
tags: [Android,Kotlin]
categories: Android教學
---


今天這篇<br>
打算來透過寫筆記的方式<br>
記錄關於我所了解的Android記憶體管理<br>
這邊我打算會持續更新在同一個筆記內<br>
如果我有讀到更多的Android記憶體管理知識<br>
我會想要把它集中在同一篇<br>


<h2>Android Memory Note</h2>
<br>
heap：<br>
Android virtual machine 會持續追蹤heap中的記憶體分配<br>
而heap是一塊記憶體用來存放系統分配的 java / kotlin object<br>

garbage collection(gc):<br>
 其在Android中的目標只為了達成以下：
<br>

* 尋找用不到的objects
* 回收這些objects用到的記憶體並將其返回給heap

而在mutli-task環境中<br>
Android會限制每個heap的size<br>
這個size會根據Android裝置有多少可用RAM決定
<br><br>

另外<br>
當heap容量塞滿時<br>
如果系統還嘗試分費記憶體<br>
就有可能會得到 OutOfMemoryError <br>


<h2>Frequent Garbage Collection</h2>
<br>
之前看國外文章他也稱GC為 memory churn<br>
換句話說就是 <br>
GC通常發生在短時間內需要記憶體時<br>
由於heap空間不足<br>
同時需要分配heap給app用<br>
又需要同時解除heap空間來補充空間不足<br>
所以如果頻繁觸發GC也會造成記憶體相關問題

來個例子：<br>
同一時間<br>
APP需要大量分配記憶體空間給你創建的objects<br>
但因為heap空間不足<br>
所以觸發了gc去回收heap空間<br><br>
但因為一來一往的迭代中<br>
造成app卡住<br>
這時候通常不會顯示oom<br><br>
但卻造成卡頓或當機<br>
進而讓使用者體驗不佳<br>


給個帶有code的例子：

<script src="https://gist.github.com/waitzShigoto/5654e03a5aa77334bf536c298fe0df88.js"></script><br>
這個是常用的recycler view的實作adapter <br>
那其中的bind()就是用來實現新的資料要產生item時的邏輯<br>

```
val demoBitmap = BitmapFactory.decodeResource(itemView.context.resources, R.drawable.bg_demo_photo)
```
在這段bind()裡有一個固定的圖片要載入item內<br>
若放在這裡<br>
意思就會是每次bind時item都會重新加載一次bitmap圖片<br>
若是在少量圖片或小專案中不會感覺到有所差異<br>
但是當大量重複加載<br>
或者當item有100個、1000個時<br>
每個都重複加載<br>
那對heap容量的消耗是相當大的<br>

因此最簡單的方式可以把固定的東西改為只加載一次<br>
<script src="https://gist.github.com/waitzShigoto/baac7167d917ce9633f7d9346b3244ed.js"></script>

或是也可以用一些第三方的lib去將圖片存入緩存<br>
進而減少加載的次數<br>
當然使用緩存也是有可能造成OOM<br>
所以也需要定義或特地條件下必需清除緩存等<br>
可以根據專案遇到的問題去優化<br>


<h2>Android Memory Leak</h2>
<br>


gc 無法清除掉的object leak 的 reference<br>
因為它認為可能有些地方還需要使用這個reference<br>
同常這種情況就稱為memory leak<br>

Inner Classes :當內部類與外部類有reference時，有可能產生memory leak<br>
例如：
<script src="https://gist.github.com/waitzShigoto/f7cf2cefdda47552aef1ea21ac0f1e37.js"></script>
像是上面這段code<br>
就是因為內部class存取了外部showResult<br>
而因為AsyncTask會在背景執行<br>
可能遇到activity已經finish了<br>
但AsyncTask還在執行<br>
因此可能造成memory leak<br>

解決這問題的思路<br>
可以把呼叫外部類的方法拿掉<br>
或是改用其他方法去存取外部累<br>
如可以使用弱引用<br>
<script src="https://gist.github.com/waitzShigoto/14c2eb371a77d2a2425180dd865a2ebe.js"></script>

用weakreference依舊可以存取外部類<br>
不過他不會像是強引用一樣強以至於不會持續保留在記憶體內<br>
當gc沒有找到object的強引用時則會去找它並將到設為null<br>

Anonymous Classes:有些匿名類存活的時間比外部時間長<br>
造成memory leak<br>

Static Variables: 使用companion object 或static 來修飾某些類時
會造成object一開始就載入<br>
之後釋放不掉<br>
導致memory leak<br>
例如 static activity
