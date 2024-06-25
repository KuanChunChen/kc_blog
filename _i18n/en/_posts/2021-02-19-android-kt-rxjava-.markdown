---
layout: post
title: "Android Development - RxJava with Network Requests: Implementing Token Refresh and Retrying Network Requests"
date: 2021-02-19 21:37:48 +0800
image: cover/ea-website-rxjava-cover-photo-new-1.png
tags: [Android]
categories: Android實作
permalink: /android-kt-rxjava
excerpt: "This article will introduce how to use RxJava to implement token refresh and retry network requests, which will help improve the user experience of the application."
---

<div class="c-border-main-title-2">Introduction</div>
Hello everyone!<br>
It's been a while since my last post,<br>
Today I want to share a method to solve the issue of refreshing tokens and retrying the same network request when using RxJava with network requests (e.g., OkHttp + Retrofit).<br>
This problem is very common in apps that require a lot of connections.<br>
When we need to make requests to the server,<br>
to ensure the legality of the user,<br>
we usually use a token mechanism to verify login or access API permissions.<br>
And tokens usually have an expiration date,<br>
to provide a good user experience,<br>
we need to implement a more complete process when we are unaware that the token in a network request has expired.<br>

<div class="c-border-content-title-4">Related Knowledge</div><br>
In this article, I will list the related knowledge used,<br>
but the main focus is on sharing the process of implementing token refresh and network reconnection,<br>
so I won't go into detail about each one. If you are interested, you can look it up or message me for discussion:

* Genetic
* Kotlin extension
* Kotlin function type
* RxJava
* Retrofit
* Okhttp

<div class="c-border-main-title-2">Thought Process</div>

<br>
Usually, when integrating API requests with a token mechanism in an application,<br>
if no corresponding processing is done, the actual execution process might be as follows:

```
App network request -> Token expired -> Server returns access expired -> App handles the error accordingly
```
<br>

In this situation,<br>
even though error handling is done,<br>
every time the token expires,<br>
it will trigger error handling (e.g., notifying the user that the token has timed out),<br>
one or two times might be considered occasional,<br>
but after multiple times,<br>
users might think your application has a problem,<br>
unable to execute smoothly,<br>
thus reducing the user experience,<br>leading to more subsequent issues.<br><br>

Therefore,<br>
I hope to implement a similar process as follows,<br>
so that after the token is refreshed,<br>
the original network connection can be retried:<br>

```
App network request -> Token expired -> Server returns access expired -> Execute token refresh process -> App retries the same network request
```
<br>

<div class="c-border-main-title-2">Actual Development</div>
In this article, the main method I use for network requests is the RxJava operator,<br>
wrapping Retrofit and applying OkHttp to request network APIs. Here I share a way I request network:<br>

<script src="https://gist.github.com/KuanChunChen/5724788a6a2efa973eb31b497ffb65df.js"></script><br>

If someone uses RxJava to handle network requests,<br>
they usually use an Rx operator to control it.<br>
Here,<br>
I use Observable. And in the above code:<br>

```
repo.getPaymentData(paymentRequest)
```

The returned result is an Observable.<br>
If you follow the method I mentioned earlier,<br>
the first situation might occur,<br>
that is, after the network request, the token becomes invalid,<br>
only error handling is done and then the token is refreshed,<br>
but the API is not retried.<br>

To solve this problem,<br>
I started researching how to use RxJava to refresh the token during execution,<br>
and use the new token to reconnect to the original API.<br>
Therefore,<br>
I wrote a Kotlin extension function<br>
to achieve this functionality:<br>

<script src="https://gist.github.com/KuanChunChen/889f4e67cf5edae25cffc006a25032dd.js"></script>

<div class="c-border-content-title-4">Code Explanation</div><br>
**1. When actually applying this extension, it will look like this:**<br>

<script src="https://gist.github.com/KuanChunChen/8ef1124c7d67d02b7e3024fc56735bc8.js"></script>
It's very convenient to use,<br>
just add the extension function where you need to re-acquire the Token,<br>
and continue using the original method where you don't need to re-acquire the Token.<br>
This extension function is very flexible,<br>
just add the following code:<br>

```
.retryNoKeyWhenError(resetRequest = {                       
     repo.getPaymentData(resetRequestToken(paymentRequest))})
```

**2. Let's take a look at the extended function separately**

I used flapmap to parse the data returned within Observable<T>,<br>
and since it's a connection request, the server usually returns the result in a fixed format,<br>
so we parse the request result status here.<br>
If it's a success, then the entire original response is returned to the observer,<br>
if it's an error, you write the handling mode you need based on actual requirements, such as:<br>

Encountering these situations<br>
(this is a self-defined enum class, mainly for signature or token expiration situations, you can define it yourself)<br>

 ```
 State.FAIL_SIGNATURE_ERROR.value
 State.FAIL_SIGNATURE_EXPIRED.value
 State.FAIL_KEY_TOKEN_EXPIRED.value
 ```
 will execute the API to re-acquire the token, save the desired data, and then return the corresponding data, then return the original error situation to the observer.


 **3. At this point, using retryWhen**

 Because an error situation was returned earlier,<br>
 it will trigger retryWhen,<br>
 here I also defined an Observable for the number of retries and the interval in seconds for retries,<br>
 it will determine how many seconds to retry once based on the input Int in case of failure.<br>

The most important thing is, the function type used earlier,<br>
plays an important role here, because this is where you write the method you expect to execute after the request fails:<br>
```
resetRequest.invoke().delay(delayInSeconds, TimeUnit.SECONDS)
```
<br>

Since the return type of the extension is defined as Observable<T> here,<br>
it can be reconnected to the original subscription, which I think is quite convenient,<br>
for your reference.<br>

Finally,<br>
you can define specific error constants and handling processes based on other situations,<br>
and add corresponding handling logic in this extension function.<br>
No matter what situation you encounter,<br>
as long as you define the corresponding error constants and handling processes in advance,<br>
this extension function can help you execute the corresponding handling.<br>
You can extend this function according to your needs,<br>
making it more suitable for your application scenarios.<br>
