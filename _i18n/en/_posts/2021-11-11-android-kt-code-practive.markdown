---
layout: post
title: "[Android][Kotlin][CodingTest] Practice Record"
date: 2021-11-11 12:55:12 +0800
image: cover/android-photo.jpg
tags: [Coding]
categories: 其他筆記
---

Actually, this article is intended to record<br>
the solutions to questions I was asked in previous interviews<br>
mainly using Kotlin<br>
including those I couldn't solve within the time limit<br>
so I want to redeem myself by solving them later<br>


<h1>Question 1</h1>
Given a string containing symbols like (,),{,},[,] etc., return true if the symbols are balanced, otherwise false:<br>

First, here is my solution:<br>

The main idea is to first get the median length of the string and convert the string into an array
```
      val strMedium = str.length / 2
      val strArray = str.toCharArray()
```

Then divide the string into front and back segments
similar to binary search
compare the corresponding positions to see if they have matching symbols


```
    for (index in 0 until strMedium) {
           val prefixString = strArray[strMedium - index - 1].toString()
           val suffixString = strArray[strMedium + index].toString()

           when (prefixString) {
               "("->{ if (suffixString!=")")return false}
               "{"->{ if (suffixString!="}")return false}
               "["->{ if (suffixString!="]")return false}
           }
       }


```

If not, return false
If all are correct,
execute the last line to return true

<h1>Question 2</h1>
Given a string, find the substring that repeats the most times,<br>
e.g., abcdabcd -> abcd repeats 2 times <br>
abababab -> ab repeats 4 times<br>


<br>
I thought about this question for a long time<br>
but I couldn't come up with a quick solution<br>
so I decided to use the brute force method<br>
The idea is<br>
to first traverse the entire string<br>
and generate possible combinations<br>

<br><br>
Then extract the substring that repeats the most<br>
find the index, the number of repetitions, or the substring required by the question (I kind of forgot the exact result asked<br>
but this might require 2~3 loops<br>
which makes the time complexity O(n^3)<br>
This feels very inefficient<br>
so I later searched online<br>
and found someone using the LPS algorithm to solve it<br>
but I'm still studying it<br>
I will add my explanation and understanding after I finish studying<br>

Here is a reference link:
https://www.geeksforgeeks.org/find-given-string-can-represented-substring-iterating-substring-n-times/

