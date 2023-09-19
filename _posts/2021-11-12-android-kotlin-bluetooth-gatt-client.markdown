---
layout: post
title: "Android低功耗藍芽Gatt連線教學：使用Kotlin實作"
date: 2021-11-12 16:16:32 +0800
image: cover/bluetooth_with_kotlin-1.png
tags: [Android,Bluetooth,Kotlin]
categories: Bluetooth
excerpt: "本篇文章介紹了如何使用Android平台上的Kotlin語言實現低功耗藍芽Gatt連線，內容包括建立Gatt連線、讀取Gatt服務、設置Gatt特性並進行數據通訊等。"
---

<div class="c-border-main-title-2">前言</div>

我花了一些時間複習之前工作所實作的低功耗藍牙連接。<br>
由於我擔心會忘記，<br>
所以想重新回顧一下並做個紀錄，<br>
希望也能幫助到需要實作的各位。<br>

Android 12之後新增了 權限相關處理，大家可以注意一下！<br>
這邊是我處理的方式，大家可以參考：
<script src="https://gist.github.com/KuanChunChen/5ce69516b88a79e4caa4a58c50b41b53.js"></script>


最終目標是這樣<br>
可以串回之前幾篇jetpack compose的練習<br>
讓資料變成真實存在的資料<br><br>
且最後能連接gatt藍芽<br>

<div align="center">
  <img src="/mov/jetpack/ea_ble_discovery.gif" width="30%" alt="bluetooth" />
</div>


<div class="c-border-main-title-2">基本概念</div>
首先介紹下<br>
藍芽掃描的方法<br>
大致上有三種<br>

BluetoothAdapter.startDiscovery() -> 掃描經典藍芽和BLE藍芽兩種<br>
BluetoothAdapter.startLeScan() -> 用來掃描低功耗藍芽 ---- 已被棄用 <br>
BluetoothLeScanner.startScan() -> 新的BLE掃描方法<br>

不過看了API內的註解<br>
目前startLeScan已被棄用<br>
是在api21時被棄用<br>

我也順便查了各個發現藍芽裝置的API來做比較<br>

<div class="c-border-content-title-4">fun startDiscovery ():boolean</div><br>
<div class="table_container">
    <ol class="rectangle-list">
        <li>
          <a href="javascript:void(0)">掃描過程通常執行12秒</a>
        </li>
        <li>
          <a href="javascript:void(0)">是異步調用</a>
        </li>
        <li>
          <a href="javascript:void(0)">透過註冊廣播來執行不同步驟，如：<br>
                ACTION_DISCOVERY_STARTED -> 當Discovery開始 <br>
                ACTION_DISCOVERY_FINISHED -> 當Discovery完成<br>
                BluetoothDevice.ACTION_FOUND -> 發現藍芽裝置 <br>
          </a>
        </li>

        <li>
          <a href="javascript:void(0)">當執行連接藍芽裝置時<br>
          不能處於startDiscovery中<br>
          需呼叫cancelDiscovery()來結束發現<br>
          </a>
        </li>

        <li>
          <a href="javascript:void(0)">
          Discovery並非由Activity管理<br><br>
          而是system service<br>
          所以為了以防萬一必需使用cancelDiscovery()<br>
          確保Discovery沒有在執行<br>
          避免在連線藍芽裝置時<br>
          device還在Discovery<br>
          </a>
        </li>
        <li>
          <a href="javascript:void(0)">Discovery只能發現目前是可被發現的藍芽裝置
          </a>
        </li>

        <li>
          <a href="javascript:void(0)">可觀察ACTION_STATE_CHANGED是否為STATE_ON
                如果當前藍芽state並非STATE_ON則API會返回false<br>
                用於確定目前是可獲得更新的值的狀態<br>
                <img src="/images/bluetooth/android_state.png" alt="Cover" width="100%">
          </a>
        </li>

        <li>
          <a href="javascript:void(0)">如果使用的目標版本小於等於Build.VERSION_CODES#R<br>
                則需要向使用者要求Manifest.permission#BLUETOOTH_ADMIN權限<br>
                <img src="/images/bluetooth/android_R.png" alt="Cover" width="100%" >
          </a>
        </li>

        <li>
          <a href="javascript:void(0)">
            如果使用的目標版本大於等於Build.VERSION_CODES#S<br>
            則需要向使用者要求Manifest.permission#BLUETOOTH_SCAN權限<br>
            <img src="/images/bluetooth/android_S.png" alt="Cover" width="100%" >
          </a>
        </li>


        <li>
          <a href="javascript:void(0)">除此之外<br>
          你可以要求Manifest.permission#ACCESS_FINE_LOCATION權限<br>
          來增加可交互的藍芽裝置種類<br>
          當然你也可以在<b>uses-permission</b>新增usesPermissionFlags="neverForLocation" tag<br>
          來避免要求位置權限<br>
          但同時可以搜尋到的裝置種類會有所限制<br>
          </a>
        </li>
    </ol>
