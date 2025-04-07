---
layout: post
title: "Quickly Learn to Adjust Element Spacing in Android Apps - Using Kotlin Extension Code to Set Margins"
date: 2022-12-25 17:05:12 +0800
image: cover/kotlin-clear-code-maring-layout-xml-constarint-layout-1.png
tags: [Android,Kotlin,Extension]
permalink: /clear_use_extension_to_set_margin
categories: Kotlin
excerpt: "In Android apps, adjusting element spacing is a common requirement, and using Kotlin extension code to set margins can achieve this quickly and easily. In this article, we will learn step-by-step how to use this technique to make your app look more beautiful and professional."
---

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Introduction</h1>

Today, I want to share a super simple trick with you,<br>
which allows you to adjust the spacing of elements in an Android app using `code`.<br>
This method is not only convenient but also makes your design more beautiful.<br>
Even if you are a beginner engineer, you can easily master it!<br>
Follow along with me to learn!<br>

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Basic Method</h1>

There are various ways to adjust element spacing in Android, and this article will introduce the method of using Kotlin extension code to set margins.<br>
Before that, let's understand<br>
that setting view margins in XML<br>
is as simple as one line:<br>
`android:layout_marginLeft="30dp"`<br>

In some cases,<br>
when the client requires you to dynamically set the spacing between Android View elements,<br>
you can usually use the following method:<br>
<script src="https://gist.github.com/waitzShigoto/60e47ade8cf051643f9075e8157c6ded.js"></script>
<br>
This method requires instantiating a LayoutParams<br>
and setting the top, bottom, left, and right margins before setting it to your View.<br>
But if you need to use this margin-setting method in multiple places,<br>
it will make the code lengthy and hard to maintain.<br>

To solve this problem,<br>
you can use Kotlin Extension to implement the margin-setting method,<br>
making your code more concise and easier to maintain.<br>

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Using Kotlin Extension to Achieve This</h1>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step 0. Here is the complete extension function</h4>
<script src="https://gist.github.com/waitzShigoto/b884affe0c15221ec627ae3faa3c1dfa.js"></script>

<p class="table_container">
  This code is ready to use.<br>
  Copy it into your project,<br>
  and call it directly on your view!<br>
  vb.btConfirmZero.margin(top = 0F)<br>
  vb.btConfirmOne.margin(bottom = 30F, right = 2F)<br>
  vb.btConfirmTwo.margin(bottom = 10F, left = 3F)<br>
  <a class="link" href="#step5" data-scroll>If you understand this, you can skip directly to step 5.</a>
</p><br>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step 1. How to Implement It?</h4>
<div class="c-border-content-title-4">
  First, create a function as follows
</div><br>
<script src="https://gist.github.com/waitzShigoto/9aec2350bcd7231a162da047508d76be.js"></script><br>

<div class="table_container">
  <p>Explanation of the above code</p>
  <ol class="rectangle-list">
    <li>
      <a href="https://kotlinlang.org/docs/lambdas.html#function-types" target="_blank">
        Here we pass in a function type named block<br>
        It is actually a type of Kotlin variable (other languages might have it too, but Java does not support it yet)<br>
          <b style="color:blue;">(For an explanation of function types, refer to: click here)</b><br>
          Using function types allows you to operate with lambda (Java has lambda, but currently does not have function types)
      </a>
    </li>

```markdown
<li>
  <a href="javascript:void(0)">
    Here we use generics<br>
    and use type conversion to convert generics<br>
    It may cause errors because it is considered implicit type casting during compilation<br>
    Therefore, if there is no explicit class<br>
    Direct casting may encounter<br>
    <b style="color:red;">`xxxxClass cannot be cast to zzzzClass` </b> this kind of error<br>
    Or some compilers will directly prompt you with a <b style="color:red;">`unchecked cast`</b> warning<br><br>

    Of course, you can also pass in clazz: Class or similar to determine what the actual class is<br>
    But this will make the code more verbose<br>
    When there are many classes, you will write more code and keep doing repetitive things... etc.<br><br>

    So here we use `reified` as a solution<br>
    It is a usage provided by Kotlin to solve such problems<br>
    -> Using reified requires `inline`<br>
  </a>
</li>
</ol>
</div><br>

<div class="c-border-content-title-4">
  After that, we can call it like this
</div><br>
<script src="https://gist.github.com/waitzShigoto/c5ef3ee7159011e92c8d17be233cf6a8.js"></script>
<div class="table_container">
  <p>Explanation of the above code</p>
  <span>
    This is actually to accommodate different <b>ViewGroup.LayoutParams</b><br>
    So that in the future, if there are more instances that inherit <b>ViewGroup.LayoutParams</b> and want to operate<br>
    It can be more flexible<br>
  </span>
</div><br>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step2. Write a method to convert dp to px</h4>
<script src="https://gist.github.com/waitzShigoto/52153b7712fde5257aaeab83b3c2ce7f.js"></script>

- This is very simple
  Mainly to match the use of pixels when setting margins
  So a conversion method was written

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step3. Modify the layout parameters through the extended layoutParams</h4>
<script src="https://gist.github.com/waitzShigoto/b64909a750c6a73306a1d1885f763f67.js"></script>
<div class="table_container">
  <p>Explanation of the above code</p>
  <span>
    Here we use the newly written <b>View.layoutParams</b> to operate the view we want to set<br><br>

    Previously in Java, setting parameters always required inputting all four parameters (left, top, right, bottom) at once<br>
    Therefore, here we use<br>
    <b>left: Float? = null, top: Float? = null, right: Float? = null, bottom: Float? = null</b><br>
    to default all four margin positions to null<br>
    Then use Kotlin's null safety feature to check, such as<br>
    <b>left?.run { leftMargin = convertDpToPixel(this) }</b><br>
    Only set the margin value if there is a value<br>
    We don't have to worry about null exceptions and can flexibly input only the positions we want to change<br>
  </span>
</div><br>

<h4 id="step5" style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Step5. Finally, use it easily</h4>

<script src="https://gist.github.com/waitzShigoto/6e721513ab6c92dc05ab2e61ef716c1f.js"></script>
```

It looks like you haven't pasted the Markdown content yet. Please provide the text you want translated, and I'll get started on the translation for you.
