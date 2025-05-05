---
layout: post
title: "Compose Multiplatform in Action: Managing UI State with StateFlow in CMP"
date: 2024-08-18 17:25:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-11
categories: ComposeMultiplatform
excerpt: "This series focuses on Compose Multiplatform in action: developing cross-platform apps from scratch using Kotlin. This post will specifically focus on developing cross-platform apps for Android and iOS, and in the final days, I'll discuss my research findings and insights."
---

<div class="c-border-main-title-2">Introduction</div>
In our previous discussions,<br>
we explored how to create UI using Compose.<br>
However, we haven't deeply examined how to adjust UI states<br>
and how to update the UI after processing business logic.<br><br>

Today,<br>
we'll dive into how to use `StateFlow`<br>
to demonstrate how to manage and adjust UI states in CMP<br>
and how to dynamically update the UI through business logic processing.<br>


<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">What is StateFlow?</div>
`StateFlow` is a state management tool in the Kotlin coroutine library<br>
designed to address the need for managing UI states in Compose.<br>
It's a Flow-based state container<br>
designed to hold and observe state changes,<br>
particularly suitable for use in `Compose`.<br>

<div class="c-border-content-title-1">Characteristics of StateFlow</div>

1. `Holds the latest state`: StateFlow always maintains the latest state value<br>
   and automatically notifies all observers<br>
   when the state changes.<br>

2. `Immutable state`: The state in StateFlow is immutable,<br>
   meaning that each state change creates a new state instance,<br>
   ensuring consistency and predictability of the state.<br>

3. `Based on Hot Flow`: Even without a `collector`,<br>
   StateFlow continuously maintains the latest state value.<br><br>

For example: we can update the UI state with the following code:<br>

```kotlin
private val _uiState = MutableStateFlow(UiState())
val uiState: StateFlow<UiState> = _uiState.asStateFlow()
```
Then collect it in your Compose UI:<br>
```
val uiState by viewModel.uiState.collectAsState()          
```


<div class="c-border-content-title-1">Implementing StateFlow to Manage UI State</div>

Let's say we have a completed `SettingScreen`<br>
that currently only displays a screen<br>
without state changes,<br>
and all the screen data is hardcoded.<br>

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

First, we can implement a `data class`<br>
to update the title "Choose Transfer Option" in the `SettingScreen`:<br>

```kotlin
data class ViewState(
    val transferOptionTitle: String,
    val isLoading: Boolean = false,
    val error: String? = null
    ... // More content according to your requirements.
)
```

Next, implement a ViewModel<br>
to manage business logic<br>
and implement UI state emission.<br>
Since `StateFlow` states are immutable,<br>
you can use `MutableStateFlow` to change them.<br>
To `prevent external accidental modifications`,<br>
we typically set `MutableStateFlow` as `private`.<br>

Additionally, I've written a sample `loadData()` function to simulate network data requests.<br>
You can notify the UI of changes through `_uiState.value = UiState(xxxx)`.<br>
You can adjust according to your needs in practice.<br>

```
class SettingViewModel(
    private val settingDataStore: SettingDataStore,
    private val dataStore: LearningDataStore,
    private val adManager: AdManager
) : ViewModel(){

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()
    
    // Simulate data loading
    fun loadData() {
        viewModelScope.launch {
            _uiState.value = UiState(isLoading = true)
            try {
                delay(1000)  // Simulate network request
                _uiState.value = UiState(transferOptionTitle = "Loaded Data", isLoading = false)
            } catch (e: Exception) {
                _uiState.value = UiState(error = e.message, isLoading = false)
            }
        }
    }
}
```

Next,<br>
we need to pass the ViewModel instance to the Setting Screen.<br>
Since we've already used Compose Navigation in previous days,<br>
we can implement the ViewModel directly in our NavGraphBuilder extension.<br>

You can create a ViewModel instance in the following ways:<br>

Using direct creation:<br>
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

Or using Koin for dependency injection (we'll cover this method in detail in later chapters):<br>


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

Finally,<br>
you just need to collect that state in your Compose UI<br>
and modify your UI through that state.<br>

<div class="c-border-content-title-1">Practical Usage</div>

You can use<br>
`val uiState by viewModel.uiState.collectAsState()`<br>
to `collect` the state changes in the viewmodel's uiState.<br>
By directly calling uiState values in your code,<br>
you can dynamically set up your screen.<br>

For example:
`uiState.isLoading`
`uiState.transferOptionTitle`
`uiState.error`
(see the code below)


```kotlin
@Composable
fun SettingScreen(navController: NavController, viewModel: SettingViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val config = createSettingConfig(navController)

    // Trigger logic
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

<div class="c-border-main-title-2">Final Result</div>

Here's the result of the example above:<br>
![GIF](https://i.imgur.com/gT7j8sR.gif) 