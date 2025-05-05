---
layout: post
title: "Compose Multiplatform in Action: Using Koin for Dependency Injection in CMP"
date: 2024-08-18 17:27:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-13
categories: ComposeMultiplatform
excerpt: "This series focuses on Compose Multiplatform in action: developing cross-platform apps from scratch using Kotlin. This post will specifically focus on developing cross-platform apps for Android and iOS, and in the final days, I'll discuss my research findings and insights."
---

<div class="c-border-main-title-2">Introduction</div>


`Compose Multiplatform (CMP)`<br><br>

Hi everyone,<br>
Today we'll continue exploring CMP applications<br>
by using `Koin` for dependency injection<br>
to reduce coupling between code components<br>
making them easier to maintain<br><br>

Android developers might be familiar with `Dagger2` or `Hilt`<br>
but currently, CMP officially supports mainly `Koin`<br>
Using `other DI solutions` might require your own workarounds<br>
so today we'll focus on integrating `Koin` into CMP<br>


<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">What is Dependency Injection?</div>
In software development,<br>
`high coupling` refers to excessive dependencies between modules or components in code<br>
making code difficult to maintain and test<br>

To solve high coupling issues,<br>
we can use `Dependency Injection (DI)` to reduce coupling between code components<br>

Dependency Injection is a design pattern<br>
that allows us to inject dependencies into objects during their lifecycle<br>
rather than creating instances inside the objects<br>
making code more flexible and testable<br>

<div class="c-border-content-title-1">What it looks like without Dependency Injection</div>

Let's look at an example from our StateFlow ViewModel from a few days ago<br>
Here we need to manually create the `SettingViewModel instance` and `initialize multiple classes inside`<br>

```kotlin
fun NavGraphBuilder.routeSettingScreen(
    navController: NavHostController,
) {

    composable(ElegantJapaneseScreen.Setting.name) {
        val viewModel = SettingViewModel()
        SettingScreen(navController, viewModel)
    }
}

class SettingViewModel() {
   lateinit var a :A
   lateinit var b :B
   lateinit var c :C
   lateinit var e :E
   lateinit var f :F
   
   init{
     a = A()
     b = B()
     ...
     ...
     ...
   }
}

```

<div class="c-border-content-title-1">What it looks like with Koin</div>

With DI, you don't need to create instances yourself<br>

```kotlin
fun NavGraphBuilder.routeSettingScreen(
    navController: NavHostController,
) {

    composable(ElegantJapaneseScreen.Setting.name) {
        val viewModel = koinViewModel<SettingViewModel>()
        SettingScreen(navController, viewModel)
    }
}

```

<div class="c-border-content-title-1">Does this really make a difference?</div>

At first glance, it seems like we're just replacing instance creation with koinViewModel injection<br>

But looking closer,<br>
if your `SettingViewModel` constructor becomes complex,<br>
you'd need to create each required instance one by one<br>

For example:<br>

```kotlin
val a = A()
val b = B()
val c = C()
val d = D()
val e = E()
val f = F()
...

SettingViewModel(a,b,c,d,e,f,...)
```


This is where DI's advantages become clear<br>
It eliminates the need to create instances manually<br>
making your code shorter and cleaner<br>

Another advantage is<br>
when you need to modify your code,<br>
it becomes more flexible<br>
You just need to change the injected module code<br>
The original `ViewModel` code can remain unchanged<br>
only modifying the logic in the module implementation<br>

Additionally,<br>
if you need to use a class in multiple places,<br>
dependency injection reduces the steps to create instances.<br>

```kotlin
class SettingViewModel(private val a: A, private val b: B,...) {
 ...
}
```

When using it, it's still simply:<br>

```kotlin
val viewModel = koinViewModel<SettingViewModel>()
```

<div class="c-border-main-title-2">Implementing Koin in CMP</div>

<div class="c-border-content-title-1">Add the corresponding libraries and versions to lib.versions.toml</div>

First,<br>
we need to add `Koin` dependencies and version numbers to the `lib.versions.toml` file<br>
After completion,<br>
remember to sync `gradle`<br>

```toml
[versions]
koin = "3.5.0"
koinCompose = "1.2.0-Beta4"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-compose-viewmodel= { module = "io.insert-koin:koin-compose-viewmodel", version.ref = "koinCompose" }
koin-compose = { module = "io.insert-koin:koin-compose", version.ref = "koinCompose" }
```

<div class="c-border-content-title-1">Import the libraries into build.gradle.kts</div>

* As usual, these are shared, so add the following to `commonMain`:

```kotlin
    sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            implementation(libs.koin.compose.viewmodel)
            implementation(libs.koin.compose)
        }
    }
```

<div class="c-border-content-title-1">Configuring Koin for multiple platforms in CMP</div>

