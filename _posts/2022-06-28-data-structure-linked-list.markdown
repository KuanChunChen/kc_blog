---
layout: post
title: "[Data Structure][Kotlin][2022]資料結構複習 - Linked List"
date: 2022-06-28 11:46:12 +0800
image: cover/data-structure/cpu-linked-list.jpg
tags: [data structure, algorithm]
categories: DataStructure
---

## Linked list feature
---
 * 為不連續的記憶體位址，透過pointers去連結elements


## Linked list 優勢
---
 * array size為固定的，故一開始需提前知道他的size，<br>
 另一方面，分配記憶體時，也會依照array的size去分配

 * array 要插入、刪除element時，成本較高，<br>
 因在此操作時，在插入、刪除點後的array需整個轉移，<br>
 在linked list時，則透過改變pointer指向即可完成

## Linked list 缺點
---
 * 不允許隨機訪問，只能依序的從第一個node開始往後找，<br>
 所以相較array，若使用binary search，則效率會較差

 * 需為每個pointer提供額外的記憶體位址

 * 因為array為連續位址，所以可以有相對位址，但linked list則沒有


## Linked list 組成
---
 * 每個節點的組成包含：
   - data item
   - pointer

 * Kotlin Linked List實作：<br>
 <script src="https://gist.github.com/KuanChunChen/ad9e538b06afc720f0785a4471fd6145.js"></script>

 * traversal linked list <br>
 基於上方的實作，只要再透過while迴圈則可以遍歷：<br>
 <script src="https://gist.github.com/KuanChunChen/4e3fa3e7c237fe1f49a8f960ca4fcb44.js"></script>

  * 後來自己又想到另一種實作方式，利用kotlin特有的data class來實作：
  <script src="https://gist.github.com/KuanChunChen/9e2f8f142eaa6aab94864dcf7cb638b3.js"></script>


 * Linked List Complexity:
  | Time Complexity | Worst Case | Average Case |
  |-----------------|------------|--------------|
  | Search          | O(n)       | O(n)         |
  | Insert          | O(1)       | O(1)         |
  | Deletion        | O(1)       | O(1)         |
