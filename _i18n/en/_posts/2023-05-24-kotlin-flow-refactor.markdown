---
layout: post
title: "Kotlin Flow Refactoring Network Connection Detailed Step-by-Step Guide"
date: 2023-05-24 15:56:16 +0800
image: cover/retrofit_with_kotlin_flow-1.png
tags: [Kotlin,Android]
permalink: /kotlin_flow_refactor
categories: Kotlin
excerpt: "Easily master how to use Kotlin Flow for network connection refactoring. This tutorial provides a detailed step-by-step guide to help you achieve efficient and stable network connections effortlessly."
---

<div class="c-border-main-title-2">Introduction</div>
<div class="c-border-content-title-4">
    Kotlin offers a powerful tool called Flow
</div>

<p>
    Kotlin Flow is a coroutine-based asynchronous programming library,<br>
    providing a reactive way to handle data streams,<br>
    and seamlessly integrating with asynchronous operations.<br><br>

    Applying Kotlin Flow to network requests,<br>
    we can handle asynchronous tasks in an elegant and concise manner,<br>
    making the code more readable and maintainable.<br><br>

    <div class="c-border-content-title-4">
        A few years ago, I also shared a version using RxJava. If you're interested, you can check it out.
    </div>
    <div class="table_container">
      <a href="{{site.baseurl}}/android-kt-rxjava">
      <img src="/images/cover/ea-website-rxjava-cover-photo-new-1.png" alt="Cover" width="25%" >
      Android Development - RxJava with Network Requests: Implementing Token Refresh and Retrying Network Requests</a>
    </div>

</p>

<div class="c-border-main-title-2">Practical Use of Kotlin Flow</div>
<div class="c-border-content-title-4">
    When actually calling Flow and collecting it, you need to include it in a Coroutine Scope, as shown below:<br>
</div>
<p>
  <script src="https://gist.github.com/KuanChunChen/6922457ce9a309d18258b1ac50ed77a6.js"></script>
</p>
<div class = "table_container">
  <p>Code Explanation</p>
  In the above code, we use the lifecycleScope of Coroutine Scope to operate our flow.<br>
  We obtain a flow through our written API and collect it.<br>
  In the process, we also add checkStatusAndRefreshToken to check whether the token has expired.<br>
  If it has, it will automatically refresh and resend the request.<br><br>
  Next, we use the catch function to catch any possible exceptions,<br>
  and perform corresponding operations in the exception handling.<br>
  If the previous steps are successful, we can obtain the return value in<br>
  <b>collect</b>,<br>
  and proceed with our logic processing.<br>
</div><br>

<div class="c-border-main-title-2">Kotlin Flow in Actual Development</div>
<div class="c-border-content-title-4">Using Kotlin Flow to replace the original Retrofit call's callback or RxJava operators, the code is as follows</div>
<p>
  <script src="https://gist.github.com/KuanChunChen/d5a3acb5f2b90bee2cd8b60c54adfcab.js"></script>
</p>

<div class = "table_container">
  <p>Code Explanation</p>
  In the above code,<br>
  we define a startLogin() function that returns a Flow containing the target data.<br>
  Then, we add a request body,<br>
  and execute the login API request.<br><br>

  Here, we use the verifyResponse function to determine whether the returned value of the executed API request meets expectations<br>
  <b>(the code for verifyResponse will be explained below).</b><br>
  After confirming there are no issues, we use emit to send the result to the Flow.<br><br>

<b>Note</b><br>
We switch the thread of this Flow to the IO thread (.flowOn(Dispatchers.IO)) to ensure that network requests are executed on a non-main thread.
</div><br>

<div class="c-border-content-title-4">Add a verifyResponse to check if the API request is as expected</div>
<p>
  <script src="https://gist.github.com/KuanChunChen/4a4daf5c3385a105b92cc642f9c505f5.js"></script>
</p>

<div class="table_container">
  <p>Code Explanation</p>
  In the code above,<br>
  we use the generic type T to make the function compatible with various API return results.<br><br>

  First, we check if the HTTP status code of the API request is between 200 and 300.<br>
  Then, we check if the response content returned by the server is empty.<br>
  If the above conditions are met,<br>
  an appropriate exception is thrown.<br>
</div><br>

<div class="c-border-content-title-4">Add a checkStatusAndRefreshToken to automatically refresh the token and re-request the original API when the API request token expires</div>
<p>
  <script src="https://gist.github.com/KuanChunChen/e6e0cc122d03f964c1abafda32cd5b02.js"></script>
</p>

<div class="table_container">
  <p>Code Explanation</p>
  In the code above,<br>
  we use an extension,<br>
  and define it as Flow&lt;BaseResult&lt;T&gt;&gt;<br><br>

  The main purpose is to check the response of the API request.<br>
  Using a generic return result to be compatible with multiple API returns.<br><br>

  We pass in function type variables tokenRefresh and apiCall,<br>
  which are used to specify the re-call to get the token and the target API interface to be re-called.<br>
  In the code above, when the conditions meet the custom error code, an emit will be triggered.<br>
</div><br>

<div class="c-border-main-title-2">Conclusion</div>

<div class="table_container">
  <p>Summary</p>
  By using Kotlin Flow to refactor network requests instead of RxJava or Retrofit callbacks,<br>
  we can achieve more powerful and flexible asynchronous programming capabilities.<br>
  Using Kotlin Flow can make the code more readable and maintainable,<br>
  while providing a more elegant way to handle asynchronous operations.<br><br>

  During the code modification process,<br>
  we used Kotlin Flow to replace the original Retrofit callback, encapsulating the API request in a Flow,<br>
  and emitting the target data through emit. At the same time, we added the verifyResponse function to check if the API request meets expectations,<br>
  including checking if the HTTP status code is in the range of 200~300 and if the response content is empty.<br><br>

  Additionally,<br>
  we introduced the checkStatusAndRefreshToken function,<br>
  which can automatically refresh the token and re-initiate the original API request when the API request token expires.<br>
  This mechanism ensures the smooth execution of API requests.<br><br>

  In summary,<br>
  using Kotlin Flow can improve the structure of network requests,<br>
  making asynchronous operations easier to manage and handle.<br>
  It can enhance the readability, maintainability, and scalability of the code, while also providing a better asynchronous programming experience.<br><br>

  Additionally,<br>
  there are some libraries that help you convert Retrofit calls to Flow,<br>
  which can be directly applied to Retrofit interfaces.<br>
  However, these libraries are often third-party or personal shares.<br>
  In some projects or products,<br>
  where the introduction of libraries needs to be evaluated,<br>
  too many infrequently used libraries will not be introduced,<br>
  so you might write your own.<br>

  Of course, any method that works is a good method.<br>
  Finding the method that best fits your project environment and efficiently solving problems is also very important!<br>
</div><br>

It looks like you haven't pasted any Markdown content yet. Please provide the text you want translated, and I'll handle the translation while adhering to the specified rules.
