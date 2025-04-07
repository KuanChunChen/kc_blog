---
layout: post
title: "Jetpack Composeでスプラッシュページにアニメーションを追加しよう！"
date: 2021-09-17 15:02:11 +0800
image: cover/ea-website-splash-cover-photo-new-1.png
tags: [Android,Kotlin,JetpackCompose]
categories: JetpackCompose
permalink: /android-kt-jetpack-compose-splash
excerpt: "Jetpack Composeを使えば、アプリケーションに動的で生き生きとしたスプラッシュページを簡単に追加できます。
この記事では、Jetpack Composeを使ってアニメーションページを作成する方法をステップバイステップで学びます。"

---

<div class="c-border-main-title-2">目標</div>
この記事の目標は、<br>
シンプルなスプラッシュページを作成することです。<br>
最終的に達成する目標は以下の通りです：<br>
<br>

<div align="center">
  <img src="/mov/jetpack/ea_splash_app.gif" width="60%"/>
</div><br>

<div class="c-border-main-title-2">前書き</div>
現在、多くのアプリケーションには、<br>
ユーザーが現在使用しているアプリケーションや会社のロゴを明確に識別できるようにするためのスプラッシュ画面が設計されています。<br>

この記事では、<br>
シンプルな遷移機能を実現し、<br>
簡単な水平拡張アニメーションを組み合わせて、<br>
今日の目標を達成する方法に焦点を当てます。<br>
Jetpack Composeの基礎にまだ慣れていない場合は、<br>
以下の記事を参考にして理解を深めてください：<br>
<br>
<div align="start">
  <a href="{{site.baseurl}}/android-kt-jetpack-compose-base">
    <img src="/images/cover/ea-website-base-cover-photo-new-1.png" alt="Cover" width="20%" >
  </a>

  <a href="{{site.baseurl}}/android-kt-jetpack-compose-base">Android Jetpack Compose 基本応用チュートリアル</a>
</div>


<div class="c-border-content-title-4">この記事は基本概念を理解していることを前提としていますので、まだ理解していない場合は上記の記事を参考にしてください。</div>

----
<div class="c-border-content-title-4">第一歩：ページ構造を考える</div>
まず、<br>
このページの全体的な構造を考える必要があります。<br>
通常、最終的な画面のイメージを先に考えます。<br>
そのため、異なるレイヤーの概念を区別するためにBoxコンポーネントを使用します。<br>

<script src="https://gist.github.com/waitzShigoto/4862edcea54d85e0b3afec37c02f78fa.js"></script>

<div class="c-border-content-title-4">第二歩：スプラッシュページのロゴアニメーションを実装する</div>
このステップでは、関数型のパラメータ <font color="red"> event:()->Unit = {} </font> を渡します。<br>
これにより、後で外部呼び出しをトリガーして実行するアクションを設定できます。<br>
同時に、<br>
アニメーションの入場と退場の時間、<br>
およびアクションを実行する前の遅延時間をデフォルトで設定できます。<br>
これらのパラメータは必要に応じて調整できますが、<br>
理解を容易にするために、関数内部に記述します。<br>

<script src="https://gist.github.com/waitzShigoto/b61eb400f593a0bd389d1b129f7dc9c5.js"></script><br>
具体的な状況に応じて、<br>
ロゴをページの中央に配置し、少し上にずらしたいと思います。<br>
そのため、Columnコンポーネントを追加し、Modifierを使用して位置を調整します。<br>
以下のコードの<font color="red">#23~#34行</font>を参考にして位置を調整してください。<br>

<br>
<script src="https://gist.github.com/waitzShigoto/65f06da7ebceb4e93d08b6fe1aad7629.js"></script>

<div class="c-border-content-title-4">第三歩：この記事のメインイベント</div>

現在私たちはアニメーションの重要な部分に入ります、<br>
Jetpack Compose の AnimatedVisibility を使用します。<br>
このクラスは多くの組み込みメソッドを提供しており、<br>
基本的なアニメーション効果を迅速に実現することができます。<br>

