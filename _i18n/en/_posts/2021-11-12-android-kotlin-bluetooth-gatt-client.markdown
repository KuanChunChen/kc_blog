---
layout: post
title: "Android Low Energy Bluetooth Gatt Connection Tutorial: Implementing with Kotlin"
date: 2021-11-12 16:16:32 +0800
image: cover/bluetooth_with_kotlin-1.png
tags: [Android,Bluetooth]
categories: Android教學
excerpt: "This article introduces how to implement Low Energy Bluetooth Gatt connection using Kotlin on the Android platform. The content includes establishing Gatt connections, reading Gatt services, setting Gatt characteristics, and performing data communication."
---

<div class="c-border-main-title-2">Introduction</div>

I spent some time reviewing the Low Energy Bluetooth connection I implemented in previous work.<br>
Because I was worried I might forget,<br>
I wanted to revisit and document it,<br>
hoping it can also help those who need to implement it.<br>

After Android 12, new permission-related handling was added, so take note!<br>
Here is how I handled it, for your reference:
<script src="https://gist.github.com/KuanChunChen/5ce69516b88a79e4caa4a58c50b41b53.js"></script>

The ultimate goal is this<br>
To integrate with previous Jetpack Compose practices<br>
Making the data real and existent<br><br>
And finally, to connect to Gatt Bluetooth<br>

<div align="center">
  <img src="/mov/jetpack/ea_ble_discovery.gif" width="30%" alt="bluetooth" />
</div>

<div class="c-border-main-title-2">Basic Concepts</div>
First, let's introduce<br>
the methods of Bluetooth scanning<br>
There are roughly three<br>

BluetoothAdapter.startDiscovery() -> Scans both classic Bluetooth and BLE Bluetooth<br>
BluetoothAdapter.startLeScan() -> Used to scan Low Energy Bluetooth ---- Deprecated <br>
BluetoothLeScanner.startScan() -> New BLE scanning method<br>

However, looking at the API notes<br>
startLeScan is currently deprecated<br>
It was deprecated in API 21<br>

I also checked various APIs for discovering Bluetooth devices for comparison<br>

<div class="c-border-content-title-4">fun startDiscovery ():boolean</div><br>
<div class="table_container">
    <ol class="rectangle-list">
        <li>
          <a href="javascript:void(0)">The scanning process usually runs for 12 seconds</a>
        </li>
        <li>
          <a href="javascript:void(0)">It is an asynchronous call</a>
        </li>
        <li>
          <a href="javascript:void(0)">Executed through registering broadcasts for different steps, such as:<br>
                ACTION_DISCOVERY_STARTED -> When Discovery starts <br>
                ACTION_DISCOVERY_FINISHED -> When Discovery finishes<br>
                BluetoothDevice.ACTION_FOUND -> When a Bluetooth device is found <br>
          </a>
        </li>

        <li>
          <a href="javascript:void(0)">When connecting to a Bluetooth device<br>
          It cannot be in startDiscovery<br>
          You need to call cancelDiscovery() to end the discovery<br>
          </a>
        </li>

        <li>
          <a href="javascript:void(0)">
          Discovery is not managed by the Activity<br><br>
          But by the system service<br>
          So, to be safe, you must use cancelDiscovery()<br>
          To ensure Discovery is not running<br>
          To avoid the device still being in Discovery<br>
          when connecting to a Bluetooth device<br>
          </a>
        </li>
        <li>
          <a href="javascript:void(0)">Discovery can only find currently discoverable Bluetooth devices
          </a>
        </li>

