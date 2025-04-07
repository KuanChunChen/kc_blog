---
layout: post
title: "Android Kotlin Tutorial: Decoding Google Maps Polyline Paths and Drawing Lines"
date: 2020-12-07 21:22:14 +0800
image: cover/kotlin_tutorial_google_map-1.png
tags: [Android]
categories: Android實作
excerpt: "This tutorial introduces how to use Kotlin in Android to decode polyline using Google Map API and draw lines based on the estimated path."
---

<div class="c-border-main-title-2">Introduction</div>

Recently,<br>
there was a requirement to draw the estimated path between two latitudes and longitudes on Google Map.<br>
The method to achieve this is to first input two latitudes or addresses on Google Map,<br>
obtain the path JSON format returned by the official Google API,<br>
then parse the JSON content,<br>
and use the data to draw the route.<br>
Below is part of the JSON content:

<script src="https://gist.github.com/waitzShigoto/37e425cb8a6b029fd9b817b155705d3a.js"></script>

**(Since the JSON data is quite large when the route is long, only a part is shown)**
But if you want to see the complete JSON file, you can click <a href="https://gist.github.com/waitzShigoto/030767a7fea9fcf4eba7cc600adc0da8">here</a> to view it.<br>

<div class="c-border-content-title-4">Step 1: Understanding the Data</div>
However, our requirement is to draw the entire driving route, so we plan to use the JSON data obtained just now, and have summarized a few tips as follows:<br>
1. The data related to the path is located in the routes array within the JSON.<br>
2. The routes contain the estimated directions.<br>
Just like when using Google Map navigation,<br>
the app will tell you<br>
to turn left/right in 500m, etc.<br>
3. Our focus this time is to draw the route between two points.<br>
So we can directly obtain the `routes` > `overview_polyline` > `points` in the JSON format.<br>
It contains a string encoded and compressed by Google.<br>

<div class="c-border-content-title-4">Step 2: Understanding the Polyline Compression Algorithm</div>

(If you are interested in the encoding algorithm, you can check the official Google algorithm)<br>
<a href="https://developers.google.com/maps/documentation/utilities/polylinealgorithm?hl=zh-tw">Google Official Polyline Encoder Utility</a><br>
Here we will use<br>
Maps JavaScript API<br>
to get a string of `non-plaintext` data.<br>
This string represents the path between the two points we want to draw.<br>
Because Google has encoded it.<br>

After reading the above document, I share the decoding process in sequence as follows:<br>

* Convert each value to its equivalent ASCII<br>
* Add the ASCII of “?” to each value (which is 63, the ASCII of ? is 63)<br>
* Perform a logical AND operation on each value with 0x20<br>
* Reverse the address<br>
* Left shift the address<br>
* Convert to binary<br>
* Multiply the original latitude and longitude by 1e5…<br>

The official Google document mentions<br>
that the main reason is to `reduce the space consumption caused by a large amount of data` during transmission.<br>
So the data is compressed.<br>

<div class="c-border-content-title-4">Step 3: Decoding the Data</div>
To solve this problem, we have to find a way to decode it,<br>
and expect to get the latitude and longitude of the entire route after decoding.<br>

The implementation method is very simple.<br>
Follow the reverse encoding process mentioned in the official Google algorithm.<br>
Take the polyline encode obtained and decode it in reverse steps,<br>
then you can get the array of latitudes and longitudes to be applied.<br>
So theoretically, it can be implemented in any language/platform.<br><br>
First, parse the `JSON obtained just now`.<br><br>

I will not show the JSON parsing process here,<br>
as many people are already familiar with it!<br>
Next, we take the polyline encode obtained from Google<br>
(points in the overview_polyline within routes):<br>

<script src="https://gist.github.com/waitzShigoto/5099e838a2d8d9af507eb94e250b33b8.js"></script>

Following the official website's process, write the decode function (Kotlin version).<br>
Here is an example I wrote in Kotlin.
You can modify it according to your needs.<br>
(For example, modifying the returned model, etc.):<br>

<script src="https://gist.github.com/waitzShigoto/17a978f6831fa8c0f2f80adffa1803ad.js"></script>
```
Here is an important point: after reversing the polyline encoding, the returned latitude and longitude are reversed, so when processing the latitude and longitude data, remember to reverse the positions.
```
<br>
Step two, pass the obtained polyline encode into the decode function:<br>
<script src="https://gist.github.com/waitzShigoto/e9cf66a41cc014870cb8bab4c188a10a.js"></script><br>

After decoding, you can get a format similar to the one below.<br>

<script src="https://gist.github.com/waitzShigoto/bf80d28f5abdd748f1def92a30e557ed.js"></script><br>

With this, we get the array of latitudes and longitudes we want to draw a line with, and we can use PolylineOption on Google Maps to draw the line:<br>

<script src="https://gist.github.com/waitzShigoto/5eb77674995ca2e3422eed17825b22a6.js"></script><br>

The final result of the drawing is as shown in the picture (red path):<br>
<div align="center">
  <img src="/images/googlemap/map02.png" alt="Cover" width="70%"/>
</div>

Additionally, here is a website that allows you to decode online,<br>
so you can test if your decode results are correct during development.<br>

<ol>
  <li>
    <a href="https://developers.google.com/maps/documentation/utilities/polylineutility">Google Official Polyline Encoder Utility</a>
  </li>
</ol>

If you think my article has helped you, please don't hesitate to give me some encouragement!
