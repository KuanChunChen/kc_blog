---
layout: post
title: "[Ktor][Kotlin][2021]Ktor server 架設 line聊天室機器人"
date: 2021-12-07 17:36:12 +0800
image: cover/kotlin-line-bot-ktor-server.png
tags: [Android,Ktor,Kotlin]
categories: Ktor
---


因為自己很喜歡Kotlin這門語言<br>
所以花了一點時間研究<br>
Ktor這個library<br>
而在閒暇時間做了一個小小side project <br>
那就是 :  
#### 基於Ktor寫的server來串接 line 聊天室機器人<br>


### 前言

 本文最終的目的<br>
 就是完成一個能自動回覆訊息的自製server<br>
 而非使用line develop console 介面所設定的<br>
 因為能自己接server的話<br>
 就能自訂一些天馬行空的功能XD<br>

#### 最終server運行結果：

 <div align="center">
   <img src="/images/linebot/server_run.png" width="100%"/>
 </div><br>

這個server透過基於ktor<br>
而ktor又基於kotlin<br>
所以如果有寫過android-kotlin的人會很熟悉<br>
透過build.gradle去設定環境與關聯一些要使用的library<br>
使用時再透過 gradle的cli去run 你寫的ktor server<br>
就會在本地端run你的server 不過目前都只有在本地端<br>
所以後續要架設你的對外url<br>
就能讓外部連線進來了<br>

而一開始不熟悉時<br>
可以到intelliJ plugin下載ktor的插件<br>
可以在創建新專案時<br>
幫你創建最基本的環境<br>
效率高很多<br>

#### 最終linebot回覆結果：

 <div align="center">
   <img src="/images/linebot/linebot01.png" width="45%"/>
   <img src="/images/linebot/linebot02.png" width="45%"/>
 </div><br>

 像是這邊我就隨意串了一些api與爬蟲<br>
 左邊就是查詢交易對的價格<br>
 右邊就是爬蟲去抓指定網路上的圖片<br>
 這些都是透過kotlin去寫<br>
 相當方便<br>


### 實作方法

  首先先創建ktor專案<br>
  我是使用ktor plugin直接幫我創<br>
  很多配置檔案他都幫你建好了<br>
  只需要了解個別在幹嘛即可<br>

  <div align="center">
    <img src="/images/linebot/ktor01.png" width="65%"/>
  </div><br>
  首先在根目錄下創了一個 application.conf檔<br>
  主要是用來設定ktor相關的參數<br>
  如port以及主程式的module指向<br>


  <script src="https://gist.github.com/KuanChunChen/ba0e0d520e9166fe6c45b16d2217fc48.js"></script>  <br>
  接著創建applicaiont.kt檔 <br>
  ```Kotlin
  fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

  ```
  這段主要是講ktor使用了netty的engine所以把它指向main()<br>
  這邊好像也有支援其他的框架<br>
  不過我還沒時間研究<br>
  之後有時間再來玩玩看<br>

  ```kotlin
  fun Application.module() {...}
  ```
  這邊則是前面.conf檔裡面指向要執行的server區塊<br>
  用了kotlin的extension去寫<br>

  <script src="https://gist.github.com/KuanChunChen/c88cf59e7c6e1e2599cfe52a107278df.js"></script>
  這邊則是實作時的範例<br>
  其中為了讓ktor支援gson解析json<br>
  所以加入了<br>
  ```Kotlin
  install(ContentNegotiation) {
        gson {
            setPrettyPrinting()
        }
    }
  ```
  這邊主要是用了kotlin receive type去寫<br>
  用途就是讓http server接收時可以用gson去解析資料<br>

  ```Kotlin
  routing {
        post("/callback") {...}
  }
  ```

  而下面roting就是類似轉接站<br>
  你可以寫一些api接口<br>
  如post,get讓外部人去呼叫api<br>
  像上面的例子就是開了一個/callback的api<br>

  至此基本ktor寫法已經結束<br>
  接著就是可以找一些第三方的server服務<br>
  或者也可以申請固定ip+domain name去架設你的ktor server<br>

  像是我的話就是使用ngrok<br>
  可以免費使用2hr的session<br>
  產生固定domain name讓你給外部人來連線<br>

  ```
  ngrok http 8080
  ```
  用法就是上往下載ngrok cli加進環境變數<br>
  然後開啟server<br>
  就會產生http,https的連線網址給你做對外連線<br>
  這邊port就看你跟你的ktor server怎麼設再修改就行<br>

###linebot簽名驗證

  看了下line developer文件<br>
  上面有提到<br>
  你必須確認<br>
  收到的header x-line-signature簽名必須與<br>
  request body 與chaneel secret做HmacSHA256驗證<br>
  確認兩者相同<br>
  才能確定是line 官方呼叫你的server<br>
  避免有心人士攻擊你的server<br>

  這邊附上我kotlin的寫法<br>
  <script src="https://gist.github.com/KuanChunChen/442337c7fa413741c5e15451827e2c74.js"></script>

  之後接收到line呼叫你的api時就能確認是line傳來的了<br>

  再來就是研究line developer的api<br>
  例如要讓linebot自動在聊天室回覆訊息<br>
  就必須要打下面這隻api<br>
  這邊附上他的curl<br>
  可以再轉成自己的語言去寫就行<br>
  相當容易<br>
  當然他也會有限制<br>
  如最多meesages長度只能是5<br>
  就是再看看官方文件就行<br>

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


  另外如果想要接一些自己的service或第三方套件<br>
  就可以先呼叫該套件後<br>
  再回覆給line-bot-server就行<br>
  爬蟲也一樣<br>
  爬完再去呼叫官方api就可<br>

  像我的話就是建立了一些command<br>
  當收到對應的指令<br>
  會去做相關的處理<br>
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

  這邊則是個範例<br>
  主要就是其中一條指令去抓第三方api取得交易對的寫法<br><br>
  大同小異<br>
  只要在指定的指令下<br>
  寫你想做的行為<br>
  再回傳就行<br>
