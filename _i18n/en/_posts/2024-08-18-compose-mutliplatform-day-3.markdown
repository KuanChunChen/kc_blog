---
layout: post
title: "Compose Multiplatform in Action: Continuing the Battle, Creating a CMP Project with Wizard"
date: 2024-08-18 17:13:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-3
categories: ComposeMultiplatform
excerpt: "This series focuses on Compose Multiplatform in Action: Developing Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform Android and iOS app development, and discuss findings and insights in the final days."
---

<div class="c-border-main-title-2">Introduction</div>

`Compose Multiplatform (CMP)`<br>
Yesterday we just finished setting up the CMP environment<br>

From a programming perspective<br>
you could actually start from scratch<br>
creating every file or structure yourself<br>
creating each file manually<br>
even using commands to write them<br>
for example<br>
`touch xxx.kt`<br>
then edit each file with `vim`<br>

But that's too cumbersome<br>
so when creating projects<br>
we typically use pre-configured project structures<br>

For `CMP`<br>
we can use the official `Wizard` tool<br>

So today we'll learn<br>
how to create CMP projects using the `Wizard`<br>
and address some common issues<br>

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">Creating a CMP Project</div>
<div class="c-border-content-title-1">Project Creation</div>
It's actually quite simple<br>
using JetBrains' official webpage<br> 
[Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/#newProject)

Once on this page<br>
you'll see a screen like this<br>
<img src="/images/compose/027.png" alt="Cover" width="50%" /><br />

Modify the project name, package name, etc. according to your needs<br>

> Let's quickly go through the settings as shown above

`Project Name`: This is the name of your project<br>
It mainly affects the `name of your built app`<br>
and your project's `root folder name`<br>

`Project ID`: This is the Package Name of your built app<br>
It also affects the package path in your project<br>

Below you'll see several checkboxes<br>
`Android`, `iOS`, `Desktop`, `Web`, `Server`<br>
You can select which platforms you want the wizard to configure for your project<br>

This is straightforward<br>
For example, if my goal is to target `Android` and `iOS`, I'd select these two platforms<br>
Under iOS, you'll see two options<br>
allowing you to choose your UI configuration<br>
> Share UI (with Compose Multiplatform UI framework)
Do not share UI (use only SwiftUI)

If you want iOS to use Compose, select<br>
`Share UI (with Compose Multiplatform UI framework)`<br>
Otherwise, use native SwiftUI<br>

Note that these are just `default` settings based on your choices<br>
you can still `manually change them later`<br><br>

After completing the form, click Download<br>
to get a pre-configured project<br>
<img src="/images/compose/028.png" alt="Cover" width="70%" /><br/>

<div class="c-border-content-title-1">Importing into IDE</div>

Unzip the compressed file from the previous step<br>
then you can use `Android Studio`'s `import project` feature<br>
to import it into the IDE<br>
so you can edit it there<br>

Navigate to `File > New > Import Project`<br>
<img src="/images/compose/029.png" alt="Cover" width="50%" /><br/>

In the file selection dialog that appears<br>
select the `folder` you just unzipped<br>
<img src="/images/compose/030.png" alt="Cover" width="70%" /><br/>

<div class="c-border-content-title-1">Bonus: Compose Multiplatform Wizard</div>
As mentioned in previous days, the CMP community is quite active<br>
and the main company behind it, `JetBrains`<br>
continues to maintain and update the tools<br>
This is a newer feature also developed by `JetBrains employees`<br>
[Compose Multiplatform Wizard](https://www.jetbrains.com/lp/compose-multiplatform/)
though it's not included in the official documentation<br>
I came across it while browsing GitHub<br>

It's similar to the `Kotlin Multiplatform Wizard` mentioned above<br>
`Compose Multiplatform Wizard` also generates projects with `Compose` as the UI through a web interface<br>
but adds options to import commonly used CMP libraries<br>

<img src="/images/compose/031.png" alt="Cover" width="50%" /><br />

Just like before<br>
enter your desired Project Name and Project ID<br>
select the libraries you want<br>
download, unzip, and import into your IDE<br><br>

This is the GitHub repo of the developer `terrakok` if you're interested<br>
It appears to be hosted on GitHub Pages<br>
[Compose-Multiplatform-Wizard GitHub](https://github.com/terrakok/Compose-Multiplatform-Wizard-App) 