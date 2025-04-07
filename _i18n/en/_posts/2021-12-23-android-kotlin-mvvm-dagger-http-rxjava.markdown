---
layout: post
title: "Creating a Smooth Auto-Loading Pagination Github API Demo: MVVM, DI, RxJava, and Paging in Android Kotlin"
date: 2021-12-23 13:06:12 +0800
image: cover/kotlin-mvvm+rxjava+retrofit+okHttp+dagger.png
tags: [Android]
categories: Android實作
excerpt: "In this tutorial, we will explore how to create a Github API Demo using MVVM, DI, RxJava, and Paging in Android Kotlin. Through this demo, you will learn how to build a smooth auto-loading pagination application and understand how to use these important technologies in Kotlin."
---

<div class="c-border-main-title-2">Introduction</div>

Today, I will share how to connect to the Github API to implement a smooth auto-loading pagination example using the following architecture.<br>
 1. Using the MVVM architecture<br>
 2. RxJava for controlling network requests<br>
 3. Dependency injection<br>
 4. Using Paging to display RecyclerView pagination<br>
 5. Data connection to the Github API<br>

<div class="c-border-content-title-4">The final result looks like this:</div><br>
<div align="center">
  <img src="/mov/paging/mvvm-paging-dagger2.gif" width="30%"/>
</div>

<div class="c-border-content-title-4">The API used is provided by Github at /search/users</div><br>

```shell
curl \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/search/users
```

<div class="c-border-content-title-4">The implemented functionality is</div><br>
Enter search text in the search field<br>
Use the built data class to call the API
and display the returned results according to the specified quantity

<div class="c-border-main-title-2">Preliminary Architecture Thoughts (TL;DR)</div>

First, you need to plan the architecture<br>
Here, we mainly use MVVM<br>
You will have a rough diagram in mind<br>
But you won't implement everything at once<br>
You will build it layer by layer<br>
Here is my simplified example:<br>

<div align="start">
  <img src="/images/paging/project-struct.png" width="30%"/>
</div>

<br>

<div class="c-border-content-title-4">Expected Development Steps</div><br>

1. First, we handle some basic common classes,<br>
such as the base folder, Android Application, and basic XML configurations.<br>
These classes might be used multiple times in subsequent development,<br>
so we complete these foundational tasks first.<br>

2-a. This time, we decided to use Jetpack ViewModel and Dagger2.<br>
Develop the DI folder mainly for the Application component,<br>
which contains some common methods that other modules can use,<br>
such as providing Application/Context or new common methods.<br>
<br>

2-b. Before starting to construct the HTTP module,<br>
I had already decided which libraries to use,<br>
including OkHttp, Retrofit, and RxJava.<br>
Then I started constructing the HTTP module,<br>
implementing the Retrofit client,<br>
mainly to provide a Retrofit instance, like this:<br>
<script src="https://gist.github.com/waitzShigoto/442337c7fa413741c5e15451827e2c74.js"></script>
<br>
Then put it into the HttpModule to be used by other modules in the future<br>
<br>

3. Start constructing the component and module for the page<br>
After building the necessary basic classes<br>
you can start creating new modules to implement the main functionality<br>
Here, you can use the written HttpModule, only needing to write some APIs for external requests.

4. Start constructing the viewmodel and repository related parts,<br>
think about what data you will need and how to update the data to formulate your viewmodel,<br>
then use the repository to execute the HTTP request.<br>

After building the above functions,<br>
go back to the module and add the classes that need to be provided for DI auto-injection.<br>

5. After completing the preparatory work, you can now start writing the UI.<br>
Use Navigation Graph to configure Activity and Fragment,<br>
and inject the previously created DI classes into the Activity or Fragment to be executed,<br>
so that they can use the DI functions.<br>

The above is the thought process for pre-planning the entire development flow.<br>
At this point,<br>
we can start talking about how to write the code!<br>
The previous parts were just some of my experience sharing and suggestions,<br>
now let's officially get into the main topic.
<span id="TLDR"></span>

<div class="c-border-main-title-2">Implementation Begins</div>

<div class="c-border-content-title-4">Create Some Basic Classes</div><br>
Such as BaseApplication, Constants, BaseActivity, etc.<br>
The purpose is to design some common code<br>
Some frequently used initialization stuff is written here<br>
It also makes your main application/BaseActivity class look less cluttered and more readable, or reduces the amount of code you need to write later.<br>
<br>
<div align="center">
  <img src="/images/paging/base_directory.png" width="35%"/>
  &ensp;
  <img src="/images/paging/base_application.png" width="30%"/>
</div>
<br>

