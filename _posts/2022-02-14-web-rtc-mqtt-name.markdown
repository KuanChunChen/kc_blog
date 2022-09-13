---
layout: post
title: "[MacOS][Enviroment][2022]WebRtc & Mqtt 名詞解釋筆記"
date: 2022-02-14 13:50:12 +0800
image: others/mqtt.png
tags: [know-how]
categories: KnowHow
---

### 0.前言 ：
  - 因為在`Android工作需求`上遇到，<br>
需串接Mqtt與webRtc，<br>
所以大概了解一些名詞的意思，<br>
不過這段主要還是由後端完成，<br>
這邊身為Android工程師大概就是了解一下，<br>
並且紀錄，未來有遇到可以再快速回憶下。<br>

### 1. MQTT 筆記：
  - <a> QoS (Quality of Service)</a> : 訊息傳送服務的quality，有三種模式
    * <a>At most once</a>  : 最多一次，容易丟包，適合不在意是否收到data的環境，因下次pulish很快會被推送

    * <a>At least once</a> : 至少一次，保證包一定會送到，只是可能收到重複的包

    * <a>Exactly once</a>  : 確定一次，確定只會送到一次包，只是收動重複包或包遺失的狀況，就會有錯誤處理，資源消耗更多

    * <a> MQTT Header</a> : 固定2bytes，消耗更少

    * <a>MQTT Session</a>：當MQTT Client 連上server時，可用 'Clean Session' flag 控制其state<br>
      a. <a>'Clean Session' is 0</a> : 屬於persistent session，當client斷連時，session仍回保留直到其timeout<br>
      b. <a>'Clean Session' is 1</a> : 屬於transient session，當client斷連即摧毀session<br>

    * <a>MQTT CONNECT Keep Alive </a>: MQTT連線時，攜帶一個Keep Alive的字節來代表keep alive時間，當沒有任何傳輸響應時，可帶PINGREQ去維持狀態，server則以PINGRESP回應。<br>
     當Keep alive timeout則關閉連線(通常狀態下keep alive timeout*1.5為timeout時間，主要看server設定)。
    * <a>LWT (last will and testament)</a> : 一種遺囑的概念，當MQTT client在不正常狀態下斷線，像是斷線時沒有呼叫
     disconnect，這時server會puslish will message過去。
    * <a>MQTT retained message </a> : 可以透過 RETAIN flag去設定 retained message ，retained message 會存在
     broker，並且會傳給有subscribe這個topic的人，且一個topic只能有一個retained message


### 2. WebRtc相關：

  - 了解以下名詞：
      * <a>Signaling</a> : 用來交換設備與設備之間的metadata或傳遞資訊，常用的像是SDP，查看網路資料說WebRTC1.0為保留
      Signaling的彈性，沒有特別強制規範其定義 ([可參考此篇](https://ithelp.ithome.com.tw/articles/10267612))

      * <a> SDP (Session Description Protocol)</a> : Signaling server 在通訊時攜帶的一種資料規範，制定了指定字母代表某種資訊，如v為protocol version、s為session name、p為phone number...等

      * <a> STUN (Session Traversal Utilities for NAT) </a> : 一種支持NAT的網路協定，其中可以透過STUN得到可用的資料([可參考此篇](https://www.netadmin.com.tw/netadmin/zh-tw/technology/D790BCA2F14F46B4A02EAAF008577963))

      例如：取得公有IP(實際上真實IP，非NAT下私有IP)、port
      * <a> TURN (Traversal Using Relay NAT) </a> : 一種支持NAT的網路協定，其特色：<br>
         a. 資料傳輸是透過server，消耗的是server的資源<br>
         b. 確保所有呼叫能在整個環境中運行<br>
         c. 如果通訊過程中出現錯誤，可提供fallback<br>

      * <a> ICE (Interactive Connectivity Establishment) </a> : 一種針對STUN & TURN 來規範其通訊標準
      特色：會試圖找出server之間通訊的最佳距離
