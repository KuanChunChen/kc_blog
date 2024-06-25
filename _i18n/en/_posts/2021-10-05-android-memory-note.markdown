---
layout: post
title: "[Android][Memory] Memory Optimization + GC Management Concepts Sharing"
date: 2021-10-05 17:42:21 +0800
image: cover/ea-website-android-memory.png
tags: [Android,Kotlin]
categories: Android教學
---

Today's post<br>
I plan to take notes<br>
to record what I understand about Android memory management<br>
I intend to keep updating this note<br>
If I learn more about Android memory management<br>
I want to consolidate it in this one post<br>

<h2>Android Memory Note</h2>
<br>
heap:<br>
The Android virtual machine continuously tracks memory allocation in the heap<br>
The heap is a block of memory used to store system-allocated java/kotlin objects<br>

garbage collection (gc):<br>
Its goal in Android is to achieve the following:
<br>

* Find unused objects
* Reclaim the memory used by these objects and return it to the heap

In a multi-task environment<br>
Android limits the size of each heap<br>
This size is determined by the amount of available RAM on the Android device
<br><br>

Additionally<br>
When the heap is full<br>
If the system still tries to allocate memory<br>
It may result in an OutOfMemoryError<br>

<h2>Frequent Garbage Collection</h2>
<br>
Previously, I read an article that also referred to GC as memory churn<br>
In other words<br>
GC usually occurs when memory is needed in a short period<br>
Due to insufficient heap space<br>
It needs to allocate heap space for the app<br>
While simultaneously freeing up heap space to compensate for the shortage<br>
So frequent GC triggers can also cause memory-related issues

For example:<br>
At the same time<br>
The app needs to allocate a large amount of memory space for the objects you create<br>
But due to insufficient heap space<br>
GC is triggered to reclaim heap space<br><br>
But in the back-and-forth iterations<br>
The app gets stuck<br>
Usually, it won't show an OOM<br><br>
But it causes lag or crashes<br>
Leading to a poor user experience<br>

Here's an example with code:

<script src="https://gist.github.com/KuanChunChen/5654e03a5aa77334bf536c298fe0df88.js"></script><br>
This is a common implementation of a recycler view adapter<br>
The bind() method is used to implement the logic for generating new items<br>

```
val demoBitmap = BitmapFactory.decodeResource(itemView.context.resources, R.drawable.bg_demo_photo)
```
In this bind() method, there is a fixed image to be loaded into the item<br>
If placed here<br>
It means that each time bind() is called, the item will reload the bitmap image<br>
In small projects or with a few images, you won't notice much difference<br>
But with a large number of repeated loads<br>
Or when there are 100 or 1000 items<br>
Each one reloading<br>
It consumes a significant amount of heap space<br>

Therefore, the simplest way is to load fixed items only once<br>
<script src="https://gist.github.com/KuanChunChen/baac7167d917ce9633f7d9346b3244ed.js"></script>

Or you can use some third-party libraries to cache the images<br>
Reducing the number of loads<br>
Of course, using cache can also cause OOM<br>
So you need to define or clear the cache under specific conditions<br>
You can optimize based on the issues encountered in the project<br>

<h2>Android Memory Leak</h2>
<br>

gc cannot clear object leaks with references<br>
Because it thinks some places might still need this reference<br>
This situation is commonly referred to as a memory leak<br>

Inner Classes: When inner classes have references to outer classes, it can cause memory leaks<br>
For example:
<script src="https://gist.github.com/KuanChunChen/f7cf2cefdda47552aef1ea21ac0f1e37.js"></script>
Like the code above<br>
Because the inner class accesses the outer showResult<br>
And since AsyncTask runs in the background<br>
The activity might have finished<br>
But AsyncTask is still running<br>
This can cause a memory leak<br>

Solution to this problem<br>
You can remove the method call to the external class<br>
or use other methods to access the external class<br>
such as using weak references<br>
<script src="https://gist.github.com/KuanChunChen/14c2eb371a77d2a2425180dd865a2ebe.js"></script>

Using weak references can still access the external class<br>
but it won't be as strong as a strong reference, so it won't persist in memory<br>
When the garbage collector (GC) does not find a strong reference to the object, it will look for it and set it to null<br>

Anonymous Classes: Some anonymous classes live longer than the external class<br>
causing memory leaks<br>

Static Variables: Using companion objects or static to modify certain classes<br>
will cause the object to load initially<br>
and then not be released<br>
leading to memory leaks<br>
for example, static activity