この部分では、<br>
まず前に定義した val 変数 state を見てみましょう。<br>
これは Jetpack Compose でよく使われる概念の一つです。<br>
なぜなら、単独で Composable を使用してコードを書くとき、<br>
XML で自動的に更新されることはないからです。<br>

<font color="red">state を通じて composable に更新を通知する必要があります</font><br>

```Kotlin
val state = remember {

    MutableTransitionState(false).apply {
        ...
    }
}
```

ここでは <font color="red">remember</font> を使って MutableTransitionState オブジェクトを記憶（保存）します。<br>

ここで重要なのは MutableTransitionState です。<br>
これは二つの状態を含む、状態を観察可能な項目です。<br>
その中には <font color="red">currentState</font> と <font color="red">targetState</font> が含まれます。<br>

公式の説明によると、<br>
観察可能な state の状態が変わると、<br>
システムが compose を再構成するようにトリガーされます。<br>
したがって、この特性を利用して、<br>
リアルタイムで compose コンポーネントの内容を変更することができます。<br>

例えば、ここでの例は：<br>
1. まず、初期状態が false の staus を宣言します。<br>
2. AnimatedVisibility を使用して、その visibleState を先ほど宣言した staus に設定します。<br>
3. 先ほど宣言した val staus の場所に apply を追加します。<br>
<br>
その概念は、<br>
kotlin の extension 概念 apply を利用して scope 内のコードを実行します。<br>
apply は親クラス内の特性を取得できるため、<br>
MutableTransitionState 内の targetState を true に設定します。<br>
<font color="red">この動作により MutableTransitionState が変化します。<br></font>
したがって、この staus を使用するものは、上記の特性をトリガーします。<br>
これにより、開発時に compose を変更するタイミングを判断する根拠が得られます。<br>

```kotlin
val state = remember {

        MutableTransitionState(false).apply {
            // Start the animation immediately.
            targetState = true

            ...

        }
    }
```

つまり、<br>
上記の方法でアニメーションをトリガーし、<br>
トリガー後に Handler を同時にトリガーしてジャンプ動作を実行します：<br>

```kotlin
val state = remember {
        MutableTransitionState(false).apply {
            // Start the animation immediately.
            targetState = true

            Handler(Looper.getMainLooper()).postDelayed({
                event.invoke()
            }, delayMillis)

        }
    }
```
<br>

次に、<br>
アニメーションの作成を開始します。<br>
ここでも Jetpack Compose のライブラリを使用します。<br>
具体的には AnimatedVisibility を使用します。<br>

この関数では、以下の変数を使用します：<br>
1. visibleState：これはアニメーションの表示状態を制御する変数です。<br>
前述の remember と MutableTransitionState を通じて、<br>
このライブラリのアニメーション効果をトリガーできます。<br><br>
言い換えれば、この状態が変わると、この関数が再度実行されます。<br>
2. enter：これはアニメーションの入場効果を定義する変数です。<br><br>
3. exit：これはアニメーションの退場効果を定義する変数です。<br>
<br>
これらの変数を設定することで、<br>
アニメーションの出現と消失を制御し、<br>
驚くべき視覚効果を生み出すことができます。<br><br>

上記を理解した後、公式が提供するいくつかの組み込みアニメーションを適用できます。<br>

入場には `expandHorizontally` を使用し、<br>
退場には `fadeOut` を使用します。<br>

つまり、enter と exit にそれぞれ必要なアニメーションを次のように設定します：<br>
```kotlin
AnimatedVisibility(
          visibleState = state,
          enter = expandHorizontally(
              animationSpec = tween(
                  durationMillis = startDurationMillis,
                  easing = LinearEasing
              ),
          ),
          exit = fadeOut(
              animationSpec = tween(
                  durationMillis = exitDurationMillis,
                  easing = LinearEasing
              ),
          )
      ){
        ...
      }
```

次に、<br>
AnimatedVisibilityScope の関数型範囲内で、<br>
表示したいコンポーネントを追加できます。<br>
これでアニメーション効果を表示できます。<br>
<div class="c-border-main-title-2">最終成品、サンプルコード</div>
<script src="https://gist.github.com/waitzShigoto/5953666a7808fbdfb4de564d07a6314e.js"></script>
