---
layout: post
title: "Compose Multiplatform 実践：CMPでSqlDelightを使用したクロスプラットフォームデータベースの実装"
date: 2024-08-18 17:28:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-14
categories: ComposeMultiplatform
excerpt: "このシリーズのテーマはCompose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。"
---

<div class="c-border-main-title-2">はじめに</div>

`Compose Multiplatform (略称CMP)`<br><br>

`CMP`プロジェクトでは<br>
クロスプラットフォームのデータベース操作をどのように実現するのでしょうか？<br>
`SqlDelight`はそのための強力なソリューションを提供しています<br><br>

本記事ではクロスプラットフォーム`Android`および`iOS`環境で<br>
`SqlDelight`を使用してデータベース操作を行う方法を紹介します<br>



<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">CMPにSqlDelightを実装する</div>

プロジェクトに`SqlDelight`を導入するには<br>
`libs.version.toml`ファイルに以下を追加します：<br>

```toml
[versions]
sqldelight = "2.0.1"

[libraries]
sqldelight-android = { module = "app.cash.sqldelight:android-driver", version.ref = "sqldelight" }
sqldelight-native = { module = "app.cash.sqldelight:native-driver", version.ref = "sqldelight" }
sqldelight-coroutines-extensions = { module = "app.cash.sqldelight:coroutines-extensions", version.ref = "sqldelight" }
/** extensions と runtime はどちらか一方を選択可能 * /
/** 主な違いは、extensionsがよく使われるflow、emit関連の操作を提供するのに対し、runtimeは提供しない点 * /
sqldelight-runtime = { module = "app.cash.sqldelight:runtime", version.ref = "sqldelight" }

[plugins]
sqlDelight = { id = "app.cash.sqldelight", version.ref = "sqldelight" }
```

そして`build.gradle.kts`にプラグインと依存関係を追加します<br>
今回は2つの主要ターゲットプラットフォームの実装が必要です<br>
`CMP`は`Kotlin`ベースのソリューションを提供しているので<br>
`androidMain`、`commonMain`、`iosMain`に<br>
それぞれ対応する依存関係を追加できます<br><br>

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

同様に、`build.gradle.kts`の<br>
`kotlin`セクションの下に`sqlDelightの設定`を追加します<br><br>

この`gradle設定`は<br>
test.your.package.dbパッケージ内で<br>
`コンパイル後`にAppDatabaseという操作可能なクラスが生成されると理解できます<br>

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


<div class="c-border-content-title-1">テーブルの実装</div>

`commonMain/sqldelight/database`ディレクトリに`.sq`ファイルを作成します：<br>
![https://ithelp.ithome.com.tw/upload/images/20240814/201683356KGhBaS0kq.png](https://ithelp.ithome.com.tw/upload/images/20240814/201683356KGhBaS0kq.png)
上記のパスに`sqldelightフォルダ`を追加する必要があります<br>
そうすることでプロジェクトをビルドする際に操作可能なクラスが正常に生成されます<br><br>

`sqlDelight`の`.sq`ファイルは<br>
SQLコマンドを通じて<br>
追加・削除・更新・検索を定義してテーブルを生成するソリューションを提供します<br><br>

`.sq`の例は以下の通りです：<br>

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

<div class="c-border-content-title-1">クロスプラットフォームのsqlDelight実装</div>

前述したように<br>
AndroidとiOSプラットフォームの互換性の違いにより<br>
テーブル関連の操作ロジックは共通化できますが<br>
異なるターゲットのDatabaseDriverは個別に実装する必要があるかもしれません<br><br>

したがって<br>
異なるプラットフォーム用の`DatabaseDriver`を作成するには<br>
次のように実装できます：<br>

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

`重要なコードの説明`：
1. `AppDatabase.Schema`：このSchemaは上記の`Build.gradle.kts`を設定した後<br>
   同期すると自動生成されます。<br><br>
2. `AndroidSqliteDriver`：Androidプラットフォームでは`context`の入力が必要なので、actual class `DatabaseDriverFactory`のコンストラクタに含めます<br><br>
3. `NativeSqliteDriver`：iOSのSqliteDriver<br>

<div class="c-border-content-title-1">Koinを使用したクロスプラットフォームDBドライバの注入</div>

以前の記事で触れたように<br>
`クロスプラットフォーム`のコンテンツがある場合<br>
`platformModule`を作成して、クロスプラットフォームで注入する必要があるコンテンツを実装できます<br>
(忘れた場合は[CMPでKoinを使用した依存性注入](https://ithelp.ithome.com.tw/articles/10344526)を参照してください)<br><br>

ここでは例を直接示します：<br>

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

`重要なコードの説明`:
1. `platformModule`：commonMainでexpectを使用して、ターゲットプラットフォームが対応する変数を実装する必要があることを知らせます<br>
   そして`androidMain`、`iosMain`ではそれぞれactualの変数を実装する必要があります<br><br>

2. したがって、ターゲットプラットフォーム`android`と`iOS`では<br>
   前に完成した`AppDatabase`と`DatabaseDriverFactory`を使用して<br>
   `koin`で依存性注入を行うことができます<br>


<div class="c-border-content-title-1">実際の使用例</div>

以下は`AppDatabase`を取得して操作を行う例です<br>
SqlDelightはオブジェクト指向の操作可能なメソッドに変換して使用できるようにします<br>

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

<div class="c-border-main-title-2">まとめ</div>

これは初期の`CMP`が提供するローカルデータベースのソリューションの一つです<br>
クロスプラットフォームのDB論理を共有するために使用されます<br>
しかし現在の使用感ではあまり直感的ではありません<br>
SQLコマンド全体を自分で書く必要があるためです<br>
しかし一度に両プラットフォームのロジックを書くことができれば<br>
これも良い方法と言えるでしょう<br><br>

しかし心配する必要はありません<br>
後で`Room`を使ったクロスプラットフォームローカルDBの新しいソリューションを紹介します<br>
これは最近の`2024/05`頃にようやくサポートされ始めたものです<br>
ですので、その時にもぜひ参考にしてみてください<br><br>

次の記事では<br>
別のローカルデータベース`Room`について紹介します<br>
参考にした後<br>
どちらを使用するかを決めることができます<br><br>
<a href="{{site.baseurl}}/compose-multiplatform-day-15">Compose Multiplatform 実践：CMPでROOMを使用したクロスプラットフォームデータベースの開発と問題解決</a> 