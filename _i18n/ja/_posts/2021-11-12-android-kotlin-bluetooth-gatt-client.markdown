---
layout: post
title: "Android低功耗ブルートゥースGatt接続チュートリアル：Kotlinを使用して実装"
date: 2021-11-12 16:16:32 +0800
image: cover/bluetooth_with_kotlin-1.png
tags: [Android,Bluetooth]
categories: Android教學
excerpt: "この記事では、Androidプラットフォーム上でKotlin言語を使用して低功耗ブルートゥースGatt接続を実現する方法を紹介します。内容には、Gatt接続の確立、Gattサービスの読み取り、Gatt特性の設定およびデータ通信などが含まれます。"
---

<div class="c-border-main-title-2">前書き</div>

以前の仕事で実装した低功耗ブルートゥース接続を復習するのに少し時間をかけました。<br>
忘れてしまうのが心配なので、<br>
再度見直して記録を残したいと思います。<br>
実装が必要な方々にも役立つことを願っています。<br>

Android 12以降では権限関連の処理が追加されましたので、注意してください！<br>
ここでは私の処理方法を紹介しますので、参考にしてください：
<script src="https://gist.github.com/KuanChunChen/5ce69516b88a79e4caa4a58c50b41b53.js"></script>


最終目標はこのようになります<br>
以前のjetpack composeの練習と連携させて<br>
データを実際のデータに変換し<br><br>
最終的にgattブルートゥースに接続できるようにします<br>

<div align="center">
  <img src="/mov/jetpack/ea_ble_discovery.gif" width="30%" alt="bluetooth" />
</div>


<div class="c-border-main-title-2">基本概念</div>
まずは<br>
ブルートゥーススキャンの方法を紹介します<br>
大まかに3種類あります<br>

BluetoothAdapter.startDiscovery() -> クラシックブルートゥースとBLEブルートゥースの両方をスキャン<br>
BluetoothAdapter.startLeScan() -> 低功耗ブルートゥースをスキャンするためのもの ---- 廃止されました <br>
BluetoothLeScanner.startScan() -> 新しいBLEスキャン方法<br>

しかし、API内の注釈を見ると<br>
現在startLeScanは廃止されています<br>
API21で廃止されました<br>

各ブルートゥースデバイスの発見APIを比較してみました<br>

<div class="c-border-content-title-4">fun startDiscovery ():boolean</div><br>
<div class="table_container">
    <ol class="rectangle-list">
        <li>
          <a href="javascript:void(0)">スキャンプロセスは通常12秒間実行されます</a>
        </li>
        <li>
          <a href="javascript:void(0)">非同期呼び出しです</a>
        </li>
        <li>
          <a href="javascript:void(0)">異なるステップを実行するためにブロードキャストを登録します。例：<br>
                ACTION_DISCOVERY_STARTED -> Discoveryが開始されたとき <br>
                ACTION_DISCOVERY_FINISHED -> Discoveryが完了したとき<br>
                BluetoothDevice.ACTION_FOUND -> ブルートゥースデバイスが発見されたとき <br>
          </a>
        </li>

        <li>
          <a href="javascript:void(0)">ブルートゥースデバイスに接続する際には<br>
          startDiscovery中であってはいけません<br>
          発見を終了するためにcancelDiscovery()を呼び出す必要があります<br>
          </a>
        </li>

        <li>
          <a href="javascript:void(0)">
          DiscoveryはActivityによって管理されていません<br><br>
          それはシステムサービスです<br>
          したがって、万が一に備えてcancelDiscovery()を使用する必要があります<br>
          Discoveryが実行されていないことを確認し<br>
          ブルートゥースデバイスに接続する際に<br>
          デバイスがDiscovery中でないことを確認します<br>
          </a>
        </li>
        <li>
          <a href="javascript:void(0)">Discoveryは現在発見可能なブルートゥースデバイスのみを発見できます
          </a>
        </li>

