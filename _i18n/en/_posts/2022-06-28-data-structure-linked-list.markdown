---
layout: post
title: "Review of Data Structures: The Ultimate Guide to Linked Lists!"
date: 2022-06-28 11:46:12 +0800
image: cover/data-structure/cpu-linked-list.jpg
tags: [data structure, algorithm]
categories: 其他筆記
excerpt: "Learn about Linked Lists to review data structures, including advantages, disadvantages, and Kotlin implementation methods. A complete guide to help you understand the time complexity and operations of Linked Lists."

---

<div class="c-border-main-title-2">Characteristics of Linked Lists</div>
A Linked List is a data structure composed of non-contiguous memory addresses, linking elements through pointers.

<div class="c-border-main-title-2">Advantages of Linked Lists</div>
Compared to Arrays, Linked Lists have the following advantages:<br><br>

1. Linked Lists are flexible in size and do not require a pre-specified size.<br>
2. The cost of inserting and deleting elements is lower, as it only requires changing the pointer direction without needing to shift the entire structure.<br>
3. They do not require contiguous memory space, making them more flexible.<br>

<div class="c-border-main-title-2">Disadvantages of Linked Lists</div>
Compared to Arrays, Linked Lists have the following disadvantages:<br>

1. Random access efficiency is lower, as traversal must start from the first node.<br>
2. Additional memory space is needed for pointers in each node.<br>
3. Relative addressing cannot be used directly. Arrays have contiguous addresses, allowing for relative addressing, but Linked Lists do not.<br>

<div class="c-border-main-title-2">Composition of Linked Lists</div>
Each node in a Linked List contains the following two elements:<br>

1. Data<br>
2. Pointer<br>
<div class="c-border-content-title-4">
   Below is the code for implementing a Linked List in Kotlin
</div>
 <script src="https://gist.github.com/KuanChunChen/ad9e538b06afc720f0785a4471fd6145.js"></script>

<div class="c-border-content-title-4">
   Below is the code for traversing a Linked List
</div>

<script src="https://gist.github.com/KuanChunChen/4e3fa3e7c237fe1f49a8f960ca4fcb44.js"></script>

<div class="c-border-content-title-4">
  Besides the above code, you can also implement a Linked List using Kotlin's Data Class:
</div>
<script src="https://gist.github.com/KuanChunChen/9e2f8f142eaa6aab94864dcf7cb638b3.js"></script>

<div class="c-border-content-title-4">
  Linked List Complexity
</div><br>
<table class="rwd-table">
    <tr>
      <th>Time Complexity</th>
      <th>Worst Case</th>
      <th>Average Case</th>
    </tr>
    <tr>
      <td>Search</td>
      <td>O(n)</td>
      <td>O(n)</td>
    </tr>
    <tr>
      <td>Insert</td>
      <td>O(1)</td>
      <td>O(1)</td>
    </tr>
    <tr>
      <td>Deletion</td>
      <td>O(1)</td>
      <td>O(1)</td>
    </tr>
  </table>
