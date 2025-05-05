---
layout: post
title: "Compose Multiplatform 実践：CMPのプロジェクト構造理解とコンパイル設定"
date: 2024-08-18 17:16:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-5
categories: ComposeMultiplatform
excerpt: "このシリーズのテーマはCompose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。"
---

<div class="c-border-main-title-2">はじめに</div>

`Compose Multiplatform (略称CMP)`<br>
昨日、CMPのシミュレータ設定を完了したばかりです<br>

前から言い忘れていましたが<br>
実は私はこのシリーズの記事で<br>
`初心者`や`モバイルアプリ開発`をしていない人でも<br>
入門できるようにしたいと思っています<br>
そのため、冗長に感じる部分や詳しく説明している箇所があります<br>
ご了承くださいXDDD<br><br>

今日はCMPプロジェクトの構造と<br>
`Gradle設定`の調整<br>
そしてCMPプロジェクトにおける`lib.version.toml`の用途について紹介します<br>

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">CMPプロジェクト構造</div>
これはCMPプロジェクトを作成したときの<br>
デフォルトの`プロジェクト構造`です<br>

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

ここで各フォルダやファイルの用途を整理しました<br>
初心者の方がより早く理解できるよう願っています<br><br>

* `YourProjectName`: プロジェクト名であり、プロジェクト全体のrootフォルダです
* `build`: コンパイル過程での出力ファイル、これはコンパイルによって生成されるため`.gitignore`に追加できます
* `composeApp`: Compose Multiplatformアプリケーションのソースコードとその設定を含みます
  - `build`: `CMP`のコンパイル出力、これはコンパイルによって生成されるため`.gitignore`に追加できます
  - `src`: `CMP`のプログラムコードディレクトリ
    -  `commonMain`: CMPプロジェクト共通のロジックコードディレクトリ
    -  `commonTest`: CMPプロジェクトのテストコードディレクトリ
    -  `iosMain`: `iOS`の実装コードディレクトリ
    -  `desktopMain`: `desktop`の実装コードディレクトリ
  - `build.gradle.kts`: `CMP`のGradle設定ファイル
* `gradle`: Gradle関連の設定ファイル
  - `wrapper`: Gradle Wrapper関連ファイルを含む
  - `libs.versions.toml`: プロジェクトで使用する`依存関係のバージョン`を定義
* `iosApp`: iOSプロジェクトのrootフォルダ
  - `iosApp`: iOSのプログラムコードディレクトリ
* `iosApp.xcodeproj`: iOSのXcodeプロジェクトファイル
* `.gitignore`: Gitバージョン管理で無視すべきファイルやディレクトリを定義
* `build.gradle.kts`: `ルートディレクトリ`のGradle設定ファイル
* `gradle.properties`: Gradleプロパティファイル
* `local.properties`: ローカル設定のプロパティファイルを定義
* `settings.gradle.kts`: `CMP`プロジェクト設定を定義するGradleファイル

<div class="c-border-main-title-2">lib.version.tomlを使用したGradle依存関係の設定</div>
`libs.versions.toml`はプロジェクトの依存関係バージョンを管理するための設定ファイルです<br>
特にGradleを使用してビルドするプロジェクトにおいて重要です<br><br>

Gradle公式ドキュメントによると<br>
この機能は`Gradle 7.0`バージョンでリリースされたものです<br>
また、彼らはこの機能を`version catalogs`と呼んでいます<br><br>

このファイルはTOML（Tom's Obvious, Minimal Language）形式を使用して依存関係のバージョン情報を定義し<br>
プロジェクト内でこれらの情報を一元管理することで、保守性と可読性を向上させます<br><br>


以下はlibs.versions.tomlの例とその説明です：<br>
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

`主要部分の説明`：<br><br>

* バージョン定義 `[versions]`:<br>
  この部分はプロジェクトで使用される各依存関係のバージョン番号を定義します<br>
  例えば、kotlin = "2.0.10-RC"はKotlinのバージョンが2.0.10-RCであることを示します<br>