```markdown
<li>
  <a href="javascript:void(0)">ACTION_STATE_CHANGEDがSTATE_ONであるかを観察する
        現在のBluetoothの状態がSTATE_ONでない場合、APIはfalseを返します<br>
        現在が更新可能な値の状態であることを確認するために使用します<br>
        <img src="/images/bluetooth/android_state.png" alt="Cover" width="100%">
  </a>
</li>

<li>
  <a href="javascript:void(0)">使用するターゲットバージョンがBuild.VERSION_CODES#R以下の場合<br>
        ユーザーにManifest.permission#BLUETOOTH_ADMIN権限を要求する必要があります<br>
        <img src="/images/bluetooth/android_R.png" alt="Cover" width="100%" >
  </a>
</li>

<li>
  <a href="javascript:void(0)">
    使用するターゲットバージョンがBuild.VERSION_CODES#S以上の場合<br>
    ユーザーにManifest.permission#BLUETOOTH_SCAN権限を要求する必要があります<br>
    <img src="/images/bluetooth/android_S.png" alt="Cover" width="100%" >
  </a>
</li>

<li>
  <a href="javascript:void(0)">それ以外の場合<br>
  Manifest.permission#ACCESS_FINE_LOCATION権限を要求することができます<br>
  インタラクティブなBluetoothデバイスの種類を増やすために<br>
  もちろん、<b>uses-permission</b>にusesPermissionFlags="neverForLocation"タグを追加して<br>
  位置情報権限の要求を避けることもできます<br>
  しかし、その場合、検出できるデバイスの種類が制限されます<br>
  </a>
</li>
</ol>
</div>

<div class="c-border-content-title-4">fun startScan ( callback:ScanCallback )</div>
<div class="table_container">
<ol class="rectangle-list">
  <li><a href="javascript:void(0)">Bluetooth LEスキャンを開始し、スキャン結果はcallbackを通じて返されます</a></li>
  <li><a href="javascript:void(0)">フィルターがないため、<br>
  省電力のために画面がオフになるとstopScanし、<br>
  再度オンにするとresumeします</a></li>
  <li><a href="javascript:void(0)">使用するターゲットバージョンがBuild.VERSION_CODES#Q以上の場合、<br>
  ユーザーにManifest.permission#ACCESS_FINE_LOCATION権限を要求する必要があります</a></li>
  <li>
  <a href="javascript:void(0)">使用するターゲットバージョンがBuild.VERSION_CODES#R以下の場合、<br>
  ユーザーにManifest.permission#BLUETOOTH_ADMIN権限を要求する必要があります
    <img src="/images/bluetooth/android_R.png" alt="Cover" width="100%">
  </a>
  </li>
  <li><a href="javascript:void(0)">使用するターゲットバージョンがBuild.VERSION_CODES#S以上の場合、<br>
  ユーザーにManifest.permission#BLUETOOTH_SCAN権限を要求する必要があります
  <img src="/images/bluetooth/android_S.png" alt="Cover" width="100%">
  </a>
</li>
```

      </li>
      <li><a href="javascript:void(0)">それ以外にも、Manifest.permission#ACCESS_FINE_LOCATION権限を要求することができます。<br>
      これにより、インタラクティブなBluetoothデバイスの種類が増えます。<br>
      もちろん、&lt;uses-permission&gt;タグにusesPermissionFlags="neverForLocation"を追加して、<br>
      位置情報の権限を要求しないようにすることもできますが、<br>
      その場合、検索できるデバイスの種類が制限されます。</a></li>
  </ol>
</div><br>

