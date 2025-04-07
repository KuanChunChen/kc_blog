---
layout: post
title: "[Android][Kotlin] How to Capture Bluetooth HCI Packet Logs on Android Phones"
date: 2021-11-12 16:16:32 +0800
image: cover/ea-android_bluetooth_hci_packet.png
tags: [Android,Bluetooth]
categories: Android教學
---

Today's article will document the research done previously on <br>
capturing Bluetooth transmission packets <br>
through methods other than logcat or writing code.<br>

These methods have been introduced by many people online,<br>
but since many of them are almost copy-paste or outdated,<br>
I researched how to actually do it myself.<br>
I will explain it in today's article.<br>

If you want to see how to connect to a GATT server, you can check here<br>
<a href="{{site.baseurl}}/2021/11/12/android-kotlin-bluetooth-gatt-client/">
<img src="/images/cover/android-kotlin-bluetooth-gatt-client.png" alt="Cover" width="25%" >
[Android][Kotlin][2021] Android BLE GATT Connection Implementation Tutorial!</a>
<br><br>

Let's get started:<br>
# Method 1
### Step 1 - Enable Developer Mode
First, you need to enable Developer Mode<br>
<br>
<img src="/images/bluetooth/open_developer.png" alt="Cover" width="30%" >
<br>

Usually, you enter Developer Mode by tapping the build number several times in the software information section.<br>
However, the method may vary depending on the phone manufacturer.<br>
Some manufacturers require entering specific commands in the dialer,<br>
or using other hidden key combinations.<br>
If it doesn't work, you can search online for how to enter Developer Mode on your phone.<br>

Once successful, you will see Developer Options in the settings.<br>
<br>
<img src="/images/bluetooth/developer.png" alt="Cover" width="30%" >
<br>

### Step 2 - Enable Bluetooth HCI Snoop Log
Next, go to Developer Options<br>
and enable the Bluetooth HCI Snoop Log option.<br>
<br>
<img src="/images/bluetooth/open_hci.png" alt="Cover" width="30%" >
<br>
<br>
Enabling this option<br>
will allow the system to record Bluetooth HCI snoop logs.<br>

I encountered a problem while researching this.<br>
Older versions of Android store HCI logs in /sdcard or /storage,<br>
but newer versions may store them in different paths,<br>
and in directories without read permissions.<br>
<br>
As a result, even if I have the file, I can't view it.<br>
Unless you have root access or adb shell su permissions on the phone,<br>
it's usually difficult to read it easily.<br>

So if your phone stores the file in a directory without read permissions like mine,<br>
you might want to follow the steps below to dump it.<br>

### Step 3 - Install CLI Tool ADB

ADB is a commonly used debugging tool in Android development.<br>
If you have installed Android Studio,<br>
it will be included in the platform tools directory of the installation.<br>
<br>
If you want to use it globally,<br>
you can set it in the environment variables.<br>
<br>
If you don't usually develop for Android<br>
and just want to test Bluetooth logs, you can download it from the link below.<br><br>
<a href="https://developer.android.com/studio/releases/platform-tools" class="btn btn-primary" role="button">View Android Platform Tool</a>
<br>

### Step 4 - Connect Phone and Confirm USB Debugging Mode
Make sure USB Debugging Mode is enabled in Developer Options<br>
and that the phone is connected to the PC.<br>
You can confirm with the following command:<br>

```
adb devices
```

If you see<br>
a message similar to the one below:<br>

```
List of devices attached
LXXXXXGYPXXCXXXXXX7	device
```

then it is connected.<br>

### Step 5 - Dump Bluetooth HCI Log File

Since the file is stored in a location without read permissions,<br>
you need to use commands to dump it.<br>
First, follow the steps above,<br>
including enabling Bluetooth HCI capture,<br>
and performing Bluetooth-related operations<br>
to generate logs.<br>

Here is a small shell script

<script src="https://gist.github.com/waitzShigoto/8d55a3492f8cafbfd86196ce8f6d610d.js"></script>

You can directly copy it to run in the shell<br>
Or you can copy it line by line to the terminal to execute
The main command used is

