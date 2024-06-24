---
layout: post
title: "Kotlin Flow 重構ネットワーク接続 詳細手順ガイド"
date: 2023-05-24 15:56:16 +0800
image: cover/retrofit_with_kotlin_flow-1.png
tags: [Kotlin,Android]
permalink: /kotlin_flow_refactor
categories: Kotlin
excerpt: "Kotlin Flowを使ってネットワーク接続をリファクタリングする方法を簡単にマスターしましょう。本ガイドでは、効率的で安定したネットワーク接続を実現するための詳細な手順を提供します。"
---

<div class="c-border-main-title-2">前書き</div>
<div class="c-border-content-title-4">
    Kotlinは強力なツールFlowを提供しています
</div>

<p>
    Kotlin Flowはコルーチンに基づく非同期プログラミングライブラリで、<br>
    データストリームを処理するためのリアクティブな方法を提供し、<br>
    非同期操作とシームレスに統合できます。<br><br>

    Kotlin Flowをネットワークリクエストに適用することで、<br>
    非同期タスクをエレガントかつ簡潔に処理でき、<br>
    コードの可読性と保守性が向上します。<br><br>

    <div class="c-border-content-title-4">
        数年前にRxJavaのバージョンも共有しましたので、興味があればご覧ください。
    </div>
    <div class="table_container">
      <a href="{{site.baseurl}}/android-kt-rxjava">
      <img src="/images/cover/ea-website-rxjava-cover-photo-new-1.png" alt="Cover" width="25%" >
      Android開発 - RxJavaを使ったネットワークリクエスト：トークン再取得と再リクエストの実装</a>
    </div>

</p>

<div class="c-border-main-title-2">Kotlin Flowの実際の使用</div>
<div class="c-border-content-title-4">
    実際にFlowを呼び出して収集（collect）する際には、Coroutine Scopeに追加する必要があります。以下のように：<br>
</div>
<p>
  <script src="https://gist.github.com/KuanChunChen/6922457ce9a309d18258b1ac50ed77a6.js"></script>
</p>
<div class = "table_container">
  <p>コード解説</p>
  上記のコードでは、Coroutine ScopeのlifecycleScopeを使用してflowを操作しています。<br>
  作成したAPIを通じてflowを取得し、collectを行います。<br>
  途中でcheckStatusAndRefreshTokenを追加してトークンの有効期限を確認し、<br>
  有効期限が切れている場合は自動的にリフレッシュしてリクエストを再送します。<br><br>
  次に、catch関数を使用して発生する可能性のある例外をキャッチし、<br>
  例外処理で適切な操作を実行します。<br>
  前述のステップが成功した場合、<br>
  <b>collect</b>で戻り値を取得し、<br>
  ロジック処理を行います。<br>
</div><br>

<div class="c-border-main-title-2">Kotlin Flowの実際の開発</div>
<div class="c-border-content-title-4">Kotlin Flowを使用して、元のretrofitコールのコールバックやRxJavaのオペレーターを置き換えます。コードは以下の通りです。</div>
<p>
  <script src="https://gist.github.com/KuanChunChen/d5a3acb5f2b90bee2cd8b60c54adfcab.js"></script>
</p>

<div class = "table_container">
  <p>コード解説</p>
  上記のコードでは、<br>
  目標データを含むFlowを返すstartLogin()関数を定義しています。<br>
  次にリクエストボディを追加し、<br>
  login APIリクエストを実行します。<br><br>

  ここでは、verifyResponse関数を使用して実行されたAPIリクエストの戻り値が期待通りかどうかを確認します。<br>
  <b>（下でverifyResponseのコードを説明します）。</b><br>
  問題がなければ、emitを使用して結果をFlowに発射します。<br><br>

<b>注意してください</b><br>
このFlowのスレッドをIOスレッドに切り替えています（.flowOn(Dispatchers.IO)）。<br>
これにより、ネットワークリクエストがメインスレッド以外で実行されることが保証されます。
</div><br>

