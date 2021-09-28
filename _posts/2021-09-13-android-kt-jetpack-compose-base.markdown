---
layout: post
title: "[Android][Kotlin][JetpackCompose]基礎篇(0) - JetpackCompose view元件範例"
date: 2021-09-13 16:00:48 +0800
image: cover/ea-website-base-cover-photo.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
---

在2021/7/28的時候<br>
google官方終於發佈了Jetpack Compose 穩定版1.0了 <br>
有興趣看官網發布文的可以看 <a href = "https://android-developers.googleblog.com/2021/07/jetpack-compose-announcement.html">這裡</a> <br>

<br>
那今天這篇我打算來分享一些基本的如何用jetpack compose來做一些元件用在android app上面
<br>
<br>
Jetpack Compose是一種完全用kotlin程式碼 <br>
去取代原本用.xml檔寫的view或layout <br>
寫出來只會有.kt檔案 <br>
減少了大部分的xml檔。 <br>

而在jetpack compose 裡面用了大量kotlin中獨有的特色：

* Lambda expression
* Function type
* Extension
* Named argument

<br>
所以如果先前對上述kt概念已經很熟悉了<br>
對學習Jetpack Compose就有很大優勢<br>
幾乎沒多久就能上手。<br>


首先我們先看看兩者的差異<br>
<br>
像是這是使用 xml 寫一個簡單toolbar的方式：<br>
<script src="https://gist.github.com/KuanChunChen/46bbdced14c9e3c26023854bed33c60d.js"></script><br>

而這則是用jetpack compose來寫toolbar的長相：<br>

<script src="https://gist.github.com/KuanChunChen/80743e79901a8c98b87655ff8f020193.js"></script><br>

這樣的改變使得view可以完全用程式碼去控制了<br>
也可以更方便的用一些function type的變數<br>
去控制view想要實現的功能<br>
也因為變成純程式碼去實作<br>
能更靈活的用判斷式去顯示與否你的view<br>


<h2>具體做法</h2>
<h4>前言</h4> <br>
最後做出來在IDE預覽可能會長成這樣<br>
左邊寫code右邊是用預覽畫面
<br>

<div align="center">
    <img src="/images/jetpack_compose/jc01.png" alt="Cover" width="100%" >  
</div>

做了幾個base的widget<br>
後面實際加入activity或fragment時<br>
可以再根據需求去重複使用

這邊前期準備工作<br>
必需更新android studio到Arctic Fox版本<br>
才能像上面一樣預覽view<br>

還沒下載的可參考：

<a href="https://developer.android.com/studio?hl=zh-cn" class="btn btn-primary" role="button">下载 Android Studio Arctic Fox</a>
<br>
<br>

<h4>第一步</h4>
先加入相關lib 至 gradle dependencies內 :<br>
<script src="https://gist.github.com/KuanChunChen/c18119da90591482e2f6f5b6cb67bdec.js"></script>
<br>
<br>
<br>

<h4>第二步</h4>

加入@Composable用以來說明你的這個fun是jetpack compose的元件<br>
<script src="https://gist.github.com/KuanChunChen/d8ecd7b8977a5d2e11cb89e00b1e2d04.js"></script>
<br>
<br>
<br>
那這裡的

```
Modifier
```
其實是jetpack compose 滿常用到的一個擴充元件屬性的interface <br>
這邊用變數形式帶入fun <br>
等於是說你要呼叫你的元件AppBar時 <br>
可以自定義Modifier去設定該元件的背景色、動畫、字體等等 <br>

<h6>(會根據你用的官方元件能設定的內容不同，主要是看該元件的Modfier怎impl的) </h6>
<br>

---
<font color="green">選擇性(optional) </font>
```
這邊可以加入 Column 來排序你用jetpace compose 做出的view<br>
有點類似 linear layout的vertical 方式<br>
如果你要加入複數個元件的話
```
<script src="https://gist.github.com/KuanChunChen/203f5c350db588cc6b3730f9b326710c.js"></script>
---


開始加入官方lib內建的funtion 直接快速做出一個toolbar<br>
例如 TopAppBar<br>
<script src="https://gist.github.com/KuanChunChen/66d842982f99a753c786594e918abe16.js"></script>

那這邊你會看到一些<br>

```Kotlin
modifier = ... ,
backgroundColor = ...,
elevation = ...,
contentColor = ...,
```
...之類的東西<br>
<br>
其實就是利用 kt內特性  Named argument 跟 function type 等<br>
讓你在用fun時更能有效的去擴充程式碼<br>

另外，這邊我們就可以利用funtion type變數<font color="red">
content: @Composable RowScope.() -> Unit</font>
去加入一個Image 在TopAppBar左邊：<br>

(這邊你可以按cmd+左鍵 去看TopAppBar的源碼知道RowScope在幹嘛)


<script src="https://gist.github.com/KuanChunChen/049c22e6449d00c4aa529c33fc6cb76f.js"></script>

<br>
到這邊就快速完成一個易擴充、能重複用的簡單widget了..
<br>

<h4>第三步</h4>
那要開始預覽的話要怎麼用呢？
你只要再寫一個fun並加入 @Preview
再按下refresh就能看到IDE右邊會顯示你剛剛做的view了
(如果沒看到可以點 右邊Design 或 split來打開預覽畫面)

<script src="https://gist.github.com/KuanChunChen/eac588083154d8faf5c8f15fff868798.js"></script>
<br>
<h4>第四步</h4>
那實際應用上<br>
你可以再包成一個content讓你去呼叫<br>
這樣你的畫面就能分得很細<br>
未來再維護上會更有效率<br>
<br>

像是這樣來包一個完整邏輯的layout<br>
這樣你未來要改layout長相就能從這裡改<br>
你的基本元件有的一些功能就不用特別修改<br>
<script src="https://gist.github.com/KuanChunChen/34565f4c1e1394cb2e5b1d50ded7093b.js"></script>

實際做出來：
<div align="center">
    <img src="/images/jetpack_compose/jc02.png" alt="Cover" width="100%" >  
</div>
<br>
<h4>最後一步</h4>
完成上面的步驟<br>
你就可以在fragment或activity裡設定你的layout了<br>
相當簡潔<br>
<script src="https://gist.github.com/KuanChunChen/d697201a60570da069cd3cc4f0ce425c.js"></script>
