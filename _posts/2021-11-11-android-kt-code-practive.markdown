---
layout: post
title: "[Android][Kotlin][CodingTest]刷題練習紀錄"
date: 2021-11-11 12:55:12 +0800
image: cover/android-photo.jpg
tags: [Android,Kotlin,Coding]
categories: Coding
---

其實這篇文章是想紀錄<br>
之前面試被問到的題目的寫法<br>
以kotlin為主<br>
可能包含時間內沒寫出來<br>
所以想雪恥之後再寫的<br>


<h1>題目1</h1>
給定一個字串，內包含(,),{,},[,]等符號，如果符號有對稱到則返回true,反之false:<br>

首先上我的解法：<br>
<script src="https://gist.github.com/KuanChunChen/fc855c0ab9c4667df49b253595744d08.js"></script><br>

概念：<br>
主要是先取字串長度 中位數 並 轉 將字串換成array
```
      val strMedium = str.length / 2
      val strArray = str.toCharArray()
```

並將字串分成前後片段來看
類似二分法
分別比較對應的位置是否有對應的符號


```
    for (index in 0 until strMedium) {
           val prefixString = strArray[strMedium - index - 1].toString()
           val suffixString = strArray[strMedium + index].toString()

           when (prefixString) {
               "("->{ if (suffixString!=")")return false}
               "{"->{ if (suffixString!="}")return false}
               "["->{ if (suffixString!="]")return false}
           }
       }


```

沒有返回false
如果都正確
則執行最後一行true 
