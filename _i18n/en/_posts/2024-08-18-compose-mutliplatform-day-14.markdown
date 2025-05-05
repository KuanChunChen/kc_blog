---
layout: post
title: "Compose Multiplatform in Action: Implementing SqlDelight for Cross-Platform Database in CMP"
date: 2024-08-18 17:28:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-14
categories: ComposeMultiplatform
excerpt: "This series focuses on Compose Multiplatform in action: developing cross-platform apps from scratch using Kotlin. This post will specifically focus on developing cross-platform apps for Android and iOS, and in the final days, I'll discuss my research findings and insights."
---

<div class="c-border-main-title-2">Introduction</div>

`Compose Multiplatform (CMP)`<br><br>

In a `CMP` project<br>
how can we implement cross-platform database operations?<br>
`SqlDelight` offers a powerful solution<br><br>

This article will introduce how to perform database operations<br>
using `SqlDelight` in a cross-platform `Android` & `iOS` environment<br>



<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">Implementing SqlDelight in CMP</div>

To introduce `SqlDelight` to your project<br>
add the following to your `libs.version.toml` file:<br>

```toml
[versions]
sqldelight = "2.0.1"

[libraries]
sqldelight-android = { module = "app.cash.sqldelight:android-driver", version.ref = "sqldelight" }
sqldelight-native = { module = "app.cash.sqldelight:native-driver", version.ref = "sqldelight" }
sqldelight-coroutines-extensions = { module = "app.cash.sqldelight:coroutines-extensions", version.ref = "sqldelight" }
/** Choose one between extensions and runtime */
/** The main difference is that extensions provides commonly used flow and emit operations, while runtime doesn't */
sqldelight-runtime = { module = "app.cash.sqldelight:runtime", version.ref = "sqldelight" }

[plugins]
sqlDelight = { id = "app.cash.sqldelight", version.ref = "sqldelight" }
```

And add the plugin and dependencies in `build.gradle.kts`<br>
This section requires implementations for both target platforms<br>
`CMP` again provides a `Kotlin`-based solution<br>
so you can directly add the corresponding dependencies<br>
to `androidMain`, `commonMain`, and `iosMain`<br><br>

```kotlin
androidMain.dependencies {

    implementation(libs.sqldelight.android)
}

commonMain.dependencies {

    implementation(libs.sqldelight.coroutines.extensions)
}

iosMain.dependencies {
    implementation(libs.sqldelight.native)
}
```

Also, in the same `build.gradle.kts` file<br>
add the `SqlDelight configuration` under the `kotlin` section<br><br>

This `gradle configuration`<br>
can be understood as creating an operable AppDatabase class<br>
in the test.your.package.db package<br>
after `compilation`<br>

```kotlin
kotlin {
      sqldelight {
        databases {
            create("AppDatabase") {
                packageName.set("test.your.package.db")
            }
        }
    }
}
```


<div class="c-border-content-title-1">Implementing Database Tables</div>

