---
layout: post
title: "Learning Android Kotlin Custom UI Techniques - Swipe View and Dropdown Animation Tutorial - 03"
date: 2020-11-21 15:44:20 +0800
image: cover/android-photo.jpg
permalink: /android/custom03
tags: [Android]
categories: Android實作
excerpt: "In this tutorial, you will learn how to use Android Kotlin to customize UI techniques, specifically how to implement swipe views and dropdown animations."
---
Hello, everyone, this is KC from Elegant Access,<br>
Welcome back to the customization implementation series,<br>
Today’s content will cover how to implement a horizontally swiping recycler view, and how to adjust it,<br>
to make it feel like a pager swipe and adjust the spacing between items. Alright, without further ado, let’s dive in!


<br><br>
Effect picture:
<br>
<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg08.png" alt="Cover" width="30%"/>
</div>


The first step is very simple, you need to define an adapter for the recycler view. Here, I prefer to start by creating the XML for the item, as shown below:

<script src="https://gist.github.com/KuanChunChen/b1a45501587bf59e8008b261c8439f72.js"></script>


<br><br>


Next, start defining your adapter and load the item you just created into it:
<br><br>

Since I prefer using a custom BaseListAdapter,<br>
in this class, I usually use generics,<br>
to replace the data that might be passed into the adapter later,<br>
and then create a view holder for this adapter within my adapter,<br>
also using generics to replace places where similar code might be repeated in the future,<br>
so it looks like this:<br>

<script src="https://gist.github.com/KuanChunChen/8718aaf48a1806a57d97471fb5b9c7b0.js"></script>
In the adapter above,<br>
my code is very minimal,<br>
because I first wrote an abstract class,<br>
<br><br>

Additionally, my base adapter looks like this,<br>
mainly abstracting some methods:

<script src="https://gist.github.com/KuanChunChen/9e90e3f602e0f4029205fe3d3b3b1155.js"></script>


Here, I mainly talk about some of the abstract methods
I require the implementation of ItemView<br>

```kotlin
@LayoutRes protected abstract int getItemViewLayout();
```
The purpose is to allow me to pass in the XML of the item I wrote<br>
so that next time I don’t have to write it again


Next, I defined a ViewHolder,<br>
to inherit the BaseViewHolder from my BaseListAdapter,<br>
the purpose is also to avoid rewriting some basic view holder content in the future<br>

Additionally, this base adapter also has some other common functions
You can refer to them if needed
Some parts can be used even if not written exactly the same

<br>
In conclusion,
I only need to override a few functions like the ones in the code above,<br>
to implement the functionality of a recycler view adapter!<br>
In my BaseListAdapter class, I inherited RecyclerView.Adapter,<br>
and implemented the necessary functions for a recycler view adapter:<br>

*   getItemViewType(position: Int)
*   onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int)
*   getItemViewType(position: Int)
*   getItemCount()
*   onCreateViewHolder(parent: ViewGroup, viewType: Int)... and other functions,<br>
<br>


These are all the places that need to be inherited when creating a recycler view,<br>
considering that recycler views might be used frequently, and being lazy XDD,<br>
I thought that in the future,<br>
even in other projects,<br>
similar ones might be used,<br>
so I tend to write an abstract class with enough future expandability,<br>
so that it’s convenient to use when writing in the future,<br>
if I want to change something, I can directly change it in the parent class,<br>
and it can be used directly by inheriting it,<br>
it really saves time and reduces repetitive code!

<br>

Currently, a basic recycler view has been constructed. <br>
Just call the code below, <br>
and you will have a basic recycler view: <br>

<script src="https://gist.github.com/KuanChunChen/16987a5a8f9039f913b3e490da226e76.js"></script>

Here, the switchRecyclerView mentioned is the custom view referred to in the previous article
  <a href="{{site.baseurl}}/2020/11/20/android-kotlin-custom-view-02/">[Custom View] Custom UI Experience Sharing (1): Implementation</a>.
If you have forgotten, you can take a look.

<br>

Next, to achieve the following effects with the recycler view: <br>
<ol>
  <li>When scrolling to the edge, the recycler view can move away from the edge and appear centered.</li>
  <li>There is a fixed spacing between each item.</li>
</ol>

We need to extend RecyclerView.ItemDecoration(), as follows:

<script src="https://gist.github.com/KuanChunChen/3df59c6aec3f5e11f983b8f0ac811cf3.js"></script>

<br>

