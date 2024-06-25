---
layout: post
title: "Android Jetpack Compose SwipeRefresh: Easily Implement Pull-to-Refresh for Lists!"
date: 2021-10-28 14:41:12 +0800
image: cover/ea_swiperefresh_app-new-1.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
permalink: /android-kt-jetpack-compose-swiperefresh
excerpt: "This article introduces how to use LazyColumn and SwipeRefresh in Jetpack Compose to easily implement dynamically updating list data."
---

<div class="c-border-main-title-2">Introduction</div>
Continuing from the previous article:<br>

<a href="{{site.baseurl}}/android-kt-jetpack-compose-list/">
  <img src="/images/cover/ea-website-lazy-colume-cover-photo-new-1.png" alt="Cover" width="20%" >
</a>

<a align="right" href="{{site.baseurl}}/android-kt-jetpack-compose-list/">Jetpack Compose: Easily Implement Dynamically Updating List Data with LazyColumn + ViewModel</a><br>

Today we will continue to fully implement the pull-to-refresh feature based on Jetpack Compose LazyColumn.<br>

<div class="c-border-content-title-1">Implementation Effect: Pull-to-Refresh List</div>

<div align="center">
  <img src="/mov/jetpack/ea_swiperefresh_app.gif" width="30%"/>
</div>


<div class="c-border-content-title-4">Related Knowledge Used</div>
* JetpackCompose SwipeRefresh, LazyColumn
* ViewModel

Combining the concepts introduced earlier,<br>
and applying the SwipeRefresh component in Jetpack Compose,<br>
you can easily achieve the target functionality.<br>


Today we will learn how to use what we have learned before,<br>
and integrate SwipeRefresh into the application.<br>
This process is very intuitive,<br>
and with just a few simple steps,<br>
you can add pull-to-refresh functionality to your list.<br>


<script src="https://gist.github.com/KuanChunChen/fe87780cc0639b8458d764ce30ee54ed.js"></script><br>

<div class="c-border-content-title-4">Meaning of Each Variable</div>

`state` is a boolean that observes whether a pull-to-refresh is happening.<br>

`onRefresh` allows you to input the scope of the task to be done.<br>

`indicator` allows you to set the details of the spinning symbol that appears during pull-to-refresh.<br>
The code for this is as follows:<br>
```
indicator = { state, trigger ->
            SwipeRefreshIndicator(
                state = state,
                refreshTriggerDistance = trigger,
                contentColor = Color.Black,
                arrowEnabled = true,
                fade = true,
                scale = true,
                backgroundColor = MaterialTheme.colors.primary,
            )
}
```
Other settings can be configured according to the names above,<br>
such as size, background color, arrow appearance, arrow color, refresh distance, etc.<br>

Another key point is<br>
we use an `isRefreshing` variable and put it into the `state` variable required by SwipeRefresh.<br>
The state of SwipeRefresh<br>
will determine whether to show the spinning animation based on your status.<br>
So when the status is `true`,<br>
the spinning waiting animation will be present.<br>
When it changes to `false`,<br>
here I use `LiveData` and observe it as state,<br>
and then observe the data retrieval after refreshing<br>
to set it to end.<br>

This pull-to-refresh<br>
is simply completed.<br>
You can also try it out quickly!<br>
