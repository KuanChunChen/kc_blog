---
layout: post
title: "[Android][Kotlin][2021]Android低功耗藍芽Gatt連線實作教學！"
date: 2021-11-12 16:16:32 +0800
image: cover/android-kotlin-bluetooth-gatt-client.png
tags: [Android,Bluetooth,Kotlin]
categories: Bluetooth
---

之前工作相關有實作低功耗藍牙的連接<br>
但怕忘記<br>
所以來複習<br>
想說之後有面試的話<br>
也可以拿來恢復記憶<br>

所以就花了點時間複習<br>
官方提供的低功耗藍牙的串法<br>

最終目標是這樣<br>
可以串回之前幾篇jetpack compose的練習<br>
讓資料變成真實存在的資料<br><br>
且最後能連接gatt藍芽<br>

<div align="center">
  <img src="/mov/jetpack/ea_ble_discovery.gif" width="30%"/>
</div>


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
 <h3> fun startDiscovery ():boolean</h3>
  1.  掃描過程通常執行12秒<br>
  2.  是異步調用<br>
  3.  透過註冊廣播來執行不同步驟，如：<br>
      ACTION_DISCOVERY_STARTED -> 當Discovery開始 <br>
      ACTION_DISCOVERY_FINISHED  -> 當Discovery完成<br>
      BluetoothDevice.ACTION_FOUND -> 發現藍芽裝置<br><br>
  4.  當執行連接藍芽裝置時<br>
      不能處於startDiscovery中<br>
      需呼叫cancelDiscovery()來結束發現<br>
  5.  Discovery並非由Activity管理<br>
      而是system service<br>
      所以為了以防萬一必需使用cancelDiscovery()<br>
      確保Discovery沒有在執行<br>
      避免在連線藍芽裝置時<br>
      device還在Discovery
  6.  Discovery只能發現目前是可被發現的藍芽裝置
  7.  可觀察ACTION_STATE_CHANGED是否為STATE_ON<br>
      如果當前藍芽state並非STATE_ON則API會返回false<br>
      用於確定目前是可獲得更新的值的狀態<br><br>
      <img src="/images/bluetooth/android_state.png" alt="Cover" width="60%" ><br><br>

  8.  如果使用的目標版本小於等於Build.VERSION_CODES#R<br>
      則需要向使用者要求Manifest.permission#BLUETOOTH_ADMIN權限 <br><br>
      <img src="/images/bluetooth/android_R.png" alt="Cover" width="60%" >
  9.  如果使用的目標版本大於等於Build.VERSION_CODES#S<br>
      則需要向使用者要求Manifest.permission#BLUETOOTH_SCAN權限 <br><br>
      <img src="/images/bluetooth/android_S.png" alt="Cover" width="60%" >
      <br><br>
  10. 除此之外<br>
      你可以要求Manifest.permission#ACCESS_FINE_LOCATION權限<br>
      來增加可交互的藍芽裝置種類<br>
      當然你也可以在<uses-permission>新增usesPermissionFlags="neverForLocation" tag<br>
      來避免要求位置權限<br>
      但同時可以搜尋到的裝置種類會有所限制<br><br>

 <h3> fun startScan ( callback:ScanCallback )</h3>

 1.  開始 Bluetooth LE 掃描，掃描結果會透過callback返回
 2.  因為這個沒有帶filters，所以省電的預設當螢幕關閉會stopScan，重新開啟後會resume
 3.  如果使用的目標版本大於等於Build.VERSION_CODES#Q ，則需要向使用者要求Manifest.permission#ACCESS_FINE_LOCATION權限 <br><br>
 4.  如果使用的目標版本小於等於Build.VERSION_CODES#R ，則需要向使用者要求Manifest.permission#BLUETOOTH_ADMIN權限 <br><br>
 <img src="/images/bluetooth/android_R.png" alt="Cover" width="60%" >
 5.  如果使用的目標版本大於等於Build.VERSION_CODES#S ，則需要向使用者要求Manifest.permission#BLUETOOTH_SCAN權限 <br><br>
 <img src="/images/bluetooth/android_S.png" alt="Cover" width="60%" >
 <br><br>
 6. 除此之外 你可以要求Manifest.permission#ACCESS_FINE_LOCATION權限，來增加可交互的藍芽裝置種類，
 當然你也可以在<uses-permission>新增usesPermissionFlags="neverForLocation" tag，來避免要求位置權限
，但同時可以搜尋到的裝置種類會有所限制<br>


```
沒錯他的第4~6項與上方startDiscovery一樣
```

### fun startScan ( filters:List<ScanFilter> , settings:ScanSettings , callback:ScanCallback)

<br>

 1.  特性包含上方startScan ( callback:ScanCallback ) 的 六條<br>
 2.  透過ScanFilter 去篩選掃描的結果，主要支援下面幾項，<a href = "https://developer.android.com/reference/android/bluetooth/le/ScanFilter">可參考</a>：<br>

 <img src="/images/bluetooth/android_filter.png" alt="Cover" width="80%" >
<br><br>

 3.  也透過ScanSettings去設定要針對返回的callback去做怎樣處理，如：返回每個過濾成功的資料、只返回第一個過濾成功的資料...等等，<a href = "https://developer.android.com/reference/android/bluetooth/le/ScanSettings#summary">可參考</a>


