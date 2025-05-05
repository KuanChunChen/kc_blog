---
layout: post
title: "Compose Multiplatform in Action: Running CMP Projects on Android and iOS Simulators"
date: 2024-08-18 17:15:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-4
categories: ComposeMultiplatform
excerpt: "This series focuses on Compose Multiplatform in Action: Developing Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform Android and iOS app development, and discuss findings and insights in the final days."
---

<div class="c-border-main-title-2">Introduction</div>

`Compose Multiplatform (CMP)`<br>
Yesterday we just set up our CMP project<br>

If you've successfully imported the project into your IDE<br>
you should see a folder structure similar to this<br>
<img src="/images/compose/032.png" alt="Cover" width="50%" /><br />

Now we can try compiling to see if it works<br>
If compilation is `successful`<br>
you'll see something like the screen below<br>
with your app running in the simulator<br>
and a success message in the bottom right corner<br>
<img src="/images/compose/033.png" alt="Cover" width="65%" /><br />


<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">Setting Up an Android Emulator</div>
If you created your project using yesterday's method: [Creating a CMP Project with Wizard]({{site.baseurl}}/compose-multiplatform-day-3)<br>
then all the `basic project configurations have been set up for you`<br>

You just need to make sure your system environment from Day 2 <a href="{{site.baseurl}}/compose-multiplatform-day-2">Setting Up the CMP Environment</a><br>
is properly installed<br>
including JDK, Kotlin, etc.<br>
<img src="/images/compose/034.png" alt="Cover" width="50%" /><br />

Next, to simulate on your computer<br>
you'll need to create an Android emulator<br>
Click on `Tools > Device Manager` in the top system bar<br>

<img src="/images/compose/035.png" alt="Cover" width="35%" /><br />

The `Device Manager` window will appear on the right<br>
<img src="/images/compose/036.png" alt="Cover" width="50%" /><br />

Click the `+` at the top and select `Create Virtual Device`<br>
<img src="/images/compose/037.png" alt="Cover" width="50%" /><br />

A window will appear allowing you to choose the type of `Android emulator` you want to create<br>
including Phone, Tablet, TV, Watch, Automotive, etc.<br>
Since Android Studio is primarily maintained by `Google`<br>
it provides Android Phone `AVDs (Android Virtual Devices)` with Google Pixel OS for you to download<br>
Of course, you can also download the `Pixel AVD images` from the Android Developer website<br>
but Google has conveniently integrated them into the IDE<br>

<img src="/images/compose/038.png" alt="Cover" width="65%" /><br />

Select your desired Phone and click `Next` in the bottom right<br>
You'll then reach the Android SDK selection screen<br>
Choose the SDK version you want to test with<br>
If you haven't downloaded a particular SDK before<br>
it will appear grayed out with a download icon on the right<br>
Once downloaded, you can select it<br>

After clicking `Next`, you can configure the emulator settings<br>
such as: orientation, network, startup settings, RAM size, SDK size, etc.<br>
Once you're done, click `Finish` in the bottom right<br>
<img src="/images/compose/039.png" alt="Cover" width="65%"/><br/>

<div class="c-border-content-title-1">Building Android Apps through the IDE</div>
Select the emulator you just created in the dropdown menu at the top<br>
and click the `Run project` button (looks like a green play button) to let the IDE build and install the app on the emulator<br>
<img src="/images/compose/040.png" alt="Cover" width="50%"/><br/>

<div class="c-border-main-title-2">Manually Building Android Apps</div>
<div class="c-border-content-title-1">Execute the following command in the terminal to build an APK</div>

>  run `./gradlew :yourComposeAppProjectName:assembleDebug`

`yourComposeAppProjectName` is your project name
`assembleDebug` indicates building a debug version

You can find the `.apk` file in `yourComposeAppProjectName/build/outputs/apk/debug/yourComposeAppProjectName-debug.apk`

<div class="c-border-content-title-1">Manual Installation</div>
There are two methods<br>
1. Drag and drop the APK into the emulator<br>
2. Use a command to install (if using adb on a `real device`, you need to enable developer mode)<br>

```
adb install ../xxx/yourComposeAppProjectName-debug.apk 
```

<div class="c-border-main-title-2">Setting Up an iOS Simulator</div>

Make sure you installed Xcode from Day 2 <a href="{{site.baseurl}}/compose-multiplatform-day-2">Setting Up the CMP Environment</a><br>

At the top of the Android Studio screen, there's a dropdown with an `Android robot` icon<br>
Click to open the dropdown menu<br>
This section contains the `Configurations` set up in your project<br>
which could be `Build Android app`, `Build iOS app` or various `gradle tasks`, etc.<br>
<img src="/images/compose/041.png" alt="Cover" width="50%"/><br/>

If this is your first time running an `iOS app` in `Android Studio`<br>
there might not be a default Build iOS Configuration<br>
So click `Edit Configuration` to set it up<br>
`Click the + in the top left` > `iOS Application`<br>
<img src="/images/compose/042.png" alt="Cover" width="50%"/><br/>

Then, based on your needs<br>
a. Set a name for the task<br>
<br>
b. For Xcode project file, click the folder icon on the far right<br>

c. In the file selector that appears, select the path to the `.xcodeproj` file<br>
(Click on the blue highlighted `.xcodeproj` and then click open)<br>
<img src="/images/compose/043.png" alt="Cover" width="50%"/><br/>
<br>
d. After selecting the .xcodeproj path<br>
the IDE will automatically read the `scheme` and `configuration` inside<br>
Now you just need to select the target `iOS emulator` version and model<br>
<img src="/images/compose/044.png" alt="Cover" width="50%"/><br/>
<br>
e. Change the Build Configuration to the one you just created<br>
and click the `Run button`<br>

<div class="c-border-content-title-1">Building iOS Apps through Xcode</div>
Since CMP creates the iOS project directly in the root folder<br>
you can simply open the `iOSApp` folder in your CMP project using Xcode<br>
and build the iOS app directly through Xcode<br>

<div class="c-border-main-title-2">Conclusion</div>
At this point, you should be able to fully build your CMP project and run it on both Android and iOS simulators<br>
<img src="/images/compose/015.png" alt="Cover" width="50%"/><br/>
Tomorrow, I'd like to introduce<br>
the CMP project structure and some potential issues you might encounter<br> 