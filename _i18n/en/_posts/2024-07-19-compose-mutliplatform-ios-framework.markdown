---
layout: post
title: "【Compose Multiplatform】Using CocoaPods in CMP Projects and Using iOS Swift/Obj-C Without CocoaPods"
date: 2024-07-18 21:30:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-ios-cocoapods
categories: ComposeMultiplatform
excerpt: "This article details the process of migrating from a Compose project to Compose Multiplatform, focusing on how to integrate iOS native code."
---

<div class="c-border-main-title-2">Introduction</div>

When developing cross-platform apps for both platforms
the current official solutions
may not be completely comprehensive
so for some features
we need to bridge back to the original platform
and use that platform's native code
How can we implement this?


<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

<div class="c-border-main-title-2">Using CocoaPods</div>
<div class="c-border-content-title-1">Add CocoaPods Configuration Settings</div>
Add configuration to libs.version.toml
<script src="https://gist.github.com/waitzShigoto/14f0d600c186a7e8d32be0d5b96666ae.js"></script>

In build.gradle.kts<br>
add the cocoapods block<br>
and add the Pod library dependencies you want to use `pod("Google-Mobile-Ads-SDK")`<br>
as well as the `PodFile` location `podfile = project.file("../iosApp/Podfile")`<br>
usually under your iOS project<br>
if you generate a project with the KMM official website<br>
the default name is `iosApp`<br>
<script src="https://gist.github.com/waitzShigoto/b6c7c751d9e203f71422c98ab512dcb4.js"></script><br>

The official website mentions that you can add the following types of Pod library dependencies<br>
- From CocoaPods repository
- Locally stored libraries
- Custom Git repository
- Custom Podspec repository
- With custom cinterop options

Configure Podfile under the iosApp project
<script src="https://gist.github.com/waitzShigoto/419374bf1bfe829fb5c2cbc3ae79a5a8.js"></script>

After that<br>
use `pod install` in the iosApp project to install the configuration<br>
if it's already installed, you can use `pod install --repo-update`<br>
or `pod deintegrate` and then reinstall<br><br>
Finally, run `./gradlew build`<br>
if successful, you can import iOS bridged code through Kotlin<br>
<script src="https://gist.github.com/waitzShigoto/13e7f746a07dd30247ad1850946dadc3.js"></script><br>

<div class="c-border-main-title-2">Using iOS Framework in Kotlin Without CocoaPods</div>
If you don't want to use CocoaPods<br>
you can use cinterop to create Kotlin bridges for Objective-C or Swift declarations<br>
so you can call them from Kotlin<br><br>

Step 1. <br>
Create a `.def` file in `../composeApp/nativeInterop/cinterop/xxx.def`<br>
(write the content according to your actual needs)<br>
<script src="https://gist.github.com/waitzShigoto/bb0cdcf859ca450bacbf3b888b49e02a.js"></script>

Step 2.<br>
Add the following code to the iOS configuration in `Build.gradle.kts`<br>
the framework you want to use can also be found through paths after installing with cocoapods<br>
or you can implement your own .swift bridge<br>

<script src="https://gist.github.com/waitzShigoto/60fad794cafa8b4c067297035aea7128.js"></script>

<div class="c-border-main-title-2">Conclusion</div>

- However, based on current testing<br>
iOS native code transferred directly through cocoapods configuration<br>
cannot be completely transferred at the current stage<br>
for example, when I use `Google-Mobile-Ads-SDK`, not all functions can be resolved<br>
- So we need to use .def to transfer it ourselves<br>
but this is equivalent to still having to write iOS native code<br> 