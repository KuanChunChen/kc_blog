---
layout: post
title: "[Android][Kotlin]如何抓取Android手機中 Bluetooth 藍芽封包日誌"
date: 2021-11-12 16:16:32 +0800
image: cover/android-photo.jpg
tags: [Android,Bluetooth]
categories: Bluetooth
---

今天這篇文章要來紀錄下之前研究過 <br>
透過logcat或寫code抓取外的方式<br>
來抓取藍芽傳輸間的封包<br>

這些方法其實網路上都有很多人介紹過<br>
但因為看到很多幾乎都是複製貼上或比較舊的資料<br>
所以自己有研究實際上怎麼做到的<br>
會在今天這篇解說<br>

<h1>方法1</h1>
<h2>Step 1 - 打開開發者模式</h2>
首先需要開啟開發者模式<br>
<br>
<img src="/images/bluetooth/open_developer.png" alt="Cover" width="30%" >
<br>

通常是在軟體資訊內點數次版本號 進入開發者模式<br>
但是每一家公司出品的手機不一定會一樣<br>
有一些廠家進入的方式是在電話撥打欄位輸入特定指令<br>
或有其他隱藏鍵按法<br>
所以如果不行可以上網查查你手上的手機如何進開發者模式<br>

成功後就會看到設定裡面多了開發者選項<br>
<br>
<img src="/images/bluetooth/developer.png" alt="Cover" width="30%" >
<br>

<h2>Step 2 - 打開藍芽HCI記錄檔</h2>
之後進入開發者選項<br>
打開藍芽HCI記錄檔 選項<br>
<br>
<img src="/images/bluetooth/open_hci.png" alt="Cover" width="30%" >
<br>
<br>
那打開這個選項後<br>
就會讓系統幫你記錄 藍芽的 HCI snoop log <br>


我爬文到這邊遇到個問題<br>
比較舊版Android的手機會把HCI log 存在 /sdcard 或/stroage<br>
後來的版本有可能存進不同的路徑<br>
而且是存進沒有權限可以read的目錄裡<br>
<br>
導致就算我有這個檔案也沒辦法看<br>
除非你有辦法得到這台手機的root權限或adb shell su權限<br>
不然通常很難用簡單方法來閱讀<br>

所以如果你的手機跟我一樣沒有存在有權限read的目錄<br>
可能可以參考下面步驟去dump出來<br>

<h2>Step 3 - 安裝CLI工具 ADB</h2>

ADB是Android開發時常用到的Debug工具<br>
如果你有安裝Android Studio 的話<br>
他會內建在安裝目錄下的platform tool內<br>
<br>
如果你想要全域使用的話<br>
可以在環境變數中設定<br>
<br>
沒有開發Android習慣<br>
純粹想測試藍芽log的可以透過下列網址下載<br><br>
<a href="https://developer.android.com/studio/releases/platform-tools" class="btn btn-primary" role="button">查看Android Platform Tool</a>
<br>

<h2>Step 4 - 連接手機並確認USB調用模式</h2>
確認有開啟開發者模式中的USB調用模式<br>
並確認有連接上pc端<br>
可以用下面指令確認<br>

```
adb devices
```

如果有看到<br>
類似下方訊息<br>

```
List of devices attached
LXXXXXGYPXXCXXXXXX7	device
```

就是有連到了 <br>

<h2>Step 5 - Dump bluetooth HCI log file</h2>

因為遇到檔案存在沒權限讀的地方<br>
所以需要使用指令來dump出來<br>
首先你要執行上方的步驟<br>
包含開啟藍芽HCI擷取<br>
並且啟動藍芽相關操作<br>
讓系統產生log<br>

這邊是一小段shell script

<script src="https://gist.github.com/KuanChunChen/8d55a3492f8cafbfd86196ce8f6d610d.js"></script>

可以直接複製去跑shell<br>
亦可以一行一行複製到terminal去執行
其中主要是使用了

```
adb bugreport <FileName>
```
因為原本不能read存有log的目錄
所以使用
指令bugreport<br>
可以幫你dump出<br>
當前Android手機內的系統log<br>
並壓縮成zip檔案到當前目錄
所以我的script我就先pushd到/tmp目錄<br>
不過這邊都是看個人使用習慣<br>
可以自行修改<br>