<div class="c-border-content-title-4">fun startScan(filters:List&lt;ScanFilter&gt;,settings:ScanSettings,callback:ScanCallback)</div>
<div class="table_container">
  <ol class="rectangle-list">
      <li>
        <a href="javascript:void(0)">特性には上記のstartScan ( callback:ScanCallback ) の6つの項目が含まれます。
        </a>
      </li>
      <li>
        <a href="https://developer.android.com/reference/android/bluetooth/le/ScanFilter">
        ScanFilterを使用してスキャン結果をフィルタリングします。<br>
        主に以下の項目をサポートしています。<br>
          <img src="/images/bluetooth/android_filter.png" alt="bluetooth android filter" width="80%">
        </a>
      </li>
      <li><a href="https://developer.android.com/reference/android/bluetooth/le/ScanSettings#summary">
      ScanSettingsを使用して、コールバックに対してどのように処理するかを設定します。<br>
      例：フィルタリングに成功したデータをすべて返す、最初にフィルタリングに成功したデータのみを返す...など。</a></li>
  </ol>
</div><br>

<div class="c-border-main-title-2">実際の開発：Bluetoothスキャンの方法</div>

manifestに上記の必要な権限を追加します。<br>
<script src="https://gist.github.com/KuanChunChen/fc855c0ab9c4667df49b253595744d08.js"></script><br>


<div class="c-border-content-title-4">コード内で権限を要求する</div>
以下に拡張機能を書きました。<br>
汎用的に使用できます。<br>

```kotlin
  requestMultiplePermissions(Manifest.permission.ACCESS_FINE_LOCATION,...
```
<script src="https://gist.github.com/KuanChunChen/42ac3a41e2b7d44eb84f5072c09fd359.js"></script>


<div class="c-border-content-title-4">BluetoothAdapterインスタンスの取得</div><br>
```kotlin
private val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
```

<div class="c-border-content-title-4">ブロードキャストの受信を登録する</div>

BluetoothDevice.ACTION_FOUNDを監視するために登録します。<br>

```
val filter = IntentFilter(BluetoothDevice.ACTION_FOUND)
    requireContext().registerReceiver(receiver, filter)
```
BroadcastReceiverを継承します。<br>
そして、receiverタイプの形式で結果をbleDeviceとして返します。<br>
```kotlin
private val receiver = DeviceListBoardCast { bleDevice ->

        deviceViewModel.addDevice(bleDevice)
    }
```

資料を取得する方法として、スキャンされたデータは以下から取得できます
```kotlin
val device: BluetoothDevice = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)!!
val rssi = intent.getShortExtra(BluetoothDevice.EXTRA_RSSI, Short.MIN_VALUE).toInt()
val uuidExtra = intent.getParcelableArrayExtra(BluetoothDevice.EXTRA_UUID)
```
継承したBroadcastReceiverの実装
<script src="https://gist.github.com/KuanChunChen/aaf1cacad87443dec44eab7777d27242.js"></script>



<div class="c-border-content-title-4">スキャンを開始する</div>


前述の通り、bluetoothAdapterを取得し、ブロードキャストリスナーを登録しました<br>
したがって、startDiscoveryとcancelDiscoveryを使用してスキャンを開始または終了できます<br>
```
bluetoothAdapter.startDiscovery()
bluetoothAdapter.cancelDiscovery()
```

この関数は<br>
主にスキャンのオンオフを行います<br>
viewmodelとcoroutineを組み合わせて<br>
viewmodelでリフレッシュ状態を記録し、coroutineで指定秒数 x 秒スキャンを行います<br>
それほど複雑にする必要がない場合は<br>
startDiscoveryとcancelDiscoveryを直接使用して開発するだけで十分です<br>
<script src="https://gist.github.com/KuanChunChen/2e0d11bb4d06d114d9eb911b3b65b3b3.js"></script>

スキャンの結果は先ほどのDeviceListBoardCast {}内に返されます<br>
ここはプロジェクトに応じて調整してください<br>
私はviewmodelを使用してデータを観察しています<br>
```
private val receiver = DeviceListBoardCast { bleDevice ->

        deviceViewModel.addDevice(bleDevice)
    }
```

