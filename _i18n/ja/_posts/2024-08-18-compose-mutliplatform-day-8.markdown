---
layout: post
title: "Compose Multiplatform 実践：CMPでComposeを使用したクロスプラットフォーム画面の実装"
date: 2024-08-18 17:22:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-8
categories: ComposeMultiplatform
excerpt: "このシリーズのテーマはCompose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。"
---

<div class="c-border-main-title-2">はじめに</div>

`Compose Multiplatform (略称CMP)`<br>

昨日、共通のMaterial3 Themeを構築しました<br>
今日はクロスプラットフォームアプリの画面を作成していきます<br>
`CMP`では`Compose`を使用してAndroidとiOSの画面を作成し<br>
Compose UIは完全に`commonMain`内に実装します<br>
つまりUI部分はすべて共有できます<br>

さらに、AndroidでもUIフレームワークとして`Compose`の使用を全面的に推進しているため<br>
すでにComposeに慣れている人にとっては非常に有利です<br>

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">最初のCompose画面を作成する</div>
* まずは`CMP`でComposeを使用して基本的なHello World画面を作成する方法を見てみましょう<br>
(不変の例である`Hello world` XD)<br>

`Compose`は`宣言的UI`を採用しているため<br>
実装する関数の前に`@Composable`を追加するだけで<br>
Composeのコンポーネントになります<br><br>

CMPの`commonMain`に以下を追加します<br>

```kotlin
// in ~/commonMain/

@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name !")
}
```

* プレビューを表示したい場合<br>
  別の関数を作成し、その前に`@Preview`を追加するだけで<br>
  IDE上でComposeのプレビューを表示できます<br>

```kotlin
// in ~/commonMain/

@Preview
@Composable
fun GreetingPreview() { Greeting("Compose") }
```

実際にIDEの右側に`@Preview`の画面が表示されます<br>
<img src="/images/compose/048.png" alt="Cover" width="100%"/><br/>

<div class="c-border-content-title-1">ComposeコンポーネントのModifier</div>

> Modifierは`Compose`でコンポーネントを修飾・設定するためのツールです<br>
Compose UIコンポーネントの動作や外観を変更するための様々な機能を提供します<br>

`Modifier`を入力して<br>
展開してみると<br>
様々なオプションが用意されており<br>
UIの動作や外観を設定できます<br>
例えば、backgroundcolor、align、height、width、onClick...など<br>
非常に多くの機能があるので、興味があれば自分で確認してみてください：<br>
<img src="/images/compose/049.png" alt="Cover" width="100%"/><br/>


* 昨日Themeを作成した場合<br>
  `Material3 theme`を使用してコンポーネントの背景色を設定できます<br>

```kotlin 
// in ~/commonMain/

@OptIn(KoinExperimentalAPI::class)
@Composable
@Preview
fun App() {
    //ElegantAccessComposeThemeを通じてMaterial 3テーマを設定
    ElegantAccessComposeTheme {
        Greeting("Compose")
    }
}
```

そして、このようにTextの外側に`Column`を追加し<br>
`Modifier.background(color = MaterialTheme.colorScheme.background)`を使用します<br>
```kotlin
// in ~/commonMain/

@Composable
fun Greeting(name: String) {
    Column(
        modifier = Modifier
            .background(color = MaterialTheme.colorScheme.background)
    ) {
        Text(text = "Hello $name !")
    }
}
```

<div class="c-border-content-title-1">Composeトップバーの作成</div>

* アプリ開発において、AndroidでもiOSでも<br>
  `カスタムツールバー`が必要になることがよくあります<br>
  <img src="/images/compose/050.png" alt="Cover" width="50%"/><br/>

