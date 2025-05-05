---
layout: post
title: "【Compose Multiplatform】Implementing SqlDelight Database"
date: 2024-07-10 15:38:40 +0800
image: cover/compose_multiplatform_sqldelight.png
tags: [Kotlin, Compose Multiplatform, SqlDelight]
permalink: /compose-multiplatform-sqldelight
categories: ComposeMultiplatform
excerpt: "This article provides a detailed guide on how to use SqlDelight in Compose Multiplatform projects to implement cross-platform database operations, including library imports, table implementation, platform-specific implementations, and practical usage methods."
---

<div class="c-border-main-title-2">Introduction</div>

In Compose Multiplatform projects<br>
how can we implement cross-platform database operations?<br>
SqlDelight provides a powerful solution<br>
This article will introduce how to<br>
use SqlDelight for database operations in a cross-platform environment<br>

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>


<div class="c-border-main-title-2">Implementation Steps</div>
<div class="c-border-content-title-1">1. Import SqlDelight</div>
First, import SqlDelight into your project:<br>
Add to your .toml file:<br>
<script src="https://gist.github.com/waitzShigoto/212a3f263b6f8bd8d89dd7a41278cf15.js"></script>

Add plugins and dependencies to build.gradle.kts:<br>
 - First add the plugin<br>
<script src="https://gist.github.com/waitzShigoto/d1f759b755844594d9b0a566c070274e.js"></script>
 - Then add the corresponding libraries for each environment<br>
<script src="https://gist.github.com/waitzShigoto/961acd32138dd067fb890b238b9574ea.js"></script>
 - Finally, add the SqlDelight configuration under kotlin<br>
 This can be understood as creating an operable class called `AppDatabase` in the `test.your.package.db` package<br>
<script src="https://gist.github.com/waitzShigoto/34c9aeaa5ed7a5899b1ed281b0ddafca.js"></script>

<div class="c-border-content-title-1">2. Implement Database Tables</div>
 - Create .sq files in the commonMain/`sqldelight`/database directory:<br>
 In the current version, I've verified that you need to add the sqldelight folder in the above path
 for the build process to successfully generate the operable class in the next step
![截圖 2024-07-09 下午3.11.59.png](/images/compose/007.png)
<script src="https://gist.github.com/waitzShigoto/1ba4ff8058e91955208ff66625cdae30.js"></script>

 - (Optional) You can download the `SqlDelight` plugin of the same name, so it can generate .sq files via right-click (available for download from the Marketplace)<br>
  [Reference sqldelight](https://plugins.jetbrains.com/plugin/8191-sqldelight)<br>
  ![截圖 2024-07-09 下午3.11.59.png](/images/compose/008.png)
 - As mentioned above, after configuration and building<br>
   the corresponding class will be generated in the path `/build/generated/sqldelight/code/..`<br><br>
 - Or you can use cmd to Build<br>
   `./gradlew generateCommonMainAppDatabaseInterface`<br><br>
 - If you encounter iOS build failures, you can change isStatic to false in build.gradle.kts<br>
    <script src="https://gist.github.com/waitzShigoto/d212905eb22f1a29896d8d3699baefe3.js"></script>

<div class="c-border-content-title-1">3. Create Platform-specific Implementations</div>
Create DatabaseDriverFactory for different platforms:<br>
<script src="https://gist.github.com/waitzShigoto/04d780bfc000ef0a802557555ea721d3.js"></script>

<div class="c-border-content-title-1">4. Practical Usage</div>
Implement business logic using the generated DB class:<br>
<script src="https://gist.github.com/waitzShigoto/e35ce1a2ca45daf6070ecbedb093ca93.js"></script>

<div class="c-border-content-title-1">5. Koin Injection (Optional)</div>
If you use Koin for dependency injection<br>
you can do it like this<br>
<script src="https://gist.github.com/waitzShigoto/6894df15e9d1e293fda291a23faf0d6f.js"></script>

<div class="c-border-main-title-2">Considerations</div>
1. It is recommended to use SqlDelight version 2.0.1, to avoid known issues with iOS build failures in version 2.0.0<br>
For details, see this discussion thread: [Click here](https://github.com/cashapp/sqldelight/issues/4357)<br>
2. If you encounter iOS build failures, you can try setting isStatic to false<br>
I can't find why this change is necessary<br>
It might be an official workaround<br>
The official documentation directly mentions this method<br>

<div class="c-border-main-title-2">Conclusion</div>
- SqlDelight provides a powerful cross-platform database solution
- Through proper encapsulation, you can use database APIs uniformly across different platforms
- Combined with dependency injection frameworks like Koin, database instances can be better managed
- Pay attention to version selection and platform-specific implementations to ensure cross-platform compatibility 