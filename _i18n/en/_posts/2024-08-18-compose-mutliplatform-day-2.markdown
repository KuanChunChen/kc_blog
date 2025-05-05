---
layout: post
title: "Compose Multiplatform in Action: First Battle, Setting Up the CMP Environment"
date: 2024-08-18 17:13:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-2
categories: ComposeMultiplatform
excerpt: "This series focuses on Compose Multiplatform in Action: Developing Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform Android and iOS app development, and discuss findings and insights in the final days."
---

<div class="c-border-main-title-2">Introduction</div>

The `Compose Multiplatform (CMP)` UI framework takes Kotlin code sharing capabilities to a new level<br>
You can implement user interfaces once<br>
and use them on all target platforms—including iOS, Android, desktop, and web<br>
Today we'll start step by step with setting up the environment<br><br>

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">Goal</div>
We want to create a CMP project capable of producing `multi-platform` applications (Android, iOS, Web, Desktop)<br>
So first we need to understand how to set up a CMP project<br><br>

You can install based on the items listed below<br>
Some are optional<br>
You can choose what to install based on `your own needs`<br>
  * Android Studio
  * Java and JDK
  * Xcode
  * Kotlin plugins
  * (Optional) Kotlin Multiplatform plugin
  * (Optional) CocoaPods
  * (Optional) kdoctor
  * (Optional) Browsers

<div class="c-border-main-title-2">CMP Environment Setup - Installing Essential Tools</div>
<div class="c-border-content-title-1">Recommended: Install kdoctor first (Optional)</div>
`kdoctor` is an officially recommended plugin<br>
It helps check if all necessary components in your environment are `ready`<br>

Install kdoctor using the Terminal command<br>
```
brew install kdoctor
```
<img src="/images/compose/019.png" alt="Cover" width="100%" /><br />

Then simply run `kdoctor` to perform the check<br>
For example, in my environment<br>
it detected that I hadn't installed the Kotlin Multiplatform Plugin<br>

```
kdoctor
```
<img src="/images/compose/020.png" alt="Cover" width="100%" /><br />

In short<br>
when you see all `[v]` marks<br>
it means your `environment is correctly` set up<br>

If `kdoctor` diagnoses any issues in your environment:<br>

`[x]`: Any failed checks that need fixing<br>
You can find problem descriptions and potential solutions after the * symbol.<br>

`[!]`: Warning checks<br>
These might be optional installations<br>
Just reminders of what you could install<br>

<div class="c-border-content-title-1">Installing Android Studio</div>
To make CMP development more convenient, we need to install `Android Studio`<br>