* そこで再利用可能なトップバーを作成できます<br>
```kotlin
//in ~/commonMain/
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppBar(
    modifier: Modifier = Modifier,
    config: MainAppBarConfig,
    elevation: Dp = 4.dp,
    containerColor: Color = MaterialTheme.colorScheme.primaryContainer
) {
    CenterAlignedTopAppBar(
        title = config.title,
        colors = TopAppBarDefaults.mediumTopAppBarColors(
            containerColor = containerColor
        ),
        modifier = modifier.shadow(elevation = elevation),
        navigationIcon = {
            config.navigationIcon()
        },
        actions = {
            config.actionIcon?.invoke()
        }
    )
}
```

ここでの`核心概念`：<br>
1. ComposeネイティブのTopAppBar：`CenterAlignedTopAppBar`を使用<br>
2. 異なる画面では異なるトップバーの内容が必要になることを考慮し<br>
   データクラス`MainAppBarConfig`を別途作成<br>
   トップバーを使用する際に<br>
   TopAppBarを繰り返し書く必要がなく<br>
   `MainAppBarConfig`のインスタンスを作成するだけでいい<br>
3. よく使用される変数は外部に公開<br>
   設定できるようにしています<br>
   例：`elevation`<br>



> データクラス`MainAppBarConfig`の実装

よく調整される要素をカスタマイズできるようにします<br>
タイトルの長さ、テキスト、スタイル、戻るアイコンなど<br>

```kotlin
// in ~/commonMain/

data class MainAppBarConfig(
    val marqueeNum: Int = 0,
    val titleText: @Composable () -> String = { "" },
    val title: @Composable () -> Unit = {
        DefaultTitleText(titleText(), marqueeNum)
    },
    val navigationIcon: @Composable () -> Unit = {},
    val actionIcon: @Composable (() -> Unit)? = null,
)

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun DefaultTitleText(titleText: String, marqueeNum: Int) {
    Text(
        modifier = Modifier.basicMarquee(marqueeNum),
        text = titleText,
        style = MaterialTheme.typography.titleMedium,
        maxLines = 1,
        overflow = TextOverflow.Ellipsis,
        color = ExtendedTheme.colors.onAppBar
    )
}
```

<div class="c-border-content-title-1">TopBarの実際の使用</div>
* ここでは`createSetting`関数を作成します<br>
  前に作成した`MainAppBarConfig`を使用して<br>
  設定したい内容を入力します<br>

```kotlin
// in ~/commonMain/

private fun createSettingConfig(
    navController: NavController,
) = MainAppBarConfig(
    titleText = { stringResource(Res.string.title_setting) },
    navigationIcon = {
        NavBackIcon(navController = navController)
    },
)
```

注：戻るボタンの遷移機能を実装したい場合<br>
遷移イベントを関数に渡す必要があるかもしれません<br>
ただし、`NavController`を使用するとより柔軟になります<br>
`NavController`はすべてのルートを管理できます<br>
遷移が必要なときに定義済みの文字列を指定するだけでいいです<br>
`この部分の詳細は後の章で説明します`<br>


* 実際の使用
```kotlin
// in ~/commonMain/

@Composable
fun SettingScreen(navController: NavController) {
    val config = createSettingConfig(navController)

    Scaffold(
        topBar = {
            MainAppBar(config = config)
        },
        containerColor = MaterialTheme.colorScheme.surfaceVariant
    ) {...}
}
```

<div class="c-border-main-title-2">実際の例</div>

* 上記の概念を利用して<br>
  簡単な設定画面を実装できます<br>

```kotlin 
// in ~/commonMain/

@Composable
fun SettingScreen(navController: NavController) {
    val config = createSettingConfig(navController)

    Scaffold(
        topBar = {
            MainAppBar(config = config)
        },
        containerColor = MaterialTheme.colorScheme.surfaceVariant
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            item {
                Text(
                    "Choose Transfer Option",
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.padding(start = 30.dp, top = 16.dp, end = 30.dp)
                )
            }

            items(SettingOption.values()) { option ->
                SettingOptionCard(
                    option = option,
                    onClick = {
                        navController.navigate(option.route) {
                            navController.graph.startDestinationRoute?.let {
                                popUpTo(it) {
                                    saveState = true
                                }
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }
        }
    }
}
```
