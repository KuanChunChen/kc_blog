---
layout: post
title: "実装ガイド：AndroidアプリにHuawei HMS Core 4.0 SDKを成功導入する方法"
date: 2020-09-15 10:06:32 +0800
image: cover/android-hms-sdk-1.png
permalink: /android/huawei_map
tags: [Android]
categories: Android教學
---

<h1 class="c-border-main-title">前書き</h1>
* 過去にプロジェクトで<br>
Huawei SDKの導入を求められた経験があり<br>
その時のメモを整理して<br>
皆さんと共有します！<br>
全体的な開発は<br>
実際にはGoogle gmsと非常に似ています <br>

<h1 class="c-border-main-title">HMSの導入</h1>


<div class="c-border-content-title-1">第一歩:アカウント登録</div>
* まずは[Huaweiバックエンド](https://developer.huawei.com/consumer/cn)で実名会員に登録する必要があります<br>
 詳細な方法は[アカウント登録認証](https://developer.huawei.com/consumer/cn/devservice/doc/20300)を参照してください。

<div class="c-border-content-title-1">第二歩:バックエンドでアプリを作成</div>
 * ここは他のプラットフォームと非常に似ています<br>
 ユーザーインターフェースを操作してアプリを作成します<br>
 ![1.png](/images/huawei/1.png)<br>
 次に使用するAPIの権限を有効にする必要があります<br>
 これもバックエンドで行います<br>
 ![2.png](/images/huawei/2.png)<br>

<div class="c-border-content-title-1">第三歩:署名の生成</div>
 * ここもGoogleと非常に似ています<br>
 AS内のツールを使って直接生成できます<br>
 ![3.png](/images/huawei/3.png)<br>
 生成後、以下のコマンドを使用します<br>
 `keytool -list -v -keystore <keystore-file>`<br>
 keystore-file : ここには証明書のパスを入力します<br>
 その後、生成されたSha256ハッシュをHuaweiバックエンドで作成したアプリの設定に貼り付けます<br><br>


<div class="c-border-content-title-1">第四歩:署名の設定</div>
  * 署名を生成した後<br>
  Huaweiバックエンドから `agconnect-services.json` をダウンロードできます<br>
  それをプロジェクトに追加します<br>

  * これは当時のプロジェクトの設定です<br>
  その時の製品要件は<br>
  プロジェクトをビルドする際に異なるメーカーの設定を先にビルドできるようにすることでした<br>
  また、HuaweiデバイスにGMSがインストールされている場合でも<br>
  Googleサービスをサポートする必要がありました<br>
  そのため、設定は以下のようになっています<br><br>
  ![4.png](/images/huawei/4.png)<br><br>
  実際のプロジェクト開発時には<br>
  チームメンバーとコミュニケーションを取ることが重要です<br>

  * `HMS`の多くの関数名は`GMS`と`同じ名前`XD<br>
  そのため、開発時にはしっかりと`区別`することが重要です<br>
  `設定`から始めるか、`コード分離`から始めるか<br>
  そうしないと、後でメンテナンスが非常に困難になります<br>
  耦合が高すぎて分離が難しい場合は...<br>

<div class="c-border-content-title-1">第五歩:プロジェクト設定の追加</div>
  * 次にAndroidプロジェクトに追加します <br>
    build gradleに`maven {url 'https://developer.huawei.com/repo/'}`を設定します
    <script src="https://gist.github.com/waitzShigoto/1ca47854f0a1eb3c94565c3512725050.js"></script>
    <br>

  * 次に必要なHMSキットをプロジェクトに導入します<br>
    ここではHMSマップを例にします<br>
    <script src="https://gist.github.com/waitzShigoto/631f00b79f69c96bd2a226c58eff5199.js"></script>
    `これで正式に開発を開始できます！`

<div class="c-border-content-title-4">開発中に遭遇したHuaweiの小さな違いの共有</div>

 * HmsとGmsの地図の小さな違い<br>
   前述の通り、HMSとGMSの関数名は非常に似ています<br>
   そのため、GMSを使ったことがある人はすぐに慣れるでしょう（？<br>
   ただ、私は運が`良かった`ので<br>
   開発中に<br>
   少し異なる点に遭遇しました<br>
   <div align="center">
     <img src="/images/huawei/6.png" alt="Cover" width="30%" >
     <img src="/images/huawei/7.png" alt="Cover" width="30%" >
   </div>
   それは、同じ定数を設定してもポリラインの太さが異なることです<br>
   例えば、`googlePolylineOption.width(5)` と `huaweiPolylineOption.width(5)` の実際の効果が異なります<br>

   ### だから、すべてのロジックがそのまま適用できるわけではありませんXDD 最善はチェックすることです!!

   最終的に同じにするためにはこうしました<br>
   ![5.png](/images/huawei/5.png)<br><br>

 * `プッシュ通知`の小さな違い<br>
   主に`サブクラスの継承`が異なります<br>
   他の使い方は同じです<br>
   ただ、共有する理由は<br>
   以前に他のHuawei機能を開発したとき<br>
   メソッドやクラスの名前がほぼ同じだったからですXD<br>
   ![8.png](/images/huawei/8.png)<br><br>


<h1 class="c-border-main-title">まとめ</h1>

 * HMSとGMSはパッケージ名が少し異なる以外に<br>
 一部の関数が少し異なるだけです<br>
 全体的に見て、両方のSDKの使い方に大きな違いはありません<br>
