---
layout: post
title: "【Android/Kotlin】Quickly Master the Three Keywords: inline / noinline / crossinline!"
date: 2020-11-30 21:01:43 +0800
image: cover/android-kt-inline-1.png
tags: [Android]
categories: Kotlin
excerpt: "In Kotlin programming, inline, noinline, and crossinline are common keywords. These keywords can be used in function declarations to modify the behavior of functions in different ways, thereby affecting the way the code runs and its performance."
---

<div class="c-border-main-title-2">Introduction</div>

In Kotlin programming, inline, noinline, and crossinline are common keywords.<br>
These keywords can be used in function declarations,<br>
to modify the behavior of functions in different ways,<br>
thereby affecting the way the code runs and its performance.<br>
This article will provide a detailed introduction to the usage and differences of these three keywords,<br>
along with relevant code examples and practical application scenarios.

<div class="c-border-content-title-4">inline</div>

The actual function of inline,<br>
is that during compilation, the content of the function using inline will be directly copied to the execution point,<br>
instead of directly instantiating an object.<br>
Using inline reduces object instantiation to improve performance.<br>
To put it simply, we write a function like this:<br>
<script src="https://gist.github.com/waitzShigoto/626f82a8e911cb4ab227f0bffc4220b9.js"></script>
<br>

However, if you directly add inline to a function that takes regular variables,<br>
some IDEs might remind you that using it this way<br>
will not improve performance.<br>
For example, in the demonstration below,<br>
only regular variables are passed in and inline is used,<br>
the compiler gives a yellow warning,<br>
indicating that passing in function type variables is expected to effectively improve performance.<br>

<div align="center">
  <img src="/images/inline/inline-02.png" alt="Cover" width="1000%"/>
</div>
<br>
So, let's try writing a function that takes a function type variable,<br>
and another function with inline, like this:<br>

<script src="https://gist.github.com/waitzShigoto/0b924c1634435c157fba4a73f3c4afc9.js"></script>
<br>

After executing these two, you will find the returned results are the same,<br>
but in reality,<br>
if you decompile this code (as shown below),<br>
you will find that without using inline,<br>
the program creates a new instance for your lambda function during execution,<br>
which means a new object is instantiated.<br>
If you have a piece of code that needs to repeatedly use this function,<br>
it will repeatedly create objects,<br>
thus potentially consuming more performance to handle this lambda function.<br>
So, using inline can reduce this performance consumption.<br>

<script src="https://gist.github.com/waitzShigoto/0edf38ee27045d23b0b490ca4381f286.js"></script>

<br>

Tip: **(Function1）null.INSTANCE** is displayed because the decompiler cannot find an equivalent Java class.

From the above example, it is clear that using inline with lambda functions<br>
can improve processing performance.<br>
But when should we actually use it? Here is an example:<br>

Suppose you have a scenario where you need to repeatedly call a function with a lambda. A less experienced person might write it like this:

<script src="https://gist.github.com/waitzShigoto/6f5a374bee3a35b754d5f551b170f969.js"></script>
<br>

As you can see, after decompiling,<br>
you will see that although you achieved repeated execution 10 times,<br>
you also created the same object 10 times.<br>

So, with more experience, you can:<br>
**1. Create the lambda function outside the loop**<br>
This can also improve performance, but since you are using Kotlin, using inline is also an option.<br>
<script src="https://gist.github.com/waitzShigoto/c7535ba99806202c354e571447b99c68.js"></script>
<br>

**2. Using inline to create:**<br>

<script src="https://gist.github.com/waitzShigoto/ad7d6e31cce3d9badd7cc9b2fa36b57a.js"></script>

<br>

In this way, you can see the advantages of using inline,<br>

Alright, let's talk about the differences between noinline and crossinline,<br>
Actually, these two keywords are used to assist inline,<br>
Unlike inline, which is added in front of fun,<br>
They are used to set function types (or lambda functions).<br>

<div class="c-border-content-title-4">noinline</div>
The concept of noinline is actually simpler,<br>
Once you understand inline, you'll see why I say these two are auxiliary,<br>
The purpose of this,<br>
Is when an inline function contains multiple function types,<br>
You can control which lambda uses inline, for example:

<script src="https://gist.github.com/waitzShigoto/b6f489a19d880c3a6f89e53d90521dd5.js"></script>
<br>
Therefore, you can choose whether to use inline based on your needs.
<br>

<div class="c-border-content-title-4">crossinline</div>
First, a preliminary concept:<br>
When you use a lambda function,<br>
If you add a return inside the declared lambda function,<br>
It will cause the place where the lambda function is used to directly return from that function:<br>
<script src="https://gist.github.com/waitzShigoto/e9fdbb9fc2aefe4841853b23d1db8714.js"></script><br>

At this time, if you don't want to exit the entire inline function,<br>
You can use something like the code above, directly changing the original return to return@getMinutesWithInline,<br>
This will only exit the declared lambda function.<br>
Or you can use the crossinline keyword,<br>
It is also used to modify lambda functions,<br>
And is also an auxiliary to inline,<br>
Its function is to prevent a return from directly exiting!<br>

<script src="https://gist.github.com/waitzShigoto/940839c5f5bbaf854a0c243748192758.js"></script>

<div class="c-border-main-title-2">Conclusion</div>
Using inline<br>
Can reduce the repeated creation of instances when calling lambda functions<br>
Thereby improving efficiency<br>
Using inline can avoid creating too many instantiated objects<br>
Using noinline allows a lambda not to use inline<br>
Using crossinline can prevent a return in a lambda from affecting the external program flow<br>

<div class="card py-4 h-100">
    <div class="card-body text-center">
        <i class="fas fa-map-marked-alt text-primary mb-2"></i>
        <h4 class="text-uppercase m-0">inline / noinline / crossinline Sample Code</h4>
        <hr class="my-4 mx-auto" />
        <div style="font-size: 1.5em;">
          <a href="https://github.com/KuanChunChen/KC_InlineDemo/blob/master/app/src/main/java/k/c/horialtal/move/sheet/kc_inlinedemo/InlineUtil.kt">
Sample Code</a>
        </div>
    </div>
</div>
