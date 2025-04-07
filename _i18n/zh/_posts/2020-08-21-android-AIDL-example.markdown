---
layout: post
title: "[App開發]用 AIDL 來跨進程開發Android app吧 ！"
date: 2020-08-21 09:41:01 +0800
image: cover/android-aidl-1.png
permalink: /android/aidl
tags: [Android]
categories: Android教學
excerpt: "身為一個App工程師，總會被要求實現需求，當你遇到要跨進程在app之間溝通，該怎麼做呢？"

---

<h1 class="c-border-main-title">AIDL介紹</h1>
<div class="c-border-content-title-4">什麼是AIDL呢？<br></div><br>

有時候你想要透過A進程去跟B進程溝通<br>
這時候你就可以透過AIDL來跟不同進程溝通<br><br>
<div class="c-border-content-title-4">例如:<br></div><br>

1.可以用在兩個app間溝通<br>
2.可以用在app跟原生kernel層溝通 (但是必需自build AOSP 把寫好的應用放進底層)<br>
3.或是app跟service溝通...等等<br>

另外AIDL是常用IPC方案<br>
我也有寫另一篇整理常用的IPC方案<br>
有需要可以參考：<br>

<div class="card py-4 h-100">
    <div class="card-body text-center">
        <i class="fas fa-map-marked-alt text-primary mb-2"></i>
        <h4 class="text-uppercase m-0 " >IPC 跨進程方案分享</h4>
        <hr class="my-4 mx-auto" />
        <div style="font-size: 1.5em;">

          <a href="{{site.baseurl}}/2022/04/15/android-ipc-note/">

            <img src="/images/cover/android-ipc-method-share-1.png" alt="Cover" width="30%" ><br>
            [Problem Solved Series]Android IPC 跨進程方案分享
          </a>
        </div>
    </div>
</div>
<br>
<h1 class="c-border-main-title">AIDL實作</h1>

<div class="c-border-content-title-1">步驟1 : 先定義AIDL介面 <br></div>

* 這步驟你可以隨意的在筆記本裡面寫 <br>
或者你可以用IDE去寫 （這裡我是用Android studio）<br>
只要是可以打字的地方都可以寫 <br><br>
接著定義你AIDL對外有什麼接口 <br>
 例如你想要有個功能是取得所有更新列表  <br>
 就可以創一個類似 getUpdateList的接口 <br>
 想要取得狀態就寫一個getStatus接口 <br>
 以此類推... <br>
![1.png](/images/aidl/1.png)<br>


* 最後你要把副檔名存成.aidl就可以 <br>
 ![11.png](/images/aidl/11.png)<br>

<div class="c-border-content-title-1">步驟2 : 實作Service<br></div>

* 完成上面的AIDL介面後<br>
需要build一下<br>
可以用cli<br>
`./gradle build` 去build<br>
或者使用Android studio裡面的 `Build> Rebuild Project` 去讓他build一下<br>
![12.png](/images/aidl/12.png)<br>


* build完後會產生一個同樣檔名的.java<br>
![13.png](/images/aidl/13.png)<br>

* 通常在Android app 要呼叫AIDL接口會用Service去接<br>
所以先繼承Service 並override該有的週期方法<br>
範例如下：<br>
<script src="https://gist.github.com/waitzShigoto/7f7cbef82fc784a8d44544bf5cbaf55b.js"></script><br>

* 接著在同一個service加入剛剛build完後產生的AIDL實例 ：<br>
<script src="https://gist.github.com/waitzShigoto/d7bdc13de183beebcda4add00ecf8458.js"></script>

<div class="c-border-content-title-4">小技巧: AIDL 介面 與 Service package path 需一樣 否則無法編譯成功</div>

下方三張圖為示意圖：<br>

![3.png](/images/aidl/3.png)<br><br>
![4.png](/images/aidl/4.png)<br><br>
![5.png](/images/aidl/5.png)<br><br>
<div class="c-border-content-title-1">步驟3 : 加入Service至Manifest.xml<br></div>
把`步驟2`的Service加入AndroidManifest.xml內並新增action<br>
<script src="https://gist.github.com/waitzShigoto/873470afaa8317265c25ac02fc8832b3.js"></script>

這邊的action是對應到之後`步驟5` 要用ServiceConnection去綁定的action<br>
`action android:name="elegant.access.service.IRSSmartService"`

<div class="c-border-content-title-1">步驟4 : 實作Intent bind service<br></div>
* 這邊之後就可以開始把你的AIDL介面 + 實作建立AIDL實例化的service<br>
給其他跨process的app或別層使用<br>
在Android內的話直接在你要的地方用Intent啟動就行了<br>
詳細參考`5~7步驟`<br>


<div class="c-border-content-title-1">(選擇性) 步驟5-其他用例<br></div>
* 如果你是要在應用層用你的AIDL Service可以參考下面的code<br>
`用Intent去bind的AIDL service就好了`<br>
<script src="https://gist.github.com/waitzShigoto/ab90b84bcdc96f98ec498045b68c57e5.js"></script>
之後你就可以直接操作裡面已經實作好的方法<br>
例如：<br>
```
eleAcesAPI.getUpdateList();
```
* 那如果是要用在`非應用層`<br>
這邊`分享個經驗`：之前遇過有專案要求應用層定義AIDL介面就好<br>
實際使用要放在framework kernal層 (剛好該專案是自己做OTA)<br>
所以如果你也是<br>
只要開AIDL介面就好<br>
這樣可以只做到`步驟3`就完成了<br>
之後再看你要實作的層級是否支援AIDL<br>
例如:我遇到的專案是自己做OTA<br>
能自定義binder<br>
所以就用C#寫了一個接了AIDL介面的service<br>
之後再在app層綁定就好<br>
這裡是用反射的方法<br>
去綁定kernel寫好的service<br>
綁定範例：<br>
<script src="https://gist.github.com/waitzShigoto/364a1289647d7676a7b51e35d21c4899.js"></script>

<div class="c-border-content-title-4">注意：這邊是你有開發底層的需求才用這個，如果是app實作AIDL就用上一個的就好</div>
<div class="c-border-content-title-4">注意2：Android官方在Android 9之後有更新新的反射政策，不確定這個還可否使用，因為那時候該機型OTA目標版本是5~8，可自行實測</div><br>


<div class="c-border-content-title-1">(選擇性) 步驟6-其他用例:AIDL支援類型有限</div><br>

* 這邊是因為專案有些特定需求的回傳值<br>
例如Calendar<br>
但因為AIDL原本就沒支援這個類型<br>
所以我就再定義一層抽象層<br>
那我實作的時候只要記得在中間加邏輯就好<br>
![9.png](/images/aidl/9.png)

<div class="c-border-content-title-1">(選擇性) 步驟7-其他用例:AIDL包成Jar檔<br></div>
*  那時候遇到需求是透過groovy語法直接build一個jar檔<br>
讓別的process直接套就能使用<br>
可以這樣做：<br>
![10.png](/images/aidl/10.png)