<div class="c-border-main-title-2">実際の開発：Bluetooth接続の方法</div>
<div class="c-border-content-title-4">主な概念は、アプリのローカルサービスを構築し、Bluetoothとバインドすると相互に通信できるようにすることです</div>

ここではserviceを使用して接続します<br>
まず、serviceを作成します<br>
次にBinderを作成します<br>
onBind時にインスタンスをfragmentに返すために使用します<br>
<script src="https://gist.github.com/KuanChunChen/9ab4e15232a62ec3894c753896eb4a26.js"></script>

<div class="c-border-content-title-4">必要なクラスを初期化する</div>

そのservice内でinitialize()関数を作成します<br>
後でbindservice時に初期化を呼び出すために使用します<br>

<script src="https://gist.github.com/KuanChunChen/06594ff234da93de9aaed7b1ec2b5480.js"></script>

<div class="c-border-content-title-4">コールバックを作成し、Bluetoothの状態が返されたときに受信できるようにする</div>

次にgattCallbackインスタンスを作成します<br>
ここでは主にonConnectionStateChange、onServicesDiscovered、onCharacteristicReadを使用します<br>
それぞれ、新しい接続状態の変更、新しいサービスの発見、新しいデータの読み取り後に<br>
返されるコールバックです<br>
ここでは主にあなたのニーズに応じて<br>
判断を行います<br>
<div class="table_container">
  <b>この段階で接続中に考えられる状況を記録します：</b><br>
  1. onConnectionStateChange -> Bluetoothの状態を返します<br>
  2. discoverServices()を実行して既存のBLEを探します<br>
  見つかった場合はonServicesDiscoveredに進みます<br>

  3. setCharacteristicNotificationというメソッドがあります<br>
  これは通知を有効にするためのものです<br>
  特定のCharacteristicを探します<br>
  (ここでのCharacteristicはハードウェアのプロトコルや定義に依存します)<br>

  Bluetoothデバイスの値が変更されると、onCharacteristicChangedで通知されます。<br>

  4. 次に、writeCharacteristicを使用すると、指定されたCharacteristicに値を書き込むことができます。<br>
  結果があると、<br>
  onCharacteristicWriteに入ります。
</div><br>

gattCallbackの例：
<script src="https://gist.github.com/KuanChunChen/6e9f5f10af4619fe3d13167a1d599e95.js"></script>

<div class="c-border-content-title-4">接続を開始</div>
connect関数を作成します。<br>
実際には、以下の2つの部分で接続を行います。<br>
```
val device = bluetoothAdapter!!.getRemoteDevice(address)
```
と
```
bluetoothGatt = device.connectGatt(this, false, gattCallback)
```
接続したいアドレスを渡し、<br>
接続したいBluetoothDeviceを取得します。<br>
次に、deviceのconnectGattメソッドを使用してGattデバイスをバインドします。<br>
もちろん、前に作成したgattCallbackも渡します。<br>
前の部分は一連のnull確認を行うだけです。<br>
アプリがnullによってクラッシュしないようにします。<br>
<script src="https://gist.github.com/KuanChunChen/aa1c6a31dc8ee2a38432db88ec0125b3.js"></script><br>


gattCallbackのインスタンス化の中で、<br>
broadcastUpdateというメソッドがあることに気づくでしょう。<br>
このメソッドは主にブロードキャストメッセージを送信するためのものです。<br>
自分のニーズに応じて、どのような状況で何をするか、<br>
またはどのようなブロードキャストメッセージを返すかを定義できます。<br>

簡単な接続とデバイスの検索<br>
大体こんな感じです。<br>

次に、Bluetoothで最も重要なのは端末間の通信です。<br>
データを送受信したい場合は、<br>
serviceとcharacteristicを見つける必要があります。<br>
ここで図を示します。<br>

<img src="/images/bluetooth/ble_logo.png" alt="Cover" width="50%" >
これはBluetooth接続時のおおよその関係図です。<br>


