---
layout: post
title: "Learning Android Kotlin Custom UI Techniques - Switching Views and Dropdown Animation Tutorial - 02"
date: 2020-11-20 16:04:13 +0800
image: cover/android-photo.jpg
permalink: /android/custom02
tags: [Android]
categories: Android實作
excerpt: "In this tutorial, you will learn how to use Android Kotlin custom UI techniques, specifically how to implement switching views and dropdown animations."
---

Hello, everyone, this is KC from Elegant Access,<br>
Welcome back to the implementation part of customizing<br>
switching views and dropdown animations.<br>
In the following paragraphs, I will introduce how to complete this custom view step by step!<br>
<br>
First, since we need to customize our own view, we need to create a class. For example, here, I named it HorizontalMoveView:
<br>
<br>

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg05.png" alt="Cover" width="30%"/>
</div>

<br>
<br>
Create this class and inherit the layout you want to use. You can adjust it according to your needs, depending on what characteristics you want the view to have. For example, I want to use FrameLayout:

<script src="https://gist.github.com/KuanChunChen/99170edc18f10eb9786ed1ef5061a511.js"></script>

<br>
<br>

Next, create what this view contains, so you need to create a custom XML to serve as the appearance of this view. For example, my view includes a webview, image view, recycler view, etc. You can customize it according to your needs.

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg06.png" alt="Cover" width="30%"/>
</div>

<br>
<br>
The actual code for the layout in the above image is as follows:
<script src="https://gist.github.com/KuanChunChen/2441aae9b1134270fc7cb0968693a4d4.js"></script>

<br>
<br>

This layout is relatively basic and not particularly difficult. It mainly depends on the reader's project requirements to define the desired layout. You don't have to follow the above exactly, but I prefer to separate files to avoid mixing them together. At this point, you just need to load this layout in the HorizontalMoveView you just created, as follows:

<script src="https://gist.github.com/KuanChunChen/30213ecc81d3372c620b05a488ac05e2.js"></script>

<br>
<br>

At this point, you have completed the first step. You can now create your own custom view, but note that so far, it's just an empty shell with no functions to support your custom view. So currently, you can call your custom view to use it, but it has no functionality, just a display. Therefore, you still need to write its functions to use it.
Here, try calling the view you just wrote like this:

<script src="https://gist.github.com/KuanChunChen/ae59cabf7891e07eebd875cc2df612f1.js"></script>

<br>
<br>

Add your custom view to the place where you want to use it. As for where your custom view is, it depends on the package you stored it in. Just add your package path and your file name.
At this point, you can probably call out a blank view because no functions have been written yet, so it might look like this:

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg07.png" alt="Cover" width="30%"/>
</div>

<br>
<br>
Let's stop here for today. Next, I will introduce how to write some functions or define a recycler view, etc., to complete our entire view.
Stay tuned for the continuation of implementing the horizontal sliding recycler view:

<div class="table_container">
  <a href="{{site.baseurl}}/2020/11/21/android-kotlin-custom-view-03/">
    <img src="/images/cover/android-photo.jpg" alt="Cover" width="30%" >
  </a>

<a href="{{site.baseurl}}/android/custom03">Learn Android Kotlin Custom UI Techniques - Switching Views and Dropdown Animation Tutorial - 03</a>
</div>

Go back to the prelude:

<div class="table_container">
  <a href="{{site.baseurl}}/2020/11/14/android-kotlin-custom-view-01/">
    <img src="/images/cover/android-photo.jpg" alt="Cover" width="30%" >
  </a>

  <a href="{{site.baseurl}}/android/custom01">Learn Android Kotlin Custom UI Techniques - Switching Views and Dropdown Animation Tutorial - 01</a>
</div>

<br>

Created by Elegant Access's KC.<br>
Copyright (c) 2024 All rights reserved.<br>
Instagram  : https://www.instagram.com/eleg.aces.kc/<br>
Github : https://github.com/KuanChunChen<br>
