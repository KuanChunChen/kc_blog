---
layout: post
title: "Create Your Own LINE Chatbot! A Beginner's Guide to Building with Kotlin Ktor"
date: 2021-12-07 17:36:12 +0800
image: cover/kotlin-line-bot-ktor-server.png
tags: [Ktor]
categories: Ktor
excerpt: "Create your own LINE chatbot! Learn from scratch how to build using Kotlin Ktor, making it easy to get started. This course will guide you through using the Kotlin Ktor framework to create a simple chatbot."
---

<div class="c-border-main-title-2">Introduction</div>

Due to my love for the Kotlin language, I spent some time researching the Ktor library,<br>
and in my spare time, I created a small side project.<br>
This project is a server written in Ktor, used to connect to a LINE chatbot.<br>

This article aims to set up a custom server using Kotlin Ktor,<br>
which can connect to a LINE chatbot to achieve automatic message replies.<br>

<div class="c-border-content-title-4">Final Server Running Result</div>
 <div align="center">
   <img src="/images/linebot/server_run.png" width="70%"/>
 </div>

<div class="c-border-content-title-4">Final LINE Bot Reply Result</div>
  <b>Here we demonstrate how to use Kotlin to connect some APIs and web crawlers to get the price of trading pairs and images from the web.</b>
  <div align="center">
    <img src="/images/linebot/linebot01.png" width="45%"/>
    <img src="/images/linebot/linebot02.png" width="45%"/>
  </div><br>

<div class="table_container">
  This article introduces how to easily set up your own LINE chatbot<br>
  based on a Kotlin Ktor server.<br>
  Ktor is a simple and easy-to-use framework,<br>
  which can be used to build different applications.<br>
  Its scalability and high performance make it a good choice.<br><br>

  Through the introduction in this article,<br>
  you will learn how to build your server using Kotlin and Ktor,<br>
  and connect to a LINE chatbot.<br><br>

  We will set up the environment through Gradle and reference some necessary libraries.<br>

</div><br>

<div class="c-border-main-title-2">Implementation Method</div>
  First, create a Ktor project.<br>
  I used the Ktor plugin to create it directly.<br>
  Many configuration files are already set up for you.<br>
  You just need to understand what each one does.<br>

  <div align="center">
    <img src="/images/linebot/ktor01.png" width="65%"/>
  </div><br>
  First,<br>
  create an application.conf file in the root directory,<br>
  mainly used to set Ktor-related parameters,<br>
  such as the port number and the package path of the main program's Application.module.<br>

  <script src="https://gist.github.com/KuanChunChen/ba0e0d520e9166fe6c45b16d2217fc48.js"></script>  <br>
  Next, create an application.kt file<br>
  ```Kotlin
  fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

  ```
  This code mainly describes that Ktor uses Netty's engine,<br>
  so it needs to point to main(),<br>
  but Ktor also supports other frameworks,<br>
  which I haven't had time to research yet. I might try them in the future.<br>

  ```kotlin
  fun Application.module() {...}
  ```
  This is the server block that the .conf file points to for execution.<br>
  It is written using Kotlin's extension.<br>

<script src="https://gist.github.com/KuanChunChen/c88cf59e7c6e1e2599cfe52a107278df.js"></script>
Below is an example of implementation,<br>
where we add the relevant code to enable Ktor to support Gson for parsing JSON.<br>
The purpose is to allow the HTTP server to use Gson to parse data when receiving it.<br>
```Kotlin
install(ContentNegotiation) {
        gson {
            setPrettyPrinting()
        }
    }
```

You can define some API endpoints here,<br>
such as POST, GET, etc., to allow external users to interact with your server by calling the API.<br>
The example below defines an API endpoint named /callback.<br>

```Kotlin
routing {
      post("/callback") {...}
}
```

This section has covered the basic Ktor syntax,<br>
next, you can consider how to deploy your Ktor Server online.<br><br>

You can choose to use third-party server hosting services,<br>
or you can apply for a fixed IP + Domain Name to set up your own server.<br>
Alternatively, you can do what I did,<br>
I used ngrok, which provides a free 2-hour session,<br>
and generates a fixed Domain Name that you can provide to external users to connect.<br>
If you just want to try it out yourself or let friends play around, you can use this method.<br>

<div class="c-border-content-title-4">Brief Introduction to ngrok Usage</div>

Using ngrok is very simple,<br>
just download the ngrok CLI and add it to your environment variables,<br>
then start the server, and it will generate HTTP and HTTPS connection URLs.<br>
You can modify the port to connect with your Ktor server.<br><br>

Once installed, simply enter the following command in the terminal
(the port can be adjusted as needed)
```
ngrok http 8080
```

<div class="c-border-main-title-2">LINE Bot Signature Verification</div>

According to the Line Developer documentation,<br>
when you receive a request from Line's official server,<br>
you must ensure that the received header x-line-signature is verified with the request body and channel secret using HmacSHA256.<br>
Only when they match,<br>
can you confirm that it is Line's official server calling your server,<br>
to prevent malicious attacks on your server.<br>

Here is my Kotlin implementation for signature verification<br>
<script src="https://gist.github.com/KuanChunChen/dab3f90689f9aa887d01c225caadd348.js"></script>

Next, we continue to learn the LINE Developer API,<br>
for example, if you want the LINE bot to automatically reply to messages in the chatroom,<br>
you need to use the following API.<br>
Below is a cURL command for reference,<br>
with cURL, developers can use their preferred language to develop.


```shell
curl -v -X POST https://api.line.me/v2/bot/message/reply \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {channel access token}' \
  -d '{
    "replyToken":"nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
    "messages":[
        {
            "type":"text",
            "text":"Hello, user"
        },
        {
            "type":"text",
            "text":"May I help you?"
        }
    ]
  }'
```

Additionally, if you want to connect to some of your own services or third-party packages,<br>
you can call the package first,<br>
and then reply to the line-bot-server.<br>
The same goes for web scraping,<br>
scrape the data and then call the official API.<br>

For example, I created some commands,<br>
when receiving the corresponding command,<br>
it will perform the related processing.<br>
```Kotlin
enum class TextCommandType(var type: String){
    MESSAGE_PICK_UP("/抽 "),
    MESSAGE_HELP("/help "),
    MESSAGE_PICK_NAME("/pick " ),
    MESSAGE_PRICE_CRYPTO_TRADE_ID("/price " ),
    MESSAGE_NOT_CONTAIN("")
  }
```

<script src="https://gist.github.com/KuanChunChen/ccf9f4c1a07013ff89c0357ef37ecda0.js"></script>

Here is an example,<br>
mainly showing how one of the commands fetches data from a third-party API to get trading pairs.<br><br>

In fact, the implementation of each command is quite similar,<br>
just write the behavior you want to execute under the specified command,<br>
and then return the result.<br>