To achieve spacing between each item, <br>
we set the mSpace variable, <br>
which is used to specify the spacing between items. <br>
So, after overriding getItemOffsets, <br>
we use the Rect inside to set the spacing between each item, like this: <br>
```
outRect.left = mSpace
```
<br>
However, to make the item appear centered when scrolling to the far left or right, <br>
we define a sideVisibleWidth variable. <br>
The calculation for this variable is: <br>

```
(screen width in pixels - each item’s pixel width)/2 - predefined spacing for the left/right edge in pixels
```
<br>
Although this calculation might seem a bit difficult to understand, <br>
it makes sense if you think about it a bit. <br>
To break it down, the recycler view initially starts from the far left or top of the screen. <br>
In this example, it’s horizontal, so it starts from the far left. The idea is: <br>
I want there to be a certain distance from the far left/right edge when scrolling, <br>
and I want the recycler view item to be centered. <br>
So, I need to get half the width of the screen, <br>
and since I want the item to move only halfway, I get half the item’s width. So, it’s: <br>

```
(screen width in pixels)/2 - each item’s pixel width/2
```
<br>

This means calculating half the screen and half the item’s distance, <br>
making it appear centered. But since we need an additional predefined spacing at the far left or right, <br>
we need to subtract the specified pixels. <br>
So, combining everything, it becomes the initial formula: <br>

```
(screen width in pixels - each item’s pixel width)/2 - predefined spacing for the left/right edge in pixels
```

So, in code, it’s: <br>
```
var sideVisibleWidth =      
//整個螢幕width的pixel  
(context.resources.displayMetrics.widthPixels
//每個item的一半
- ScreenUtil().convertDpToPixel(70F, context).roundToInt()) / 2
//預期間隔多少的pixel
- ScreenUtil().convertDpToPixel(28F, context) .roundToInt()
```
<br>

Next, we just need to specify the item spacing under certain conditions, as follows:
<br>

<script src="https://gist.github.com/KuanChunChen/9a7c2bdeb1a7fc034079711d70b64e2a.js"></script>

<br>

So, in the code above, the first item’s spacing is set to my sideVisibleWidth and the right spacing of each item is mSpace pixels. <br>

With this, the spacing settings are complete. Next, we need to calculate the movement distance for each item and perform the corresponding actions.

<br><br>

Next, we extend RecyclerView.OnScrollListener() to calculate the scroll listener:

<script src="https://gist.github.com/KuanChunChen/9e98788c170b119d4da62124eb7523f3.js"></script>

<br>

This part is not too difficult, but it can be a bit time-consuming. Once you understand what it needs to do, you will have an "aha" moment. <br>
In this class, we need to record the current position of the item being scrolled, <br>

as well as the pixel size of each recycler view item. <br>
Since we need to record the current scroll position and calculate the scroll amount to determine the proportion of each item, <br>
we pass in the following in the constructor: <br>

```
SwitchRecyclerScrollerListener(private var mPosition: Int, private val itemWith: Int)
```

Next, override onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) to get the scroll amount when moving left or right,<br>

<script src="https://gist.github.com/KuanChunChen/f9f16c1c8ac7c55e4c32ffc841b07430.js"></script>

We get dx in onScroll, which represents the scroll amount when moving left or right,<br>
It triggers every time you scroll, so during the scroll, record and accumulate this value,<br>
Then use onScrollStateChanged, when the scrolling stops,<br>
which is SCROLL_STATE_IDLE, to calculate the total movement and the movement ratio:<br>

```
val offset = scrolledWidth.toFloat() / itemWith.toFloat()
```
<br>

The calculated ratio is how many items I moved, use this value to trigger what to do for each move,<br>
For example, here, if the number of moved items is not 0, I set the text color change, like:

```
if (moveTotalCount != 0) {        
   mPosition += moveTotalCount     
   scrolledWidth -= itemWith * moveTotalCount
   setItemAnim(recyclerView, mPosition)      
}
```

So when scrolling, it will look like the text color changes as you scroll!<br>
I won't write out the animation code here,<br>
If you're interested, you can check out the source code I shared, which has detailed instructions,<br>
Of course, you can also write it yourself according to your needs!<br>
Finally, just take out the inherited classes you just wrote,<br>
and you can get a horizontally scrolling recycler view. Here is an example of how I used it:<br>

<script src="https://gist.github.com/KuanChunChen/13e2e64e8a59b8be7a9c3dcddde81d2e.js"></script>

<br>

