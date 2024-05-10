---
layout: post
title: "Android Kotlin教學：解碼Google Maps Polyline路徑與繪製線條"
date: 2020-12-07 21:22:14 +0800
image: cover/kotlin_tutorial_google_map-1.png
tags: [Android,Kotlin,Google map]
categories: Android
excerpt: "本篇教學介紹如何使用Kotlin在Android中使用Google Map API decode polyline透過預估路徑來畫線。"
---

<div class="c-border-main-title-2">前言</div>

最近，<br>
有個需求是要在Google Map上面，<br>
將兩個經緯度之間的預估路徑畫出來。<br>
實現的方法是先在Google Map上面輸入兩個經緯度或地址，<br>
取得Google官方API回覆的路徑JSON格式，<br>
然後解析JSON內容，<br>
並透過其中的資料來繪製路線。<br>
以下是部分的JSON內容：

<script src="https://gist.github.com/KuanChunChen/37e425cb8a6b029fd9b817b155705d3a.js"></script>

**(因當路線太長時，json資料是一大包，故只截取一部分)**
但如果想看完整json檔的夥伴們，可以點 <a href="https://gist.github.com/KuanChunChen/030767a7fea9fcf4eba7cc600adc0da8">這裡</a> 觀看<br>

<div class="c-border-content-title-4">第一步：理解資料</div>
然而我們的需求是需要畫出整段行車路徑，所以預計使用剛剛取得的json資料，其中有歸納出幾個tips如下：<br>
1.取得路徑相關資訊的資料位於json內的routes的array<br>
2.routes裡面包含預估的走法，像平常用google map導航，他會跟你說 前方500m向左轉/向右轉…等等<br>
3.而這次我們的重點是要畫出兩點之間的行徑路線，所以可以直接取得json格式內routes>overview_polyline>points，裡面是一串google經過encode壓縮的編碼<br>


<div class="c-border-content-title-4">第二步：理解polyline壓縮的演算法</div>

(如果有興趣知道編碼演算法的可以看 google官方演算法)
<a href="https://developers.google.com/maps/documentation/utilities/polylinealgorithm?hl=zh-tw">google官方Polyline Encoder Utility</a>
這邊我們會透過<br>
Maps JavaScript API<br>
去拿到一串不可讀資料<br>
這串資料代表我們想要的兩點路徑<br>
因為google官方將他encode了<br>

在閱讀演算法後，大致解碼流程如下：<br>
其中包含，把每個值轉為等效的Ascii，<br>
將ascii 的 “ ? ”加入每個值（其實就是上面看到的 63 , ?的ascii就是 63），<br>
每個值與0x20做邏輯閘運算，<br>
位址reverse，<br>
位址左移，<br>
轉換為2進位，<br>
原本的經緯度乘1e5…<br>

原來在google官方文件有提到，<br>
大部分的原因是為了在傳輸過程降低大量資料造成的空間消耗，<br>
所以就是傳壓縮過的資料了<br>


<div class="c-border-content-title-4">第三步：解碼資料</div>
那為了解決這個問題，只好去找decode的方法，<br>
並預期解碼後，可以得到整個行徑路線的經緯度。<br>

我google了，實現方法很簡單，<br>
就是依照上面提到google官方演算法內的encode流程進行反向編程，<br>
將拿到的polyline encode拿去反向步驟解碼，<br>
則可以得到欲應用的經緯度陣列。<br>
所以理論上是不管在哪個語言/平台都能實現<br><br>
先把剛剛拿到的json進行解析，<br><br>

這邊我就不展示json解析的過程了，<br>
相信很多人都已經會了！<br>
接著，我們拿從google端取得的polyline encode<br>
(routes內的overview_polyline內的points)：<br>

<script src="https://gist.github.com/KuanChunChen/5099e838a2d8d9af507eb94e250b33b8.js"></script>


依照官網的流程寫出 decode function （Kotlin version），<br>
這邊提供我用Kotlin寫的例子
可以依照你的需求，修改成你需求的樣子<br>
（如修改返回的model…等等）：<br>

<script src="https://gist.github.com/KuanChunChen/17a978f6831fa8c0f2f80adffa1803ad.js"></script>
```
這裡有一個重點，經過反轉的polyline編碼，返回的經緯度是相反的，所以你在處理經緯資料的時候，記得要把位置相反過來
```
<br>
第二步，將取得polyline encode帶入decode function :<br>
<script src="https://gist.github.com/KuanChunChen/e9cf66a41cc014870cb8bab4c188a10a.js"></script><br>

解碼後，可以取得類似下方的格式<br>

<script src="https://gist.github.com/KuanChunChen/bf80d28f5abdd748f1def92a30e557ed.js"></script><br>

這樣得到我們想要畫線的經緯度陣列，即可在google map使用PolylineOption 去畫線了：<br>

<script src="https://gist.github.com/KuanChunChen/5eb77674995ca2e3422eed17825b22a6.js"></script><br>

最後畫線得出結果如圖 (紅色路徑)：<br>
<div align="center">
  <img src="/images/googlemap/map02.png" alt="Cover" width="70%"/>
</div>

另外這邊提供兩個網站，可以直接線上解碼，<br>
讓你在開發時，測試自己的decode結果是不是對的<br>

<ol>
  <li>
    <a href="https://developers.google.com/maps/documentation/utilities/polylineutility">google官方Polyline Encoder Utility)</a>
  </li>

  <li>
    <a href="https://open-polyline-decoder.60devs.com/">open-polyline-decoder(非官方)</a>
  </li>

</ol>

覺得我的文章有幫助到你的小夥伴，請不吝嗇的給我些鼓勵吧！
