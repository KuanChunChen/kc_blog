---
layout: post
title: "[Android][Kotlin][2021]Android低功耗藍芽Gatt連線實作教學！"
date: 2021-11-12 16:16:32 +0800
image: cover/android-photo.jpg
tags: [Android,Bluetooth]
categories: Bluetooth
---

之前工作相關有實作低功耗藍牙的連接
但怕忘記
所以來複習
想說之後有面試的話
也可以自己拿來複習

所以就花了點時間複習
官方提供的低功耗藍牙的串法

首先介紹下
藍芽掃描的方法
大致上有三種

BluetoothAdapter.startDiscovery() -> 掃描經典藍芽和BLE藍芽兩種
BluetoothAdapter.startLeScan() -> 用來掃描低功耗藍芽
BluetoothLeScanner.startScan() -> 新的BLE掃描方法

不過看了lib內的註解
目前startLeScan已被棄用
查了下資料是在api21時被棄用


我也順便查了各個發現藍芽裝置的API來做比較
- fun startDiscovery ():boolean
1.掃描過程通常執行12秒
2.是異步掉用
3.透過註冊廣播來執行不同步驟，如：
ACTION_DISCOVERY_STARTED -> 當Discovery開始
ACTION_DISCOVERY_FINISHED  -> 當Discovery完成
BluetoothDevice.ACTION_FOUND -> 發現藍芽裝置
4.當執行連接藍芽裝置時，不能處於startDiscovery中，需呼叫cancelDiscovery()來結束發現
5.Discovery並非由Activity管理，而是system service，所以必須

- startScan (ScanCallback callback)


| 左對齊 | startDiscovery | startLeScan |
| :-----| :----: | :----: |
| 掃描返回方式 | 註冊boardcast | 實例callback |
| 資料返回格式 | 單元格 | 單元格 |
