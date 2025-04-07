---
layout: post
title: "Jetpack Compose: Easily Implement Dynamically Updating List Data with LazyColumn + ViewModel"
date: 2021-09-28 11:03:41 +0800
image: cover/ea-website-lazy-colume-cover-photo-new-1.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
permalink: /android-kt-jetpack-compose-list
excerpt: "This article introduces how to easily implement dynamically updating list data using LazyColumn and ViewModel in Jetpack Compose."
---
<div class="c-border-main-title-2">Introduction</div>
In the past, creating list views from ListView -> RecyclerView -> using different Adapters has been done,
and now it has evolved to Jetpack Compose, which also allows for easy list creation.<br>
After my practical implementation,<br>
I found the process to be quite simple.<br>
Now I want to share my experience with everyone,<br>
for your reference.<br>
The main difficulty is how to integrate ViewModel into Jetpack Compose code.<br>

<h2>Implementation Effect: List and Dynamic Data Changes</h2>
<div align="center">
  <img src="/mov/jetpack/ea_list_app.gif" width="50%"/>
</div>

<br>

<div class="c-border-content-title-4">Related Knowledge Used</div>
* JetpackCompose
* Viewmodel


<div class="c-border-main-title-2">Implementation</div>
<div class="c-border-content-title-4">Step 1: Create List Items</div>
This step is very similar to creating XML for RecyclerView<br>
First, implement the appearance of each item<br>
Since similar concepts have been discussed in previous articles,<br>
I won't go into detail here<br>
If you're interested, you can refer to the previous articles<br>

<div align="start">
  <a href="{{site.baseurl}}/android-kt-jetpack-compose-base">
    <img src="/images/cover/ea-website-base-cover-photo-new-1.png" alt="Cover" width="40%" >
  </a>
  <a align="right" href="{{site.baseurl}}/android-kt-jetpack-compose-base/">Android Jetpack Compose Basic Application Tutorial</a><br><br>

  <a href="{{site.baseurl}}/2021/09/17/android-kt-jetpack-compose-splash">
    <img src="/images/cover/ea-website-splash-cover-photo-new-1.png" alt="Cover" width="40%" >
  </a>

  <a align="right" href="{{site.baseurl}}/2021/09/17/android-kt-jetpack-compose-splash/">Learn to Add Animations to the Splash Page with Jetpack Compose!</a><br>


</div>

<br>
Let's look directly at the item implementation example:<br>
<br>

<script src="https://gist.github.com/waitzShigoto/90340f7ddf11897d221d12b87bab4782.js"></script>
<br>
The main task is to implement the item <br>
You can pair it with your custom data model, navigation guides, etc.<br>
Then arrange the positions of your components<br>
and insert the data
<br>

<div class="c-border-content-title-4">Step 2: Use LazyColumn to Implement the List</div>

Next, just use LazyColumn to call the item you just created<br>
This way, you can implement a list<br>
As follows:
<script src="https://gist.github.com/waitzShigoto/691f335e74c0ba919d159065ce9d70de.js"></script>

<div class="c-border-content-title-4">Step 3: Add ViewModel to Handle Data Changes</div>
This is the ViewModel implementation for this example<br>
and LiveData to observe data changes<br>
<script src="https://gist.github.com/waitzShigoto/3fd3912e5202073418e05e8c5057fac3.js"></script>
<br>
<br>

<div class="c-border-content-title-1">Hint</div>

```
常常在code看到用底線_命名變數
例如上面這個例子就是
_devices 與 devices
但卻不懂為何要用這樣同名的變數只加一個底線
或取成不同名字的兩個變數
這是我之前剛開始寫code會有的疑問
後來我終於明白
所以這邊來分享下
```

Here, `_devices` is defined as private<br>
`devices` is defined as public<br>
The `private` variable is used for internal class operations<br>
External classes that want to operate on `devices` should use the public variable<br><br>
In the example above<br>
`_devices` is used for internal class calls<br>
Usually, internal business logic will modify this value<br>
`to avoid repeated operations`<br>
or causing some confusion<br>
making subsequent maintenance more difficult<br><br>

For example, LiveData is used here<br>
to allow the public variable to be observed and used by external classes, as in this example with `devices`<br>
By providing getter/setter functions, external calls can directly modify it<br>
without repeated operations or multiple modifications<br>
avoiding the need to look at it for a long time if this feature needs to be removed or fixed in the future<br>

<div class="c-border-content-title-4">Step 4: Integrate ViewModel into Compose</div>
<br>
Combine the previously implemented list compose with the ViewModel:<br>
<script src="https://gist.github.com/waitzShigoto/6bae5c6238ec34c9c01b35a5f1144259.js"></script>
<br>
<br>
Add this line<br>
to make the `devices` in the ViewModel a state that can change the UI in Compose<br>

```kotlin
val devices: List<BleDevice> by deviceViewModel.devices.observeAsState(listOf())
```

Here is an example wrapped as content for reference:<br>
<script src="https://gist.github.com/waitzShigoto/b544ff8031746459060be65333bb222b.js"></script><br>

<div class="c-border-content-title-4">Step 5: Apply it to a Fragment</div>

<br>
Remember to import the ViewModel<br>

```kotlin
val model: DeviceViewModel by activityViewModels()
```

Then integrate it into the previously completed content<br>
See the example:<br>

<script src="https://gist.github.com/waitzShigoto/93bf9336cded4dd003e6aa5f7b54d18b.js"></script>

So, after observing changes in LiveData within the ViewModel<br>
the screen will automatically update<br>
It's really convenient!<br>

Next, we will introduce how to<br>
add pull-to-refresh functionality<br><br>

<a href="{{site.baseurl}}/2021/10/28/android-kt-jetpack-compose-swiperefresh/">
  <img src="/images/cover/ea_swiperefresh_app-new-1.png" alt="Cover" width="30%" >
</a>

<a align="right" href="{{site.baseurl}}/android-kt-jetpack-compose-swiperefresh/">Android Jetpack Compose SwipeRefresh: Easily Implement Pull-to-Refresh for Lists!</a><br>
