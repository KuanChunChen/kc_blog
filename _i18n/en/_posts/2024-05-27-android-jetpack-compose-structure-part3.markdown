---
layout: post
title: Developing Apps with Jetpack Compose for Android【03】 - Compose Navigation
date: 2024-05-27 15:42:39 +0800
image: cover/android-jetpack-compose-structure-part3.png
tags: [Android,Kotlin]
permalink: /android-jetpack-compose-structure-part3
categories: JetpackCompose
excerpt: ""
---

<div class="c-border-content-title-4">Introduction</div>
* This is the third part of this series<br>
Having had the opportunity to develop an entire project using Compose<br>
After some exploration<br>
I have some insights to share<br><br>
I decided to write this process into notes to share with everyone<br>

<div class="c-border-content-title-1">Initial Setup</div>
* The libraries used are as follows:
<div id="category">
    {% include table/compose-use.html %}
    {% include table/compose-category.html %}
</div>

<div class="c-border-content-title-4">Implementing Navigation for Compose</div>
* Here we plan to use a Main activity to navigate and switch to other screens<br>
So today we will implement NavHost in Compose

<div class="c-border-content-title-1">step1. Create enums for each screen</div>
* First, define an enum<br>
It will contain the content you expect to navigate to<br>
It can be expanded gradually as needed<br>
<script src="https://gist.github.com/KuanChunChen/78babc3c8b4f6a00e73b65ce472b4dd7.js"></script>

<div class="c-border-content-title-1">step2. Define Compose Screen</div>
* Implement the screens you need, for example:
<script src="https://gist.github.com/KuanChunChen/c40ade08846566ca103aea3b9a5f23f0.js"></script>

<div class="c-border-content-title-1">step3. Create routers for each screen</div>
* Since we will use NavGraphBuilder<br>
Extend NavGraphBuilder to specify the router for each screen<br>
Here, we use the previously defined `Login` as a reference indicator for its router<br>
To navigate to the LoginScreen, add the screen in the lambda<br>
<script src="https://gist.github.com/KuanChunChen/2577ea435d4b0bb0d028223f6c8dbadd.js"></script>

<div class="c-border-content-title-1">step4. Register each screen</div>
* Next, add all the screens you want to navigate to in the `NavHost`<br>
`startDestination`: your starting screen<br>
`navController`: used to specify the navigation controller<br><br>
To switch screens, simply control it with navController<br>
For example: `navController.navigate(ElegantAccessScreen.Feedback.name)`<br>
<script src="https://gist.github.com/KuanChunChen/72c59114a906ceb4efcc48c7acef5762.js"></script>

<div class="c-border-content-title-1">step5. Achieve multiple screens in one activity</div>
* Finally, when you want to add a new screen<br>
Simply implement the Screen<br>
<img src="/images/compose/001.png" width="50%"><br><br>

Practical use:<br>
<script src="https://gist.github.com/KuanChunChen/27b4d20765e035a36eed8ce204cbbc88.js"></script>

<a class="link" href="#category" data-scroll>Jump back to the table of contents</a>
