---
layout: post
title: "Compose Multiplatform 実践：CMPでのNavigationBarボトムバーの実装"
date: 2024-08-18 17:26:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-12
categories: ComposeMultiplatform
excerpt: "このシリーズのテーマはCompose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。"
---

<div class="c-border-main-title-2">はじめに</div>

`Compose Multiplatform (略称CMP)`<br><br>

今日は`CMP`のNavigationBarボトムバーを実装します<br>
これはmaterial 3で提供されているcomposableコンポーネントで<br>
ユーザーがアプリでよく使用するページ切替用のボトムバーを作成できます<br>

実際に作成すると次のようになります<br>

![https://ithelp.ithome.com.tw/upload/images/20240812/201683355J8smYXCg7.png](https://ithelp.ithome.com.tw/upload/images/20240812/201683355J8smYXCg7.png)

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">NavigationBarボトムバーの実装</div>
今日は`CMP`でNavigationBarボトムバーを実装する方法を段階的に紹介します<br>
ボトムバーの構造を定義し<br>
`スタイル`と`動作`を追加する必要があります<br>

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

`主要コードの説明`：<br>
1. リスト`screens`を定義しました：ここでの`Triple`は<br>
   3つのパラメータを入れられるコンテナです<br>
   ここでカスタマイズした内容を通じて<br>
   異なる`NavigationBarItem`を生成します<br>
2. `NavigationBar(
   modifier = Modifier.height(60.dp),
   containerColor = MaterialTheme.colorScheme.surface,
   ) {....}`：
   これも多くのcomposeの基本的な書き方で<br>
   NavigationBarで`NavigationBarItem`をラップすると<br>
   高さ60 dpのボトムバーが得られます<br>

3. `navController: NavController`を渡すことを想定しています：<br>
   これは数日前に画面ナビゲーションに使用したコントローラーです<br>
   （忘れた場合は前回の記事を参照してください）<br><br>

4. `val navBackStackEntry by navController.currentBackStackEntryAsState()`：<br>
   このコードはKotlinの`by`構文を使用して`navBackStackEntry`変数を作成し<br>
   navController.currentBackStackEntryAsState()の戻り値に委譲しています<br><br>

5. `val currentDestination = navBackStackEntry?.destination`：<br>
   この行は`navBackStackEntry`から現在の目的地（currentDestination）を抽出します<br><br>

6. 上記の`4~5`は、主に現在のナビゲーション先を取得するためのもので<br>
   ここでロジックに基づいてUI状態の更新を処理できるようにします<br><br>

7. `selected = currentDestination?.route == route`：<br>
   この行を追加した主な理由は、同じ画面で同じBottomBarItemをクリックする問題を防ぐためです<br><br>

8. NavigationBarItemのパラメータは、以前の他のcomposableと同様に<br>
   開発者のシナリオに応じて内容を調整できます<br><br>

<div class="c-border-content-title-1">実際の使用例</div>

以前の`Compose Navigation`の外側に`Scaffold`をラップしたことを覚えていますか？<br>
ここで<br>
`Scaffold`の`bottomBar`に<br>
実装したばかりの`BottomNavigation`を追加できます<br>

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
        // ここに追加
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

<div class="c-border-content-title-1">一部のページでNavigationBarを表示したくない場合はどうすればいいですか？</div>

この場合<br>
`shouldShowBottomBar`という関数を作成して<br>
現在`NavigationBar`を表示すべきかどうかを判断できます<br><br>

方法はとても簡単です<br>

NavigationBarを表示したいrouteのリストを作成し<br>
`現在のroute`と比較します<br><br>

ここで前に定義したenumが威力を発揮します<br>
定義済みのenumを通じて<br>
対応するページのRouteを見つけて追加するだけです<br>

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

次に`Scaffold`に`if判定`を追加するだけです<br>

```kotlin
Scaffold(
    bottomBar = {
        if (shouldShowBottomBar(navController)) {
            BottomNavigation(navController)
        }
    },
)
``` 