<h2> 實際開發：如何進行藍芽掃描</h2>

在manifest中加入上述所需權限<br>
<script src="https://gist.github.com/KuanChunChen/fc855c0ab9c4667df49b253595744d08.js"></script><br>
<br>

在code要求權限，這邊是我寫的一個extension，大家可以依照自己習慣去要求權限<br>
```kotlin
  requestMultiplePermissions(Manifest.permission.ACCESS_FINE_LOCATION,...
```


取得BluetoothAdapter實例<br>
```kotlin
private val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
```

註冊接收廣播<br>

這邊我繼承一個BroadcastReceiver<br>
並監聽BluetoothDevice.ACTION_FOUND<br>
然後使用receiver type返回結果<br>
```kotlin
private val receiver = DeviceListBoardCast { bleDevice ->

        deviceViewModel.addDevice(bleDevice)
    }
```

這邊是註冊廣播的繼承類，
和平常使用的 BroadcastReceiver沒什麼差異
就是取資料的方式是
```kotlin
val device: BluetoothDevice = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)!!
val rssi = intent.getShortExtra(BluetoothDevice.EXTRA_RSSI, Short.MIN_VALUE).toInt()
val uuidExtra = intent.getParcelableArrayExtra(BluetoothDevice.EXTRA_UUID)
```

<script src="https://gist.github.com/KuanChunChen/aaf1cacad87443dec44eab7777d27242.js"></script>

這邊是我實作掃描的一個函式<br>
實際上你只要會用<br>
bluetoothAdapter.startDiscovery() && bluetoothAdapter.cancelDiscovery()<br>
就可以進行掃描了<br>

這個函式<br>
主要是進行掃描的開關<br>
並搭配viewmodel與coroutine<br>
做到用viewmodel紀錄刷新狀態，並透過coroutine掃描指定秒數 x 秒 <br>
<script src="https://gist.github.com/KuanChunChen/2e0d11bb4d06d114d9eb911b3b65b3b3.js"></script>

<h2> 實際開發：如何進行藍芽連線</h2>

這邊使用service的方式去串接<br>
首先建立一個service<br>
並建立Binder<br>
用來onBind時返回實例給fragment去調用<br>
<script src="https://gist.github.com/KuanChunChen/9ab4e15232a62ec3894c753896eb4a26.js"></script><br><br>


在service內創建一個 initialize()函式<br>
用在之後bindservice時可以調用初始化<br>

<script src="https://gist.github.com/KuanChunChen/06594ff234da93de9aaed7b1ec2b5480.js"></script>

接著寫個gattCallback實例<br>
這邊主要是onConnectionStateChange、onServicesDiscovered、onCharacteristicRead<br>
分別是當有新的連接狀態改變、新的服務被發現、新的東西讀到後<br>
返回的callback<br>
這邊主要可以根據你的需求<br>
去做判斷式呈現<br>


<script src="https://gist.github.com/KuanChunChen/6e9f5f10af4619fe3d13167a1d599e95.js"></script>

接著這邊<br>
做一個connect的函式<br>
這個函式裡面的bluetoothAdapter<br>
是從前面步驟initialize()實例化<br>


<script src="https://gist.github.com/KuanChunChen/aa1c6a31dc8ee2a38432db88ec0125b3.js"></script><br>


那做一連串片段的null確認後<br>
成功的話就 getRemoteDevice + bluetooth address取得device物件<br>
```kotlin
val device = bluetoothAdapter!!.getRemoteDevice(address)
```

取得後<br>
開始連上gattServer  <br>
帶上前面的gattCallback<br>
```kotlin
bluetoothGatt = device.connectGatt(this, false, gattCallback)
```

那前面可以看到在gattCallback實例化中<br>
有個broadcastUpdate<br>
這個主要是sendBroadcast<br>
這邊也是根據自己需求去定義<br>
要回傳什麼廣播<br>
就可以在其他地方接收事件的廣播<br>




最後<br>
要回到fragment或activity處<br>
連接service了<br>
所以寫一個ServiceConnection實例<br>
在bindservice時使用<br>

<script src="https://gist.github.com/KuanChunChen/476a2e1848472d99f8794f6d19c078f0.js"></script>
如果getSystemService取不到bluetoothManager<br>
可能是前面的權限沒打開<br>
可以檢查看看<br>

然後在你的fragment或activity處<br>
bindservice<br>

```kotlin
val gattServiceIntent = Intent(context, BluetoothLeService::class.java)
requireActivity().bindService(gattServiceIntent, serviceConnection, Context.BIND_AUTO_CREATE)
```
就可以了！<br>

簡單的連接與尋找裝置<br>
大概就是這樣<br>
如果想看怎麼透過第三方工具<br>
擷取藍芽封包可以參考：<br>

<a href="{{site.baseurl}}/2021/11/12/android-bluetooth-hci-packet/">
<img src="/images/cover/ea-android_bluetooth_hci_packet.png" alt="Cover" width="25%" >
[Android][Kotlin]如何抓取Android手機中 Bluetooth 藍芽封包日誌</a>
<br><br>

不過因為這兩種方式<br>
我都覺得沒有到很好用<br>
所以之後還有研究其他抓包方式<br>
也會再更新上來<br>

<a>{% include google/google_ad_client.html %}</a>