```markdown
<li>
  <a href="javascript:void(0)">Observe if ACTION_STATE_CHANGED is STATE_ON
        If the current Bluetooth state is not STATE_ON, the API will return false<br>
        Used to determine if the current state is one where updated values can be obtained<br>
        <img src="/images/bluetooth/android_state.png" alt="Cover" width="100%">
  </a>
</li>

<li>
  <a href="javascript:void(0)">If the target version used is less than or equal to Build.VERSION_CODES#R<br>
        You need to request the Manifest.permission#BLUETOOTH_ADMIN permission from the user<br>
        <img src="/images/bluetooth/android_R.png" alt="Cover" width="100%" >
  </a>
</li>

<li>
  <a href="javascript:void(0)">
    If the target version used is greater than or equal to Build.VERSION_CODES#S<br>
    You need to request the Manifest.permission#BLUETOOTH_SCAN permission from the user<br>
    <img src="/images/bluetooth/android_S.png" alt="Cover" width="100%" >
  </a>
</li>

<li>
  <a href="javascript:void(0)">Additionally<br>
  You can request the Manifest.permission#ACCESS_FINE_LOCATION permission<br>
  To increase the types of interactive Bluetooth devices<br>
  Of course, you can also add the usesPermissionFlags="neverForLocation" tag in <b>uses-permission</b><br>
  To avoid requesting location permissions<br>
  But the types of devices that can be searched will be limited<br>
  </a>
</li>
</ol>
</div>

<div class="c-border-content-title-4">fun startScan ( callback:ScanCallback )</div>
<div class="table_container">
  <ol class="rectangle-list">
      <li><a href="javascript:void(0)">Start Bluetooth LE scan, scan results will be returned via callback</a></li>
      <li><a href="javascript:void(0)">Because this does not include filters,<br>
      The default power-saving mode will stopScan when the screen is off,<br>
      And resume when the screen is turned back on</a></li>
      <li><a href="javascript:void(0)">If the target version used is greater than or equal to Build.VERSION_CODES#Q,<br>
      You need to request the Manifest.permission#ACCESS_FINE_LOCATION permission from the user</a></li>
      <li>
      <a href="javascript:void(0)">If the target version used is less than or equal to Build.VERSION_CODES#R,<br>
      You need to request the Manifest.permission#BLUETOOTH_ADMIN permission from the user
        <img src="/images/bluetooth/android_R.png" alt="Cover" width="100%">
      </a>
      </li>
      <li><a href="javascript:void(0)">If the target version used is greater than or equal to Build.VERSION_CODES#S,<br>
      You need to request the Manifest.permission#BLUETOOTH_SCAN permission from the user
      <img src="/images/bluetooth/android_S.png" alt="Cover" width="100%">
      </a>
```


```html
      </li>
      <li><a href="javascript:void(0)">Additionally, you can request the Manifest.permission#ACCESS_FINE_LOCATION permission,<br>
      to increase the types of interactive Bluetooth devices,<br>
      of course, you can also add the usesPermissionFlags="neverForLocation" tag in &lt;uses-permission&gt;,<br>
      to avoid requesting location permissions,<br>
      but the types of devices that can be discovered will be limited</a></li>
  </ol>
</div><br>

<div class="c-border-content-title-4">fun startScan(filters:List&lt;ScanFilter&gt;,settings:ScanSettings,callback:ScanCallback)</div>
<div class="table_container">
  <ol class="rectangle-list">
      <li>
        <a href="javascript:void(0)">Features include the six items from the above startScan ( callback:ScanCallback )
        </a>
      </li>
      <li>
        <a href="https://developer.android.com/reference/android/bluetooth/le/ScanFilter">
        Use ScanFilter to filter the scan results,<br>
        mainly supporting the following items,<br>
          <img src="/images/bluetooth/android_filter.png" alt="bluetooth android filter" width="80%">
        </a>
      </li>
      <li><a href="https://developer.android.com/reference/android/bluetooth/le/ScanSettings#summary">
      Also use ScanSettings to set how to handle the returned callback,<br>
      such as: return each successfully filtered data, only return the first successfully filtered data... etc.</a></li>
  </ol>
</div><br>

<div class="c-border-main-title-2">Actual Development: How to Perform Bluetooth Scanning</div>

Add the required permissions mentioned above in the manifest<br>
<script src="https://gist.github.com/KuanChunChen/fc855c0ab9c4667df49b253595744d08.js"></script><br>


<div class="c-border-content-title-4">Request Permissions in the Code</div>
Below is an extension<br>
that can be used universally<br>

```kotlin
  requestMultiplePermissions(Manifest.permission.ACCESS_FINE_LOCATION,...
```
<script src="https://gist.github.com/KuanChunChen/42ac3a41e2b7d44eb84f5072c09fd359.js"></script>


<div class="c-border-content-title-4">Obtain an Instance of BluetoothAdapter</div><br>
```kotlin
private val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
```

<div class="c-border-content-title-4">Register to Receive Broadcasts</div>

Register to listen for BluetoothDevice.ACTION_FOUND<br>

```
val filter = IntentFilter(BluetoothDevice.ACTION_FOUND)
    requireContext().registerReceiver(receiver, filter)
```
Extend a BroadcastReceiver<br>
and use the receiver type to return the result bleDevice<br>
```kotlin
private val receiver = DeviceListBoardCast { bleDevice ->

        deviceViewModel.addDevice(bleDevice)
    }
```

其中取資料的方式是，到時候掃描出來的資料可以從這幾個拿
```kotlin
val device: BluetoothDevice = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)!!
val rssi = intent.getShortExtra(BluetoothDevice.EXTRA_RSSI, Short.MIN_VALUE).toInt()
val uuidExtra = intent.getParcelableArrayExtra(BluetoothDevice.EXTRA_UUID)
```
繼承的BroadcastReceiver實作
<script src="https://gist.github.com/KuanChunChen/aaf1cacad87443dec44eab7777d27242.js"></script>



<div class="c-border-content-title-4">開始進行掃描</div>


前面已經拿到bluetoothAdapter跟註冊廣播監聽了<br>
所以開始分別可以用startDiscovery、cancelDiscovery 來開始或結束掃描<br>
```
bluetoothAdapter.startDiscovery()
bluetoothAdapter.cancelDiscovery()
```

這個函式<br>
主要是進行掃描的開關<br>
並搭配viewmodel與coroutine<br>
做到用viewmodel紀錄刷新狀態，並透過coroutine掃描指定秒數 x 秒 <br>
如果不需要用到那麼複雜的話 <br>
直接用startDiscovery、cancelDiscovery去開發就行了 <br>
<script src="https://gist.github.com/KuanChunChen/2e0d11bb4d06d114d9eb911b3b65b3b3.js"></script>

掃描的結果會返回剛剛DeviceListBoardCast {}內，<br>
這邊根據自己專案去調整就行<br>
我是用viewmodel來觀察資料<br>
```
private val receiver = DeviceListBoardCast { bleDevice ->

        deviceViewModel.addDevice(bleDevice)
    }
