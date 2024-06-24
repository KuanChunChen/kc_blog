---
layout: post
title: "Android Logcat 抓取テクニック教本、簡単にマスター：開発者でなくても理解できるlog取得テクニック！"
date: 2022-04-18 16:37:48 +0800
image: cover/android-catch-log-1.png
tags: [Android,Debug]
categories: Debug探討
---

<div class="c-border-main-title-2">前書き</div>

* 今日は、Androidのログを簡単に取得するためのテクニックを皆さんに共有したいと思います！<br>
  開発過程でよくある問題：「ログを素早く取得する方法は？」<br>
  「テストや他の非開発者でも簡単にAndroidのログを取得する方法は？」<br>
  心配しないでください！簡単でわかりやすい方法をいくつかまとめましたので、開発とテストをより効率的に行うための助けになれば幸いです。<br>

<div class="c-border-main-title-2">Androidログを素早く取得するための基本概念！</div>

  * Androidのログを取得するには、logcatというツールを使用しますが、logcatはシステム内部のログしか取得しないことに注意が必要です。
    - 全体のログを取得する：コマンド `adb logcat` を使用して全体のログを取得できます。<br>
    特定のログだけを取得するためにフィルタ条件を指定することもできます。<br>
    詳細なフィルタ方法については[フィルタログ参考](https://developer.android.com/studio/command-line/logcat#options)を参照してください。
    - 各バッファのサイズを確認する：コマンド `adb logcat -g` を使用して各バッファのサイズを確認できます。
    - 異なるバッファ内のログを確認する：主要なバッファ以外にも、<br>
    radio、events、systemなどの他のバッファも確認できます。<br>
    以下のコマンドを使用して特定のログを確認できます。<br>
    ```
    [adb] logcat [-b 'buffer name']
    ```
    ここで、<buffer_name>は確認したいバッファの名前です。<br>
    例：<br>
    メインバッファログ：<br>
    <b>adb logcat -b main</b><br>
    イベントバッファログ：<br>
    <b>adb logcat -b events</b><br>
    など
    - 各バッファの違いについては公式ドキュメントを参照してください：[代替ログバッファの確認](https://developer.android.com/studio/command-line/logcat#alternativeBuffers)

<br>

<div class="c-border-main-title-2">Androidログ取得の考え方</div>
<div class="c-border-content-title-4">以下はadbを使用してAndroidシステムのログを取得する方法です：</div><br>

<p class ="table_container">
  <i style="text-align: center;">su権限が必要</i><br>
 1. カーネルパニックログを取得する：<b style="color:red;">adb pull /sys/fs/pstore/console-ramoops</b><br>
 2. カーネルログを出力する：<b style="color:red;">adb shell cat /proc/kmsg</b>（現在のログを取得し、同じコマンドを再度呼び出すと前回の終了後のログから表示されます）<br>
 3. Linuxカーネルリングバッファログ：<b style="color:red;">adb shell su dmesg</b><br>
 <a herf="https://man7.org/linux/man-pages/man1/dmesg.1.html">dmesgコマンド参考</a>
</p>

<p class ="table_container">
  <i style="text-align: center;">権限不要</i><br>
  1. ANRログを取得する：<b style="color:red;">adb pull /data/anr</b><br>
</p>

<div class="c-border-content-title-4">PC端でadb logcatコマンドを実行する</div>
  - adb logcatを使用して、現在接続されているデバイスのログを取得することもできます。例：
  ```
  adb logcat
  ```

 <br>
 <div class="c-border-content-title-4">Androidアプリからコードでログを取得する</div>
  * この方法は、開発者が以下の方法でアプリ内にログ取得機能を組み込み、非開発者がログを取得できるようにするものです。
    - コマンドを実行するプロセスを開く：
    例：`Runtime.getRuntime().exec("logcat -b radio")`

    - Android 4.1以前では、<br>
      開発者はManifest.xmlに "READ_LOGS" 権限を追加することで、<br>
      su権限が必要なログを取得することができました。<br>

      しかし、Android 4.1以降では、<br>
      Googleは "READ_LOGS" 権限を不良権限のトップ10にリストアップしたため、<br>
      使用が推奨されなくなりました。Google開発者の関連動画を参照してください。<br>
      [Google開発者関連動画](https://www.youtube.com/watch?v=WDDgoxvQsrQ&t=1323s)

    - そのため、Android 4.1以降では、アプリ内でログを取得する権限が `“signature|privileged”` に変更されました。
       これは `システム署名` が必要であるか、
       ビルドイメージ時に特権フォルダ `../priv-app` にパッケージされたアプリ ([特許権限ホワイトリスト](https://source.android.google.cn/devices/tech/config/perms-whitelist?hl=zh-cn))
       でなければ `READ_LOGS` 権限を取得できません。

    - PCからコマンドを実行する場合：
      `adb shell "pm grant <package name> android.permission.READ_LOGS && am force-stop <package name>" `

       これにより `READ_LOGS` 権限を有効にし、アプリを強制終了します（コマンド実行後にアプリを再起動する必要があります）。
       権限を無効にするには `grant` を `revoke` に変更します。



<div class="c-border-content-title-4">手作業でのログ取得：前述の方法を組み合わせる</div>
  - 開発者がAndroidアプリ内でログを対応するフォルダに書き込み、<br>
    その後adb pullで取得する

  - 例：アプリが完成した後、adb pullで取得する<br>
      `adb pull /sdcard/Android/data/your.package.name/files/`
<br>

<div class="c-border-content-title-4">別の、より迅速な方法：スクリプトまたはシェルの使用</div>

  - シェルスクリプトを使用してバックグラウンドでログを取得する
  - ここでは簡単なスクリプトの例を紹介します：<br>
<script src="https://gist.github.com/KuanChunChen/ff02fe2fa4d02a0b6521bdc75ef61666.js"></script>

<p class ="table_container">
  1. <b style="color:red;">開発者</b>がカスタマイズする場合は、上記のコードを完全に理解する必要があります。<br>
  2. <b style="color:red;">非開発者</b>が上記のコードをtxtまたは空白のファイルにコピーする場合：<br>  
     まず、PC環境にadbがインストールされていることを確認します。<br>
     <b style="color:red;">packageName</b> を指定のアプリパッケージ名に変更します。<br>
     <b style="color:red;">adbPath</b> をadbのシステムパスに変更します。<br>
     （非開発者が使用する場合、./adbを同じフォルダに配置し、adbがインストールされていないPCでも実行できるようにすることも可能です）
  4. （オプション）出力されるログファイル名をカスタマイズすることも可能で、タイムスタンプを追加して区別することもできます。<br>
</p>
  - 最後にスクリプトを作成し、ターミナル（mac terminal / win cmd）で ./your_add_log.sh を実行します。<br>
  これでログ取得が開始されます！<br>
  ![shell_log_start.png](/images/others/shell_log_start.png)
