---
layout: post
title: "Compose Multiplatform 實戰：CMP中透過StateFlow來管理UI狀態"
date: 2024-08-18 17:25:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-11
categories: ComposeMultiplatform
excerpt: "這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App
這次我會聚焦在 開發 跨平台Android 跟 IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得"
---

<div class="c-border-main-title-2">前言</div>
在前幾天的分享中<br>
我們討論了如何使用 Compose 來製作 UI<br>
然而，如何調整 UI 狀態以及在處理業務邏輯後如何改變 UI 畫面<br>
我們尚未深入探討<br><br>

今天<br>
我們將深入探討如何使用`StateFlow`<br>
展示如何在 CMP 中管理和調整 UI 狀態<br>
以及如何通過業務邏輯的處理來動態更新 UI<br>


<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">StateFlow 是什麼？</div>
`StateFlow` 是 Kotlin 協程庫中的一個狀態管理工具<br>
旨在解決在 Compose 中管理 UI 狀態的需求<br>
它是一個基於 Flow 的狀態容器<br>
設計來持有和觀察狀態變化<br>
特別適合在`Compose` 中使用<br>

<div class="c-border-content-title-1">StateFlow 的特點</div>

1. `持有最新狀態`：StateFlow 始終持有最新的狀態值<br>
   並且當狀態發生變化時<br>
   會自動通知所有觀察者<br>

2. `狀態不可變`：StateFlow 的狀態是不可變的<br>
   這意味著每次狀態改變都會創建一個新的狀態實例<br>
   從而確保狀態的一致性和預測性。<br>

3. `基於熱流（Hot Flow）`：即使沒有`收集器(Collect)`<br>
   StateFlow 也會持續保持最新的狀態值<br><br>

例如：我們可以透過以下code去更新UI狀態<br>

```kotlin
private val _uiState = MutableStateFlow(UiState())
val uiState: StateFlow<UiState> = _uiState.asStateFlow()
```
在你的Compose UI處去collect<br>
```
val uiState by viewModel.uiState.collectAsState()          
```


<div class="c-border-content-title-1">實做StateFlow管理UI狀態</div>

假設我們有一個 實作好的`SettingScreen`<br>
目前都只有顯示畫面<br>
但沒有狀態變化<br>
畫面的資料都是寫死的<br>

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

那我們可以先實作一個`data class`<br>
目的是用來更新`SettingScreen`中的Choose Transfer Option的標題<br>

```kotlin
data class ViewState(
    val transferOptionTitle: String,
    val isLoading: Boolean = false,
    val error: String? = null
    ... // More content that according your requirment.
)
```

接著實作一個Viewmodel<br>
用來把管理業務邏輯<br>
以及實現UI狀態的發送<br>
那因為`StateFlow`狀態是無法改變的<br>
所以你要改變可以用`MutableStateFlow`<br>
而通常為了`避免外部不小心改到`<br>
所以會把`MutableStateFlow`設定為`private `<br>

另外這邊寫了個範例`loadData()`去模擬網路請求資料<br>
可以透過`_uiState.value = UiState(xxxx)`去通知UI該改變了<br>
實際上你可以根據需求去調整<br>

```
class SettingViewModel(
    private val settingDataStore: SettingDataStore,
    private val dataStore: LearningDataStore,
    private val adManager: AdManager
) : ViewModel(){

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()
    
    // 模擬加載數據
    fun loadData() {
        viewModelScope.launch {
            _uiState.value = UiState(isLoading = true)
            try {
                delay(1000)  // 模擬網絡請求
                _uiState.value = UiState(transferOptionTitle = "Loaded Data", isLoading = false)
            } catch (e: Exception) {
                _uiState.value = UiState(error = e.message, isLoading = false)
            }
        }
    }
}
```

接著<br>
我們需要將ViewModel實例傳給Setting Screen<br>
由於我們前幾天已經使用了Compose Navigation<br>
所以可以直接在我們的NavGraphBuilder擴展中實現ViewModel<br>

你可以通過以下方式來創建ViewModel實例：<br>

使用直接創建的方式：<br>
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

或者使用Koin來進行依賴注入（我們會在後續章節詳細介紹這個方法）<br>


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

最後<br>
你只需要在你的 Compose UI 中去收集該狀態<br>
並透過該state去修改你的UI即可<br>

<div class="c-border-content-title-1">實際使用</div>

可以透過<br>
`val uiState by viewModel.uiState.collectAsState()`<br>
去`collect` uiState在viewmodel中的狀態變化<br>
在程式碼中直接呼叫uiState的值<br>
就能夠動態去設置畫面<br>

例如：
`uiState.isLoading`
`uiState.transferOptionTitle`
`uiState.error`
(可直接看下方code)


```kotlin
@Composable
fun SettingScreen(navController: NavController, viewModel: SettingViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val config = createSettingConfig(navController)

    // 觸發邏輯
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




