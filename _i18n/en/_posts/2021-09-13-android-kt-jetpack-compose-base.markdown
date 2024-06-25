---
layout: post
title: "Android Jetpack Compose Basic Tutorial"
date: 2021-09-13 16:00:48 +0800
image: cover/ea-website-base-cover-photo-new-1.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
permalink: /android-kt-jetpack-compose-base
excerpt: "Welcome to the Android Jetpack Compose Basic Tutorial! In this tutorial, we will introduce you to the world of Jetpack Compose, guiding you step by step to master the basic concepts and techniques of Compose."

---

<div class="c-border-main-title-2">Introduction</div>
On 2021/7/28<br>
Google officially released Jetpack Compose stable version 1.0 <br>
If you are interested in the official announcement, you can check <a href = "https://android-developers.googleblog.com/2021/07/jetpack-compose-announcement.html">here</a> <br>

<br>
Today, I plan to share some basics on how to use Jetpack Compose to create components for Android apps.
<br>
<br>
Jetpack Compose is entirely written in Kotlin code <br>
replacing the traditional .xml files used for views or layouts <br>
resulting in only .kt files <br>
which reduces the majority of XML files. <br>

<div class="c-border-content-title-4">Jetpack Compose utilizes many unique features of Kotlin</div><br>

<div class="table_container">
  <p>Some basic concepts of Kotlin</p>
  <ol class="rectangle-list">
    <li><a href="javascript:void(0)">Lambda expression</a></li>
    <li><a href="javascript:void(0)">Function type</a></li>
    <li><a href="javascript:void(0)">Extension</a></li>
    <li><a href="javascript:void(0)">Named argument</a></li>
  </ol>
</div>

<br>
So if you are already familiar with the above Kotlin concepts<br>
you will have a significant advantage in learning Jetpack Compose<br>
and can quickly get started. <br>

<div class="c-border-content-title-4">First, let's look at the differences between the two</div>

Here is a simple toolbar written in XML:<br>
<script src="https://gist.github.com/KuanChunChen/46bbdced14c9e3c26023854bed33c60d.js"></script><br>

And here is the toolbar written in Jetpack Compose:<br>

<script src="https://gist.github.com/KuanChunChen/80743e79901a8c98b87655ff8f020193.js"></script><br>

This change allows us to control views entirely with code.<br>
At the same time,<br>
it makes it more convenient to use variables of function types,<br>
to control the functionality needed for the views.<br>
Since we are implementing with pure Kotlin code,<br>
we can more flexibly use conditionals to control the visibility of views.<br>
This gives us greater flexibility when designing applications.<br>

<div class="c-border-main-title-2">Specific Implementation</div>

Here,<br>
I have created some basic widgets.<br>
When you actually use them in an Activity or Fragment,<br>
you can reuse them as needed,<br>
which allows for more efficient development and management of your application.<br>
This modular design approach enables you to quickly build feature-rich and reusable interface elements,<br>
greatly saving development time and improving code maintainability.<br>

<br>
The final result in the IDE preview might look like this<br>
Code on the left and preview on the right<br>

<div align="center">
    <img src="/images/jetpack_compose/jc01.png" alt="Cover" width="100%" >  
</div>


<div class="c-border-content-title-4">Preliminary Work</div>

You must update Android Studio to the Arctic Fox version<br>
to preview Composable components through the IDE.<br>

Official download location:
<a href="https://developer.android.com/studio?hl=zh-cn" class="btn btn-primary" role="button">Download Android Studio Arctic Fox</a>
<br>
<br>

<div class="c-border-content-title-4">Step One</div>
First, add the relevant libraries to the gradle dependencies:<br>
<script src="https://gist.github.com/KuanChunChen/c18119da90591482e2f6f5b6cb67bdec.js"></script>
<br>
<br>
<br>

<div class="c-border-content-title-4">Step Two</div>
Add @Composable to indicate that your function is a Jetpack Compose component.<br>
<script src="https://gist.github.com/KuanChunChen/d8ecd7b8977a5d2e11cb89e00b1e2d04.js"></script>
<br>
<br>
<br>
Here,

```
Modifier
```
is an interface frequently used in Jetpack Compose,<br>
to extend the properties of components.<br>
Here,<br>
using a variable as a function parameter,<br>
means that when you call the AppBar component,<br>
you can customize the Modifier,<br>
setting properties such as the background color, animation, font, etc.<br>

<h6>(Depending on the official component you are using, set different contents according to the implementation of that component's Modifier.) </h6>
<br>

<div class="c-border-content-title-4"><font color="green">Optional</font></div>

You can use Column to arrange the views you create with Jetpack Compose.<br>
Column provides a vertical arrangement similar to LinearLayout,<br>
which is very useful when you need to add multiple components.<br>
By using Column, you can easily arrange multiple components vertically,<br>
making your interface layout more structured and easier to manage.<br>
<script src="https://gist.github.com/KuanChunChen/203f5c350db588cc6b3730f9b326710c.js"></script>
---


Start adding functions built into the official library to quickly create a toolbar.<br>
For example, TopAppBar<br>
<script src="https://gist.github.com/KuanChunChen/66d842982f99a753c786594e918abe16.js"></script>

Here you will see some<br>

```Kotlin
modifier = ... ,
backgroundColor = ...,
elevation = ...,
contentColor = ...,
```

<br>
This actually utilizes Kotlin features like Named arguments and function types,<br>
allowing you to more effectively extend the code when using functions.<br>

Additionally, here we can use a function type variable<font color="red">
content: @Composable RowScope.() -> Unit</font>
to add an Image to the left side of the TopAppBar:<br>

(You can press cmd+left click here to see the source code of TopAppBar and understand what RowScope does)


<script src="https://gist.github.com/KuanChunChen/049c22e6449d00c4aa529c33fc6cb76f.js"></script>

<br>
At this point, you have quickly completed a simple, extensible, and reusable widget.
<br>

<div class="c-border-content-title-4">Step Three</div>
So how do you start the preview?
You just need to write another function and add @Preview
Then press refresh to see the view you just created displayed on the right side of the IDE.
(If you don't see it, you can click Design or split on the right to open the preview screen)

<script src="https://gist.github.com/KuanChunChen/eac588083154d8faf5c8f15fff868798.js"></script>
<br>
<div class="c-border-content-title-4">Step Four</div>
In practical application<br>
You can wrap it into a content to call it<br>
This way, your screen can be divided very finely<br>
Future maintenance will be more efficient<br>
<br>

For example, wrap a complete logic layout like this<br>
This way, if you want to change the layout appearance in the future, you can change it here<br>
Some functions of your basic components do not need to be specially modified<br>
<script src="https://gist.github.com/KuanChunChen/34565f4c1e1394cb2e5b1d50ded7093b.js"></script>

Actual result:
<div align="center">
    <img src="/images/jetpack_compose/jc02.png" alt="Cover" width="100%" >  
</div>
<br>
<div class="c-border-content-title-4">Final Step</div>

After completing the above steps<br>
You can set your layout in the fragment or activity<br>
Quite concise<br>
<script src="https://gist.github.com/KuanChunChen/d697201a60570da069cd3cc4f0ce425c.js"></script>
