---
layout: post
title: "Implementation Guide: How to Successfully Integrate Huawei HMS Core 4.0 SDK in an Android App"
date: 2020-09-15 10:06:32 +0800
image: cover/android-hms-sdk-1.png
permalink: /android/huawei_map
tags: [Android]
categories: Android教學
---

<h1 class="c-border-main-title">Introduction</h1>
* In past projects, there have been<br>
requests from clients to integrate the Huawei SDK.<br>
I happened to have made some notes before,<br>
so I organized them now<br>
to share with everyone!<br>
Overall development<br>
is actually quite similar to Google GMS XDD <br>

<h1 class="c-border-main-title">Integrating HMS</h1>


<div class="c-border-content-title-1">Step 1: Register an Account</div>
* First, you need to go to the [Huawei Developer Console](https://developer.huawei.com/consumer/cn) to register and join as a verified member.<br>
  For detailed instructions, refer to [Account Registration and Verification](https://developer.huawei.com/consumer/cn/devservice/doc/20300).

<div class="c-border-content-title-1">Step 2: Create an Application in the Console</div>
 * This step is quite similar to other platforms.<br>
 You can create it through the user interface.<br>
 ![1.png](/images/huawei/1.png)<br>
 Next, you need to enable the API permissions you want to use.<br>
 This is also done in the console.<br>
 ![2.png](/images/huawei/2.png)<br>

<div class="c-border-content-title-1">Step 3: Generate a Signature</div>
 * This step is quite similar to Google.<br>
 You can use the tool within AS to generate it directly.<br>
 ![3.png](/images/huawei/3.png)<br>
 After generating, use the command<br>
 `keytool -list -v -keystore <keystore-file>`<br>
 keystore-file: Here you need to input the certificate path.<br>
 Then paste the generated Sha256 hash into the configuration of the app you just created in the Huawei console.<br><br>


<div class="c-border-content-title-1">Step 4: Configure the Signature</div>
  * After generating the signature,<br>
  you can download `agconnect-services.json` from the Huawei console.<br>
  Then start adding it to your project.<br>

  * This image shows the configuration of the project at that time.<br>
  Because the product requirement was<br>
  to be able to build different vendor configurations when building the project,<br>
  and also to support Google services if someone has installed GMS on their Huawei phone,<br>
  the configuration is as shown below.<br><br>
  ![4.png](/images/huawei/4.png)<br><br>
  Of course, during actual project development,<br>
  it is better to communicate with your team members.<br>

  * Because many function names in `HMS` are the `same names` as in `GMS` XD,<br>
  it is better to `distinguish` them clearly during development.<br>
  Whether starting from `configuration` or `code separation`,<br>
  otherwise, it will be very troublesome to maintain later.<br>
  If the coupling is too high and difficult to separate, then...<br>

<div class="c-border-content-title-1">Step 5: Add Project Configuration</div>
  * Next, add it to the Android project.<br>
    Configure `maven {url 'https://developer.huawei.com/repo/'}` in the build gradle.
    <script src="https://gist.github.com/KuanChunChen/1ca47854f0a1eb3c94565c3512725050.js"></script>
    <br>

  * Then import the required HMS kit into the project.<br>
    Here, taking HMS map as an example.<br>
    <script src="https://gist.github.com/KuanChunChen/631f00b79f69c96bd2a226c58eff5199.js"></script>
    `Now you can officially start development!`

<div class="c-border-content-title-4">Sharing Small Differences Encountered While Developing for Huawei</div>

 * Small differences between Hms and Gms maps<br>
   As mentioned earlier, the function names of HMS and GMS are extremely similar<br>
   So if you've used GMS before, you should be able to get the hang of it quickly (？<br>
   However, I happened to be `luckier`<br>
   During development, I encountered<br>
   some slight differences<br>
   <div align="center">
     <img src="/images/huawei/6.png" alt="Cover" width="30%" >
     <img src="/images/huawei/7.png" alt="Cover" width="30%" >
   </div>
   When setting the polyline, the thickness set by the same constant was different<br>
   For example, `googlePolylineOption.width(5)` vs `huaweiPolylineOption.width(5)`
   The actual effect was different<br>

   ### So not all logic can be directly applied XDD It's best to check!!

   Finally, it had to be changed like this to be the same<br>
   ![5.png](/images/huawei/5.png)<br><br>

 * Small differences in `push notifications`<br>
   Mainly the `subclass inheritance` is different<br>
   Other than that, the usage is the same<br>
   But I'm sharing this because<br>
   when developing other Huawei features before<br>
   the method and class names were almost identical XD<br>
   ![8.png](/images/huawei/8.png)<br><br>


<h1 class="c-border-main-title">To Summarize</h1>

 * Apart from the package names being slightly different<br>
 and a few functions being slightly different<br>
 overall, the usage of the SDKs from both companies is not very different<br>
