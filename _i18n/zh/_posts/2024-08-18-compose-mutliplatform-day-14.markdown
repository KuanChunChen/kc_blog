---
layout: post
title: "Compose Multiplatform 實戰：CMP實作跨平台資料庫SqlDelight"
date: 2024-08-18 17:28:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-14
categories: ComposeMultiplatform
excerpt: "這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App
這次我會聚焦在 開發 跨平台Android 跟 IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得"
---

<div class="c-border-main-title-2">前言</div>

`Compose Multiplatform (簡稱CMP)`<br><br>

在 `CMP` 專案中<br>
如何實現跨平台的資料庫操作呢？<br>
`SqlDelight` 提供了一個強大的解決方案<br><br>

本文將介紹如何在跨平台`Android` & `iOS`環境中<br>
使用 `SqlDelight` 進行資料庫操作<br>



<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">在CMP中實作SqlDelight</div>

在專案中導入 `SqlDelight`<br>
需在`libs.version.toml` 文件中添加：<br>

```toml
[versions]
sqldelight = "2.0.1"

[libraries]
sqldelight-android = { module = "app.cash.sqldelight:android-driver", version.ref = "sqldelight" }
sqldelight-native = { module = "app.cash.sqldelight:native-driver", version.ref = "sqldelight" }
sqldelight-coroutines-extensions = { module = "app.cash.sqldelight:coroutines-extensions", version.ref = "sqldelight" }
/** extensions 跟 runtime 可兩選一 * /
/** 主要差異是在extensions有提供常用的flow、emit相關操作使用，runtime則無 * /
sqldelight-runtime = { module = "app.cash.sqldelight:runtime", version.ref = "sqldelight" }

[plugins]
sqlDelight = { id = "app.cash.sqldelight", version.ref = "sqldelight" }
```

並在 `build.gradle.kts` 中添加插件和依賴<br>
這次部分需要兩大目標平台的實作<br>
`CMP`一樣有提供`Kotlin`為底的解決方案<br>
所以可以直接在 `androidMain`、`commonMain`、`iosMain`<br>
加入對應的依賴項<br><br>

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

同時，一樣是`build.gradle.kts`中<br>
`kotlin`下面加入`sqlDelight的配置`<br><br>

這段`gradle配置`<br>
可以理解為在test.your.package.db package下<br>
當`編譯過後`會幫你建立一個AppDatabase的可操作class<br>

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


## 實作資料表

在 `commonMain/sqldelight/database` 目錄下創建 `.sq` 文件：<br>
![https://ithelp.ithome.com.tw/upload/images/20240814/201683356KGhBaS0kq.png](https://ithelp.ithome.com.tw/upload/images/20240814/201683356KGhBaS0kq.png)
需要在上述路徑加入`sqldelight folder`<br>
然後Build專案時才會成功產生可操作的class<br><br>

而`sqlDelight`的`.sq`<br>
提供的方案是讓你透過sql指令<br>
去定義增刪改查 來產出table<br><br>

`.sq`範例如下：<br>

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

## 實作跨平台的sqlDelight內容
前面說過<br>
可能因為Android、iOS平台的相容性不同<br>
所以table相關操作邏輯可以共通<br>
但是不同目標的DatabaseDriver可能需要各別實作<br><br>

因此<br>
為不同平台創建 `DatabaseDriver`<br>
可以這樣寫：<br>

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

`關鍵程式碼解說`：
1. `AppDatabase.Schema`：這個Schema是配置完上面的`Build.gradle.kts`<br>
   sync後會幫你產生的。<br><br>
2. `AndroidSqliteDriver` ： 在 Android平台的需要輸入`context`，所以在autual class `DatabaseDriverFactory`建構子放入<br><br>
3. `NativeSqliteDriver`：iOS的SqliteDriver<br>

## koin注入跨平台DB驅動

前面天數有提到<br>
當有`跨平台`的內容時<br>
可以做一個`platformModule`去實作跨平台需要注入的內容<br>
(忘記的可以回[CMP中使用koin來依賴注入](https://ithelp.ithome.com.tw/articles/10344526)看~~)<br><br>

這邊我們直接上範例：<br>

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

`關鍵程式碼解說`:
1. `platformModule`：commonMain中用expect告知目標平台需要實作對應variable<br>
   而在`androidMain`、`iosMain`中就需要分別去實作autual的variable<br><br>

2. 因此我們在目標平台`android` 跟 `iOS` 中 就可以用<br>
   前面完成的`AppDatabase`與`DatabaseDriverFactory`<br>
   並搭配`koin`去依賴注入<br>


## 實際使用

以下是獲得 `AppDatabase` 並進行操作的示例<br>
SqlDelight會幫你轉成物件導向可以操作的方法讓你使用<br>

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

## 結語

這是前期`CMP` 提供的一個local db的一個解決方案<br>
用來共用跨平台的db邏輯<br>
不過目前用起來比較沒那麼直觀<br>
因為需自己寫整篇sql指令<br>
但能一次撰寫雙平台邏輯的話<br>
也不失為一種好方法<br><br>

不過大家不用擔心<br>
後面會再介紹用`Room`來實作跨平台local db的一個新方案<br>
是近期`2024/05`左右才開始支援的<br>
所以大家到時候也可以來參考看看<br><br>

下一篇文章<br>
我將會介紹另一種本地資料庫 `Room`<br>
大家可以參考之後<br>
再決定要用哪一種<br><br>
[Compose Multiplatform 實戰：CMP中使用ROOM開發跨平台資料庫 & 疑難雜症
](https://ithelp.ithome.com.tw/articles/10344763)