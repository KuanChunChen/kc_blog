---
layout: post
title: "Compose Multiplatform in Action: Entry Points for Cross-Platform Android and iOS Code in CMP"
date: 2024-08-18 17:17:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-6
categories: ComposeMultiplatform
excerpt: "This series focuses on Compose Multiplatform in Action: Developing Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform Android and iOS app development, and discuss findings and insights in the final days."
---

<div class="c-border-main-title-2">Introduction</div>

`Compose Multiplatform (CMP)`<br>
Yesterday we gained a general understanding of the CMP project structure<br>

From yesterday's [Understanding CMP Project Structure and Build Configuration]({{site.baseurl}}/compose-multiplatform-day-5)<br>
we learned that in a CMP project we can write<br>

Common logic in `commonMain`<br>
Android platform logic in `androidMain`<br>
iOS platform logic in `iosMain`<br>
Desktop platform logic in `desktopMain`<br>

```
YourProjectName
├── composeApp
│   ├── ...
│   ├── src
│   │   ├── commonMain
│   │   ├── commonTest
│   │   ├── iosMain
│   │   └── desktopMain
│   └── ...
├── ...
├── ...
└── ...
```

Now let's start understanding<br>
the entry points of `CMP` code<br>
Since it involves cross-platform implementation<br>
I feel it's important to understand<br>
how the code works and how it enters each platform<br>
so `today I'll explain in detail the entry points for cross-platform code in CMP`<br>


<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">Understanding CMP Code Entry Points</div>
Let's first get a basic understanding of **Compose Multiplatform** and **Kotlin Multiplatform** <br>

* When CMP is created, these entry points are already established for you<br>
  You only need to `understand the concept` here<br>

* The entry point for shared code in CMP's commonMain<br>
  is `expected` to be called by cross-platform code<br>
  in androidMain, iOSMain, etc.<br>
  to achieve the goal of sharing code<br>

* Here we've created a shared App() function<br>
  which includes<br>
  1. A `custom common UI Theme`<br>
  2. Using Koin for viewmodel injection<br>
  3. A custom Compose UI entry point<br>
  (In later chapters, we'll explain how to customize UI Theme, use Koin, customize Compose UI, and other topics)<br>

```kotlin
// in ../commonMain/App.kt
@Composable
@Preview
fun App() {

    ElegantAccessComposeTheme {
        val viewModel = koinViewModel<MainViewModel>()
        ElegantAccessApp(viewModel)
    }

}
```

<div class="c-border-content-title-1">Android App Entry Point</div>

* `Android` actually calls the shared App() function from commonMain

```kotlin
// in ../androidMain/App.kt
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val androidModule = module {
            single<Activity> { this@MainActivity }
            single<Context> { this@MainActivity.applicationContext }
        }

        startKoin {
            modules(appModule() + androidModule)
        }

        setContent {
            // Call the shared App() function we implemented
            App()
        }
    }
}
```

- In Android's `Android Manifest.xml`, this `MainActivity` is declared with an `<activity>` tag<br>
  along with the initial page for launching the app via `<intent-filter>`<br>
  ```xml
  <?xml version="1.0" encoding="utf-8"?>
    <manifest xmlns:android="http://schemas.android.com/apk/res/android">
        <application
            ...>
            <activity
                ...
                android:name=".MainActivity">
                <intent-filter>
                    <action android:name="android.intent.action.MAIN" />
                    <category android:name="android.intent.category.LAUNCHER" />
                </intent-filter>
            </activity>
        </application>
    </manifest>
  ```

<div class="c-border-content-title-1">iOS App Entry Point</div>

* `iosMain` actually calls the shared App() function from commonMain

```
// in ../commonIos/MainViewController.kt

fun MainViewController() = ComposeUIViewController {

    val uiViewController = LocalUIViewController.current
    val iosModule = module {
        single<UIViewControllerWrapper> { UIViewControllerWrapperImpl(uiViewController) }
    }

    KoinApplication(application = {
        modules(appModule() + iosModule)
    }) {
        App()
    }
}
```

* In `iOS`, the function `MainViewController()` from the above `MainViewController.kt` is actually called
  <img src="/images/compose/045.png" alt="Cover" width="100%"/><br/>


<div class="c-border-content-title-1">Desktop Entry Point</div>

* In `desktopMain`, the shared App() function from commonMain is actually called<br>
  using the `application function` along with `Window` from compose to create a desktop application
```kotlin
// in ../desktopMain/main.kt
fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "App",
    ) {
        App()
    }
}
```

* The desktop component in CMP is also compiled through JVM<br>
  If you want to build it<br>
  use the following gradle command in your environment<br>
```groovy
./gradlew desktopRun -DmainClass=MainKt --quiet
```

* Alternatively, you can add this Gradle task directly to the Run Configuration in your IDE
<img src="/images/compose/046.png" alt="Cover" width="90%"/><br/>

<div class="c-border-main-title-2">Developing Shared Logic</div>

* After understanding the entry points above<br>
  we can start developing shared logic<br>
  to achieve creating applications for multiple platforms with `just one set of code`<br>

* As shown in the image below<br>
  we will spend most of our time in `./commonMain`<br>
  most of the logic development happens here<br>
  except for things that depend on specific platforms, such as file systems, file pickers, etc.<br>
  which will be implemented through `expect` and `actual`<br>
  (we'll also cover how to use expect and actual in later chapters)<br>

<img src="/images/compose/047.png" alt="Cover" width="80%"/><br/>

* However, up to this point<br>
  even though `desktop platforms` or `iOS platforms` have their own file systems<br>
  requiring custom implementations in the commonMain shared logic<br>
  in both `KMM` and `CMP`<br>
  there are already libraries that support writing these cross-platform components<br>
  using `kotlin` code<br>
  you just need to `configure them in Gradle`<br>

For example: implementing file-related operations for desktop through Kotlin:<br>

``` kotlin
// ../desktop/PlatformFile.desktop.kt
actual class PlatformFile actual constructor(private val path: String) {
    private val file = java.io.File(path)

    actual fun exists() = file.exists()
    actual fun createFile() = file.createNewFile()
    actual fun writeBytes(bytes: ByteArray) = file.writeBytes(bytes)
    actual fun delete() = file.delete()
    actual fun isDirectory(): Boolean = file.isDirectory
    actual fun copyTo(destination: PlatformFile, overwrite: Boolean) {
        file.copyTo(java.io.File(destination.path), overwrite)
    }
    actual fun mkdirs() {
        file.mkdirs()
    }
}

actual class PlatformZip actual constructor() {
    actual fun unzip(zipFilePath: String, destinationDir: String) {
        java.util.zip.ZipFile(zipFilePath).use { zip ->
            zip.entries().asSequence().forEach { entry ->
                val file = java.io.File(destinationDir, entry.name)
                if (entry.isDirectory) {
                    file.mkdirs()
                } else {
                    file.parentFile.mkdirs()
                    zip.getInputStream(entry).use { input ->
                        file.outputStream().use { output ->
                            input.copyTo(output)
                        }
                    }
                }
            }
        }
    }
}
```
