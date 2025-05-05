---
layout: post
title: "Compose Multiplatform in Action: Taking It Easy, An Introduction to CMP"
date: 2024-08-18 17:12:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-1
categories: ComposeMultiplatform
excerpt: "This series focuses on Compose Multiplatform in Action: Developing Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform Android and iOS app development, and discuss findings and insights in the final days."
---

<div class="c-border-main-title-2">Introduction</div>

Hello everyone!<br>
This series will focus on `Compose Multiplatform in Action: Developing Cross-platform Apps from Scratch with Kotlin`<br>
I'll concentrate on developing cross-platform apps for `Android` and `iOS`<br>
In the final days, I'll also share my findings and insights from my research<br>

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">Introduction to Compose Multiplatform</div>
Let's first get a basic understanding of **Compose Multiplatform** and **Kotlin Multiplatform**

The term `Multiplatform` itself is simply `Multi` + `platform`<br>
As the name suggests, it means supporting `multiple platforms`<br>

According to the [JetBrains official website](https://www.jetbrains.com/lp/compose-multiplatform/),<br>
`Compose Multiplatform` allows developers to use Kotlin's `Compose declarative UI`<br>
to develop applications<br>
Currently supported platforms include `iOS`, `Android`, `Desktop`, and `Web`<br><br>

Some people also refer to it as `KMM (Kotlin Mobile Multiplatform)`<br>
or `CMP (Compose Multiplatform)`, `KMP (Kotlin Multiplatform)`<br>
In this series, I'll use `CMP` to refer to Compose Multiplatform<br>
to reduce repetition throughout the articles<br>
I hope you can get used to this abbreviation!<br>

<div class="c-border-content-title-1">What's the difference between CMP and KMP?</div>

Both aim to simplify cross-platform project development<br>
reducing the time spent writing and maintaining the same code for different platforms<br>

You can use Gradle configurations<br>
along with shared source code development to reduce development time<br>
such as developing cross-platform code through `commonMain`<br>
Compose UI is developed in this layer<br><br>

`Here are the main differences`:<br>

`KMP` requires using `native platform` code to create the UI layout for target apps<br>
For example:<br>
Android uses `xml` to implement layouts<br>
or more recently, Android has evolved to using Compose for UI implementation<br><br>

`iOS` uses SwiftUI for implementation<br><br>

`CMP` extends the KMP concept<br>
It similarly allows writing shared code<br>
and now supports using `Compose` to create multi-platform UI<br>

<div class="c-border-content-title-1">Preview</div>

As shown below, I can create `multi-platform UI` using just Compose<br>
<img src="/images/compose/015.png" alt="Cover" width="50%" /><br />

Of course, this UI is created using `Material Design 3`<br>
Some might be concerned that it doesn't match iOS design guidelines<br>

However, my past practical experience has taught me<br>
that when working on projects<br>
most UI designs<br>
are primarily based on iOS screens<br>

Therefore, apart from platform-specific components<br>
careful customization can create screens that look almost identical to iOS<br>

So this aspect depends on each person's `use case`<br>
and whether they care about these differences XD<br>

<div class="c-border-main-title-2">Goals</div>

Finally<br>
In these thirty days, I'll share the following topics<br>

* [Understanding CMP basic environment configuration]()
* Mastering CMP [basic creation methods](), [project configuration](), and [simulator configuration]()
* [Understanding CMP program entry points]()
* [Using Material Design 3 Theme in CMP]()
* [Concrete methods for implementing UI with Compose]()
* [Using expect and actual to implement cross-platform code]()
* [Understanding how to use Koin for DI injection in CMP]()
* How to handle Android context requirements in CMP development?
* Implementing DataStore for local persistent storage in CMP
* [Implementing local database using SqlDelight in CMP]()
* [Implementing local database using Room in CMP]()
  and solving the [KSP2] Annotation value is missing in nested annotations issue
* Importing CocoaPods and using iOS frameworks in CMP projects
* Using cinterop and iOS frameworks in CMP projects
* ...and more

<div class="c-border-main-title-2">Conclusion</div>

Starting tomorrow<br>
I'll begin writing notes to help everyone better understand `Compose Multiplatform`<br>

Additionally, CMP is constantly being updated<br>
Based on articles published by Google<br>

It's likely that more support<br>
will be gradually added to CMP<br>
which is something to look forward to<br>
<img src="/images/compose/014.png" alt="Cover" width="50%" /><br />
(Image source: Google Blog)<br>

Since CMP is relatively new<br>
we might encounter various situations<br>
and there isn't as much information available online<br>
so if you encounter any issues, we can discuss them and learn from each other<br> 