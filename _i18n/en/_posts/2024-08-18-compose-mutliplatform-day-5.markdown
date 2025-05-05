---
layout: post
title: "Compose Multiplatform in Action: Understanding CMP Project Structure and Build Configuration"
date: 2024-08-18 17:16:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-5
categories: ComposeMultiplatform
excerpt: "This series focuses on Compose Multiplatform in Action: Developing Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform Android and iOS app development, and discuss findings and insights in the final days."
---

<div class="c-border-main-title-2">Introduction</div>

`Compose Multiplatform (CMP)`<br>
Yesterday we just finished configuring the simulators for CMP<br>

I've been meaning to mention<br>
that I'm hoping this series of articles<br>
can help `beginners` and even people who don't typically develop `Mobile Apps`<br>
to get started<br>
so I'm being quite detailed in some places<br>
I hope you'll bear with me XDDD<br><br>

Today I'll introduce the CMP project structure<br>
along with `Gradle configuration` adjustments<br>
and the purpose of `lib.version.toml` in CMP projects<br>

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">CMP Project Structure</div>
Here is the default `project structure`<br>
when you create a CMP project<br>

```
YourProjectName
├── build
├── composeApp
│   ├── build
│   ├── src
│   │   ├── commonMain
│   │   ├── commonTest
│   │   ├── iosMain
│   │   └── desktopMain
│   └── build.gradle.kts
├── gradle
│   ├── wrapper
│   │   └── libs.versions.toml
├── iosApp
│   ├── iosApp
│   └── iosApp.xcodeproj
├── .gitignore
├── build.gradle.kts
├── gradle.properties
├── local.properties
└── settings.gradle.kts
```

Here's a breakdown of the purpose of each folder and file<br>
to help beginners understand more quickly<br><br>

* `YourProjectName`: The project name and the root folder of the entire project
* `build`: Output files from the compilation process, generated during build, so it can be added to `.gitignore`
* `composeApp`: Contains the source code and configuration for the Compose Multiplatform application
  - `build`: Build outputs for `CMP`, also generated during compilation, so it can be added to `.gitignore`
  - `src`: The directory for `CMP` code
    -  `commonMain`: Directory for common logic code in the CMP project
    -  `commonTest`: Directory for test code in the CMP project
    -  `iosMain`: Directory for `iOS` implementation code
    -  `desktopMain`: Directory for `desktop` implementation code
  - `build.gradle.kts`: Gradle configuration file for `CMP`
* `gradle`: Gradle-related configuration files
  - `wrapper`: Contains Gradle Wrapper related files
  - `libs.versions.toml`: Defines the `dependency versions` used in the project
* `iosApp`: Root folder for the iOS project
  - `iosApp`: Directory for iOS code
* `iosApp.xcodeproj`: Xcode project file for iOS
* `.gitignore`: Defines which files or directories should be ignored in Git version control
* `build.gradle.kts`: Gradle configuration file for the `root directory`
* `gradle.properties`: Gradle properties file
* `local.properties`: Properties file defining local configurations
* `settings.gradle.kts`: Gradle file defining the settings for the `CMP` project

<div class="c-border-main-title-2">Using libs.versions.toml to Configure Gradle Dependencies</div>
`libs.versions.toml` is a configuration file used to manage project dependency versions<br>
especially in projects built with Gradle<br><br>

According to the official Gradle documentation<br>
this feature was supported in the `Gradle 7.0` release<br>
and they call this feature `version catalogs`<br><br>