<div class="c-border-content-title-4">Main Architecture</div>
#### a. First develop the DI components and modules related to the application<br>
First, build the basic DI modules<br>

<script src="https://gist.github.com/waitzShigoto/eb5864c365e4e4b184b3084deb41d060.js"></script>
<br>
Build the component:<br>
<script src="https://gist.github.com/waitzShigoto/a6ddb1250a9d8df5ab18488f35df38ad.js"></script>
<br>

#### b. Develop the module for HTTP requests
Then develop the HTTP connection module<br>
Considering that the app might primarily use HTTP connections later on,<br>
we first set up the HTTP module<br>
The HTTP module looks like this:

<script src="https://gist.github.com/waitzShigoto/6d73385fd8aca0b3ee372100c1a2e1b0.js"></script>

RetrofitClient is a class I encapsulated myself,<br>
it returns a Retrofit instance<br>
Built through a builder and a custom OkHttp builder<br>
to create this Retrofit instance<br>
<br>
Since RxJava's Observable will be used later,<br>
we add<br>
RxJava2CallAdapterFactory<br>
during the setup to make Retrofit support RxJava<br>
```Kotlin
.addCallAdapterFactory(RxJava2CallAdapterFactory.create())
```
<script src="https://gist.github.com/waitzShigoto/442337c7fa413741c5e15451827e2c74.js"></script>

<br>

<div class="c-border-content-title-4">Feature Development</div>

#### c-1. Create the API interface for Retrofit<br>

<script src="https://gist.github.com/waitzShigoto/a63ac4066bfed42d4bd909ed644e23c9.js"></script>

#### c-2. Create the Repository where the actual API calls will be made<br>

<script src="https://gist.github.com/waitzShigoto/ea939951bca958c6c983a1bb8bd226a2.js"></script>

#### c-3. Create ViewModel and anticipate the data to be observed<br>

In this example<br>
the following data needs to be observed<br>
1. UI display status<br>
2. List data to be displayed during paging<br>

<script src="https://gist.github.com/waitzShigoto/3a8b6ec9c0ce4ca6bfd3c5c7d2653748.js"></script>

#### c-4. Create module<br>

<script src="https://gist.github.com/waitzShigoto/f27a22b68b240cc95bc05bb3d2af19be.js"></script>

The @Provides | @Module | @Inject annotations are required for DI<br>
So, depending on different situations or places, you need to add the relevant annotations<br>

#### c-5. Add HTTP module<br>
The previously written HTTP module comes in handy<br>
Add the following code before the module you want to call<br>
```Kotlin
@Module(includes = [HttpModule::class])
```

#### c-6. Create the fragment for displaying the screen<br>
Start creating the fragment and inject the ViewModel<br>
<script src="https://gist.github.com/waitzShigoto/b131256f8612877c48eba6c05c58e4b6.js"></script>

#### c-7. Create the module to be used<br>

This is a step to create a Dagger Component<br>
1. Write a component<br>
2. If you need to use context, you can import the previously created app component<br>
3. Add the module you want to use<br>
<script src="https://gist.github.com/waitzShigoto/63c03346e0d17b76019d9308051904b6.js"></script>
<br>

#### c-8. Develop the app's view<br>

The remaining task is to start developing the app's view and paging functionality<br>

Here, I use the official Android paging library for pagination<br>
Using RecyclerView in conjunction with the paging library<br>

First, write a class PagedListAdapter<br>
Then create getItemViewType, onBindViewHolder, onCreateViewHolder:<br>
<script src="https://gist.github.com/waitzShigoto/680faa718048a164879e9926c84d16b6.js"></script>
Create DiffUtil.ItemCallback to determine the differences between new and old data<br>
If different, it will update<br>

Next, create the DataSource.Factory used for paging<br>
<script src="https://gist.github.com/waitzShigoto/27a1befa148117fa009005bd8fae312e.js"></script>
This section is about the use of PageKeyedDataSource,<br>
which has three override methods,<br>
including loadInitial, loadAfter, loadBefore<br>
representing initialization, before loading data, and after loading data respectively<br>

By adding custom data into the pagelist,<br>
you can implement your business logic in these methods,<br>
such as executing an HTTP request during initialization.<br>

For example, create an onResult callback interface<br>
and call this method when encountering loadAfter<br>
to pass the data back to the calling point<br>
```kotlin
callback.onResult(listSearchUser, initPage, nextKey)
```

Of course, how to write this method<br>
can be adjusted according to individual situations<br>
and the results may vary<br>

Here is my example:<br>
<script src="https://gist.github.com/waitzShigoto/95e205701044eb49b16031c4f771df71.js"></script>
