---
layout: post
title: "[Android Tutorial] Master Android Device Owner Permissions, Enterprise Management Made Easy!"
date: 2022-04-25 18:19:28 +0800
image: cover/android-device-owner-1.png
tags: [Android,Debug]
categories: Android教學
excerpt: "Want to easily manage enterprise-level Android devices? This article provides a comprehensive guide on requesting and utilizing Android Device Owner permissions."

---

<div class="c-border-main-title-2">Introduction: Exploring Device Owner Permissions</div>

<p style="margin-top: 15px;" class="table_container">
	In this series of articles, I will share the problems I encountered in Android development,<br>
	and the notes on how I solved these problems.<br>
	This article will explore the Device Owner permissions provided in Android, including how to obtain and use these permissions.
</p>

<div class="c-border-main-title-2">Why Become a Device Owner</div>
Have you ever encountered needs that cannot be met by ordinary permissions? What should you do?<br>
For example,<br>
if you need to enforce a specific screen on the device,<br>
or prevent users from uninstalling specific applications, you will need Device Owner permissions.<br>

In short,<br>
Device Owner permissions can help developers achieve needs that cannot be met by ordinary permissions,<br>
but whether you need to use them depends on the specific application scenario.<br><br>

This permission allows you to use the APIs within the DevicePolicyManager provided by Android.<br>
You can refer to the DevicePolicyManager documentation provided by Android to understand which APIs are available.<br>
<a href="https://developer.android.com/reference/android/app/admin/DevicePolicyManager" target="_blank">DevicePolicyManager Documentation</a>

<div class="c-border-main-title-2">How to Become a Device Owner</div>

<div class="c-border-content-title-4">There are several ways to make your Android app a device owner, including the following two methods:</div>

<p style="margin-top: 15px;" class="table_container">
	1. After a Factory Reset, enter the welcome page, click the Welcome text seven times, and use the opened camera to scan the QR Code.<br>
	2. After a Factory Reset, click eight times, and use GMS to scan the QR Code (requires GMS).
</p>

Please note that different manufacturers may adopt different methods.<br>
However, in practice, almost all of them can be used, unless it is a specially customized OTA that might not work.<br><br>
Next, you need to create a QR code scan to implement these two steps.<br>

<p style="margin-top: 15px;" class="table_container">
1. Use the following command apk_download_link to input your apk download URL<br>
<b>curl -s [apk_download_link] | openssl dgst -binary -sha256 | openssl base64 | tr '+/' '-_' | tr -d '='</b><br><br>

2. Use the following JSON format to fill in your values<br>
<b>android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME</b>: Enter the path of your packageName/AdminReceiver<br>
<b>android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_CHECKSUM</b>: Enter the hash code generated in step 1<br>
<b>android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION</b>: Enter your download URL<br>
</p>
<script src="https://gist.github.com/KuanChunChen/8a9376c9f99b70090c2c45a58defdf09.js"></script>

<p style="margin-top: 15px;" class="table_container">
	3. Use the JSON format from step 2 to generate a QR code.<br>
	Afterwards, simply open the QR code scanner on the device after a Factory Reset using one of the two methods mentioned earlier.<br>
	Let the user scan the QR code you generated.<br>
	Once the system is set up,<br>
	the app will automatically install and become the Device Owner.<br><br>

	This method is usually intended for non-developers.<br>
	For example: Developers from various platforms can first upload the APK.<br>
	After obtaining the APK download URL,<br>
	use the steps above to generate the hash code and create the JSON format data, then make the QR code.<br>
	This makes it convenient for non-developers to generate the Device Owner app through UI operations.<br>
</p>

<div class="c-border-content-title-4">Another method: Using adb commands to designate an app as the device owner</div>
  Here, you just need to input the path of your app's Admin Receiver into the command below<br>
  to make the app the device owner.<br>
  `adb shell dpm set-device-owner com.your.package/com.your.package.receivers.AdminReceiver`
   - However, this command has some limitations:<br>
   1. There must not be any GMS account on the current OS.<br>
   This means you need to remove any Google account from the settings that you use for Google services.<br>
   2. Only one user-configured Device Owner can exist in the system. If there is one, you can delete it first and then reset the required app.<br>
   `adb shell dumpsys device_policy`<br>
   This command allows you to check the current device owner status on your OS.

