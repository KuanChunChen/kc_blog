---
layout: post
title: "【Compose Multiplatform】Cross-Platform App with Android Context Implementation Using Koin"
date: 2024-07-10 16:44:11 +0800
image: cover/compose_multiplatform_di_context.png
tags: [Kotlin, Compose Multiplatform, Dependency Injection, Koin]
permalink: /compose-multiplatform-di-context
categories: ComposeMultiplatform
excerpt: "This article provides a detailed guide on how to handle Android-specific Context issues when using Koin for dependency injection in Compose Multiplatform projects, including actual code implementations."
---

<div class="c-border-main-title-2">Introduction</div>

When developing Compose Multiplatform projects<br>
we need to handle platform-specific issues<br>
One problem we encounter is that<br>
Android platform requires Context while iOS doesn't<br>
This article will introduce how to<br>
successfully solve this problem when using Koin for dependency injection<br>

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>


<div class="c-border-main-title-2">Implementation Methods</div>
<div class="c-border-content-title-1">1. Using expect and actual Keywords</div>
First<br>
we need to use CMP's expect and actual keywords to provide different implementations for different platforms<br><br>

First create the expect in commonMain<br>
In this example, SettingDataStore needs context<br>
and LearningViewModel needs SettingDataStore<br>
so I created an expect platformModule variable<br>
<script src="https://gist.github.com/waitzShigoto/3b4f485ab4125137e709bdbb1beb9aa3.js"></script>

<div class="c-border-content-title-1">2. Android Platform Implementation</div>
On the Android platform, we need to implement platformModule <br>
where I expect dataStore needs to get a context:<br>
<script src="https://gist.github.com/waitzShigoto/683e5aae4fed38732e316cb0a94cde94.js"></script>

<div class="c-border-content-title-1">3. iOS Platform Implementation</div>
On the iOS platform, we don't need Context<br>
so we can implement it directly<br>
<script src="https://gist.github.com/waitzShigoto/912bd0f442f650156791481b1cf7e4c3.js"></script>

<div class="c-border-content-title-1">4. Initialize Koin</div>
Initialize Koin at each platform's entry point:<br><br>

Android<br>
At the Android entry point, get the context<br>
and insert it into the startKoin module list<br>
<script src="https://gist.github.com/waitzShigoto/34ee8c8baf10fe2ab0a34a0d3815994a.js"></script>

iOS:<br>
<script src="https://gist.github.com/waitzShigoto/425c93b104dcc5cc35373a83174dfe1d.js"></script>

<div class="c-border-main-title-2">Usage</div>
Using koinViewModel injected ViewModel in commonMain:<br>
<script src="https://gist.github.com/waitzShigoto/0d756e78444510d20f26fec3a8829358.js"></script>

Or you can use `get()` in the module to help generate the instances you need
<script src="https://gist.github.com/waitzShigoto/3b4f485ab4125137e709bdbb1beb9aa3.js"></script>

<div class="c-border-main-title-2">Conclusion</div>
- Using expect and actual keywords can handle platform differences
- Koin provides DI support in Compose Multiplatform
- Properly handling Context makes cross-platform code clearer and more maintainable
- This method can be applied to other platform-specific dependency injection scenarios
- In actual development, you can flexibly adjust DI strategies according to your own needs 