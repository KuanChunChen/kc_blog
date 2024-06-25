---
layout: post
title: "[App Development] Use AIDL for Inter-process Communication in Android Apps!"
date: 2020-08-21 09:41:01 +0800
image: cover/android-aidl-1.png
permalink: /android/aidl
tags: [Android]
categories: Android教學
excerpt: "As an app engineer, you will always be required to implement various features. When you encounter the need for inter-process communication between apps, what should you do?"

---

<h1 class="c-border-main-title">Introduction to AIDL</h1>
<div class="c-border-content-title-4">What is AIDL?<br></div><br>

Sometimes you want to communicate from process A to process B.<br>
In this case, you can use AIDL to communicate between different processes.<br><br>
<div class="c-border-content-title-4">For example:<br></div><br>

1. It can be used for communication between two apps.<br>
2. It can be used for communication between an app and the native kernel layer (but you must build AOSP and put the written application into the underlying layer).<br>
3. Or communication between an app and a service... etc.<br>

Additionally, AIDL is a commonly used IPC solution.<br>
I have also written another article summarizing common IPC solutions.<br>
If needed, you can refer to it:<br>

<div class="card py-4 h-100">
    <div class="card-body text-center">
        <i class="fas fa-map-marked-alt text-primary mb-2"></i>
        <h4 class="text-uppercase m-0">IPC Inter-process Communication Solutions</h4>
        <hr class="my-4 mx-auto" />
        <div style="font-size: 1.5em;">

          <a href="{{site.baseurl}}/2022/04/15/android-ipc-note/">

            <img src="/images/cover/android-ipc-method-share-1.png" alt="Cover" width="30%" ><br>
            [Problem Solved Series] Android IPC Inter-process Communication Solutions
          </a>
        </div>
    </div>
</div>
<br>
<h1 class="c-border-main-title">AIDL Implementation</h1>

<div class="c-border-content-title-1">Step 1: Define the AIDL Interface<br></div>

* In this step, you can write freely in a notebook.<br>
Or you can use an IDE to write (here I am using Android Studio).<br>
As long as it is a place where you can type, you can write.<br><br>
Next, define what interfaces your AIDL will expose.<br>
For example, if you want a function to get all update lists,<br>
you can create an interface similar to getUpdateList.<br>
If you want to get the status, write a getStatus interface.<br>
And so on...<br>
![1.png](/images/aidl/1.png)<br>

* Finally, you need to save the file with the extension .aidl.<br>
![11.png](/images/aidl/11.png)<br>

<div class="c-border-content-title-1">Step 2: Implement the Service<br></div>

* After completing the above AIDL interface,<br>
you need to build it.<br>
You can use the CLI<br>
`./gradle build` to build it,<br>
or use the `Build > Rebuild Project` option in Android Studio to build it.<br>
![12.png](/images/aidl/12.png)<br>

* After building, a .java file with the same name will be generated.<br>
![13.png](/images/aidl/13.png)<br>

* Usually, in an Android app, you will use a Service to call the AIDL interface.<br>
So first, extend the Service and override the necessary lifecycle methods.<br>
An example is as follows:<br>
<script src="https://gist.github.com/KuanChunChen/7f7cbef82fc784a8d44544bf5cbaf55b.js"></script><br>

* Next, add the AIDL instance generated after the build to the same service:<br>
<script src="https://gist.github.com/KuanChunChen/d7bdc13de183beebcda4add00ecf8458.js"></script>

<div class="c-border-content-title-4">Tip: The AIDL interface and Service package path must be the same, otherwise it will not compile successfully</div>

The three images below are illustrative:<br>

![3.png](/images/aidl/3.png)<br><br>
![4.png](/images/aidl/4.png)<br><br>
![5.png](/images/aidl/5.png)<br><br>
<div class="c-border-content-title-1">Step 3: Add Service to Manifest.xml<br></div>
Add the Service from `Step 2` to AndroidManifest.xml and add an action<br>
<script src="https://gist.github.com/KuanChunChen/873470afaa8317265c25ac02fc8832b3.js"></script>

The action here corresponds to the action that will be used in `Step 5` to bind the ServiceConnection<br>
`action android:name="elegant.access.service.IRSSmartService"`

<div class="c-border-content-title-1">Step 4: Implement Intent bind service<br></div>
* Here you can start to add your AIDL interface + implement the service that instantiates AIDL<br>
for other cross-process apps or different layers to use<br>
In Android, you can directly start it with an Intent wherever you need<br>
Refer to `Steps 5~7` for details<br>

<div class="c-border-content-title-1">(Optional) Step 5 - Other Use Cases<br></div>
* If you want to use your AIDL Service at the application layer, you can refer to the code below<br>
`Just use Intent to bind the AIDL service`<br>
<script src="https://gist.github.com/KuanChunChen/ab90b84bcdc96f98ec498045b68c57e5.js"></script>
Then you can directly operate the methods already implemented inside<br>
For example:<br>
```
eleAcesAPI.getUpdateList();
```
* If you want to use it in the `non-application layer`<br>
Here is a `shared experience`: previously encountered a project that required defining the AIDL interface at the application layer<br>
but the actual use was to be placed in the framework kernel layer (coincidentally, the project was doing OTA)<br>
So if you are also<br>
just need to open the AIDL interface<br>
This way, you can complete it by just doing `Step 3`<br>
Then see if the layer you want to implement supports AIDL<br>
For example: in my encountered project, we were doing OTA ourselves<br>
able to define a custom binder<br>
So I wrote a service that connected to the AIDL interface using C#<br>
Then just bind it at the app layer<br>
Here, we used reflection to bind the service written in the kernel<br>
Binding example:<br>
<script src="https://gist.github.com/KuanChunChen/364a1289647d7676a7b51e35d21c4899.js"></script>

<div class="c-border-content-title-4">Note: Use this only if you have the need to develop at the lower layer. If it's for app implementation of AIDL, just use the previous one</div>
<div class="c-border-content-title-4">Note 2: Android officially updated the reflection policy after Android 9, not sure if this can still be used, because at that time the target version for the OTA model was 5~8, you can test it yourself</div><br>

<div class="c-border-content-title-1">(Optional) Step 6 - Other Use Cases: Limited AIDL Support Types</div><br>

* Here, because the project had some specific return value requirements<br>
such as Calendar<br>
but AIDL originally did not support this type<br>
so I defined another abstract layer<br>
When I implement it, I just need to remember to add logic in the middle<br>
![9.png](/images/aidl/9.png)

<div class="c-border-content-title-1">(Optional) Step 7 - Other Use Cases: Package AIDL into a Jar File<br></div>
* At that time, the requirement was to directly build a jar file using groovy syntax<br>
so that other processes could use it directly<br>
You can do it like this:<br>
![10.png](/images/aidl/10.png)