* 依存関係定義 `[libraries]`:<br>
  この部分はプロジェクトで実際に使用される依存関係とそのバージョン情報を定義します<br>
  各ライブラリは`module`と`version.ref`を定義します<br>
  ここで`module`は依存関係の`Maven`であり<br>
  `version.ref`は上で定義した`バージョン番号`を参照します<br>
  - 例えば androidx-activity-compose = { module = "androidx.activity:activity-compose", version.ref = "androidx-activityCompose" }<br>
  - は androidx-activityCompose 標準ライブラリのバージョンが androidx-activityCompose で定義されたバージョン番号1.9.0を参照していることを示します<br>

* プラグイン定義 `[plugins]`:<br>
  この部分はプロジェクトで使用されるプラグインとそのバージョン情報を定義します<br>
  各プラグインは`id`と`version.ref`を定義します<br>
  ここで`id`はプラグインの識別子であり<br>
  `version.ref`も上で定義したバージョン番号を参照します<br>
  - 例えば、kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
  - はkotlinMultiplatform PluginのバージョンがKotlinで定義されたバージョン番号`2.0.10-RC`を参照していることを示します

* 上記の`.toml`を設定したら<br>
  プロジェクトを同期した後<br>
  Gradle設定で直接`libs.xxx.xx`の形式を使用して依存関係を設定できます<br>
  例：<br>
> implementation(libs.androidx.activity.compose)


* この設定方法により、プロジェクトの依存関係バージョン管理がより一元化され、バージョンアップグレードと保守が容易になります。libs.versions.tomlファイルを通じて、プロジェクトは全ての依存関係のバージョン情報を明確に把握でき、複数の場所でバージョン番号を重複定義することによる混乱を避けることができます。

* また、こちらは[.tomlにmigrationしてversion catalogsを使用する際に発生する問題](https://elegantaccess.org/android-upgrade-to-toml-tutorial)について書かれていますので、ご参考ください

<div class="c-border-content-title-1"> build.gradle.kts(:composeApp)</div>

`build.gradle.kts(:composeApp)`は`CMP`プロジェクトを設定するためのGradleビルドスクリプトファイルです<br>
これは｀Kotlin DSL（Domain Specific Language）を使用してビルド設定を定義しています`<br>
この方法はより強力な`型安全性`(Null safety)と`より良いIDE サポート`を提供します<br><br>

主にアプリのコンパイル時の動作に影響します<br>

しかし、`CMP`プロジェクトの`build.gradle.kts`の内容は長いため<br>
パートに分けて説明します<br>

* `plugins`ブロック：プラグインをインポートするために使用します<br>
  対応するプラグインをインポートするには、`lib.version.toml`で宣言されたプラグインを使用します<br>
  以下のように：<br>
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

`kotlin`ブロック：<br>
ここでは主に`CMP`プロジェクトの設定項目を配置します<br>
例えば、`共有ファイル`（String、画像など）の設定<br>
コンパイルJDK<br>
または異なるターゲットプラットフォームの設定など<br>

ここで簡単に説明します：<br>
* `androidTarget > compilerOptions > jvmTarget.set(JvmTarget.JVM_17)`
  JDK 17を使用してコンパイルするよう設定<br>

* `cocoapods`：`Gradle`を通じて`cocoapods`をインポートし、iOSのフレームワークを使用<br>

* `listOf(iosX64(), iosArm64(), iosSimulatorArm64()).forEach { target -> ...`：<br>
  iOS向けの設定、例えば`cinterops`を使用してiOSと橋渡しする<br>
  CMPが指定されたiOSフレームワークを使用できるようにする<br>

* `sourceSets > androidMain.dependencies`と`commonMain.dependencies`など：<br>
  ここでは異なるプラットフォーム向けにインポートしたい依存関係を指定できます<br>
  例えば：androidMainブロックは`android`で使用するライブラリをインポート<br>
  commonMainブロックは`共通ロジック`で使用するライブラリをインポート<br>
  さらにiosMainを使用して`iOS`で使用するライブラリもインポートできます<br>

ただし、下の例では橋渡し方式を使用しているため<br>
以下を使用しています<br>
`listOf(iosX64(), iosArm64(), iosSimulatorArm64())`<br>
iOSフレームワークをインポートするための方法ですが<br>
ここでは簡単に触れるだけにします<br>
後の章でiOSの橋渡しについてより詳細に説明します<br>

* 以下は簡単な`build.gradle.kts`の例です<br>

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

