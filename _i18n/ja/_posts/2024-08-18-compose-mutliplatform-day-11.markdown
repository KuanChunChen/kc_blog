---
layout: post
title: "Compose Multiplatform 実践：CMPでStateFlowを使用したUI状態管理"
date: 2024-08-18 17:25:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-11
categories: ComposeMultiplatform
excerpt: "このシリーズのテーマはCompose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。"
---

<div class="c-border-main-title-2">はじめに</div>
これまでの記事で<br>
Composeを使ってUIを作成する方法について説明してきました<br>
しかし、UI状態の調整方法やビジネスロジック処理後にUI画面を変更する方法については<br>
まだ詳しく説明していませんでした<br><br>

今日は<br>
`StateFlow`の使用方法について詳しく説明し<br>
CMP内でUI状態を管理・調整する方法<br>
そしてビジネスロジックの処理を通じてUIを動的に更新する方法を紹介します<br>


<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">StateFlowとは？</div>
`StateFlow`はKotlinコルーチンライブラリの状態管理ツールで<br>
Compose内のUI状態管理のニーズを解決するためのものです<br>
これはFlowベースの状態コンテナで<br>
状態の保持と変化の観察のために設計されており<br>
特に`Compose`での使用に適しています<br>

<div class="c-border-content-title-1">StateFlowの特徴</div>

1. `最新の状態を保持`：StateFlowは常に最新の状態値を保持し<br>
   状態が変化した場合<br>
   自動的にすべてのオブザーバーに通知します<br>

2. `状態は不変`：StateFlowの状態は不変です<br>
   つまり、状態が変わるたびに新しい状態インスタンスが作成され<br>
   状態の一貫性と予測可能性が確保されます<br>

3. `ホットフロー（Hot Flow）ベース`：`コレクター(Collect)`がなくても<br>
   StateFlowは常に最新の状態値を維持し続けます<br><br>

例えば：以下のコードでUI状態を更新できます<br>

```kotlin
private val _uiState = MutableStateFlow(UiState())
val uiState: StateFlow<UiState> = _uiState.asStateFlow()
```
Compose UIでcollectする<br>
```
val uiState by viewModel.uiState.collectAsState()          
```


<div class="c-border-content-title-1">StateFlowを使用したUI状態管理の実装</div>

すでに実装済みの`SettingScreen`があるとします<br>
現在は画面表示のみで<br>
状態変化はなく<br>
画面のデータはハードコードされています<br>

```kotlin 
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

まず、`data class`を実装します<br>
目的は`SettingScreen`内の「Choose Transfer Option」タイトルを更新することです<br>

```kotlin
data class ViewState(
    val transferOptionTitle: String,
    val isLoading: Boolean = false,
    val error: String? = null
    ... // More content that according your requirment.
)
```

次にViewmodelを実装します<br>
ビジネスロジックを管理し<br>
UI状態の送信を実現します<br>
`StateFlow`の状態は変更できないため<br>
変更するには`MutableStateFlow`を使用します<br>
通常、`外部からの誤った変更を防ぐ`ために<br>
`MutableStateFlow`を`private`に設定します<br>

また、ネットワークリクエストをシミュレートする`loadData()`の例を作成しました<br>
`_uiState.value = UiState(xxxx)`を使用してUIに変更を通知できます<br>
実際には要件に応じて調整できます<br>

```
class SettingViewModel(
    private val settingDataStore: SettingDataStore,
    private val dataStore: LearningDataStore,
    private val adManager: AdManager
) : ViewModel(){

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()
    
    // データロードのシミュレーション
    fun loadData() {
        viewModelScope.launch {
            _uiState.value = UiState(isLoading = true)
            try {
                delay(1000)  // ネットワークリクエストのシミュレーション
                _uiState.value = UiState(transferOptionTitle = "Loaded Data", isLoading = false)
            } catch (e: Exception) {
                _uiState.value = UiState(error = e.message, isLoading = false)
            }
        }
    }
}
```

続いて<br>
ViewModelインスタンスをSetting Screenに渡す必要があります<br>
すでにCompose Navigationを使用しているので<br>
NavGraphBuilder拡張でViewModelを実装できます<br>

以下の方法でViewModelインスタンスを作成できます：<br>

直接作成する方法：<br>
```kotlin
fun NavGraphBuilder.routeSettingScreen(
    navController: NavHostController,
) {

    composable(ElegantJapaneseScreen.Setting.name) {
        val viewModel = SettingViewModel()
        SettingScreen(navController, viewModel)
    }
}
```

またはKoinを使用して依存性注入を行う方法（後の章で詳しく説明します）<br>


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

最後に<br>
Compose UIで状態を収集し<br>
その状態を使ってUIを変更するだけです<br>

<div class="c-border-content-title-1">実際の使用例</div>

`val uiState by viewModel.uiState.collectAsState()`を使用して<br>
viewmodelの状態変化を`collect`し<br>
コード内で直接uiStateの値を呼び出すことで<br>
画面を動的に設定できます<br>

例：
`uiState.isLoading`
`uiState.transferOptionTitle`
`uiState.error`
（以下のコードを参照）


```kotlin
@Composable
fun SettingScreen(navController: NavController, viewModel: SettingViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val config = createSettingConfig(navController)

    // ロジックのトリガー
    LaunchedEffect(Unit) {
        viewModel.loadData()
    }
    
    Scaffold(
        topBar = {
            MainAppBar(config = config)
        },
        containerColor = MaterialTheme.colorScheme.surfaceVariant
    ) { paddingValues ->
        if (uiState.isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else if (uiState.error != null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Error: ${uiState.error}",
                    color = MaterialTheme.colorScheme.error
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    Text(
                        text = uiState.transferOptionTitle,
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
}
```

<div class="c-border-main-title-2">最終成效</div>

最後看看上面這個例子的結果<br>
![GIF](https://i.imgur.com/gT7j8sR.gif)




