---
layout: post
title: "[Android][Kotlin]AndroidスマホでBluetoothパケットログを取得する方法"
date: 2021-11-12 16:16:32 +0800
image: cover/ea-android_bluetooth_hci_packet.png
tags: [Android,Bluetooth]
categories: Android教學
---

今日は、以前に研究した<br>
logcatやコードを書かずに<br>
Bluetooth通信のパケットを取得する方法を記録します。<br>

これらの方法はネット上で多くの人が紹介していますが、<br>
多くはコピー＆ペーストや古い情報が多いので、<br>
実際にどうやって行うかを研究しました。<br>
今日はその解説をします。<br>

もし、gattサーバーの接続方法を見たい場合は、こちらをご覧ください。<br>
<a href="{{site.baseurl}}/2021/11/12/android-kotlin-bluetooth-gatt-client/">
<img src="/images/cover/android-kotlin-bluetooth-gatt-client.png" alt="Cover" width="25%" >
[Android][Kotlin][2021]Android低功耗藍芽Gatt連線實作教學！</a>
<br><br>

本文開始：<br>
# 方法1
### Step 1 - 開発者モードを有効にする
まず、開発者モードを有効にする必要があります。<br>
<br>
<img src="/images/bluetooth/open_developer.png" alt="Cover" width="30%" >
<br>

通常はソフトウェア情報内でバージョン番号を数回タップして開発者モードに入りますが、<br>
各メーカーのスマホによって異なる場合があります。<br>
一部のメーカーでは、電話ダイヤル画面で特定のコマンドを入力するか、<br>
他の隠しキーを押す方法があります。<br>
もしうまくいかない場合は、手持ちのスマホの開発者モードの入り方をネットで調べてください。<br>

成功すると、設定内に開発者オプションが表示されます。<br>
<br>
<img src="/images/bluetooth/developer.png" alt="Cover" width="30%" >
<br>

### Step 2 - Bluetooth HCIログを有効にする
次に、開発者オプションに入り、<br>
Bluetooth HCIログオプションを有効にします。<br>
<br>
<img src="/images/bluetooth/open_hci.png" alt="Cover" width="30%" >
<br>
<br>
このオプションを有効にすると、<br>
システムがBluetoothのHCIスヌープログを記録します。<br>

ここで問題に直面しました。<br>
古いバージョンのAndroidスマホでは、HCIログが/sdcardや/storageに保存されますが、<br>
新しいバージョンでは異なるパスに保存される可能性があります。<br>
さらに、読み取り権限のないディレクトリに保存されることがあります。<br>
<br>
そのため、このファイルがあっても読むことができません。<br>
スマホのroot権限やadb shell su権限がない限り、<br>
簡単に読むことは難しいです。<br>

もし、あなたのスマホが私と同じように読み取り権限のあるディレクトリに保存されていない場合、<br>
以下の手順を参考にしてダンプしてください。<br>

### Step 3 - CLIツールADBをインストールする

ADBはAndroid開発でよく使用されるデバッグツールです。<br>
Android Studioをインストールしている場合、<br>
インストールディレクトリのplatform tool内に内蔵されています。<br>
<br>
全域で使用したい場合は、環境変数に設定できます。<br>
<br>
Android開発の習慣がなく、<br>
単にBluetoothログをテストしたい場合は、以下のURLからダウンロードできます。<br><br>
<a href="https://developer.android.com/studio/releases/platform-tools" class="btn btn-primary" role="button">Android Platform Toolを見る</a>
<br>

### Step 4 - スマホを接続し、USBデバッグモードを確認する
開発者モードのUSBデバッグモードが有効になっていることを確認し、<br>
PCに接続されていることを確認します。<br>
以下のコマンドで確認できます。<br>

```
adb devices
```

以下のようなメッセージが表示されれば、<br>
接続されています。<br>

```
List of devices attached
LXXXXXGYPXXCXXXXXX7	device
```

### Step 5 - Bluetooth HCIログファイルをダンプする

ファイルが読み取り権限のない場所に保存されているため、<br>
コマンドを使用してダンプする必要があります。<br>
まず、上記の手順を実行し、<br>
Bluetooth HCIキャプチャを有効にし、<br>
Bluetooth関連の操作を開始して、<br>
システムにログを生成させます。<br>

ここに一小段のシェルスクリプトがあります

<script src="https://gist.github.com/waitzShigoto/8d55a3492f8cafbfd86196ce8f6d610d.js"></script>

直接コピーしてシェルで実行できます<br>
または一行ずつターミナルにコピーして実行することもできます
主に使用するのは

```
adb bugreport <FileName>
```
元々ログが保存されているディレクトリを読み取れないため
bugreportコマンドを使用します<br>
これにより、現在のAndroidスマートフォン内のシステムログをダンプし<br>
zipファイルに圧縮して現在のディレクトリに保存します
そのため、スクリプトではまず/tmpディレクトリにpushdします<br>
ただし、これは個人の使用習慣によるので<br>
自由に変更できます<br>

