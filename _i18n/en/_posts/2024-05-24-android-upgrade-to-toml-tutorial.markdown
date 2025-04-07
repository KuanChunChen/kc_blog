---
layout: post
title: "Issues Encountered When Migrating Android Projects to Version Catalogs Using .toml"
date: 2024-05-24 18:24:24 +0800
image: cover/android-upgrade-to-toml-tutorial.png
tags: [Kotlin]
permalink: /android-upgrade-to-toml-tutorial
categories: Kotlin
excerpt: ""
---

<div class="c-border-content-title-4">Introduction</div>
* Since the previous project switched to `.kts` for building the project<br>
the official documentation also released an article aimed at migrating projects to version catalogs<br>
After adding it, you can see it displayed at the bottom when viewing the project directory in Android Studio<br>
<img src="/images/toml/001.png" width="40%"><br>
This saves a step (no need to double Shift to search XD) <br>
You can see the content by clicking <br>

* Previously, creating a `Dependence.kt` might require double Shift to search<br>
or looking under `../Dependence.kt`<br>

<div class="c-border-content-title-1">Applicable AGP Versions</div>

* Because newer versions of Android Studio<br>
can directly configure new projects through the IDE<br>
But if you encounter older projects<br>
you might wonder if you need to update the `AGP version` during manual migration<br>
And usually, older projects might be quite old<br>
requiring time to update or lacking the budget to optimize in a short time<br>
so maintaining the original version might be considered<br><br>

* So I did some research<br>
and randomly took an AGP configured with toml created by AS<br>
which was directly version 8.4.0<br>
<img src="/images/toml/002.png" width="50%"><br><br>
<img src="/images/toml/003.png" width="50%"><br><br>
<img src="/images/toml/004.png" width="50%"><br><br>

* According to the Gradle official documentation, in the `7.0` documentation
it mentions that `version catalogs were supported as an experimental feature in the 7.0 release`
<img src="/images/toml/005.png" width="50%"><br><br>
<a href="https://docs.gradle.org/7.0/release-notes.html">Refer to Gradle 7.0 release</a>
So toml can be used in 7.x

<div class="c-border-content-title-1">Issues You Might Encounter During Migration</div>
* Some projects use this method to introduce libraries<br>
```
implement("com.orhanobut:dialogplus:1.11@aar")
```
There is an @aar at the end<br>
But toml does not support adding @aar at the end in versions<br>
causing the build to fail<br>
<img src="/images/toml/009.png" width="50%"><br><br>
You can change it to the following<br>
<script src="https://gist.github.com/waitzShigoto/c019662550b3ae9c8ab2a685ee3644a7.js"></script>

* In the past, kotlin objects were used to configure version parameters, as shown below<br>
<script src="https://gist.github.com/waitzShigoto/e529bd12f84310a4c1f05c237850f1ba.js"></script>
If you want to switch everything to .toml
Testing shows that accessing versions configured in .toml externally<br>
cannot be done directly like `libs.xx.xx.xxx to get the version`<br><br>
You can only use `get()` to get the value of Versions in .toml<br>
For example: `libs.versions.minSdk.get().toInt()`<br>
<script src="https://gist.github.com/waitzShigoto/950ea155ac70ee87ce9b2060667027fa.js"></script><br>
However, if you set it this way<br>
you cannot see where it is used in .toml<br>
<img src="/images/toml/013.png" width="50%"><br><br>
Use `aapt dump badging appName.apk` to verify that the build output matches the `libs.versions.minSdk.get()` setting<br>
<img src="/images/toml/010.png" width="100%"><br><br>

* Configurations below AGP 8.1.0 need to add `@Suppress("DSL_SCOPE_VIOLATION")` above `plugin{}`
<img src="/images/toml/012.png" width="100%"><br><br>
The reason is due to an issue with the IDE
<a href="https://github.com/gradle/gradle/issues/22797">Version catalog accessors for plugin aliases shown as errors in IDE kotlin script editor #22797</a>

* Next is the version.ref under `[plugins]`<br>
It cannot be set to null or empty <br>

Because some projects use plugin + classpath to set up
<script src="https://gist.github.com/waitzShigoto/d353a385e8942ba88259c2bbb4e03171.js"></script>
<script src="https://gist.github.com/waitzShigoto/29686a0a02bd225c08ca968011f87503.js"></script>
This causes conflicts when directly using plugins settings<br>
<img src="/images/toml/011.png" width="50%"><br><br>

<div class="c-border-content-title-1">Why some libraries can build without setting version.ref</div>
* The first time you use `.toml`, you might wonder why some libraries can build normally without setting version.ref<br>
<img src="/images/toml/014.png" width="80%"><br><br>
This is because when you introduce `composeBom`<br>
and then import other related libraries without setting versions<br>
it will automatically map the related library versions based on the composeBom version you set<br>
So, by just setting composeBom, it can automatically set compatible versions for the supported libraries<br>
Very convenient!<br>
 - <a href="https://developer.android.com/develop/ui/compose/bom/bom-mapping">Refer to Bom mapping to understand the corresponding versions</a><br>

<div class="c-border-content-title-4">Migration method for version catalogs</div>
<div class = "table_container">
   <p>Migration explanation</p>
  Create <b>lib.version.toml</b> under the <b>../gradle</b> directory<br>
  <img src="/images/toml/006.png" width="35%"><br><br>
  Add <b>[versions]</b>, <b>[libraries]</b>, and <b>[plugins]</b> according to your needs<br>
  The official recommended naming convention is kebab case<br>
  It helps with better code completion<br>
  <img src="/images/toml/008.png" width="100%">
  For example, the code below:
</div>
<script src="https://gist.github.com/waitzShigoto/ca2178bad03c6ee04618a575a7751334.js"></script>

<div class = "table_container">
   <p>Actual usage</p>
  After adding the toml file, click sync now to synchronize<br>
  Then you can directly use it in build.gradle.kts<br>
  For example, the code below:<br>
</div>
<script src="https://gist.github.com/waitzShigoto/5be8ba888fa9e64287f8a33636fa533b.js"></script>
<div class="c-border-content-title-1">References</div>
- <a href="https://developer.android.com/build/migrate-to-catalogs?hl=zh-cn#kts">Android developer official documentation</a><br>
- <a href="https://docs.gradle.org/7.5/userguide/version_catalog_problems.html#unsupported_format_version">Gradle version catalogs troubleshooting</a><br>
- <a href="https://github.com/gradle/gradle/issues/22797">Version catalog accessors for plugin aliases shown as errors in IDE kotlin script editor #22797</a><br>