Create `.sq` files in the `commonMain/sqldelight/database` directory:<br>
![https://ithelp.ithome.com.tw/upload/images/20240814/201683356KGhBaS0kq.png](https://ithelp.ithome.com.tw/upload/images/20240814/201683356KGhBaS0kq.png)
You need to add a `sqldelight folder` in the above path<br>
for the build process to successfully generate operable classes<br><br>

The `.sq` files in `SqlDelight`<br>
allow you to define tables using SQL commands<br>
to create CRUD (Create, Read, Update, Delete) operations<br><br>

Here's an example `.sq` file:<br>

```sql
CREATE TABLE VocabularyEntity (
 id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL
 );

 insert:
 INSERT OR REPLACE INTO VocabularyEntity(id, name)
 VALUES(?,?);

 getAll:
 SELECT * FROM VocabularyEntity;

 updateName:
 UPDATE VocabularyEntity
 SET name = :name
 WHERE id IS :id;

 delete:
 DELETE FROM VocabularyEntity
 WHERE id IS :id;
```

<div class="c-border-content-title-1">Implementing Cross-Platform SqlDelight Content</div>

As mentioned earlier<br>
due to compatibility differences between Android and iOS platforms<br>
table-related operation logic can be shared<br>
but the DatabaseDriver for different targets may need separate implementations<br><br>

Therefore<br>
to create `DatabaseDriver` for different platforms<br>
you can write it like this:<br>

```kotlin

// in ../commonMain
expect class DatabaseDriverFactory {
    fun create(): SqlDriver
}

// in ../androidMain
actual class DatabaseDriverFactory(private val context: Context) : KoinComponent {

    actual fun create(): SqlDriver {
        return AndroidSqliteDriver(AppDatabase.Schema, context, "AppDataBase")
    }
}

// in ../iosMain
actual class DatabaseDriverFactory {
    actual fun create(): SqlDriver {
        return NativeSqliteDriver(AppDatabase.Schema, "AppDataBase")
    }
}
```

`Key code explanation`:
1. `AppDatabase.Schema`: This Schema is generated after configuring the above `Build.gradle.kts`<br>
   and syncing.<br><br>
2. `AndroidSqliteDriver`: The Android platform requires a `context`, so we include it in the actual class `DatabaseDriverFactory` constructor<br><br>
3. `NativeSqliteDriver`: The SqliteDriver for iOS<br>

<div class="c-border-content-title-1">Injecting Cross-Platform DB Drivers with Koin</div>

As mentioned in previous days<br>
when dealing with `cross-platform` content<br>
you can create a `platformModule` to implement cross-platform injection needs<br>
(If you've forgotten, go back to [Using Koin for Dependency Injection in CMP](https://ithelp.ithome.com.tw/articles/10344526))<br><br>

Here's an example:<br>

```kotlin
// in ../commonMain
expect val platformModule: Module

// in ../androidMain
actual val platformModule: Module = module {

    single { DatabaseDriverFactory(get<Context>()) }
    single { AppDatabase(get<DatabaseDriverFactory>().create()) }
}

// in ../iosMain
actual val platformModule: Module = module {

    single { DatabaseDriverFactory() }
    single { AppDatabase(get<DatabaseDriverFactory>().create()) }
}
```

`Key code explanation`:
1. `platformModule`: In commonMain, we use expect to inform target platforms they need to implement the corresponding variable<br>
   and in `androidMain` and `iosMain`, we need to implement the actual variable respectively<br><br>

2. Therefore, in the target platforms `android` and `iOS`, we can use<br>
   the previously completed `AppDatabase` and `DatabaseDriverFactory`<br>
   along with `koin` for dependency injection<br>


<div class="c-border-content-title-1">Practical Usage</div>

Here's an example of obtaining `AppDatabase` and performing operations<br>
SqlDelight will convert it into object-oriented methods for you to use<br>

```kotlin
class LearningDataStore (private val db: AppDatabase) {
    private val queries = db.vocabularyEntityQueries

    fun insert(id: Long?, name: String) {
        queries.insert(id = id, name = name)
    }

    fun getAll() = queries.getAll().asFlow().mapToList(Dispatchers.IO)

    fun update(id: Long, name: String) {
        queries.updateName(id = id, name = name)
    }

    fun delete(id: Long) {
        queries.delete(id = id)
    }
}
```

<div class="c-border-main-title-2">Conclusion</div>

This is an early solution provided by `CMP` for a local database<br>
to share cross-platform db logic<br>
However, it's not very intuitive to use currently<br>
as you need to write entire SQL commands yourself<br>
But if it allows writing logic for both platforms at once<br>
it's still a good approach<br><br>

Don't worry, though<br>
We'll introduce a new approach using `Room` for cross-platform local databases later<br>
which started being supported around `May 2024`<br>
so you can check that out as well<br><br>

In the next article<br>
I'll introduce another local database option, `Room`<br>
After comparing both<br>
you can decide which one to use<br><br>
<a href="{{site.baseurl}}/compose-multiplatform-day-15">Compose Multiplatform in Action: Using ROOM for Cross-Platform Database Development & Troubleshooting</a> 