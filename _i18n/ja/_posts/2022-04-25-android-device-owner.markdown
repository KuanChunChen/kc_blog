---
layout: post
title: "[Android教學]Android Device Owner権限をマスターし、企業レベルの管理を簡単に！"
date: 2022-04-25 18:19:28 +0800
image: cover/android-device-owner-1.png
tags: [Android,Debug]
categories: Android教學
excerpt: "企業レベルのAndroidデバイスを簡単に管理したいですか？この記事では、Android Device Owner権限のリクエストと実際の使用方法について詳しく説明します。"
---


<div class="c-border-main-title-2">前言：Device owner権限を探る</div>

<div class="c-border-main-title-2">なぜDevice Ownerになるのか</div>
通常の権限では満たせないニーズに遭遇したことはありますか？<br>
例えば、<br>
特定の画面を強制設定したり、<br>
ユーザーが特定のアプリをアンインストールできないようにしたい場合、Device Owner権限が必要です。<br>


要するに、<br>
Device Owner権限は、通常の権限では対応できないニーズを満たすことができ、<br>
使用するかどうかは具体的なアプリケーションのシナリオによります。<br><br>

この権限を使用すると、Android公式が提供するDevicePolicyManagerのAPIを利用できます。<br>
利用可能なAPIについては、Android公式のDevicePolicyManagerドキュメントを参照してください。<br>
<a href="https://developer.android.com/reference/android/app/admin/DevicePolicyManager" target="_blank">DevicePolicyManagerドキュメント</a>

<div class="c-border-main-title-2">Device Ownerになる方法</div>

<div class="c-border-content-title-4">AndroidアプリをDevice Ownerにする方法はいくつかあります。以下はそのうちの二つです：</div>

<p style="margin-top: 15px;" class="table_container">
	1. Factory Reset後、ウェルカム画面で「Welcome」を7回タップし、カメラを使ってQRコードをスキャンします。<br>
	2. Factory Reset後、8回タップし、GMSでQRコードをスキャンします（GMSが必要）。
</p>

注意：メーカーによって方法が異なる場合があります。<br>
しかし、ほとんどの場合、これらの方法が使えます。特別なOTAを使用している場合のみ、使用できない可能性があります。<br><br>
次に、これらの手順を実行するためのQRコードを作成します。<br>

<p style="margin-top: 15px;" class="table_container">
1. 以下のコマンドを使用し、apk_download_linkにAPKのダウンロードURLを入力します。<br>
<b>curl -s [apk_download_link] | openssl dgst -binary -sha256 | openssl base64 | tr '+/' '-_' | tr -d '='</b><br><br>

2. 以下のJson形式を使用し、値を入力します。<br>
   <b>android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME</b>：パッケージ名/AdminReceiverのパスを入力 <br>
   <b>android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_CHECKSUM</b>：手順1で生成されたハッシュコードを入力<br>
   <b>android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION</b>：ダウンロードURLを入力<br>
</p>
<script src="https://gist.github.com/KuanChunChen/8a9376c9f99b70090c2c45a58defdf09.js"></script>

<p style="margin-top: 15px;" class="table_container">
	3. 手順2のjson形式を使ってQrCodeを生成します。<br>
	その後、Factory Reset後に前述の2つの方法でQRコードカメラを開き、<br>
	ユーザーに生成したQrCodeをスキャンさせます。<br>
	システムが設定されると、<br>
	そのアプリは自動的にインストールされ、Device Ownerになります。<br><br>

	この方法は通常、開発者以外の人が使用するためのものです。<br>
	例えば、各端末の開発者が先にapkをアップロードし、<br>
	その後apkのダウンロードURLを取得したら、<br>
	上記の手順でハッシュコードを生成し、json形式のデータを作成してQrCodeを生成します。<br>
	これにより、開発者以外の人でもUI操作を通じてDevice Ownerアプリを生成できます。<br>
</p>

<div class="c-border-content-title-4">別の方法：adbコマンドを使用して指定アプリをdevice ownerにする</div>
  ここでは、指定アプリのAdmin Receiverのパスを以下のコマンドに入力するだけで、<br>
  そのアプリをdevice ownerにすることができます。<br>
  `adb shell dpm set-device-owner com.your.package/com.your.package.receivers.AdminReceiver`
   - ただし、このコマンドにはいくつかの制限があります。<br>
   1. 現在のOSにはGMSアカウントが一切存在しないこと。<br>
   通常、Googleサービスを使用するためにはGoogleアカウントにログインする必要がありますが、設定でこれを削除できます。<br>
   2. システム内にはユーザー設定のDevice ownerが1つしか存在できません。既に存在する場合は削除してから必要なアプリを再設定します。<br>
   `adb shell dumpsys device_policy`<br>
   このコマンドで現在のOSに存在するdevice ownerの状況を確認できます。