```

<div class="c-border-main-title-2">實際開發：如何進行藍芽連線</div>
<div class="c-border-content-title-4">主要概念是建好app本地的service，當跟藍芽綁定時，就能互相溝通</div>

這邊使用service的方式去串接<br>
首先建立一個service<br>
並建立Binder<br>
用來onBind時返回實例給fragment去調用<br>
<script src="https://gist.github.com/KuanChunChen/9ab4e15232a62ec3894c753896eb4a26.js"></script>

<div class="c-border-content-title-4">初始化必需的class類別</div>

在該service內創建一個 initialize()函式<br>
用在之後bindservice時可以調用初始化<br>

<script src="https://gist.github.com/KuanChunChen/06594ff234da93de9aaed7b1ec2b5480.js"></script>

<div class="c-border-content-title-4">寫好callback，到時候藍芽狀態返回就能收到</div>

接著寫個gattCallback實例<br>
這邊主要是onConnectionStateChange、onServicesDiscovered、onCharacteristicRead<br>
分別是當有新的連接狀態改變、新的服務被發現、新的東西讀到後<br>
返回的callback<br>
這邊主要可以根據你的需求<br>
去做判斷<br>
<div class="table_container">
  <b>這段記錄下連線中可能的情況：</b><br>
  1. onConnectionStateChange ->返回藍芽狀態<br>
  2. 當執行discoverServices() 去找現有的ble<br>
  當找到會進onServicesDiscovered<br>

  3. 有個方法setCharacteristicNotification<br>
  這個是去啟用notify <br>
  去找特定的Characteristic<br>
  (這邊Characteristic就看跟硬體的協議或定義)<br>

When the Bluetooth device value changes, it will notify you with onCharacteristicChanged<br>

4. Then, writeCharacteristic allows you to write values into the specified Characteristic<br>
Similarly, when there is a result, it will go to<br>
onCharacteristicWrite
</div><br>

gattCallback example:
<script src="https://gist.github.com/KuanChunChen/6e9f5f10af4619fe3d13167a1d599e95.js"></script>

<div class="c-border-content-title-4">Start Connection</div>
Create a connect function<br>
The main part is to connect using the following two lines<br>
```
val device = bluetoothAdapter!!.getRemoteDevice(address)
```
and
```
bluetoothGatt = device.connectGatt(this, false, gattCallback)
```
Pass the address you want to connect to<br>
Get the BluetoothDevice you want to connect to<br>
Then use the connectGatt method in the device to bind the Gatt device<br>
Of course, you also need to pass in the gattCallback written earlier<br>
The previous part is just a series of null checks<br>
To ensure the app does not crash due to null<br>
<script src="https://gist.github.com/KuanChunChen/aa1c6a31dc8ee2a38432db88ec0125b3.js"></script><br>

In the instantiation of gattCallback,<br>
you will find a method named broadcastUpdate.<br>
This method is mainly used to send broadcast messages,<br>
you can define what to do in different situations according to your needs,<br>
or what broadcast messages to return.<br>

Simple connection and device search<br>
That's about it<br>

Next, the most important thing in Bluetooth is communication between terminals<br>
So if you want to send and receive data<br>
You need to find the service and characteristic<br>
Here is a diagram<br>

<img src="/images/bluetooth/ble_logo.png" alt="Cover" width="50%" >
This is a general relationship diagram when connecting Bluetooth<br>

So we find it through the following method:<br>
<script src="https://gist.github.com/KuanChunChen/2b6fb90e97f14b00e6a942b43f653644.js"></script>
Bring in the gatt service obtained through the broadcast earlier<br>
Then you can traverse to get the characteristic<br>

Since the official Android has already wrapped the characteristic class for you<br>
To read, you just need to call the relevant function:<br>

<script src="https://gist.github.com/KuanChunChen/51be18e662704d9cf0241cc27f5f961b.js"></script>
<br>

And it will return to you in the previously defined BluetoothGattCallback<br>
onCharacteristicRead<br>
You just need to define the broadcast reception to get the data<br>

<script src="https://gist.github.com/KuanChunChen/ebb8318578499bec7f6cf97f4bc93063.js"></script>

Additionally, there is also a notify method in Bluetooth:<br>

<script src="https://gist.github.com/KuanChunChen/d9348fbbdc38d3b1bbc20250505c414b.js"></script>

Similarly, it returns the result<br>
In BluetoothGattCallback<br>
Check onCharacteristicChanged<br>
<script src="https://gist.github.com/KuanChunChen/20abc91e5b0b6a658aa3ae3d17cfdee9.js"></script>

If you want to see how to capture Bluetooth packets through third-party tools<br>
You can refer to:<br>

<div class="table_container">
  <a href="{{site.baseurl}}/2021/11/12/android-bluetooth-hci-packet/">
  <img src="/images/cover/ea-android_bluetooth_hci_packet.png" alt="Cover" width="25%" >
  [Android][Kotlin] How to Capture Bluetooth Packet Logs on Android Phones</a>
</div>

<div class="c-border-main-title-2">Bluetooth Module Notes: Includes Classic Bluetooth (BT) and Low Energy Bluetooth (LTE)</div>
<div class="c-border-content-title-4">Classic Bluetooth (BT)</div>
Includes Bluetooth 1.0 / 1.2 / 2.0+EDR / 2.1+EDR / 3.0+EDR and other developments and improvements<br>
Generally refers to modules below Bluetooth 4.0<br>
Typically used for data transmission with larger volumes<br>
Examples: voice, music, higher data volume transmission, etc.<br>

Classic Bluetooth modules can be further subdivided into<br>
Traditional Bluetooth modules and High-Speed Bluetooth modules<br>

Traditional Bluetooth modules were introduced in 2004<br>
The main representative is the module supporting the Bluetooth 2.1 protocol<br>
Traditional Bluetooth has 3 power levels<br>
Class1 / Class2 / Class3<br>
Supporting transmission distances of 100m / 10m / 1m respectively<br>

<br>
High-Speed Bluetooth modules were introduced in 2009<br>
The speed increased to about 24Mbps<br>
Eight times that of traditional Bluetooth modules<br>

<div class="c-border-content-title-4">Low Energy Bluetooth Module (BLE)</div>

Generally refers to modules of Bluetooth 4.0 or higher<br>
Bluetooth Low Energy technology is low-cost, short-range<br>
Can operate in the 2.4GHz ISM radio frequency band<br>
Because BLE technology uses a very fast connection method<br>
It can usually be in a "non-connected" state (saving energy)<br>

Android phones with Bluetooth 4.x are all dual-mode Bluetooth (both Classic Bluetooth and Low Energy Bluetooth)<br>

<div class="c-border-main-title-2">Kotlin + Jetpack Compose Bluetooth App Example</div>

Finally, I wrote an example before, and recently organized it. Those who need it can refer to it
  <a style ="color:white;" href="https://github.com/KuanChunChen/elegantAccessApp">You can refer to this article</a>

<a>{% include google/google_ad_client.html %}</a>
