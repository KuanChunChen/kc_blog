---
layout: post
title: "Compose Multiplatform 實戰：CMP中實作NavigationBar底部欄"
date: 2024-08-18 17:26:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-12
categories: ComposeMultiplatform
excerpt: "這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App
這次我會聚焦在 開發 跨平台Android 跟 IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得"
---

<div class="c-border-main-title-2">前言</div>

`Compose Multiplatform (簡稱CMP)`<br><br>

今天我們要來實作 `CMP` 的NavigationBar底部欄<br>
他也是在material 3 中有提供的一個composable元件<br>
可以提供使用者製作App中常使用切換頁面的底部欄<br>

實際做出來會看起來像這樣<br>

![https://ithelp.ithome.com.tw/upload/images/20240812/201683355J8smYXCg7.png](https://ithelp.ithome.com.tw/upload/images/20240812/201683355J8smYXCg7.png)

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">實作 NavigationBar底部欄</div>
今天我將分步介紹如何在 `CMP` 中實作一個 NavigationBar 底部欄<br>
我們需要定義底部欄的結構<br>
然後為其添加`樣式`和`行為`<br>

```kotlin
@Composable
fun BottomNavigation(navController: NavController) {
    val screens = listOf(
        Triple("🏠", "Lessons", ElegantJapaneseScreen.Learning.name),
        Triple("あ", "Ad", ElegantJapaneseScreen.Ad.name),
        Triple("🔍", "Grammar", ElegantJapaneseScreen.Grammar.name),
        Triple("👤", "Settings", ElegantJapaneseScreen.Setting.name)
    )

    NavigationBar(
        modifier = Modifier.height(60.dp),
        containerColor = MaterialTheme.colorScheme.surface,
    ) {
        val navBackStackEntry by navController.currentBackStackEntryAsState()
        val currentDestination = navBackStackEntry?.destination

        screens.forEach { (icon, label, route) ->
            NavigationBarItem(
                icon = { Text(icon) },
                label = { if (label.isNotEmpty()) Text(label) },
                selected = currentDestination?.route == route,
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = Color.Blue,
                    selectedTextColor = Color.Blue,
                    indicatorColor = Color.Blue.copy(alpha = 0.5f),
                    unselectedIconColor = Color.Gray,
                    unselectedTextColor = Color.Gray
                ),
                onClick = {
                    if (currentDestination?.route != route) {
                        navController.navigate(route) {
                            navController.graph.findStartDestination().route?.let {
                                popUpTo(it) {
                                    saveState = true
                                }
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                }
            )
        }
    }
}
```

`關鍵程式碼解說`：<br>
1. 我定義了一個list `screens`：其中的`Triple`<br>
   可以讓你放入三參數的一個容器<br>
   透過這邊自定義的內容<br>
   去產生不同的`NavigationBarItem`<br>
2. `NavigationBar(
   modifier = Modifier.height(60.dp),
   containerColor = MaterialTheme.colorScheme.surface,
   ) {....}`：
   這邊一樣是我們眾多compose的起手式<br>
   用NavigationBar去包`NavigationBarItem`<br>
   這樣你就可以得到一個高度是60 dp的底部欄<br>

3. 我們預期會傳入`navController: NavController`：<br>
   這個是前幾天我們用來導航頁面的控制器<br>
   (忘記的可以回去看)<br><br>

4. `val navBackStackEntry by navController.currentBackStackEntryAsState()`：<br>
   這行代碼使用了 Kotlin 的 `by` 語法來創建一個 `navBackStackEntry` 變量<br>
   並將其委託給 navController.currentBackStackEntryAsState() 的返回值<br><br>

5. `val currentDestination = navBackStackEntry?.destination`：<br>
   這行從 `navBackStackEntry` 中提取當前目的地 (currentDestination)<br><br>

6. 而以上`4~5`，主要是為了拿到當前目的地的導航<br>
   讓我們可以在這邊根據邏輯去處理UI狀態的更新<br><br>

7. `selected = currentDestination?.route == route`：<br>
   加入這行主要是為了防止在同個畫面又點擊了同個BottomBarItem的問題<br><br>

8. NavigationBarItem的參數就跟之前的其他comsable類似<br>
   可以根據開發者情境去調整內容<br><br>

## 實際使用

還記得我們前面的`Compose Navigation`外面包了一層`Scaffold`嗎？<br>
這時候<br>
我們就可以直接在`Scaffold`中的`bottomBar`中<br>
加入我們剛實作好的`BottomNavigation`了<br>

```kotlin
@Composable
fun ElegantAccessApp(
    vm: MainViewModel,
    navController: NavHostController = rememberNavController(),
) {
    vm.navController = navController

    navController.addOnDestinationChangedListener { _, destination, _ ->
        println("Navigation: Navigated to ${destination.route}")
    }

    Scaffold(
        // 加在這裡
        bottomBar = {
           BottomNavigation(navController)
        },
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = ElegantJapaneseScreen.Learning.name,
            modifier = Modifier
                .padding(paddingValues)
                .safeDrawingPadding()
                .fillMaxSize()
        ) {
            routeLearningScreen(navController)
            routeAdScreen(navController)
            routeAScreen(navController)
            routeBScreen(navController)
            routeCScreen(navController)
            routeSettingScreen(navController)
        }

    }
}
```

## 如果有的頁面不想顯示NavigationBar怎麼辦？

那這時候<br>
就可以寫一個function `shouldShowBottomBar`<br>
用來判斷當前是否要顯示`NavigationBar`<br><br>

方法也很簡單<br>

建立一個list存放想要顯示NavigationBar的route<br>
跟`當前route`比較<br><br>

這時候前面定義的enum就發揮優勢了<br>
透過定義好的enum<br>
這邊只需要去找到對應頁面的Route放進就好<br>

```kotlin
@Composable
fun shouldShowBottomBar(navController: NavHostController): Boolean {
    val currentRoute = navController.currentBackStackEntryAsState().value?.destination?.route
    return currentRoute in listOf(
        ElegantJapaneseScreen.Learning.name,
        ElegantJapaneseScreen.Ad.name,
        ElegantJapaneseScreen.Contest.name,
        ElegantJapaneseScreen.Grammar.name,
        ElegantJapaneseScreen.About.name,
        ElegantJapaneseScreen.Setting.name
    )
}
```

接著在`Scaffold`加入`if判斷`即可<br>

```kotlin
Scaffold(
    bottomBar = {
        if (shouldShowBottomBar(navController)) {
            BottomNavigation(navController)
        }
    },
)
```