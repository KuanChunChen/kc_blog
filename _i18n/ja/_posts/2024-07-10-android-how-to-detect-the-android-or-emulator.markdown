---
layout: post
title: "【UseCase】Android 偵測App現在是否在模擬器上跑？"
date: 2024-07-10 10:00:00 +0800
image: cover/android_emulator_detection.png
tags: [Android, Kotlin]
permalink: /android-emulator-detection
categories: Android教學
excerpt: "本文詳細介紹了在 Android App中檢測是否運行在模擬器環境的多種方法，包括使用內建屬性、檢查特定文件、檢查電話號碼等，並提供了實作。"
---

<div class="c-border-main-title-2">前言</div>

有時候會遇到PM提出一個需求<br>
希望避免自家app上架後<br>
被使用到模擬器上跑<br>
這邊收集了一下各種檢驗的方法<br>
分享出來<br>

<div class="c-border-main-title-2">檢測方法</div>
<div class="c-border-content-title-1">1. 使用 Android 內建屬性</div>
這種方法利用 Android 系統的 Build 類來檢查各種硬件和軟件屬性：<br>
<script src="https://gist.github.com/waitzShigoto/bbea6bcd92107162c90bcdd5dc8e3b4b.js"></script>

<div class="c-border-content-title-1">2. 檢查特定文件</div>
某些文件只存在於模擬器環境中，我們可以檢查這些文件是否存在：<br>
<script src="https://gist.github.com/waitzShigoto/f383dc9e57822547ba1de4b05b0ecf85.js"></script>

<div class="c-border-content-title-1">3. 檢查電話號碼</div>
模擬器通常有特定的電話網絡設置：
<script src="https://gist.github.com/waitzShigoto/8e9fd3a2433281dd90e0e70fbfdf7d7e.js"></script>

<div class="c-border-content-title-1">4. 結合多種方法</div>
把上面所有方法結合<br>
用來判斷是否是模擬器<br>
但我覺得不一定每台模擬器都有可能完美檢查出來<br>
要是模擬器開發者知道這些檢驗手法<br>
理論上也能製作出一台繞過這些方法的模擬器<br>
<script src="https://gist.github.com/waitzShigoto/0c5cf9c9118ac6e044d0386f785490a6.js"></script>

<div class="c-border-main-title-2">注意事項</div>
上面只是用各種可能判斷為模擬器的方法去判斷<br>
我實際使用還是有可能會遇到下列情況<br>
1. 這些方法並非 100% 可靠，因為模擬器也可能會針對這些去實作模擬真機<br>
2. 一些真實設備可能會被誤判為模擬器(若剛好該廠真機少了你檢測的屬性或特性時)<br>
3. 換一種思路來想 <br>
變成你可以針對你遇過的模擬器去擋掉<br>

<div class="c-border-main-title-2">總結</div>
- 結合多種檢測方法以提高準確性

- 定期更新檢測邏輯以適應新的模擬器<br>
這種可能就是case by case <br>
因為有QA會幫忙測<br>
遇到的話<br>
他反饋給你<br>
就能再針對問題去解決<br>

- 可能要考慮是否要用這個方法<br>
避免因誤判而影響用戶體驗<br>

- 雖然這些技術可以提供有用的信息<br>
但它們並不是絕對可靠的<br>
在實施任何基於這些檢測結果的邏輯之前<br>
請考慮其潛在影響和必要性。<br>