次の方法で見つけます：<br>
<script src="https://gist.github.com/KuanChunChen/2b6fb90e97f14b00e6a942b43f653644.js"></script>
前にブロードキャストで取得したgatt serviceを渡すと、<br>
遍歴してcharacteristicを取得できます。<br>

Android公式がcharacteristicのクラスを既に用意しているので、<br>
読み取るには関連する関数を呼び出すだけです。<br>

<script src="https://gist.github.com/KuanChunChen/51be18e662704d9cf0241cc27f5f961b.js"></script>
<br>

そして、以前に定義したBluetoothGattCallback内の<br>
onCharacteristicReadで結果が返されます。<br>
ブロードキャストを受信するように定義するだけでデータを取得できます。<br>

<script src="https://gist.github.com/KuanChunChen/ebb8318578499bec7f6cf97f4bc93063.js"></script>


さらに、Bluetoothにはnotifyメソッドもあります。<br>

<script src="https://gist.github.com/KuanChunChen/d9348fbbdc38d3b1bbc20250505c414b.js"></script>

同様に結果が返されます。<br>
BluetoothGattCallback内の<br>
onCharacteristicChangedを確認します。<br>
<script src="https://gist.github.com/KuanChunChen/20abc91e5b0b6a658aa3ae3d17cfdee9.js"></script>


サードパーティツールを使用して<br>
Bluetoothパケットをキャプチャする方法を見たい場合は、以下を参照してください。<br>

<div class="table_container">
  <a href="{{site.baseurl}}/2021/11/12/android-bluetooth-hci-packet/">
  <img src="/images/cover/ea-android_bluetooth_hci_packet.png" alt="Cover" width="25%" >
  [Android][Kotlin]AndroidスマートフォンのBluetoothパケットログをキャプチャする方法</a>
</div>

<div class="c-border-main-title-2">Bluetoothモジュールノート: クラシックBluetooth(BT)と低消費電力Bluetooth(LTE)</div>
<div class="c-border-content-title-4">クラシックBluetooth(BT)</div>
Bluetooth 1.0 / 1.2 / 2.0+EDR / 2.1+EDR / 3.0+EDRなどの基礎上で発展・完成されたもの<br>
Bluetooth 4.0未満のモジュールを指す<br>
一般的にデータ量が多い伝送に使用される<br>
例：音声、音楽、高データ量の伝送など<br>

クラシックBluetoothモジュールはさらに細分化される<br>
従来のBluetoothモジュールと高速Bluetoothモジュール<br>

従来のBluetoothモジュールは2004年に登場<br>
主にBluetooth 2.1プロトコルをサポートするモジュールが代表的<br>
従来のBluetoothには3つの出力レベルがある<br>
Class1 / Class2 / Class3<br>
それぞれ100m / 10m / 1mの伝送距離をサポート<br>

<br>
高速Bluetoothモジュールは2009年に登場<br>
速度は約24Mbpsに向上<br>
従来のBluetoothモジュールの8倍<br>

<div class="c-border-content-title-4">低消費電力Bluetoothモジュール(BLE)</div>

Bluetooth 4.0以上のモジュールを指す<br>
低消費電力Bluetooth技術は低コスト、短距離<br>
2.4GHz ISM周波数帯で動作可能<br>
BLE技術は非常に高速な接続方式を採用しているため<br>
通常は「非接続」状態にしておくことができる（エネルギーを節約）<br>

AndroidスマートフォンのBluetooth 4.xはすべてデュアルモードBluetooth（クラシックBluetoothと低消費電力Bluetoothの両方を持つ）<br>

<div class="c-border-main-title-2">Kotlin + Jetpack Compose Bluetoothアプリの例</div>

最後に、以前書いた例を最近整理してアップしました。必要な方は参考にしてください
  <a style ="color:white;" herf="https://github.com/KuanChunChen/elegantAccessApp">こちらを参照</a>

<a>{% include google/google_ad_client.html %}</a>