```
adb bugreport <FileName>
```
Because the original directory containing the logs cannot be read,
the `bugreport` command is used<br>
It helps you dump<br>
the current system log of the Android phone<br>
and compress it into a zip file in the current directory
So in my script, I first pushd to the /tmp directory<br>
But this is based on personal usage habits<br>
You can modify it yourself<br>

After that, just unzip
```
unzip fetchBugReport.zip
```
The data from your bugreport<br>
will show the log data inside your phone<br>
Then you can `cat` the relevant log files <br>
or use specific software to read some difficult-to-read files<br>

Usually, the unzipped data is in a folder structure
like
FS/data/log/.../btsnoop_hci.log

The file we are looking for is the Bluetooth log file <br>
But I have tried different phones<br>
and the directory structure might be different<br>
If you want to write the shell script to execute with one click<br>
you might need to pull this into a variable<br>
to easily fetch the log<br>
For example:
<script src="https://gist.github.com/waitzShigoto/d862a1007ddb5bbef96b28a8a5c3e723.js"></script>
This can be rewritten according to personal needs


Finally, sharing a note<br>
During the research process<br>
I found that not every phone generates Bluetooth logs<br>
So these uncertainties<br>
make the idea of easily capturing packets<br>
less reliable<br>
But knowing this method<br>
won't hurt if you need it in the future<br>


# Method 2 - nRF Sniffer + Wireshark to Capture Bluetooth Packets

### Step 1 - Install Python and pyserial
Enter<br>

```
python --version
```
If a version is displayed<br>
it means Python is already installed globally<br>

<img src="/images/bluetooth/python_version.png" alt="Cover" width="100%" >
<br>
If not, you can install it via<br>

Method 1:
<a href="https://www.python.org/downloads/">Python official website</a>
<br>
Method 2: Install via brew<br>
<img src="/images/bluetooth/python_install.png" alt="Cover" width="30%" >


Enter the following command in the terminal<br>
to install pyserial<br>
```
pip install pyserial
```
If "Successfully" appears, it means the installation was successful


### Step 2 - Install WireShark   

Go to
<a href="https://www.wireshark.org/download.html">WireShark official website</a>
to download the installer

<img src="/images/bluetooth/wireshark_web.png" alt="Cover" width="50%" >
<br>
<br>
Choose the version for your OS<br>
and install it like you would any other software<br>
<br>
<img src="/images/bluetooth/wireshark_dmg_phtot.png" alt="Cover" width="30%" >

### Step 3 - Install nRF-Sniffer-for-Bluetooth-LE Plugin  


Download via the link
<a href="https://www.nordicsemi.com/Products/Development-tools/nRF-Sniffer-for-Bluetooth-LE/Download#infotabs">nRF-Sniffer-for-Bluetooth-LE</a><br>

Choose the desired version<br>
The Changelog for the version can be viewed in the dropdown<br>
<br>
<img src="/images/bluetooth/nRF_changelog.png" alt="Cover" width="50%" >
<br><br>
I downloaded version 4.1.0<br>
Choose according to your needs<br>

After unzipping the downloaded zip, find the extcap folder
<br><br>
<img src="/images/bluetooth/excap.png" alt="Cover" width="50%" >
<br><br>



And open WireShark's About WireShark<br>
For the mac version, it's within the application name<br><br>
<img src="/images/bluetooth/wireshark_about.png" alt="Cover" width="30%" >
<br><br>

Find the Global Extcap Path <br><br>
<img src="/images/bluetooth/wireshark_folder.png" alt="Cover" width="60%" >
<br><br>

extcap is the folder where Wireshark places plugins<br>
Copy all the files from the nRF-Sniffer-for-Bluetooth-LE extcap folder you downloaded earlier<br>
into this folder<br>

### Step 4 - Use the official hardware to start capturing packets   

The official website mentions that the following hardware is required to capture packets

<img src="/images/bluetooth/nRF_dongle.png" alt="Cover" width="60%" >
<br><br>

Purchase online<br>
or if you already have it, plug it into your computer and open Wireshark<br>

Find the connected source selection<br>
nRF Sniffer for Bluetooth LE COMXX<br>
and you can start capturing<br>


Conclusion<br>
This method of capturing Bluetooth packets has a small cost - it requires additional equipment<br>
So if you happen to have the equipment on hand<br>
you can try this method<br>

