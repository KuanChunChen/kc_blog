---
layout: post
title: "Android Logcat Capture Techniques Tutorial: Easy Grasp for Non-Developers!"
date: 2022-04-18 16:37:48 +0800
image: cover/android-catch-log-1.png
tags: [Android,Debug]
categories: Debug探討
---

<div class="c-border-main-title-2">Introduction</div>

* Today, I want to share some tips on how to easily capture Android logs!<br>
  During the development process, there are often questions like: "Is there a quick way to capture logs?"<br>
  "How can testers or other non-developers easily capture Android logs?"<br>
  Don't worry! I've compiled some simple and easy-to-understand methods to help you develop and test more efficiently.<br>

<div class="c-border-main-title-2">Quickly Capture Android Logs, Starting with Basic Concepts!</div>

  * To capture Android logs, you can use the logcat tool. However, note that logcat only captures internal system logs.
    - Capture the entire log: Use the command `adb logcat` to capture the entire log.<br>
    You can specify filter conditions to capture only specific logs.<br>
    For detailed filtering methods, refer to [Log Filtering Reference](https://developer.android.com/studio/command-line/logcat#options)
    - Check the size of each buffer: Use the command `adb logcat -g` to check the size of each buffer.
    - View logs in different buffers: Besides the main buffer, there are other buffers you can view,<br>
    such as radio, events, system, etc.<br>
    You can use    
    ```
    [adb] logcat [-b 'buffer name']
    ```
    to view specific logs.<br>
    Here, `<buffer_name>` is the name of the buffer you want to view.<br>
    For example:<br>
    Main buffer log:<br>
    <b>adb logcat -b main</b><br>
    Events buffer log:<br>
    <b>adb logcat -b events</b><br>
    And so on.
    - For differences between buffers, refer to the official documentation: [View Alternative Log Buffers](https://developer.android.com/studio/command-line/logcat#alternativeBuffers)

<br>

<div class="c-border-main-title-2">Android Log Capture Approach</div>
<div class="c-border-content-title-4">Here are some ways to capture Android system logs using adb:</div><br>

<p class ="table_container">
  <i style="text-align: center;">Requires su permissions</i><br>
 1. Extract Kernel panic log: <b style="color:red;">adb pull /sys/fs/pstore/console-ramoops</b><br>
 2. Print Kernel log: <b style="color:red;">adb shell cat /proc/kmsg</b> (captures the current log; calling the same command a second time will display logs starting from the end of the previous capture)<br>
 3. Linux kernel-ring buffer log: <b style="color:red;">adb shell su dmesg</b><br>
 <a href="https://man7.org/linux/man-pages/man1/dmesg.1.html">dmesg Command Reference</a>
</p>

<p class ="table_container">
  <i style="text-align: center;">No permissions required</i><br>
  1. Extract ANR log: <b style="color:red;">adb pull /data/anr</b><br>
</p>

<div class="c-border-content-title-4">Execute adb logcat Command via PC</div>
  - Using `adb logcat` can also capture logs from the currently connected device, such as:
  ```
  adb logcat
  ```

<br>
<div class="c-border-content-title-4">Capture Logs from Android App Using Code</div>
* This approach involves developers writing the log capture functionality within the app so that non-developers can capture logs.
  - Start a process to execute the command:
    For example: `Runtime.getRuntime().exec("logcat -b radio")`

  - Before Android 4.1,<br>
    developers could add the "READ_LOGS" permission in Manifest.xml,<br>
    and with this permission, they could obtain logs that required su permissions.<br>

    However, after Android 4.1,<br>
    Google classified the "READ_LOGS" permission as one of the top ten harmful permissions,<br>
    so it is no longer recommended. You can refer to related Google developer videos.<br>
    [Google Developer Related Video](https://www.youtube.com/watch?v=WDDgoxvQsrQ&t=1323s)

  - Therefore, for Android > 4.1, the permission to capture logs within the app was changed to `“signature|privileged”`,
    which means it requires a `system signature` or
    the app must be placed in the privileged folder `../priv-app` during the build ([Privileged Permission Whitelist](https://source.android.google.cn/devices/tech/config/perms-whitelist?hl=zh-cn))
    to obtain the `READ_LOGS` permission.

  - If using a PC to issue commands:
    `adb shell "pm grant <package name> android.permission.READ_LOGS && am force-stop <package name>"`

    This can enable the `READ_LOGS` permission and force-stop the app (since the app needs to be restarted for the changes to take effect).
    To disable the permission, change `grant` to `revoke`.

<div class="c-border-content-title-4">Manual Method: Combining Previous Methods</div>
- Developers can write code in the Android app to log to the corresponding folder<br>
  and then use adb pull to retrieve it.

- For example: after the app is written, use adb pull to retrieve it<br>
  `adb pull /sdcard/Android/data/your.package.name/files/`
<br>

<div class="c-border-content-title-4">Another, Faster Method: Script or Shell Method</div>

- Use a pre-written shell script to capture logs in the background directly from the command line.
- Here is a simple example:<br>
<script src="https://gist.github.com/waitzShigoto/ff02fe2fa4d02a0b6521bdc75ef61666.js"></script>

<p class="table_container">
  1. If <b style="color:red;">developers</b> need to customize it, they should fully understand the code above.<br>
  2. If <b style="color:red;">non-developers</b> are using it, they can copy the code above into a txt or blank file.<br>
     First, ensure that adb is available in the computer environment.<br>
     Modify <b style="color:red;">packageName</b> to the specified app package name.<br>
     Configure <b style="color:red;">adbPath</b> to your adb system path.<br>
     (If you are providing it for non-developers, you can also configure ./adb in the same folder path so that those without adb installed can execute it by downloading the one with adb included.)
  4. (optional) You can customize the output log file name and include timestamps for differentiation, etc.<br>
</p>
- Finally, you can execute ./your_add_log.sh in the command line (mac terminal / win cmd)<br>
  to start capturing logs!<br>
  ![shell_log_start.png](/images/others/shell_log_start.png)
