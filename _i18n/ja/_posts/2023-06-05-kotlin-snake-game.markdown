---
layout: post
title: "Android Kotlin：クラシックなスネークゲームの再現、1日で作って遊べる！"
date: 2023-06-05 17:24:06 +0800
image: snake_game/kotlin_snake_game_post.png
tags: [Kotlin,Android]
permalink: /kotlin_snake_game
categories: Android實作
excerpt: "このチュートリアルでは、クラシックなスネークゲームを一歩一歩作成し、ゲーム開発の楽しさを存分に体験していただきます！初心者から経験豊富な開発者まで、この実践的なチュートリアルを通じてKotlin言語とゲーム開発の理解を深めることができます。一緒にこの老若男女に愛されるゲームを再現し、自分だけのクラシックな思い出を作りましょう！"
---

<div class="c-border-main-title-2">前書き</div>
<div class="c-border-content-title-4">
    このチュートリアルでは
</div>
<p>
AndroidのカスタムViewを使用してクラシックなスネークゲームを実現する方法を学びます。
<div class="c-border-content-title-4">
    以下は実現する機能です
</div>
1.蛇の移動と方向転換<br>
2.ランダムに食べ物を生成<br>
3.蛇が食べ物を食べると成長<br>
4.境界または自身に衝突したときにゲームをリセット<br>
<div align="center">
  <img src="/images/snake_game/snake_demo.gif" alt="Cover" width="20%"/>
</div>
</p>

<div class="c-border-main-title-2">スネークゲームのViewの実装</div>
<div class="c-border-content-title-4">
    カスタムViewクラスの作成<br>
</div>
<p>

  <script src="https://gist.github.com/waitzShigoto/eb9fc1cf52e51c18c85160b9dec6b418.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
      まず、SnakeGameViewという名前のカスタムViewクラスを作成し、Viewクラスを継承します。<br>
  </div><br>
</p>

<div class="c-border-content-title-4">
    変数の定義と初期化<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/696e8b14f4b8fdd8e9a5ebc317105b80.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
      SnakeGameViewクラス内で、蛇の位置、サイズ、方向など、ゲームに必要な変数を定義します。<br>
      以下は各項目の用途の概要です<br>
      screenWidth:キャンバスの幅（蛇が走れる領域）<br>
      screenHeight:キャンバスの高さ（蛇が走れる領域）<br>
      snakeSize: 蛇のサイズ<br>
      snake:蛇全体の座標をLinkedListに格納<br>
      food：食べ物の座標<br>
      foodPaint：食べ物のスタイル<br>
      direction：蛇の頭の方向<br>
      score：スコア<br>
      updateHandler：スネークゲームの画面を継続的に更新するための間隔イベント<br>
      snakeHeadBitmap：蛇の頭のビットマップ画像<br>
      snakeBodyBitmap：蛇の体のビットマップ画像<br>
      borderColor：境界線の色<br>
      borderWidth：境界線の幅<br>
      borderPaint：境界線のスタイル<br>
      pendingDirection：次に向かう方向<br>
  </div><br>
</p>

<div class="c-border-content-title-4">
    ゲーム画面のサイズ設定<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/9c426a1e42cdd7b27a04169083e01d2d.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
    SnakeGameViewクラス内で、<br>
    onMeasureメソッドをオーバーライドして、<br>
    蛇のサイズに基づいてゲーム画面のサイズを調整する必要があります。<br>
    この例では、ゲーム画面が自動的に適応し、<br>
    蛇が完全に移動できるようにする方法を示しています。<br>
    主な理由は、異なるメーカーのスマートフォンのサイズと密度が異なるため、<br>
    設定された画面サイズと蛇の幅、高さが異なる可能性があり、<br>
    ゲームの効果に影響を与える可能性があるためです。<br>
    ユーザー体験の一貫性を確保するために、この設計が採用されています。<br>
    開発者は自分のニーズに応じて適切に調整できます。
  </div><br>
</p>

<div class="c-border-content-title-4">
    蛇と食べ物の描画<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/6d59bfaf552bade337814b0016fd0725.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
    SnakeGameView の<br>
    onDraw メソッドで、<br>
    蛇と食べ物を描画します。<br>
    この例では、ビットマップを使用して蛇の頭と体のリソースを導入し、<br>
    貪食蛇の外観をカスタマイズします。<br>
    また、蛇は常に移動し方向を変える必要があるため、<br>
    Matrix() + rotationAngle を使用して回転角度を設定します。<br>
    <pre>
    val rotationAngle = when (direction) {
      Direction.UP -> 180f
      Direction.DOWN -> 0f
      Direction.LEFT -> 90f
      Direction.RIGHT -> -90f
    }</pre>

    <pre> val matrix = Matrix()
          matrix.postRotate(rotationAngle, bodyBitmap.width / 2f, bodyBitmap.height / 2f)
          matrix.postTranslate(part.x.toFloat(), part.y.toFloat())
          canvas.drawBitmap(bodyBitmap, matrix, null)</pre>
    自分のニーズに応じて適切に調整することもできます。<br>
  </div><br>
</p>

<div class="c-border-content-title-4">
    ゲームロジック<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/d3d6fa84b498999473e0ed041fcb48be.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
    ゲームの主要なロジック（蛇の移動、衝突検出など）を実装するために、updateGame メソッドを追加します。<br>
    resetGame() では、壁や自分に衝突したときに実行する手順を定義できます。<br>
    例：ポップアップを表示、終了画面など。
  </div><br>
</p>

<div class="c-border-content-title-4">
    食べ物の生成<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/3f8e352778a37d355b2afb2607013b23.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
    ランダムに食べ物を生成するために、generateFood メソッドを追加します。<br>
    ランダムに生成された x, y 座標を前に宣言した food オブジェクトに指定します。<br>
    これにより、onDraw 時にランダムに食べ物を生成する効果が実現できます。<br>
  </div><br>
</p>

<div class="c-border-content-title-4">
    方向の更新<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/f5880e17a1706da1c958ad3e1a7925ac.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
    蛇がユーザーの操作に応じて方向を変えるために、<br>
    updateDirection メソッドを実装する必要があります。
  </div><br>
</p>


<div class="c-border-content-title-4">
    リソースの解放<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/6dad33e94f9f62d5a3db492a8f2655f0.js"></script>
  <div class = "table_container">
    <p>コード解説</p>
    メモリリークを避けるために、ビットマップなどの使用済みリソースを解放するメソッドを実装する必要があります。<br>
    これにより、後でアクティビティやフラグメントのライフサイクルに戻ったときにリソースを解放できます。
  </div><br>
</p>

<div class="c-border-content-title-4">
    フラグメント/アクティビティを接続し、ボタンイベントを設定する<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/3dfd240bbe8d1a9b1311d74fcffba44b.js"></script>
  <script src="https://gist.github.com/waitzShigoto/1bcd4c2bc5b927975a4c56f62afe3cb1.js"></script>
  <div class = "table_container">
    <p>コードの説明</p>
    これが最後のステップです。<br>
    前に実装したビューをフラグメントまたはアクティビティに接続し、<br>
    インタラクティブなボタンを追加することで、ユーザーと対話できるスネークゲームが実現します！<br>
    ここでは自作のジョイスティックビューを使用していますが、上下左右の移動には4つのボタンを使用することもできます。<br>
  </div><br>
</p>
