---
layout: post
title: "Compose Multiplatform in Action: Using expect and actual to Implement Cross-Platform Code"
date: 2024-08-18 17:23:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-9
categories: ComposeMultiplatform
excerpt: "This series focuses on Compose Multiplatform in Action: Developing Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform Android and iOS app development, and discuss findings and insights in the final days."
---

<div class="c-border-main-title-2">Introduction</div>

`Compose Multiplatform (CMP)`

By sharing code<br>
we not only reduce duplicate work<br>
but also improve development efficiency and code consistency<br>
`CMP` provides developers with a cross-platform solution<br>
allowing the same business logic to run on different platforms<br>

In this article<br>
we'll explore how `CMP` uses the `expect` and `actual` keywords to implement `cross-platform` code<br>
and share some practical experiences<br>

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">What are expect and actual?</div>
Let's first get a basic understanding of **Compose Multiplatform** and **Kotlin Multiplatform** 

* The `expect` keyword is used to declare a platform-dependent interface or class in shared code<br>
  while the `actual` keyword is used to implement this interface or class on specific platforms<br>

Let's look at a simple example<br>
The code below shows how to return the name of the platform on each platform<br>
In `commonMain`, we use the `expect` keyword to declare a function<br>
and expect other platforms in the CMP project to implement this function<br>

```kotlin
// in ~/commonMain/.../xxx.kt
expect fun getPlatformName(): String

// in ~/androidMain/.../xxx.kt
actual fun getPlatformName(): String {
    return "Android"
}

// in ~/iosMain/.../xxx.kt
actual fun getPlatformName(): String {
    return "iOS"
}
```

Additionally<br>
`expect` and `actual` can be used not only for functions<br>
but also for classes<br>
This allows us to flexibly define platform-specific logic<br>
in shared code<br>
and provide implementations on specific platforms<br>

```kotlin 
// in ~/commonMain/.../FileSystem.kt
expect class FileSystem {
    fun readFile(path: String): String
}

// in ~/androidMain/.../FileSystem.kt
actual class FileSystem {
    actual fun readFile(path: String): String {
        // Android-specific file reading logic
    }
}

// in ~/iosMain/.../FileSystem.kt
actual class FileSystem {
    actual fun readFile(path: String): String {
        // iOS-specific file reading logic
    }
}
```

<div class="c-border-main-title-2"">Practical Examples</div>

* For instance, when setting up the [material 3]({{site.baseurl}}/compose-multiplatform-day-7) theme a couple of days ago<br>
  we set up an `expect` function called setStatusBarStyle<br>
  mainly `expecting a cross-platform function`<br>
  that can set the status bar on specific platforms<br>

```kotlin
// in ~/commonMain/.../xxxx.kt
@Composable
expect fun setStatusBarStyle(
    backgroundColor: Color,
    isDarkTheme: Boolean
)

// in ~/androidMain/.../xxx.kt
@Composable
actual fun setStatusBarStyle(backgroundColor: Color, isDarkTheme: Boolean) {

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = backgroundColor.toArgb()
            window.navigationBarColor = Color.Transparent.toArgb()
        }
    }
}

// in ~/iosMain/.../xxx.kt
@Composable
actual fun setStatusBarStyle(backgroundColor: Color, isDarkTheme: Boolean) {
    DisposableEffect(isDarkTheme) {
        val statusBarStyle = if (isDarkTheme) {
            UIStatusBarStyleLightContent
        } else {
            UIStatusBarStyleDarkContent
        }
        UIApplication.sharedApplication.setStatusBarStyle(statusBarStyle, animated = true)
        onDispose { }
    }
}
```

* A second example is when using Koin for dependency injection on specific platforms<br>
  When a platform needs some specific `instances`<br>
  you might need to implement them on that platform<br>
  In this case, you can create an `expect` Koin module in commonMain<br><br>

Here's an example (we'll cover how to use Koin in more detail later)<br>

```kotlin
// in ~/commonMain/.../xxxx.kt
expect val platformModule: Module

fun appModule() =
    listOf(platformModule)

// in ~/androidMain/.../xxx.kt
actual val platformModule: Module = module {
    /** Datastore*/
    single { dataStore(get<Context>()) }

    /** Database*/
    single<RoomDatabase.Builder<AppDatabase>> {
        getAppDatabase(get())
    }
}

// in ~/iosMain/.../xxx.kt
actual val platformModule: Module = module {
    /** DataStore*/
    single { dataStore() }

    /** Database*/
    single { getAppDatabase() }
}
```

<div class="c-border-main-title-2">Tips</div>

The IDE provides a way<br>
to help you more easily identify which platform a `class` is implemented for<br>
When you write the `expect` keyword in shared code<br>
if other platforms haven't implemented the corresponding `actual`<br>

The IDE will notify you that implementation is missing<br>
At this point, you can simply hit the auto-generate button<br>
and the IDE will create the missing implementation files<br>
adding `corresponding strings` to the file names for specific platforms<br>
such as xxx.android.kt or xxx.ios.kt.<br>

This way<br>
you can more intuitively understand which platform each class belongs to<br>
For example:<br>
When you use `command+f` to search for a function you just implemented<br>
you can clearly know which platform's class you're currently looking at.<br>
![https://ithelp.ithome.com.tw/upload/images/20240809/20168335MtnaW60N59.png](https://ithelp.ithome.com.tw/upload/images/20240809/20168335MtnaW60N59.png) 