<div class="c-border-content-title-4">verifyResponseを追加してAPIリクエストが期待通りかどうかを確認する</div>
<p>
  <script src="https://gist.github.com/KuanChunChen/4a4daf5c3385a105b92cc642f9c505f5.js"></script>
</p>

<div class = "table_container">
  <p>コードの説明</p>
  上記のコードでは、<br>
  ジェネリック型Tを使用して、関数がさまざまなAPIの戻り値に対応できるようにしています。<br><br>

  まず、APIリクエストのHTTPステータスコードが200から300の間にあるかどうかを確認します。<br>
  次に、サーバーから返されたレスポンスの内容が空でないかを確認します。<br>
  これらの条件が満たされる場合、<br>
  対応する例外をスローします。<br>
</div><br>


<div class="c-border-content-title-4">checkStatusAndRefreshTokenを追加して、APIリクエストのトークンが期限切れの場合に自動的にトークンをリフレッシュし、元のAPIを再リクエストする</div>
<p>
  <script src="https://gist.github.com/KuanChunChen/e6e0cc122d03f964c1abafda32cd5b02.js"></script>
</p>

<div class = "table_container">
  <p>コードの説明</p>
  上記のコードでは、<br>
  拡張関数を使用し、<br>
  Flow&lt;BaseResult&lt;T&gt;&gt;として定義しています。<br><br>

  主にAPIリクエストのレスポンスをチェックするために使用します。<br>
  ジェネリック型の戻り値を使用して、複数のAPIの戻り値に対応できるようにしています。<br><br>

  関数タイプの変数tokenRefreshとapiCallを渡し、<br>
  それぞれトークンを再取得するための呼び出しと、再呼び出しの対象となるAPIエンドポイントを指定します。<br>
  上記のコードでは、条件がカスタムエラーコードに一致する場合にemitを発行するようにしています。<br>
</div><br>



<div class="c-border-main-title-2">結論</div>

<div class = "table_container">
  <p>まとめ</p>
  Kotlin Flowを使用してネットワークリクエストを再構築し、RxJavaやRetrofitのコールバックを置き換えることで、<br>
  より強力で柔軟な非同期プログラミング能力を得ることができます。<br>
  Kotlin Flowを使用することで、コードの可読性と保守性が向上し、<br>
  非同期操作をより優雅に処理する方法を提供します。<br><br>

  コードの変更過程で、<br>
  Kotlin Flowを使用して元のRetrofitコールバックを置き換え、APIリクエストをFlowにカプセル化し、<br>
  emitを通じてターゲットデータを発行しました。同時に、APIリクエストが期待通りかどうかを確認するためにverifyResponse関数を追加し、<br>
  HTTPステータスコードが200〜300の範囲内にあるかどうかやレスポンスの内容が空でないかを確認しました。<br><br>

  さらに、<br>
  checkStatusAndRefreshToken関数を導入し、<br>
  APIリクエストのトークンが期限切れの場合に自動的にトークンをリフレッシュし、元のAPIリクエストを再発行できるようにしました。<br>
  このメカニズムにより、APIリクエストの円滑な実行が保証されます。<br><br>

  総括すると、<br>
  Kotlin Flowを使用することでネットワークリクエストのコード構造を改善し、<br>
  非同期操作をより管理しやすく、処理しやすくします。<br>
  コードの可読性、保守性、拡張性が向上し、より良い非同期プログラミング体験を提供します。<br><br>

  また、<br>
  retrofitのコールをflowに変換するlibもいくつかあります。<br>
  これをretrofitのインターフェースに直接適用することができます。<br>
  しかし、このようなlibは第三者や個人の共有に偏っていることが多く、<br>
  特定のプロジェクトや製品では、libの導入を評価する必要があるため、<br>
  あまり使用されないlibを導入しないことがあります。<br>
  その場合、自分で実装することになります。<br>

  もちろん、使用できる方法はすべて良い方法です。<br>
  プロジェクト環境に最も適した方法を見つけ、効率的に問題を解決することも重要です！<br>

</div><br>
