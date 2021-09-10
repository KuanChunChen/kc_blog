---
layout: post
title: "[Android][Kotlin][Custom View]客製UI心得分享（0）：前導篇－左右切換view與動畫的下拉欄"
date: 2020-11-14 15:30:18 +0800
image: android-photo.jpg
tags: [Android,Kotlin]
categories: Android
---
---

Hello,大家好,這裡是Elegant Access的 KC
平時是一位Android Developer ,擅長的語言是Kotlin ，Java ，喜歡的開發風格是使用封裝 ,抽象與泛型…等觀念去開發，因為我認為，在實現app的過程中，應該保持coding版面的乾淨，一方面可以增加code reuse的可能，也能降低一些冗余程式碼的產生，未來當你寫出更多code要來維護時，你也能一目瞭然的知道你是怎麼寫的，所以對我來說善用各種觀念與不同design parttern或架構去完成一個project是我對自己基本的要求，當然，寫code肯定有比你更強的人在寫，所以除了用過去學習過的方法去寫code, 我也會不停增加自己的經驗，像是最近就在惡補 receiver type & extension 的用法，在未來也希望能分享給各位，接著就進入正文吧：

---


首先最容易讓人理解的方式，就是直接先上影片，效果如影片：

<div align="center">
  <img src="/images/kt-demo-git01.gif" alt="Cover" width="30%"/>
</div>

<p> </p>
<p> </p>
在這個demo裡面你會看到的有：

<ol>
  <li>下拉bottom sheet</li>
  <li>Recycler view 左右滑動</li>
  <li>Recycler view 中每個Item點擊時切換</li>
  <li>Recycler view初始化時置中</li>
  <li>Recycler view 中Item margin設置</li>
  <li>WebView 跳轉到應用程式</li>
</ol>


我也繼承了下面的一些類（只列出主要用到的類）有

<ol>
  <li>LinearLayoutManager</li>
  <li>BottomSheetBehavior</li>
  <li>ItemDecoration</li>
  <li>OnScrollListener …等等，還有其他的類就不一一列出來了。</li>
</ol>



本篇我會先介紹這個demo 的一些特色，如下：
像是能夠隨著滑動，正中央imageView淡入，淡出的效果。

<div align="center">
  <img src="/images/kt-demo-jpg01.jpeg" alt="Cover" width="30%" >
  <img src="/images/kt-demo-jpg02.jpeg" alt="Cover" width="30%" >
</div>


第二步，就是客製出一條左右滑動的recycler view，包含：
<ol>
  <li>客製化recycler view 包含其中細項的調整</li>
  <li>間距設置</li>
  <li>滑動時動畫（字體變色，漸層，變更view等）</li>

</ol>

<div align="center">
  <img src="/images/kt-demo-jpg03.jpeg" alt="Cover" width="30%" >
  <img src="/images/kt-demo-jpg04.jpeg" alt="Cover" width="30%" >
</div>

<br>
<br>
<br>
最後，就是比較常見的就一些參數調整，<br>
色碼設置，<br>
或其他view區塊設置等等，<br>
如果喜歡的接下去看吧！<br>

請參考：

<div align="start">
  <a href="{{site.baseurl}}/2020/11/20/android-kotlin-custom-view-02/">
    <img src="/images/android-photo.jpg" alt="Cover" width="30%" >
  </a>

  <a href="{{site.baseurl}}/2020/11/20/android-kotlin-custom-view-02/">[Android][Kotlin][Custom View]客製UI心得分享（1）：實作篇 - 建立基本的custom view</a>
</div>

<br>

Created by Elegant Access's KC.<br>
Copyright (c) 2020 All rights reserved.<br>
Instagram  : https://www.instagram.com/eleg.aces.kc/<br>
Github : https://github.com/KuanChunChen<br>