This file uses the TOML (Tom's Obvious, Minimal Language) format to define dependency version information<br>
centralizing this information in the project to improve maintainability and readability<br><br>


Here's an example of a libs.versions.toml file and its explanation:<br>
```.toml
[versions]
agp = "8.2.0"
kotlin = "2.0.10-RC"
androidx-activityCompose = "1.9.0"

[libraries]
androidx-activity-compose = { module = "androidx.activity:activity-compose", version.ref = "androidx-activityCompose" }

[plugins]
androidApplication = { id = "com.android.application", version.ref = "agp" }
androidLibrary = { id = "com.android.library", version.ref = "agp" }
kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
```

`Key sections explained`:<br><br>

* Version definitions `[versions]`:<br>
  This section defines the version numbers of various dependencies used in the project<br>
  For example, kotlin = "2.0.10-RC" indicates that the Kotlin version is 2.0.10-RC.<br>

* Dependency definitions `[libraries]`:<br>
  This section defines the actual dependencies used in the project and their version information<br>
  Each library defines a `module` and a `version.ref`<br>
  where `module` is the dependency's `Maven` coordinate<br>
  and `version.ref` references the version number defined above<br>
  - For example, androidx-activity-compose = { module = "androidx.activity:activity-compose", version.ref = "androidx-activityCompose" }<br>
  - indicates that the androidx-activityCompose standard library version references the version number 1.9.0 defined by androidx-activityCompose.<br>

* Plugin definitions `[plugins]`:<br>
  This section defines the plugins used in the project and their version information<br>
  Each plugin defines an `id` and a `version.ref`<br>
  where `id` is the plugin identifier<br>
  and `version.ref` also references the version number defined above<br>
  - For example, kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
  - indicates that the kotlinMultiplatform Plugin version references the version number `2.0.10-RC` defined by kotlin.<br>

* Once the `.toml` file is configured<br>
  after clicking sync project<br>
  you can directly configure dependencies in your Gradle configuration<br>
  using the `libs.xxx.xx` notation<br>
  For example:<br>
> implementation(libs.androidx.activity.compose)


* This configuration approach makes project dependency version management more centralized and unified, facilitating version upgrades and maintenance. Through the libs.versions.toml file, the project can clearly see all dependency version information, avoiding the confusion caused by defining version numbers in multiple places.

* You can also check out [issues encountered when migrating to version catalogs with .toml]({{site.baseurl}}/android-upgrade-to-toml-tutorial) for reference

<div class="c-border-content-title-1">build.gradle.kts(:composeApp)</div>

`build.gradle.kts(:composeApp)` is a Gradle build script file used to configure `CMP` projects<br>
It uses `Kotlin DSL (Domain Specific Language) to define build configurations`<br>
This approach provides stronger `type safety` (Null safety) and `better IDE support`<br><br>

It mainly affects your app's behavior during compilation<br>

Since the `build.gradle.kts` for `CMP` projects is quite lengthy<br>
I'll explain it in parts<br>

* `plugins` block: Used to import plugins<br>
  The imported plugins use what's declared in the `lib.version.toml`<br>
  Like this:<br>
```
plugins {
    alias(libs.plugins.multiplatform)
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.compose)
    alias(libs.plugins.android.application)
    alias(libs.plugins.buildConfig)
    alias(libs.plugins.kotlinx.serialization)
}
```

`kotlin` block:<br>
This is where you place configuration items for the `CMP` project<br>
Such as configuration for `shared files` (Strings, images, etc.)<br>
JDK compilation settings<br>
Or settings for different target platforms<br>

Here's a brief explanation:<br>
* `androidTarget > compilerOptions > jvmTarget.set(JvmTarget.JVM_17)`
  Sets compilation to use JDK 17<br>

* `cocoapods`: Imports `cocoapods` via `Gradle` to use iOS frameworks<br>

* `listOf(iosX64(), iosArm64(), iosSimulatorArm64()).forEach { target -> ...` :<br>
  Configures iOS, for example using `cinterops` to bridge to iOS<br>
  Allowing CMP to use specified iOS frameworks<br>

* `sourceSets > androidMain.dependencies` and `commonMain.dependencies`, etc.:<br>
  Here you can specify dependencies for different platforms<br>
  For example: the androidMain block imports libraries used by `android`<br>
  The commonMain block imports libraries used by `shared logic`<br>
  You can even use iosMain to import libraries for `iOS`<br>

However, the example below uses bridging<br>
so it uses<br>
`listOf(iosX64(), iosArm64(), iosSimulatorArm64())`<br>
to import iOS frameworks<br>
I'll just cover this briefly for now<br>
Later chapters will provide more detailed explanations about iOS bridging<br>

* Below is a simple example of a `build.gradle.kts` file<br>

```.gradle.kts
kotlin {

    androidTarget {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_17)
        }
    }

    cocoapods {
        summary = "Bidapp ads for kotlin multiplatform"
        version = "1.0"
        homepage = "https://github.com/JetBrains/kotlin"
        ios.deploymentTarget = "15.4"
        podfile = project.file("../iosApp/Podfile")
        name = "composeApp"
        pod("Google-Mobile-Ads-SDK")

        framework {
            baseName = "composeApp"
            linkerOpts.add("-lsqlite3")
            isStatic = true
            binaryOption("bundleId", "xxxx.edu")

        }

    }
  

    listOf(iosX64(), iosArm64(), iosSimulatorArm64()).forEach { target ->
            
            ...

        val frameworkPath = baseDir.resolve(targetArchitecture)
    
        target.compilations.getByName("main") {

            cinterops {
                create("GoogleMobileAds") {
                    defFile(project.file("src/nativeInterop/cinterop/GoogleMobileAds.def"))
                    compilerOpts(
                        "-framework",
                        "GoogleMobileAds",
                        "-F$frameworkPath"
                    )

                }
            }
        }

        target.binaries.all {
            linkerOpts(
                "-framework",
                "GoogleMobileAds",
                "-F$frameworkPath"
            )
        }
    }

    sourceSets {


        androidMain.dependencies {
            implementation(compose.preview)
            implementation(libs.androidx.activity.compose)
            implementation(libs.google.ads)

        }
        commonMain.dependencies {
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material3)
            implementation(compose.ui)
            implementation(compose.components.resources)
            implementation(compose.components.uiToolingPreview)
            implementation(libs.koin.core)
            implementation(libs.koin.compose)
            implementation(libs.koin.compose.viewmodel)
            implementation(libs.navigation.compose)
            implementation(libs.datastore.core)
            implementation(libs.ktor.serialization.kotlinx.json)
            implementation(libs.androidx.room.runtime)
            implementation(libs.sqlite.bundled)
            implementation(libs.kotlinx.datetime)

        }

    }
}
```

* 可以看到<br>
  如果你想要在<br>
  共用邏輯導入`material3`<br>
  就直接在commomMain的block中導入即可<br>
  不過可能會有人好奇<br>
  為啥這邊是`compose`.material而不是libs.xxxxxx<br>
  這是因為<br>
  當你導入KMM插件後<br>
  他有內建一下compose專案常用的library<br>
  讓你可以直接用<br>
  而`不用`自己再去lib.version.toml中宣告<br>

```
commonMain.dependencies {
    implementation(compose.material3)
}
```