</div>

<div class="c-border-content-title-4">fun startScan ( callback:ScanCallback )</div>
<div class="table_container">
  <ol class="rectangle-list">
      <li><a href="javascript:void(0)">開始 Bluetooth LE 掃描，掃描結果會透過callback返回</a></li>
      <li><a href="javascript:void(0)">因為這個沒有帶filters，<br>
      所以省電的預設當螢幕關閉會stopScan，<br>
      重新開啟後會resume</a></li>
      <li><a href="javascript:void(0)">如果使用的目標版本大於等於Build.VERSION_CODES#Q ，<br>
      則需要向使用者要求Manifest.permission#ACCESS_FINE_LOCATION權限</a></li>
      <li>
      <a href="javascript:void(0)">如果使用的目標版本小於等於Build.VERSION_CODES#R ，<br>
      則需要向使用者要求Manifest.permission#BLUETOOTH_ADMIN權限
        <img src="/images/bluetooth/android_R.png" alt="Cover" width="100%">
      </a>

      </li>
      <li><a href="javascript:void(0)">如果使用的目標版本大於等於Build.VERSION_CODES#S，<br>
      則需要向使用者要求Manifest.permission#BLUETOOTH_SCAN權限
      <img src="/images/bluetooth/android_S.png" alt="Cover" width="100%">
      </a>

      </li>
      <li><a href="javascript:void(0)">除此之外 你可以要求Manifest.permission#ACCESS_FINE_LOCATION權限，<br>
      來增加可交互的藍芽裝置種類，<br>
      當然你也可以在&lt;uses-permission&gt;新增usesPermissionFlags="neverForLocation" tag，<br>
      來避免要求位置權限，<br>
      但同時可以搜尋到的裝置種類會有所限制</a></li>
  </ol>
</div><br>

<div class="c-border-content-title-4">fun startScan(filters:List&lt;ScanFilter&gt;,settings:ScanSettings,callback:ScanCallback)</div>
<div class="table_container">
  <ol class="rectangle-list">
      <li>
        <a href="javascript:void(0)">特性包含上方startScan ( callback:ScanCallback ) 的 六條
        </a>
      </li>
      <li>
        <a href="https://developer.android.com/reference/android/bluetooth/le/ScanFilter">
        透過ScanFilter 去篩選掃描的結果，<br>
        主要支援下面幾項，<br>
          <img src="/images/bluetooth/android_filter.png" alt="bluetooth android filter" width="80%">
        </a>
      </li>
      <li><a href="https://developer.android.com/reference/android/bluetooth/le/ScanSettings#summary">
      也透過ScanSettings去設定要針對返回的callback去做怎樣處理，<br>
      如：返回每個過濾成功的資料、只返回第一個過濾成功的資料...等等</a></li>
  </ol>
</div><br>

<div class="c-border-main-title-2">實際開發：如何進行藍芽掃描</div>

在manifest中加入上述所需權限<br>
<script src="https://gist.github.com/KuanChunChen/fc855c0ab9c4667df49b253595744d08.js"></script><br>


<div class="c-border-content-title-4">在程式碼的地方要求權限</div>
下面寫了一個extension<br>
可以通用<br>

```kotlin
  requestMultiplePermissions(Manifest.permission.ACCESS_FINE_LOCATION,...
```
<script src="https://gist.github.com/KuanChunChen/42ac3a41e2b7d44eb84f5072c09fd359.js"></script>


<div class="c-border-content-title-4">取得BluetoothAdapter實例</div><br>
```kotlin
private val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
```

<div class="c-border-content-title-4">註冊接收廣播</div>

註冊監聽BluetoothDevice.ACTION_FOUND<br>

```
val filter = IntentFilter(BluetoothDevice.ACTION_FOUND)
    requireContext().registerReceiver(receiver, filter)
```
繼承一個BroadcastReceiver<br>
然後使用receiver type的形式返回結果bleDevice<br>
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

  當藍芽裝置數值有改變就會用onCharacteristicChanged通知你<br>

  4. 然後writeCharacteristic可以讓你寫值進指定的Characteristic<br>
  一樣當有結果會進到<br>
  onCharacteristicWrite
</div><br>

gattCallback範例：
<script src="https://gist.github.com/KuanChunChen/6e9f5f10af4619fe3d13167a1d599e95.js"></script>

