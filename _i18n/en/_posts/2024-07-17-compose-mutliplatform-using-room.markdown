---
layout: post
title: "【Compose Multiplatform】Using ROOM Database in CMP - [KSP2] Annotation value is missing in nested annotations"
date: 2024-07-18 20:46:20 +0800
image: cover/compose_multiplatform_room.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-room
categories: ComposeMultiplatform
excerpt: "This article details the process of migrating from a Compose project to Compose Multiplatform, and how to implement Room, which is commonly used in Android development."
---

<div class="c-border-main-title-2">Introduction</div>


<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

<div class="c-border-main-title-2">Important Notes - Current Compatibility Issues with ROOM in CMP</div>

* Note 1. Room version 2.7.0-alpha01 and above supports KMM.

* Note 2. When importing ksp, you might encounter issues with version incompatibility due to different Kotlin versions<br>
and `fail to Build`<br>
In this case, you can check the official GitHub for supported versions: [ksp releases](https://github.com/google/ksp/releases)<br>

* Note 3. Using Kotlin with ksp will check for ksp version and Kotlin compatibility<br>
When using Kotlin 2.0.0, during `gradle sync` you might see errors about version incompatibility<br>
such as `Cannot change attributes of configuration ':composeApp:debugFrameworkIosX64' after it has been locked for mutation` <br>
or `[KSP2] Annotation value is missing in nested annotations`<br><br>
Initially, I found a solution for the `KSP2` issue<br>
by adding `ksp.useKSP2=true` in gradle.properties<br><br>
However, even after solving this issue<br>
and passing `gradle sync`<br>
you'll encounter problems when configuring Room with ksp<br>
For example, after setting up `ksp(libs.androidx.room.compiler)`<br>
you'll consistently get missing dao errors: `[ksp] [MissingType]: xxxxx 'data.xxx.xxxDao' references a type that is not present`<br><br>
After researching this issue<br>
Some suggest downgrading the Kotlin version to match ksp<br>
But since the official Wizard for CMP now defaults to Kotlin 2.0.0<br>
and following the principle of using newer rather than older versions XD<br>
If you want to successfully set up Room with Kotlin 2.0.0, you'll need to use a workaround<br>
You can refer to the methods below until an official solution is available<br><br><br>
I'll provide methods below<br>
that you can reference<br><br>
Additionally, I've seen that other developers have already reported issues to the official team:<br>
   * [Issue 1](https://github.com/google/ksp/issues/1896)
   * [Issue 2](https://youtrack.jetbrains.com/issue/KT-68981)
   * [Issue 3](https://github.com/google/ksp/issues/1833)



<div class="c-border-main-title-2">Implementation</div>

<div class="c-border-content-title-1">Import - With Kotlin version 1.9</div>

* Step 1. Import Room
   - Add the following to your .toml file:
     <script src="https://gist.github.com/waitzShigoto/c352887cbc647ca13eeb66452a79edbd.js"></script>

   - Add plugin to build.gradle.kts:
     <script src="https://gist.github.com/waitzShigoto/b131ed97d95a0cd21cc3a7831c6142a8.js"></script>

   - Add library to build.gradle.kts:
     <script src="https://gist.github.com/waitzShigoto/a036df8a7c3a144e2b261471e911d82f.js"></script>
  
   - Add the following code to the outer layer of build.gradle.kts:
     <script src="https://gist.github.com/waitzShigoto/52c42bc675a05a58f04ab9fc95624032.js"></script>

   - If you're using Kotlin version greater than 1.9.20, add the following to gradle.properties:
    <script src="https://gist.github.com/waitzShigoto/adc4b45f180191bc1ec6911c9471cf8e.js"></script>

<div class="c-border-content-title-1">Import - With Kotlin version 2.0.0</div>

* Step 1. Modify ksp version:
  <script src="https://gist.github.com/waitzShigoto/ca66a227923d4f4a47c7a6a5823af719.js"></script>

* Step 2. Adjust build.gradle.kts:<br>
   - Add `build/generated/ksp/metadata` to the kotlin block<br>
   - Use the add method to import ksp<br>
   - Add tasks.withType to the outer layer<br>
    <script src="https://gist.github.com/waitzShigoto/c294e47392a0e64f2bd6cc88f638a5ac.js"></script>

* Step 3. Implement RoomDatabase using a workaround<br><br>
  This is the current workaround<br>
  If you're using Kotlin 2.0.0, you'll need to do this<br>
  as we need to wait for the official team to resolve compatibility issues<br>
  <script src="https://gist.github.com/waitzShigoto/a94106152a3951c8f605bb9cee11eaac.js"></script>

<div class="c-border-main-title-2">Using Room in Practice</div>
<div class="c-border-content-title-1">Android Main</div>
Implement AppDataBase builder
<script src="https://gist.github.com/waitzShigoto/070cd28c456b0cf18418e7982a3a859c.js"></script><br>

Koin: 
<script src="https://gist.github.com/waitzShigoto/6a76498330b853aebcadcf118d8322c9.js"></script>
<div class="c-border-content-title-1">iOS Main</div>
Implement AppDataBase builder
<script src="https://gist.github.com/waitzShigoto/12078618b6fe85935efd75dfd84178f0.js"></script><br>

Koin:
<script src="https://gist.github.com/waitzShigoto/221f5879d2f9aa3cf71368f6a6c30f47.js"></script>

<div class="c-border-content-title-1">Common Main</div>
Implement AppDataBase
<script src="https://gist.github.com/waitzShigoto/0c2d746b2045ab6a265ad00acd221e6c.js"></script>

Dao
<script src="https://gist.github.com/waitzShigoto/f509c24e1504ecf18cddd59ea478d127.js"></script>

Entity
<script src="https://gist.github.com/waitzShigoto/40c40b4435400e56c7f77f9160238d64.js"></script>

<div class="c-border-main-title-2">References</div>

* [KMM official documentation on importing ksp](https://kotlinlang.org/docs/ksp-multiplatform.html)
* [Android Studio Room documentation](https://developer.android.com/jetpack/androidx/releases/room#declaring_dependencies)
* [KMM Room support documentation](https://developer.android.com/kotlin/multiplatform/room)
* [ksp2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html)
* [issuetracker](https://issuetracker.google.com/issues/341787827) 