<div class="c-border-main-title-2">How to Remove Device Owner</div>
<div class="c-border-content-title-4">Removing via Command</div><br>
`adb shell dpm remove-active-admin com.your.package/.receivers.AdminReceiver`
 - This command requires:<br>
 Adding `android:testOnly="true"`<br>
 within the `<application>` tag in `AndroidManifest.xml`<br>
 to remove the Device Owner.
 - Apps with device owner permissions<br>
 usually cannot be removed or installed via adb install.<br>
 You can use `-r -f` to force overwrite: `adb install -r -f ../xxx.apk`
 or force remove and then install.

 * Removing via Official API<br>
 Within the device owner app,<br>
 use `clearDeviceOwnerApp` in `DevicePolicyManager` to remove the permissions.<br>

 * Directly Factory Reset the phone<br>
 If none of the above methods work, you can use the ultimate solution: Factory Reset XD

 <div class="c-border-main-title-2">Creating a Device Admin Receiver</div>

* This works in conjunction with Admin permissions.<br>
You need to create an Admin Receiver within the app that will be the Device Owner.<br>
This way, when you use adb to obtain permissions,<br><br>
the subsequent Receiver can be activated.<br>
In other words,<br>
`adb shell dpm remove-active-admin com.your.package/.receivers.AdminReceiver`<br>

* Admin permissions mean:<br>
Adding the necessary Receiver for Admin permissions within the app.<br>
So the user<br>
can also find the `Device Administrators` permissions in the settings and enable it.<br>
However, this is actually `different` from Device Owner permissions.<br>
`Do not confuse the two.`<br>

* For the method, refer to the official documentation: [Documentation](https://developer.android.com/guide/topics/admin/device-admin)<br>
The documentation also mentions some practical examples for reference.<br>
The process is simple and only requires creating<br>
a subclass of `DeviceAdminReceiver`<br>
and adding it to the Manifest.xml.<br>

* Quick steps:
1. Extend a `DeviceAdminReceiver`

```Kotlin
class AdminReceiver : DeviceAdminReceiver() {
    override fun onEnabled(context: Context, intent: Intent) { 
    }

    override fun onDisabled(context: Context, intent: Intent) {
    } 
}
```

2.
Implement the permission declaration in `device_admin.xml` under the path `res/xml`

```xml
<device-admin xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-policies>    
        <limit-password />
        <watch-login />
        <reset-password />
    </uses-policies>
</device-admin>
```

3. Add the first two items to the manifest

```xml
<receiver
    android:name=".MyAdminReceiver"
    android:permission="android.permission.BIND_DEVICE_ADMIN">
    <meta-data
        android:name="android.app.device_admin"
        android:resource="@xml/device_admin" />

    <intent-filter>
        <action android:name="android.app.action.DEVICE_ADMIN_ENABLED" />
    </intent-filter>
</receiver>
``` 

4. Request through code

```kotlin
fun startAskActiveAdmin() {
    if (!isAdminActive) {
        val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
        intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, deviceAdmin)
        this.activity.startActivityForResult(intent, KnoxManager.DEVICE_ADMIN_ADD_RESULT_ENABLE)
    }
}
```

5. Handle the return result

```kotlin
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    if (requestCode == KnoxManager.DEVICE_ADMIN_ADD_RESULT_ENABLE) {
        when (resultCode) {
            RESULT_CANCELED -> {
                logger.debug("RESULT_CANCELED")
            }
            RESULT_OK -> {
                logger.debug("RESULT_OK ")
      
            }
        }
    }
}
```


<div class="c-border-main-title-2">Device Owner Implementation Sharing</div>

Here are some examples encountered in previous implementations<br>
Mainly discussing the concepts and some parts of the code<br>
Personally, I think it's not too difficult to understand<br>
So I won't go into too much detail<br>

* First, you need to get instances of DevicePolicyManager and AdminReceiver<br>
	<script src="https://gist.github.com/KuanChunChen/c12af22551a91a32a6f85cd3da7e3313.js"></script>

* Once you have them, you can call them as needed. The implementation methods are quite similar, so here are just a few examples

	- `Hide App`
	 <script src="https://gist.github.com/KuanChunChen/520157aaceb75c79cda052e10f576a26.js"></script>
	- Add `User Restriction`
	 <script src="https://gist.github.com/KuanChunChen/15286f247a2120b4320b4cf5f678560e.js"></script>

* For more examples, you can refer to Google's [github](https://github.com/googlesamples/android-testdpc) which has sample apps using Device Owner


---
Supplement:<br>
Besides Device Owner<br>
The following command can also modify the configuration of a specified app through adb<br>
`adb shell pm grant com.your.package android.permission.CHANGE_CONFIGURATION`<br>
Or you can directly add it to `AndroidManifest.xml`
However, because its protectLevel on the system is declared as `signature|privileged`
(Now looking at the documentation, `signature|privileged` has been changed to `signatureOrSystem`, with the same effect as before)
At this time, to use this permission to change app configuration, you need to obtain a system signature or have device owner permissions

You can check the official <a href="https://developer.android.com/guide/topics/manifest/permission-element?hl=zh-cn
" target="_blank">permission documentation</a> to understand `signature|privileged`