<div class="c-border-content-title-4">開始連線</div>
做一個connect的函式<br>
其實主要就是以下兩段去做連線<br>
```
val device = bluetoothAdapter!!.getRemoteDevice(address)
```
跟
```
bluetoothGatt = device.connectGatt(this, false, gattCallback)
```
把要連線的adress丟進去<br>
拿到想要連線的BluetoothDevice<br>
再用device內的方法connectGatt去綁定Gatt裝置<br>
當然同時要丟入前面寫好的gattCallback<br>
前面只是做一連串的null確認<br>
確保app 不會因null而crash<br>
<script src="https://gist.github.com/KuanChunChen/aa1c6a31dc8ee2a38432db88ec0125b3.js"></script><br>


在 gattCallback 的實例化中，<br>
你會發現有一個名為 broadcastUpdate 的方法。<br>
這個方法主要是用來發送廣播訊息，<br>
你可以根據自己的需求去定義遇到什麼情況要做什麼事，<br>
或要回傳什麼廣播訊息。<br>

簡單的連接與尋找裝置<br>
大概就是這樣<br>

接著藍芽最重要的就是終端之間的通訊<br>
所以如果想要收送資料<br>
必需要找出service與characteristic<br>
這邊先上個圖<br>

<img src="/images/bluetooth/ble_logo.png" alt="Cover" width="50%" >
這是藍芽連接時大概的關係圖<br>


所以我們透過以下方法找出：<br>
<script src="https://gist.github.com/KuanChunChen/2b6fb90e97f14b00e6a942b43f653644.js"></script>
將前面透過廣播取得的gatt service帶入<br>
就可以透過遍歷去取得characteristic<br>

那因為android官方已經有幫你包好characteristic的類了<br>
所以你要讀取只要透過相關function呼叫:<br>

<script src="https://gist.github.com/KuanChunChen/51be18e662704d9cf0241cc27f5f961b.js"></script>
<br>

並且他會在之前定義的BluetoothGattCallback內的<br>
onCharacteristicRead返回給你<br>
你只要定義好接收廣播就可以得到資料<br>

<script src="https://gist.github.com/KuanChunChen/ebb8318578499bec7f6cf97f4bc93063.js"></script>


另外藍芽裡面也有一種notify的方法：<br>

<script src="https://gist.github.com/KuanChunChen/d9348fbbdc38d3b1bbc20250505c414b.js"></script>

一樣返回結果<br>
BluetoothGattCallback裡面<br>
onCharacteristicChanged去看<br>
<script src="https://gist.github.com/KuanChunChen/20abc91e5b0b6a658aa3ae3d17cfdee9.js"></script>


如果想看怎麼透過第三方工具<br>
擷取藍芽封包可以參考：<br>

<div class="table_container">
  <a href="{{site.baseurl}}/2021/11/12/android-bluetooth-hci-packet/">
  <img src="/images/cover/ea-android_bluetooth_hci_packet.png" alt="Cover" width="25%" >
  [Android][Kotlin]如何抓取Android手機中 Bluetooth 藍芽封包日誌</a>
</div>


<div class="c-border-main-title-2">藍芽模組筆記:有 經典藍芽(BT) 與 低功耗藍牙(LTE)</div>
<div class="c-border-content-title-4">經典藍芽(BT)</div>
包含 藍芽1.0 / 1.2 / 2.0+EDR / 2.1+EDR / 3.0+EDR 等基礎上發展和完善起來的<br>
泛指藍芽4.0以下的模組<br>
一般用於資料量比較大的傳輸<br>
如：語音、音樂、較高資料量傳輸等<br>

經典藍芽模組可再細分為<br>
傳統藍芽模組和高速藍芽模組<br>

傳統藍芽模組在2004年推出<br>
主要代表是支援藍芽2.1協議的模組<br>
傳統藍芽有3個功率級別<br>
Class1 / Class2 / Class3<br>
分別支援100m / 10m / 1m的傳輸距離<br>

<br>
高速藍芽模組在2009年推出<br>
速率提高到約24Mbps<br>
是傳統藍芽模組的八倍<br>

<div class="c-border-content-title-4">低功耗藍芽模組(BLE)</div>

泛指藍芽4.0或更高的模組<br>
藍芽低功耗技術是低成本、短距離<br>
可工作在2.4GHz ISM射頻頻段<br>
因為BLE技術採用非常快速的連線方式<br>
因此平時可以處於“非連線”狀態（節省能源）<br>

Android手機藍芽4.x都是雙模藍芽(既有經典藍芽也有低功耗藍芽)<br>

<div class="c-border-main-title-2">Kotlin + jetpack compose 藍芽app範例</div>

最後我之前寫了一個範例，最近終於整理上來，有需要的可以參考看看

<div class="c-border-main-title-2">Kotlin + jetpack compose 藍芽app範例
  <a style ="color:white;" herf="https://github.com/KuanChunChen/elegantAccessApp">可參考此篇</a>
</div>

<a>{% include google/google_ad_client.html %}</a>
