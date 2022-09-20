---
layout: post
title: "[Android][2020]Android AIDL 實作範例分享！"
date: 2020-08-21 09:41:01 +0800
image: cover/android-photo.jpg
tags: [Android,AIDL]
categories: Android
---

* 步驟1 : 先定義AIDL介面 <br>
![1.png](/images/aidl/1.png)

* 步驟2 : 實作Service
並且在build module後<br>
將其產生的AIDL 實例 加入<br>
如圖所示：<br>
![2.png](/images/aidl/2.png)
* 提示: AIDL 介面 與 Service package path 需一樣 否則無法編譯成功<br>
下方三張圖為示意圖：<br>
![3.png](/images/aidl/3.png)<br><br>
![4.png](/images/aidl/4.png)<br><br>
![5.png](/images/aidl/5.png)<br><br>
* 步驟3 : 加入Service至Manifest.xml<br>
![6.png](/images/aidl/6.png)
* 步驟4 : 實作Intent bind service<br>
這邊之後就可以開始把你的AIDL介面<br>
給其他跨process的app或別層使用<br>
我這邊是拉出一個類去實作這塊<br>
後面再單獨打包<br>
讓其他端直接套了就能用<br>
![7.png](/images/aidl/7.png)
* 步驟5 : 這步主要就是去實作你的介面內的function<br>
如果你是要實作在應用層可以參考下圖<br>
![8.png](/images/aidl/8.png)<br><br>
這邊`分享個經驗`：之前遇過有專案要求應用層定義AIDL介面就好<br>
實作要放在framework kernal層 (剛好該專案是自己做OTA)<br>
所以如果你也是<br>
只要開介面 + 做service出來就好 你考慮只做到步驟3<br>
或者看你專案的需求而定<br>

* 步驟6(選擇性) : 這步開始就不一定需要實作了<br>
這邊是因為專案有些特定需求的回傳值<br>
例如Calendar<br>
但因為AIDL原本就沒支援這個類型<br>
所以我就再定義一層抽象層<br>
那我實作的時候只要記得在中間加邏輯就好<br>
![9.png](/images/aidl/9.png)
* 步驟7(選擇性) : 這邊就是前面步驟4說的<br>
那時候遇到是透過groovy語法直接build一個jar檔<br>
讓別的process使用<br>
![10.png](/images/aidl/10.png)
