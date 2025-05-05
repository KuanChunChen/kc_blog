---
layout: post
title: "【Compose Multiplatform】Project Migration Discussion and Development Guide"
date: 2024-07-11 18:30:20 +0800
image: cover/compose_multiplatform_guide.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-guide
categories: ComposeMultiplatform
excerpt: "This article details the process of migrating from a Compose project to Compose Multiplatform, including initial migration costs, library equivalents, potential issues, and future outlook."
---

<div class="c-border-main-title-2">Introduction</div>

Compose Multiplatform (CMP) provides developers with a powerful cross-platform development tool<br>
But migrating from a Compose project to CMP also faces some challenges<br>
This article will detail key points and considerations in the migration process<br>

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

<div class="c-border-main-title-2">Initial Migration Costs</div>

Initially, you need to understand how CMP achieves cross-platform functionality<br>
So it takes some time to understand<br>
the project structure<br>
Let's quickly go through it below<br>

When developing with CMP, you need to be familiar with the structure of multiple folders:<br>
<img src="/images/compose/009.png" alt="Cover" width="30%"/><br>

Common code is placed in commonMain:<br>
<img src="/images/compose/010.png" alt="Cover" width="30%"/><br>

Import the required libraries in each environment:<br>
<img src="/images/compose/011.png" alt="Cover" width="50%"/><br>

Since it uses lib.version.toml for configuration by default<br>
you need to understand .toml<br>
but it's actually very easy<br>
the official defaults work fine<br>
unless you need special configurations<br><br>

Here are some notes I wrote before<br>
<a href="{{site.baseurl}}/android-upgrade-to-toml-tutorial">For reference</a>

<div class="c-border-main-title-2">Reference for Library Migration from Compose Project to CMP Project</div><br>
* Assuming we originally used some common libs or officially recommended ones for Android projects (as shown on the left of the table)<br>
  After trying to write with CMP, we'll find some benefits in the migration cost of the libraries we use (as shown on the right of the table)<br>
  Because most of them are things you've used when writing Compose<br>
{% include table/compose-multiplatform-compare.html %}

<div class="c-border-main-title-2">Potential Issues</div>

1. Cross-platform requirement differences:<br>
   For example, Android needs Context, iOS doesn't:<br>
   <script src="https://gist.github.com/waitzShigoto/d4594b6b1b1e92509fa34c67233b301d.js"></script><br>
   Complete notes: <a href="{{site.baseurl}}/compose-multiplatform-di-context">【Compose Multiplatform】Cross-Platform App with Android Context Implementation Using Koin</a><br>
2. Platform-specific implementations:<br>
   For example, mobile often uses local persistent storage<br>
   In Android, we use DataStore to handle this issue<br>
   So how do we use it across multiple platforms?<br>
   Using expect and actual keywords:<br>
   <script src="https://gist.github.com/waitzShigoto/99f7bc0f32960a1af80971e8f68a8b0d.js"></script>
   <script src="https://gist.github.com/waitzShigoto/171b2f873713be2da5214a5450e1f2a4.js"></script>
   <script src="https://gist.github.com/waitzShigoto/3a1379e63db12a23997c21d7f632d8fa.js"></script>
   Despite needing separate implementations<br>
   some common libraries<br>
   are supported by CMP with Kotlin implementations<br>
   so even with separate platform implementations, you can still write in pure .kt<br>
   just like the DataStore implemented in iosMain above<br><br>

   Complete notes: <a href="{{site.baseurl}}/compose-multiplatform-datastore">【Compose Multiplatform】Implementing Local Persistent Storage with DataStore</a><br>

3. CMP library compatibility issues or bugs being continuously fixed:<br>
   For example, SQLDelight 2.0.0 version has build errors on iOS:<br>
    - Solution 1: Import stately-common<br>
    - Solution 2: Upgrade to version 2.0.1 or above<br>
   The reason can be found in this discussion thread: [Click here](https://github.com/cashapp/sqldelight/issues/4357)<br>
   Complete SQLDelight notes: <a href="{{site.baseurl}}/compose-multiplatform-sqldelight">【Compose Multiplatform】Implementing SqlDelight Database</a>
<div class="c-border-main-title-2">Future Outlook</div>

Google mentioned support for KMP in their blog on May 14, 2024:<br>
<img src="/images/compose/012.png" alt="Cover" width="50%"/><br>
This might mean more libraries will be supported in the future.

<div class="c-border-main-title-2">Conclusion</div>

- CMP provides powerful cross-platform development capabilities, but requires adaptation to the new project structure
- Most common libraries have corresponding CMP versions<br>
For example, those commonly used in Compose App development can be used directly<br>
DataStore, Room, etc.
- When handling platform differences, using expect and actual keywords is very helpful
- Pay attention to library version compatibility issues<br>
Currently in development<br>
I've encountered several configuration compatibility issues<br>
Such as: Room compatibility issues with Kotlin 2.0.0<br>
Errors with embedAndSign when configuring CocoaPods in CMP<br>

- Keep an eye on Google's latest updates for more support and resources<br>
I've tried asking GPT directly<br>
but it may not be that accurate<br>
Many compatibility issues still require researching on your own<br>
or perhaps when more data becomes available in the future, it might provide more precise answers<br> 