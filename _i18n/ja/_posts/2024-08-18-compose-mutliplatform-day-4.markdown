---
layout: post
title: "Compose Multiplatform 実践：AndroidとiOSシミュレータでCMPプロジェクトを実行"
date: 2024-08-18 17:15:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-4
categories: ComposeMultiplatform
excerpt: "このシリーズのテーマはCompose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。"
---

<div class="c-border-main-title-2">はじめに</div>

`Compose Multiplatform (略称CMP)`<br>
昨日、CMPプロジェクトの構築が完了したばかりです<br>

プロジェクトをIDEに正常にインポートできた場合<br>
以下のようなフォルダ構造が表示されます<br>
<img src="/images/compose/032.png" alt="Cover" width="50%" /><br />

この時点で、コンパイルが可能かどうか確認できます<br>
`正常に`コンパイルされた場合<br>
以下のような画面が表示されます<br>
シミュレータで実装されたアプリ画面が開き<br>
右下にコンパイルの成功・失敗メッセージが表示されます<br>
<img src="/images/compose/033.png" alt="Cover" width="65%" /><br />


<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

<div class="c-border-main-title-2">Androidシミュレータのインストール</div>
昨日の記事：[Wizardを使ってCMPプロジェクトを作成](https://ithelp.ithome.com.tw/articles/10343416)の方法で作成した場合<br>
基本的な`プロジェクト設定はすでに構成済み`です<br>

基本的に、2日目の<a href="{{site.baseurl}}/compose-multiplatform-day-2">CMP環境のインストール</a>で<br>
システム環境が正しくインストールされていることを確認するだけです<br>
例えば、JDK、Kotlinなど<br>
<img src="/images/compose/034.png" alt="Cover" width="50%" /><br />

次に、コンピュータ上でシミュレーションする場合<br>
Androidシミュレータを作成する必要があります<br>
上部システムバーの`Tools > Device Manager`をクリックします<br>

<img src="/images/compose/035.png" alt="Cover" width="35%" /><br />

右側に`Device Manager`ウィンドウが表示されます<br>
<img src="/images/compose/036.png" alt="Cover" width="50%" /><br />

上部の`+`をクリックし、`Create Virtual Device`を選択します<br>
<img src="/images/compose/037.png" alt="Cover" width="50%" /><br />

作成したい`Androidシミュレータ`を選択するウィンドウが表示されます<br>
Phone、Tablet、TV、Watch、Automotiveなどがあります<br>
Android Studioは後期に主に`Google`によって維持されているため<br>
Google Pixel OSを搭載したAndroid Phoneの`AVD(Android Virtual Device)`をダウンロードできます<br>
もちろん、`Pixel AVDのイメージファイル`はAndroid Developer公式サイトからもダウンロードできますが<br>
Googleはそれを親切にIDEに統合してくれています<br>

<img src="/images/compose/038.png" alt="Cover" width="65%" /><br />

希望のPhoneを選択し、右下の`Next`をクリックします<br>
Android SDKの選択画面に進みます<br>
テストしたいSDKに応じて選択します<br>
以前にダウンロードしていないSDKは<br>
グレー表示され、右側にダウンロードアイコンがあります<br>
ダウンロード完了後に選択できるようになります<br>

`Next`をクリックすると、シミュレータの設定ができます<br>
方向、ネットワーク、起動設定、RAMサイズ、SDKサイズなどを設定できます<br>
選択後、右下の`Finish`をクリックします<br>
<img src="/images/compose/039.png" alt="Cover" width="65%"/><br/>

<div class="c-border-content-title-1">IDEを使用してAndroid Appをビルド</div>
上部で先ほど作成したシミュレータを選択し<br>
上部の`プロジェクト実行`ボタン（緑色の再生ボタンのようなもの）をクリックして、IDEにビルドしてもらいシミュレータにインストールします<br>
<img src="/images/compose/040.png" alt="Cover" width="50%"/><br/>

<div class="c-border-main-title-2">手動でAndroid Appをビルド</div>
<div class="c-border-content-title-1">ターミナルで以下のコマンドを実行してAPKをビルド</div>

>  run `./gradlew :yourComposeAppProjectName:assembleDebug`

`yourComposeAppProjectName`はあなたが作成したプロジェクトの名前です
`assembleDebug`はデバッグバージョンをビルドすることを意味します

`.apk`ファイルは`yourComposeAppProjectName/build/outputs/apk/debug/yourComposeAppProjectName-debug.apk`にあります

<div class="c-border-content-title-1">手動インストール</div>
2つの方法があります<br>
1.APKをシミュレータにドラッグ＆ドロップ<br>
2.コマンドを使用してインストール（`実機`でadbを使用する場合は、開発者モードを有効にする必要があります）<br>

```
adb install ../xxx/yourComposeAppProjectName-debug.apk 
```

<div class="c-border-main-title-2">iOSシミュレータのインストール</div>

2日目の<a href="{{site.baseurl}}/compose-multiplatform-day-2">CMP環境のインストール</a>時に<br>
Xcodeがインストールされていることを確認します<br>

Android Studioの画面上部にある`Androidの小さな緑色の人形`アイコンの場所をクリックします<br>
ドロップダウンメニューが表示されます<br>
このセクションはプロジェクトで設定された`Configuration`が統合されています<br>
`Build Android app`、`Build iOS app`、または一部の`gradle task`などがあります<br>
<img src="/images/compose/041.png" alt="Cover" width="50%"/><br/>

初めて`Android Studio`で`iOS app`を実行する場合<br>
デフォルトのBuild iOS Configurationがない可能性があります<br>
そのため、`Edit Configuration`をクリックして設定します<br>
`左上の+をクリック` > `iOS Application`<br>
<img src="/images/compose/042.png" alt="Cover" width="50%"/><br/>

その後、必要に応じて設定できます<br>
a. タスクの名前を設定<br>
<br>
b. Xcode project fileの右端のフォルダアイコンをクリック<br>

c. 表示されるファイル選択ダイアログで`.xcodeproj`のパスを選択<br>
（`.xcodeproj`を選択してopenをクリック）<br>
<img src="/images/compose/043.png" alt="Cover" width="50%"/><br/>
<br>
d. .xcodeprojパスを選択すると<br>
IDEは自動的に内部の`scheme`と`configuration`を読み取ります<br>
そのため、あとは目的の`iOS emulator`バージョンとモデルを選択するだけです<br>
<img src="/images/compose/044.png" alt="Cover" width="50%"/><br/>
<br>
e. Build Configurationを先ほど作成した設定に変更し<br>
`実行ボタン`をクリックします<br>

<div class="c-border-content-title-1">Xcodeを使用してiOS Appをビルド</div>
CMPはrootフォルダ直下にiOSプロジェクトを作成するため<br>
XcodeでCMPプロジェクト配下の`iOSApp`フォルダを直接開くだけで<br>
Xcodeを使ってiOSAppを直接ビルドできます<br>

<div class="c-border-main-title-2">まとめ</div>
これでCMPプロジェクトを完全にビルドし、AndroidとiOSシミュレータで実行できるようになりました<br>
<img src="/images/compose/015.png" alt="Cover" width="50%"/><br/>
明日は<br>
CMPのプロジェクト構造といくつかの一般的な問題について紹介したいと思います<br> 