その後、解凍するだけです
```
unzip fetchBugReport.zip
```
bugreportで出力されたデータ<br>
スマートフォン内のログデータが表示されます<br>
その後、関連するログファイルをcatするか<br>
特定のソフトウェアを使用して読み取りにくいファイルを読むことができます<br>

通常、解凍するとフォルダ構造が連結されます
例：
FS/data/log/.../btsnoop_hci.log

探しているファイルはBluetoothのログファイルです<br>
ただし、異なるスマートフォンで試したところ<br>
出力されるディレクトリ構造が異なる場合があります<br>
シェルスクリプトをワンクリックで実行できるようにしたい場合<br>
ここを変数にしておくと<br>
ログを簡単に取得できます<br>
例：
<script src="https://gist.github.com/waitzShigoto/d862a1007ddb5bbef96b28a8a5c3e723.js"></script>
ここは個人のニーズに応じて書き換え可能です


最後に共有しますが<br>
研究過程で<br>
すべてのスマートフォンがBluetoothのログを生成するわけではないことがわかりました<br>
そのため、これらの不確実性により<br>
パケットを簡単にキャプチャするという元々の考えが<br>
あまり信頼できないものになりました<br>
ただし、この方法を知っておくと<br>
後で使用する場合に損はありません<br>


# 方法2 - nRF Sniffer + WiresharkでBluetoothパケットをキャプチャ

### Step 1 - Pythonとpyserialのインストール
入力<br>

```
python --version
```
バージョンが表示されれば<br>
グローバル環境に既にインストールされています<br>

<img src="/images/bluetooth/python_version.png" alt="Cover" width="100%" >
<br>
表示されない場合は<br>

方法1:
<a href = "https://www.python.org/downloads/">Python公式サイト</a>
からインストール<br>
方法2:brewを使用してインストール<br>
<img src="/images/bluetooth/python_install.png" alt="Cover" width="30%" >


ターミナルに以下のコマンドを入力して<br>
pyserialをインストールします<br>
```
pip install pyserial
```
Successfullyと表示されればインストール成功です


### Step 2 - WireSharkのインストール   

<a href = "https://www.wireshark.org/download.html">WireShark公式サイト</a>
にアクセスしてインストーラをダウンロードします

<img src="/images/bluetooth/wireshark_web.png" alt="Cover" width="50%" >
<br>
<br>
自分のOSに合ったバージョンを選択し<br>
通常のソフトウェアインストールのようにインストールします<br>
<br>
<img src="/images/bluetooth/wireshark_dmg_phtot.png" alt="Cover" width="30%" >

### Step 3 - nRF-Sniffer-for-Bluetooth-LEプラグインのインストール  


リンクからダウンロードします
<a href = "https://www.nordicsemi.com/Products/Development-tools/nRF-Sniffer-for-Bluetooth-LE/Download#infotabs">nRF-Sniffer-for-Bluetooth-LE</a><br>

必要なバージョンを選択します<br>
バージョンのChangelogはドロップダウンで確認できます<br>
<br>
<img src="/images/bluetooth/nRF_changelog.png" alt="Cover" width="50%" >
<br><br>
私は4.1.0をダウンロードしました<br>
ここは自分の必要に応じて選択してください<br>

ダウンロードしたzipを解凍し、extcapフォルダを見つけます
<br><br>
<img src="/images/bluetooth/excap.png" alt="Cover" width="50%" >
<br><br>

並打開WireShark のAbout WireShark<br>
mac版的是在應用程式名稱內<br><br>
<img src="/images/bluetooth/wireshark_about.png" alt="Cover" width="30%" >
<br><br>

Golbal Extcap Path を見つける<br><br>
<img src="/images/bluetooth/wireshark_folder.png" alt="Cover" width="60%" >
<br><br>

extcapは wiresharkがプラグインを置くフォルダです<br>
上記でダウンロードしたnRF-Sniffer-for-Bluetooth-LE extcapフォルダ内のファイルをすべてこのフォルダにコピーします<br>

### Step 4 - 公式提供のハードウェアを使用してパケットキャプチャを開始する {/*examples*/}

公式サイトでは、パケットキャプチャを行うために以下のハードウェアが必要とされています

<img src="/images/bluetooth/nRF_dongle.png" alt="Cover" width="60%" >
<br><br>

オンラインで購入するか<br>
既に持っている場合は、コンピュータに挿入してwiresharkを開きます<br>

接続されたソースを見つけて選択します<br>
nRF Sniffer for Bluetooth LE COMXX<br>
これでキャプチャを開始できます<br>

結論<br>
この方法でBluetoothパケットをキャプチャするには、追加のハードウェアが必要なため、少しコストがかかります<br>
したがって、手元に適切なハードウェアがある場合は、この方法を試してみる価値があります<br>