<div class="c-border-main-title-2">Device Ownerの削除方法</div>
<div class="c-border-content-title-4">コマンドを使用して削除</div><br>
`adb shell dpm remove-active-admin com.your.package/.receivers.AdminReceiver`
 - このコマンドを使用するには： <br>
 `AndroidManifest.xmlの<application>`内に <br>
 `android:testOnly="true"`を追加する必要があります。<br>
 これによりDevice Ownerを削除できます。
 - Device owner権限を持つアプリは通常、削除やadb installでのインストールができません。<br>
 `-r -f`オプションを追加して強制的に上書きするか、強制的に削除してから再インストールします。<br>
 `adb install -r -f ../xxx.apk`

 * 公式APIを使用して削除 <br>
 Device ownerアプリ内で <br>
 `DevicePolicyManager`の`clearDeviceOwnerApp`を使用して権限を削除します。<br>

 * 直接Factory Resetを行う <br>
 上記の他の方法がすべて使用できない場合、最終手段としてFactory Resetを行います。XD

 <div class="c-border-main-title-2">Device Admin Receiverの作成</div>

* これはAdmin権限と補完関係にあります。<br>
Device Ownerにするアプリ内に<br>
Admin Receiverを作成する必要があります。<br>
これにより、Adbを使用して権限を取得する際に<br><br>
後続のReceiverが起動できるようになります。<br>
つまり、<br>
`adb shell dpm remove-active-admin com.your.package/.receivers.AdminReceiver`<br>

* Admin権限とは： <br>
アプリ内にAdmin権限が必要なReceiverを追加することです。<br>
これにより、ユーザーは設定内で`装置管理者`権限を見つけて有効にすることができます。<br>
ただし、これはDevice Ownerとは実際には`異なる`権限です。<br>
`ここで混同しないようにしてください`<br>

* 追加方法は公式サイトを参照：[ドキュメント](https://developer.android.com/guide/topics/admin/device-admin)<br>
ドキュメントには実際の使用例も記載されていますので、参考にしてください。<br>
手順は非常に簡単で、<br>
`DeviceAdminReceiver`のサブクラスを生成し、<br>
それをManifest.xmlに追加するだけです。<br>

* 手順を簡単に説明します。
1. `DeviceAdminReceiver`を継承する

```Kotlin
class AdminReceiver : DeviceAdminReceiver() {
    override fun onEnabled(context: Context, intent: Intent) { 
    }

    override fun onDisabled(context: Context, intent: Intent) {
    } 
}
```

2.
`res/xml`のパスにdevice_admin.xmlの権限宣言を実装します

```xml
<device-admin xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-policies>    
        <limit-password />
        <watch-login />
        <reset-password />
    </uses-policies>
</device-admin>
```

3. 前の2つの項目をマニフェストに追加します

```xml
<receiver
    android:name=".MyAdminReceiver"
    android:permission="android.permission.BIND_DEVICE_ADMIN">
    <meta-data
        android:name="android.app.device_admin"
        android:resource="@xml/device_admin" />

    <intent-filter>
        <action android:name="android.app.action.DEVICE_ADMIN_ENABLED" />
    </intent-filter>
</receiver>
``` 

4. コードを通じてリクエストを行います

```kotlin
fun startAskActiveAdmin() {
    if (!isAdminActive) {
        val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
        intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, deviceAdmin)
        this.activity.startActivityForResult(intent, KnoxManager.DEVICE_ADMIN_ADD_RESULT_ENABLE)
    }
}
```

5. 戻り結果を処理します

```kotlin
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    if (requestCode == KnoxManager.DEVICE_ADMIN_ADD_RESULT_ENABLE) {
        when (resultCode) {
            RESULT_CANCELED -> {
                logger.debug("RESULT_CANCELED")
            }
            RESULT_OK -> {
                logger.debug("RESULT_OK ")
      
            }
        }
    }
}
```


<div class="c-border-main-title-2">Device Owner 実装共有</div>

ここでは以前に行った例をいくつか共有します<br>
ただし、主に概念と実装の一部のコードについて簡単に説明します<br>
個人的にはそれほど難しくないと思います<br>
なので詳細には説明しません<br>

* まず、DevicePolicyManagerとAdminReceiverのインスタンスを取得する必要があります<br>
	<script src="https://gist.github.com/KuanChunChen/c12af22551a91a32a6f85cd3da7e3313.js"></script>

* 取得した後は、必要に応じて呼び出すことができます。実装方法はほぼ同じなので、ここではいくつかの例を挙げるだけにします

	- `アプリを隠す`
	 <script src="https://gist.github.com/KuanChunChen/520157aaceb75c79cda052e10f576a26.js"></script>
	- `ユーザー制限`を追加する
	 <script src="https://gist.github.com/KuanChunChen/15286f247a2120b4320b4cf5f678560e.js"></script>

* その他の例については、Googleの[github](https://github.com/googlesamples/android-testdpc)にあるDevice Ownerを使用したサンプルアプリを参照してください


---
補足：<br>
Device Owner以外にも<br>
以下のコマンドを使用してadbを通じて指定されたアプリの設定を変更することができます<br>
`adb shell pm grant com.your.package android.permission.CHANGE_CONFIGURATION`<br>
または直接`AndroidManifest.xml`に追加することもできます
ただし、システム上のprotectLevelが`signature|privileged`として宣言されているため
（現在のドキュメントでは`signature|privileged`が`signatureOrSystem`に変更されており、効果は以前と同じです）
この権限を使用してアプリの設定を変更するには、システム署名を取得するか、device owner権限を持つ必要があります

公式の<a href="https://developer.android.com/guide/topics/manifest/permission-element?hl=zh-cn
" target="_blank">権限ドキュメント</a>を参照して、`signature|privileged`について理解してください
