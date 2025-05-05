---
layout: post
title: "Compose Multiplatform 実践：expect と actual を使用したクロスプラットフォームコードの実装"
date: 2024-08-18 17:23:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-9
categories: ComposeMultiplatform
excerpt: "このシリーズのテーマはCompose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。"
---

<div class="c-border-main-title-2">はじめに</div>

`Compose Multiplatform (略称CMP)`

コードを共有することで<br>
重複作業を減らすだけでなく<br>
開発効率とコードの一貫性を向上させることができます<br>
`CMP`は開発者にクロスプラットフォームソリューションを提供し<br>
同じビジネスロジックを異なるプラットフォーム上で実行できるようにします<br>

この記事では<br>
`CMP`が`expect`と`actual`キーワードを使用して`クロスプラットフォーム`コードを実装する方法を探り<br>
実践的な経験を共有します<br>

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">expect と actual とは？</div>
まずは **Compose Multiplatform** と **Kotlin Multiplatform** について簡単に理解しましょう

* `expect`キーワードは共有コードでプラットフォーム固有のインターフェースやクラスを宣言するために使用され<br>
  `actual`キーワードは特定のプラットフォームでそのインターフェースやクラスを実装するために使用されます<br>

簡単な例を見てみましょう<br>
以下のコードは各プラットフォームの名前を返す方法を示しています<br>
`commonMain`で`expect`キーワードを使用して関数を宣言し<br>
CMPプロジェクトの他のプラットフォームでその関数を実装することを期待しています<br>

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

また<br>
`expect`と`actual`は関数だけでなく<br>
クラスにも使用できます<br>
これにより、共有コード内で<br>
プラットフォーム固有のロジックを柔軟に定義し<br>
特定のプラットフォームで実装を提供できます<br>

```kotlin 
// in ~/commonMain/.../FileSystem.kt
expect class FileSystem {
    fun readFile(path: String): String
}

// in ~/androidMain/.../FileSystem.kt
actual class FileSystem {
    actual fun readFile(path: String): String {
        // Androidプラットフォーム固有のファイル読み込みロジック
    }
}

// in ~/iosMain/.../FileSystem.kt
actual class FileSystem {
    actual fun readFile(path: String): String {
        // iOSプラットフォーム固有のファイル読み込みロジック
    }
}
```

<div class="c-border-main-title-2"">実際の例</div>

* 一昨日の[material 3](https://ithelp.ithome.com.tw/articles/10343654)テーマの設定時に<br>
  `expect` function として setStatusBarStyle を設定しました<br>
  これは主に`クロスプラットフォーム関数を期待`し<br>
  特定のプラットフォームでステータスバーを設定できるようにするためです<br>

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

* 2つ目の例は、特定のプラットフォームにkoinを注入する場合です<br>
  そのプラットフォームが特定の`instance`を必要とする場合<br>
  そのプラットフォームで実装する必要があるかもしれません<br>
  この場合、commonMainに`expect`のkoin moduleを作成できます<br><br>

以下は例です（後ほどkoinの使用方法についてさらに詳しく説明します）<br>

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

<div class="c-border-main-title-2">小技巧</div>

IDEには<br>
実装している`class`がどのプラットフォームにあるかを区別しやすくする方法があります<br>
共有コードで`expect`キーワードを記述する際<br>
他のプラットフォームでまだ対応する`actual`が実装されていない場合<br>

IDEは未実装であることを通知します<br>
この時、自動生成をクリックするだけで<br>
IDEは未実装のファイルを作成し<br>
特定のプラットフォームのファイル名に`対応する文字列`を追加します<br>
例えば、xxx.android.ktやxxx.ios.ktなどです。<br>

これにより<br>
各classが属するプラットフォームをより直感的に理解できます<br>
例えば:<br>
`command+f`で実装した関数を検索するとき<br>
現在検索されているのがどのプラットフォームのclassなのかが明確にわかります。<br>
![https://ithelp.ithome.com.tw/upload/images/20240809/20168335MtnaW60N59.png](https://ithelp.ithome.com.tw/upload/images/20240809/20168335MtnaW60N59.png) 