First, go to the [Android Studio official website](https://developer.android.com/studio)<br>
to download the IDE<br>
<img src="/images/compose/021.png" alt="Cover" width="50%" /><br />

Then, if you're on `MacOS`, open the downloaded `.dmg` file<br>
and drag the IDE to your Applications folder<br>
If you're on `Windows`, run the `.exe` file and select the installation directory<br>

<img src="/images/compose/022.png" alt="Cover" width="50%" /><br />
(Image shows Mac installation)



<div class="c-border-content-title-1">Checking the Kotlin Plugin</div>
`CMP` primarily uses `Kotlin` for development<br>
so the Kotlin Plugin is `essential`<br>
However, modern Android Studio versions come with it integrated<br>
Once you install Android Studio, the Kotlin Plugin is already installed<br>
(Newer IDE versions take care of this for you)<br>

So you can proceed to open `Android Studio`<br>

If you do encounter any issues<br>
go to `Tools > Kotlin > Configure Kotlin in Project`<br>
to let the IDE check if it's installed<br>
<img src="/images/compose/023.png" alt="Cover" width="50%" /><br />



<div class="c-border-content-title-1">Checking Java JDK Environment</div>
This step is similar to the one above<br>
Newer versions of `Android Studio IDE` already handle this for you<br><br>

If you're `unsure` whether it's installed<br>
the IDE has a built-in download option<br>
You can check for JDK installation at:<br>
Click `Android Studio > Settings` or use shortcut `Command + ,`<br>
<img src="/images/compose/024.png" alt="Cover" width="50%" /><br />

Navigate to `Build, Execution Deployment > Build Tools > Gradle`<br>
<img src="/images/compose/025.png" alt="Cover" width="50%" /><br />

Click the dropdown menu and select from existing options in your environment<br>
or click Download JDK to download it<br>
<img src="/images/compose/026.png" alt="Cover" width="50%" /><br />


Additionally<br>
I recommend using `sdkman` (Optional)<br>
It allows you to `manage SDKs in your environment` via command line<br>
Since we're focusing on `CMP`<br>
I'll just introduce a few `commonly used` commands<br>
Feel free to look up more online if interested<br><br>

View currently configured sdk<br>
```
sdk current
```

List available and downloadable Java SDKs<br>
```
sdk ls java
```

Set JAVA environment (xxx name can be found using sdk ls above)<br>
```
sdk using java xxx
```

<div class="c-border-content-title-1">Kotlin Multiplatform plugin (Optional)</div>
To better support Multiplatform in Android Studio<br>
we need to download the `Kotlin Multiplatform plugin`<br>
Open Settings > Plugin > Marketplace<br>
<img src="/images/compose/017.png" alt="Cover" width="50%" /><br />

Click `install`<br>
After completion, click `Apply` and then `Restart` the IDE<br>

This enables Android Studio to automatically create `basic KMP project content`<br>
when using Create New Project<br>
It's like having a built-in `template` creator<br>
<img src="/images/compose/018.png" alt="Cover" width="50%" /><br />

> For reference, see the [KMM Plugin official Release](https://kotlinlang.org/docs/multiplatform-plugin-releases.html)

Additionally, `for CMP specifically`<br>
there's an official online method for creating basic CMP projects<br>
(If you forgot the difference between KMP and CMP, refer to `Day 1` article, <a href="{{site.baseurl}}/compose-multiplatform-day-1">Compose Multiplatform in Action: Taking It Easy, An Introduction to CMP</a>)<br>

This is through the online webpage<br>
[Wizard](https://kmp.jetbrains.com/#newProject)<br>
which lets you create a project and import it into the IDE<br>

The choice between methods comes down to:<br>
`KMP`: Using the `KMM plugin` focuses more on `Native UI` + `common logic` development<br>
`CMP`: Using the online `KMM Wizard` focuses more on `Compose UI` + `common logic` development for multiple platforms<br>

That's all for this introduction<br>
When we start detailed project development later<br>
I'll explain how to use the `Wizard`<br>

<div class="c-border-content-title-1">Installing Xcode</div>

If you're on macOS<br>
and want to run iOS apps<br>
you'll need Xcode<br><br>

The method is simple<br>
Go to the App Store, search for Xcode<br>
and download it<br>
<img src="/images/compose/016.png" alt="Cover" width="50%" /><br />


If you're using another operating system<br>
you can skip this step<br>
though you won't be able to build iOS apps<br>
There might be workarounds?<br>
But those probably won't follow the standard approach XD<br>

<div class="c-border-content-title-1">Installing CocoaPods (Optional)</div>

If you anticipate using iOS frameworks, you can install this now<br>
If not, you can wait until needed<br><br>

Install CocoaPods using the command<br>

```
brew install cocoapods
```

However, to install via brew<br>
you'll need a newer version of Ruby<br><br>

According to the official site, you need at least version `3.3.4`<br>
> Depends on:
ruby	3.3.4	Powerful, clean, object-oriented scripting language

You can check your environment's version with<br>

```
ruby -v 
```

If your version is too old<br>
first `reinstall` it<br>
```
brew reinstall ruby
```

Then use `brew install cocoapods`<br>

<div class="c-border-content-title-1">Checking Browsers (Optional)</div>

If you want to create Web applications<br>
you'll need a browser that supports `Wasm garbage collection (GC)`.<br>

Here's the official information<br>
You need to check your OS's `Browser version`<br>
The following environments are currently supported<br>

`Chrome` and `Chromium`: Supported from version 119.<br>
`Firefox`: Supported from version 120.<br>
`Safari/WebKit`: Wasm GC is currently in development<br><br>

Browsers like Safari might not fully support it yet<br>
so you might not be able to run everything completely<br>
If you need to develop Web apps<br>
try following the information above<br>

<div class="c-border-content-title-1">Conclusion</div>
I always feel that starting with a new programming language or framework<br>
usually means you'll be `unfamiliar` with how to configure its environment<br>
but with a little guidance<br>
it becomes much easier to get started<br>

Overall<br>
you don't need prior experience with Compose Multiplatform, Android, or iOS<br>
you can start from zero, gradually familiarize yourself with Kotlin, and then master CMP step by step<br>

If you have any questions or issues, feel free to discuss in the comments section, and we can learn and grow together.<br>
That's all for this article, thank you for reading and for your support!<br> 