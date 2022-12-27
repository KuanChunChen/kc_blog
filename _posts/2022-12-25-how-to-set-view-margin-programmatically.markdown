---
layout: post
title: "[Android][Kotlin][Clear Code]如何優雅的用程式碼在各種layout動態設定view margin"
date: 2022-12-25 17:05:12 +0800
image: cover/android-photo.jpg
tags: [Android,Kotlin,Extension]
permalink: /clear_use_extension_to_set_margin
categories: Android
---

<h1 style="background-color:powderblue;">&nbsp;&nbsp;前言</h1>

今天這篇主要是紀錄一下 <br>
使用Kotlin extension的作法<br>
這個方法我個人認為很漂亮<br>
所以特別跟大家分享一下!<br>


<h1 style="background-color:powderblue;">&nbsp;&nbsp;基本的方法</h1>

首先<br>
可以先了解下<br>
在xml裡面設定view間距的話<br>
可能就是一行而已<br>
`android:layout_marginLeft="30dp"`<br>

但有些情況下<br>
想動態設定margin值時<br>
一般早期的方法會用:<br>
<script src="https://gist.github.com/KuanChunChen/60e47ade8cf051643f9075e8157c6ded.js"></script>
<br>
實例化一個LayoutParams並設定上下左右間距後<br>
再set到你的view<br>

但這樣如果你多處都要set的話<br>
就會覺得挺麻煩<br>
每處都要寫一次一樣的code<br>
就會讓版面看起來很亂<br>

或你可以寫一個kotlin object 單例<br>
這樣也能減少相當一部分的code<br>
那還有其他方法嗎？<br>
這時就可以用kotlin extension 去實作

<h1 style="background-color:powderblue;">&nbsp;&nbsp;使用kotlin extension來完成</h1>

所以這邊用了extension去擴充<br>
<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;實際擴充的code</h4>
<script src="https://gist.github.com/KuanChunChen/b884affe0c15221ec627ae3faa3c1dfa.js"></script>
<br>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;首先先擴充一個View類命名為layoutParams</h4>
<script src="https://gist.github.com/KuanChunChen/9aec2350bcd7231a162da047508d76be.js"></script>
<br>

 - 這邊我們傳入一個 function type 命名為block<br>
   它其實就是一種Kotlin變數(可能別的語言也有 但是Java還沒支援)
    - 可以參考：[Kotlin function type](https://kotlinlang.org/docs/lambdas.html#function-types)<br>


 - 使用function type 可以讓你用lambda去操作(Java雖有lambda，不過目前並沒有function type)

 - 我們這邊使用泛型<br>
   且用了型別轉換去轉換泛型<br>
   有可能因為編譯時被認為是隱式型別強轉而產生錯誤<br>
   因此如果在沒有明確類別<br>
   直接強轉則可能遇到<br>
   `xxxxClass cannot be cast to zzzzClass` 這種的錯誤<br>
   或是有些編譯器會直接提示你 `unchecked cast` 警告語

 - 當然你也可以 帶入clazz: Class之類的 來判斷實際的類是什麼<br>
   但這樣code會變得更多<br>
   當類別一多時就會很麻煩、一直做重複的事...等等
   或是得寫更多的code

 - 所以這邊用了`reified`來作為解決方法，他是一種kotlin提供來解決這類問題的一個用法
   - 使用reified必需帶`inline`
   <br>


 - 最後這個步驟，<br>
   其實就是為了符合不同的`ViewGroup.LayoutParams`<br>
   讓未來如果有更多繼承`ViewGroup.LayoutParams`的實體類想進行操作<br>
   可以更有彈性<br>

   以我們這個例子就是想動態操控view與parent view的間距<br>
   用程式碼在runtime時<br>
   能夠隨判斷進行設置<br>
   所以用了`MarginLayoutParams`<br>

   亦即是如果你這次想要用別的LayoutParams<br>
   你也可以直接用該LayoutParams去操作裡面的method<br>
   例如:
   <script src="https://gist.github.com/KuanChunChen/c5ef3ee7159011e92c8d17be233cf6a8.js"></script>
   但如果今天純論我們這個例子的話<br>
   其實也可以省略這整個步驟<br><br>
   但因為也許在某些情況我們還需要設定其他的layout的params的話<br>
   就可以直接使用這個extension<br>
   這樣到時候還要改的話<br>
   效率就會比較好一些<br>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;寫一個dp to px的method</h4>
<script src="https://gist.github.com/KuanChunChen/52153b7712fde5257aaeab83b3c2ce7f.js"></script>

  - 這邊很簡單
  主要是為了配合設定間距時使用的是pixel
  所以寫了個轉換方法

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;透過擴充好的layoutParams去對layout的parameter做修改</h4>
<script src="https://gist.github.com/KuanChunChen/b64909a750c6a73306a1d1885f763f67.js"></script>

  - 這邊就透過剛剛的寫好的View.layoutParams去操作我們要設定的view

  - 以前在java要設定都一定要一次輸入上下左右四個parmater<br>
  因此這邊我們用<br>
  `left: Float? = null, top: Float? = null, right: Float? = null, bottom: Float? = null`<br>
  來預設四個位置的間距都是null<br>
  再使用kotlin null safe的特性去檢查，如<br>
  `left?.run { leftMargin = convertDpToPixel(this) }`<br>
  這樣我們既不用擔心會null exception又能彈性的只輸入我們想改的位置就好<br>

  - 最後輕鬆使用：
  <script src="https://gist.github.com/KuanChunChen/6e721513ab6c92dc05ab2e61ef716c1f.js"></script>
