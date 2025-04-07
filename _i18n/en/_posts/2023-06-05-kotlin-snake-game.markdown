---
layout: post
title: "Android Kotlin: Recreating the Classic Snake Game, Playable in Less Than a Day!"
date: 2023-06-05 17:24:06 +0800
image: snake_game/kotlin_snake_game_post.png
tags: [Kotlin,Android]
permalink: /kotlin_snake_game
categories: Android實作
excerpt: "In this tutorial, we will guide you step-by-step to create the classic Snake game, allowing you to fully experience the fun of game development during the learning process! Whether you are a beginner or an experienced developer, this hands-on tutorial will deepen your understanding of the Kotlin language and game development. Let's revisit this timeless game and create your own classic memories!"
---

<div class="c-border-main-title-2">Introduction</div>
<div class="c-border-content-title-4">
    In this tutorial
</div>
<p>
We will learn how to use Android's custom View to implement the classic Snake game.
<div class="c-border-content-title-4">
    Here are the features we will implement
</div>
1. Snake movement and turning<br>
2. Random food generation<br>
3. Snake growth after eating food<br>
4. Game reset upon hitting the boundary or itself<br>
<div align="center">
  <img src="/images/snake_game/snake_demo.gif" alt="Cover" width="20%"/>
</div>
</p>

<div class="c-border-main-title-2">Implementing the Snake Game View</div>
<div class="c-border-content-title-4">
    Create a custom View class<br>
</div>
<p>

  <script src="https://gist.github.com/waitzShigoto/eb9fc1cf52e51c18c85160b9dec6b418.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
      First, create a custom View class named SnakeGameView, inheriting from the View class.<br>
  </div><br>
</p>

<div class="c-border-content-title-4">
    Define variables and initialize<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/696e8b14f4b8fdd8e9a5ebc317105b80.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
      In the SnakeGameView class, define the variables needed for the game, such as the snake's position, size, direction, etc.<br>
      Below is a brief explanation of each variable's purpose<br>
      screenWidth: Canvas width (area where the snake can move)<br>
      screenHeight: Canvas height (area where the snake can move)<br>
      snakeSize: Size of the snake<br>
      snake: Coordinates of the entire snake stored in a LinkedList<br>
      food: Coordinates of the food<br>
      foodPaint: Style of the food<br>
      direction: Direction of the snake's head<br>
      score: Score<br>
      updateHandler: An interval event to continuously update the snake game screen<br>
      snakeHeadBitmap: Bitmap image of the snake's head<br>
      snakeBodyBitmap: Bitmap image of the snake's body<br>
      borderColor: Border color<br>
      borderWidth: Border width<br>
      borderPaint: Style of the border<br>
      pendingDirection: The direction the snake is about to turn<br>
  </div><br>
</p>

<div class="c-border-content-title-4">
    Set game screen size<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/9c426a1e42cdd7b27a04169083e01d2d.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
    In the SnakeGameView class,<br>
    we need to override the onMeasure method,<br>
    to adjust the game screen size based on the snake's size.<br>
    This example demonstrates how to make the game screen adaptive,<br>
    so that the snake can fully traverse it.<br>
    The main reason is that different brands of phones have varying sizes and densities,<br>
    which may cause the set screen size to differ from the snake's width and height,<br>
    affecting the game experience. To ensure a consistent user experience, this design is adopted.<br>
    Developers can make adjustments according to their own needs.
  </div><br>
</p>

<div class="c-border-content-title-4">
    Drawing the Snake and Food<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/6d59bfaf552bade337814b0016fd0725.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
    In SnakeGameView,<br>
    in the onDraw method,<br>
    we draw the snake and food.<br>
    In this example, we use bitmaps to import the snake head and body resources<br>
    to customize the appearance of the snake.<br>
    Additionally, since the snake will keep moving and needs to change direction,<br>
    we use Matrix() + rotationAngle to set the rotation angle.<br>
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
    You can also make adjustments according to your needs.<br>
  </div><br>
</p>

<div class="c-border-content-title-4">
    Game Logic<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/d3d6fa84b498999473e0ed041fcb48be.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
    Add an updateGame method to implement the main game logic, such as snake movement and collision detection.<br>
    The resetGame() method can be defined to specify what steps to take when the snake hits a wall or itself,<br>
    such as displaying a popup, ending the game screen, etc.
  </div><br>
</p>

<div class="c-border-content-title-4">
    Generating Food<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/3f8e352778a37d355b2afb2607013b23.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
    Add a generateFood method to implement the functionality of randomly generating food.<br>
    Assign the randomly generated x and y coordinates to the previously declared food object.<br>
    This way, during onDraw,<br>
    the effect of randomly generating food can be achieved.<br>
  </div><br>
</p>

<div class="c-border-content-title-4">
    Updating Direction<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/f5880e17a1706da1c958ad3e1a7925ac.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
    To allow the snake to change direction based on user input,<br>
    we need to implement an updateDirection method.
  </div><br>
</p>


<div class="c-border-content-title-4">
    Resource Cleanup<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/6dad33e94f9f62d5a3db492a8f2655f0.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
    To avoid memory leaks, we need to implement a method to clean up used resources, such as bitmaps.<br>
    This allows the resources to be released when the activity or fragment lifecycle is resumed.
  </div><br>
</p>

<div class="c-border-content-title-4">
    Connect back to fragment/activity and set button events<br>
</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/3dfd240bbe8d1a9b1311d74fcffba44b.js"></script>
  <script src="https://gist.github.com/waitzShigoto/1bcd4c2bc5b927975a4c56f62afe3cb1.js"></script>
  <div class = "table_container">
    <p>Code Explanation</p>
    This is the final step,<br>
    Connect the previously implemented view back to the fragment or activity<br>
    Adding interactive buttons will allow you to create an interactive Snake game with the user!<br>
    Here, I am using a custom joystickView, or you can use four buttons to move up, down, left, and right<br>
  </div><br>
</p>
