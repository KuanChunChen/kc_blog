---
layout: post
title: "[Android][2020][Samsung][Problem Solved Series] 導入Huawei HMS Core 4.0 心得分享 "
date: 2020-09-15 10:06:32 +0800
image: cover/huawei_map.png
tags: [Android,Debug,Samsung,knox]
categories: Debug
---

過去在專案上有遇過<br>
有廠商要求導入Huawei SDK的經驗<br>
剛好以前有做一些筆記<br>
現在把他整理出來<br>
分享給大家！<br>

整體開發下來<br>
其實就是跟Google gms滿像的 XDD <br>



導入HMS
---

 * 第一步：
 首先你必須去[華為後台](https://developer.huawei.com/consumer/cn)註冊加入實名會員<br>
 具體方法可參考[帳號註冊認證](https://developer.huawei.com/consumer/cn/devservice/doc/20300)。

 * 第二步：
 在後台創建應用<br>
 這邊就是跟其他平台滿像的<br>
 有使用者介面操作一下即可創建<br>
 ![1.png](/images/huawei/1.png)<br>
 接著就需要去開啟你要用的API的權限<br>
 也是在後台打開<br>
 ![2.png](/images/huawei/2.png)<br>

 * 第三步：
 生成簽名<br>
 這邊跟google滿像的<br>
 可以用AS內的tool直接生成<br>
 ![3.png](/images/huawei/3.png)<br>
 產生後使用指令<br>
 `keytool -list -v -keystore <keystore-file>`<br>
 keystore-file : 這邊是需要輸入證書path<br>
 之後把產生的Sha256 hash貼到華為後台你剛創建的app的配置內<br><br>


  * 第四步：
    前面配置好簽名之後<br>
    就可以在後台下載 agconnect-services.json<br>
    可以開始加入到你的專案中<br><br>

    這個圖是分享一下當時專案的配置<br>
    因為那時候產品需求是<br>
    希望在build project的時候就能先build進不同產商的配置<br>
    然後亦希望在huawei內如果有人的手機自行安裝了gms<br>
    又要可以支援google服務<br>
    所以配置如下圖<br><br>
    ![4.png](/images/huawei/4.png)<br><br>
    當然實際專案開發時<br>
    可以跟你們的team member溝通會比較好<br>

    因為hms sdk 很多function name 都跟gms sdk 內都是`一樣的名字`XD<br>
    所以開發上就要好好`分清楚`會比較好<br>
    不管從`配置`著手 或 `code分離`開始<br>
    不然很容易後期維護上會很麻煩<br>
    耦合太高又很難拆的話就...<br>


  * 第五步：<br>
    再來就是加入android專案lib implementation或其他import的配置<br>
    配置maven
    <script src="https://gist.github.com/KuanChunChen/1ca47854f0a1eb3c94565c3512725050.js"></script>
    <br>
    再來就是加入你要用的lib kit<br>
    這邊就是他把每個功能切出來再不同的lib內<br>
    可能叫 xxx kit 如地圖就是 Map kit<br>
    所以以地圖為例就是加入：<br>
    <script src="https://gist.github.com/KuanChunChen/631f00b79f69c96bd2a226c58eff5199.js"></script>
    `這樣可以正式開始開發了！`

開發huawei遇到的小差異分享
---
 * Hms 與 Gms 兩家地圖的小差異

   前面說到HMS與GMS的function name 極度相似<br>
   所以如果用過gms的人應該很快能上手(？<br>
   不過我剛好運氣比較好<br>
   在開發時有遇到<br>
   稍微不同的地方<br>
   <div align="center">
     <img src="/images/huawei/6.png" alt="Cover" width="30%" >
     <img src="/images/huawei/7.png" alt="Cover" width="30%" >
   </div>
   就是在設置 polyline的時候同樣的常數設置出來的粗度不同啊<br>
   如 `googlePolylineOption.width(5)` vs `huaweiPolylineOption.width(5)`
   實測效果不一樣<br>

   ### 所以也不是全部邏輯能直接套啊XDD 最好還是檢查一下!!

   最後改成這樣才能一樣<br>
   ![5.png](/images/huawei/5.png)<br><br>

 * `推播`小差異<br>
   主要就是`繼承子類`不同<br>
   其他用起來也一樣<br>
   不過我會分享是因為<br>
   之前開發別的華為功能<br>
   幾乎是方法、類的名稱幾乎一模一樣XD<br>
   ![8.png](/images/huawei/8.png)<br><br>


## 總結一下：
 整體上兩家SDK用法沒有差到很多<br>
 就是少部分function不太一樣<br>
 大多數用起來<br>
 其實就是在學google<br>
 可能主要是差在server吧XD<br>