(Remember our discussion on [entry points for different platforms](https://ithelp.ithome.com.tw/articles/10343651)?<br>
If you've forgotten, go back and review it)<br>

* First, let's add an expect `platformModule` in `commonMain`<br>
  Since target platforms might have different implementations<br>
  If CMP doesn't support something yet<br>
  We can use `platformModule` to implement and inject separately<br>
  allowing different target platform content to be injected into `commonMain`<br>
  For example: persistent storage dataStore, localized storage RoomDatabase Builder, etc.<br>

First, in `commonMain`, declare an `expect` for `platformModule`
&
`appModule()` which helps us `place or extend more modules`

```kotlin
// in ../commonMain
expect val platformModule: Module

fun appModule() =
    listOf(platformModule,...)
```

Then implement `platformModule` for `androidMain` & `iosMain`

`androidMain`:
```
// in ../androidMain

actual val platformModule: Module = module {
    /** Add some target class that you would like to get it instance*/
    // for example : single { dataStore(get<Context>()) }

}
```

`iosMain`:
```kotlin
// in ../iosMain

actual val platformModule: Module = module {
    /** Add some target class that you would like to get it instance*/
    // for example : single { dataStore() }

}
```

* Now we need to configure Koin in `CMP target platforms`<br>
  First, let's add Koin to `androidMain`<br>

```kotlin
// in ../androidMain/../MainActivity.kt

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val androidModule = module {
            single<Context> { this@MainActivity.applicationContext }
        }

        startKoin {
            modules(appModule() + androidModule)
        }

        setContent {
            App()
        }
    }
}
```

`Key code explanation`:

1. `androidModule`: Because both `Android` and `iOS platforms` might have their own rules<br>
   For example: `Android has Context` but iOS doesn't<br>
   We can create an `androidModule` to configure a `Context` instance in Koin<br><br>
2. `startKoin`: Then we can bring in the androidModule and the previously created `appModule()`<br>
   Based on `the previous code`<br>
   Our previously declared `platformModule` will also be included<br>


* Now let's configure Koin for `iosMain`

```kotlin
// in ../iosMain/../MainViewController.kt

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

interface UIViewControllerWrapper {
    fun getViewController(): UIViewController
}

class UIViewControllerWrapperImpl(private val viewController: UIViewController) : UIViewControllerWrapper {
    override fun getViewController() = viewController
}
```

`Key code explanation`:<br>

1. `iosModule`: Similar to `android`, iOS also has unique elements like `UIViewController`<br>
   If needed, we can create an `iosModule` for it<br><br>

2. `KoinApplication`: Then we can bring in the `iosModule` and our previously created `appModule()`<br>
   Based on `the previous code`<br>
   Our previously declared `platformModule` will also be included<br><br>

<div class="c-border-content-title-1">Implementing shared modules with Koin in CMP</div>

The previous section mainly covered development methods across multiple target platforms<br>
Now, we can finally start developing shared modules<br>
Creating modules in `Koin` is also relatively intuitive<br><br>

First, let's see how to define `Koin` modules in `commonMain`<br>

```kotlin
// in ../commonMain

expect val platformModule: Module

fun appModule() =
    listOf(platformModule, utilModule, viewModelModule ...)

val utilModule = module {
    single { A() }
    single { B() }
    single { C() }
}

val viewModelModule = module {
    single { SettingViewModel(get(), get(), get()) }
}
```

`Key code explanation`:<br>
1. `single { A() }`: Defines a singleton instance of A<br>
   Whenever A is injected, Koin will return the same instance<br>
   `single { B() }` and `single { C() }`: Similarly defines singleton instances of B and C<br><br>
2. `single { SettingViewModel(get(), get(), get()) }`: Defines a singleton instance of `SettingViewModel`, and injects instances of A, B, C from the `Koin` container using the `get()` method.<br><br>
3. `appModule()`: We defined this earlier, now we just add the new modules.<br><br>
4. This module primarily uses the `module{}` provided in the Koin library<br>
   The `core concept` is to create the instances you want<br>
   Once `startKoin` is configured<br>
   You can have them `injected` for you `through Koin`<br>


<div class="c-border-content-title-1">Actually using Koin injection in CMP</div>

Now we can happily `free ourselves` from complex manual instance creation

```kotlin
fun NavGraphBuilder.routeSettingScreen(
    navController: NavHostController,
) {

    composable(ElegantJapaneseScreen.Setting.name) {
        val viewModel = koinViewModel<SettingViewModel>()
        SettingScreen(navController, viewModel)
    }
}
```

<div class="c-border-main-title-2">Summary</div>

- Koin can be used in Compose Multiplatform
- With proper configuration, Koin can be used flexibly on different platforms
- Using Koin can greatly simplify dependency management in cross-platform projects
- Choose the appropriate initialization method based on project size and complexity 