之後只要解壓縮
```
unzip fetchBugReport.zip
```
你bugreport出來的資料<br>
就會看到你手機內的log data了<br>
之後你就可以cat相關log檔案 <br>
或是拿特定軟體去讀一些難閱讀的檔案<br>

那這邊通常解壓縮出來是串資料夾結構
如
FS/data/log/.../btsnoop_hci.log

我們要找的檔案是藍芽的log檔 <br>
但我試過不同手機<br>
可能出來的目錄結構可能不同<br>
如果想要把shell script 純粹寫成一鍵執行<br>
可能要注意這裡把他拉成變數<br>
就能輕鬆抓取log<br>
如：
<script src="https://gist.github.com/KuanChunChen/d862a1007ddb5bbef96b28a8a5c3e723.js"></script>
這邊就依照個人需求可改寫


最後分享個<br>
在研究過程中<br>
發現不是每台手機都會產生藍芽的log<br>
所以這些不確定性<br>
讓原本想要輕鬆抓封包的想法<br>
變得比較沒那麼靠譜<br>
不過就當知道這個方法<br>
之後如果用到也不虧<br>


<h1>方法2 - nRF Sniffer + Wireshark 抓取藍芽封包</h1>

<h2>Step 1 - 安裝python 與 pyserial</h2>
輸入<br>

```
python --version
```
如果有顯示版本<br>
表示全域環境內已有<br>

<img src="/images/bluetooth/python_version.png" alt="Cover" width="100%" >
<br>
沒有的話可以透過<br>

法1:
<a href = "https://www.python.org/downloads/">python官網</a>
安裝<br>
法2:透過brew安裝<br>
<img src="/images/bluetooth/python_install.png" alt="Cover" width="30%" >


在terminal內輸入以下指令<br>
安裝pyserial<br>
```
pip install pyserial
```
如出現 Successfully 字樣則表示安裝成功


<h2>Step 2 - 安裝 WireShark  </h2>

前往
<a href = "https://www.wireshark.org/download.html">WireShark 官網</a>
下載安裝檔

<img src="/images/bluetooth/wireshark_web.png" alt="Cover" width="50%" >
<br>
<br>
選擇屬於你os的版本<br>
並且像是平常一樣安裝你的套裝軟體<br>
<br>
<img src="/images/bluetooth/wireshark_dmg_phtot.png" alt="Cover" width="30%" >

<h2>Step 3 - 安裝 nRF-Sniffer-for-Bluetooth-LE 插件  </h2>


透過連結下載
<a href = "https://www.nordicsemi.com/Products/Development-tools/nRF-Sniffer-for-Bluetooth-LE/Download#infotabs">nRF-Sniffer-for-Bluetooth-LE</a><br>

選擇想要的版本<br>
版本的Changelog可以在下拉欄看<br>
<br>
<img src="/images/bluetooth/nRF_changelog.png" alt="Cover" width="50%" >
<br><br>
我是下載4.1.0<br>
這邊根據自己所需選擇<br>

解壓縮下載的zip後找到extcap資料夾
<br><br>
<img src="/images/bluetooth/excap.png" alt="Cover" width="50%" >
<br><br>


並打開WireShark 的About WireShark<br>
mac版的是在應用程式名稱內<br><br>
<img src="/images/bluetooth/wireshark_about.png" alt="Cover" width="30%" >
<br><br>

找到 Golbal Extcap Path <br><br>
<img src="/images/bluetooth/wireshark_folder.png" alt="Cover" width="60%" >
<br><br>

extcap是 wireshark放 插件的資料夾<br>
把上面下載好的nRF-Sniffer-for-Bluetooth-LE extcap資料夾<br>
內的檔案全部複製到這個資料夾裡<br>

<h2>Step 4 - 使用 官方提供的硬體開始抓封包  </h2>

官網提到 需要以下硬體才能進行抓包

<img src="/images/bluetooth/nRF_dongle.png" alt="Cover" width="60%" >
<br><br>

上網購買<br>
或本身就有 插入電腦後直開wireshark<br>

找到連接的 來源選<br>
nRF Sniffer for Bluetooth LE COMXX<br>
就能開始抓了<br>


結論<br>
這個方法 抓藍芽封包 比較小雜<br>
所以如果手邊剛好有設備也能用這個方法試試看<br>
