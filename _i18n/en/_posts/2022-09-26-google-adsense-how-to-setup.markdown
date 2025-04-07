---
layout: post
title: "Want to Increase Website Revenue? Learn How to Add Google AdSense to Your Site - Tutorial"
date: 2022-09-26 14:44:32 +0800
image: cover/html-google-adsense-2022-1.png
tags: [html,adsense,google,extra income,tutorial]
categories: 其他筆記
excerpt: "Want to increase website revenue? This tutorial teaches you how to add Google AdSense to your site and easily learn how to earn from ads. Come and learn!"
---

<h1 style="background-color:powderblue;">&nbsp;&nbsp;Introduction</h1>

Today's article<br>
will explain step by step<br>
what `google adsense` is<br>
and provide a hands-on tutorial on how to earn revenue by placing ads<br>

<h1 style="background-color:powderblue;">&nbsp;&nbsp; Google AdSense Tutorial</h1>
<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;What is Google AdSense?</h4>

First, for those who don't know what `adsense` is<br>
it is a service provided by Google for advertisers to place ads<br>
In other words, if a company wants to place ads through Google's ad placement service<br>
they need someone to expose the ads<br>
By using `adsense`<br>
you can become the person who publishes ads for Google<br>
and earn a `share of the revenue`<br>

For example<br>
you can publish ads on your website in the following style:<br>
{% include google/adsense/ad_subject.html %}

If you still don't understand<br>
I think the best way to explain<br>
is with a picture<br>
![01.png](/images/adsense/01.png)<br><br>

That's right<br>
this picture is a screenshot of the `Google AdSense homepage`<br>
It shows the statistics, actual revenue, balance, etc., for the ads you publish for Google<br>
If you want to see this page, you can follow the steps below XD<br>

<br>
<h3 style="background-color:tomato; color:white;">&nbsp;&nbsp;Step 1 - Pass the Review</h3>
<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Start Registration</h4>
First, you need to go to
<a href="https://www.google.com/adsense/">
<img style ="border:3px solid black;" src="/images/cover/adsense.jpeg" alt="Cover" width="30%" > </a> to register an account
<br>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Add Your Website</h4>
Next, after entering the webpage<br>
find the `Sites` option on the left<br>
<img style ="border:3px solid black;" src="/images/adsense/02.png" alt="Cover" width="30%" ><br><br>
You will see a button on the right `Add Site` that allows you to add your website, click it<br>
<img style ="border:3px solid black;" src="/images/adsense/03.png"><br><br>

Next<br>
you will see a page<br>
asking you to enter your `domain name` (*Note 1)<br>
(or commonly known as URL, website address, etc.)<br>
After entering, click Save and Continue<br>
<img src="/images/adsense/04.png"><br><br>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Add HTML Code to Head and Request Review</h4>

At this point, if<br>
your website passes the `Google scan` successfully<br>
you will be returned to the previous page<br>
and the URL you just entered will be added<br>
Usually, the first entry will be in `unreviewed` status<br>
You might see a string of code<br>
<script src="https://gist.github.com/waitzShigoto/ce78fcc8c41a93621a2af59d052c55da.js"></script>
You need to add it to the `<head>` tag of your website<br>
because Google needs to review your website for the first time<br>
to check if it meets the requirements, if there is any strange content, if the content is too little, etc.<br>
<img style ="border:3px solid black;" src="/images/adsense/05.png"><br><br>
So if you confirm that your website is okay and you have added the required code<br>
click the `Request Review` button at the bottom right<br>
Then wait for `a few hours` or `1-2 days`<br>
Google will send you an email<br>
informing you whether the review was successful<br>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Review Successful</h4>
You will receive a letter similar to the one below upon success<br>
<img style ="border:3px solid black;" src="/images/adsense/06.png"><br><br>

<h3 style="background-color:tomato; color:white;">&nbsp;&nbsp;Step 2 - Define Ads</h3>
<br>

Once you pass the review<br>
You can start placing ads on your website<br>
Click `Ads` on the left side of the website to see the screen below<br>
<img style ="border:3px solid black;" src="/images/adsense/07.png"><br><br>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;By Site - Official Automatic Ad Placement</h4>

`By Site` will automatically insert ads into your website<br>
This way, you don't have to modify the code yourself<br>
But you also can't decide the ad placement<br>
So, to make the website look less odd<br>
You might consider using `By Ad Unit` to place ads<br>

Method:
On the `By Site` page, find the URL you want to place ads on and click the `Edit Icon`<br>
After entering, turn on the `Auto Ads` toggle button on the right<br>
Ads will be automatically placed on your website within 1-2 hours<br>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;By Ad Unit - Custom Ad Placement</h4>
<br>

After clicking `By Ad Unit`, you will see the screen below<br>
<img style ="border:3px solid black;" src="/images/adsense/08.png"><br><br>
There are four types of ad styles available for you to use<br>
Choose any one you want to see<br>
For example, `Display Ads`<br>
<img style ="border:3px solid black;" src="/images/adsense/09.png"><br>
It will allow you to set the shape you want<br>
And preview the approximate appearance of the ad<br>
But you will only know the real look when it is placed on your webpage<br>
Then click `Create` at the bottom right<br>
It will automatically generate the code for you<br>
<img style ="border:3px solid black;" src="/images/adsense/11.png"><br>
At this point, copy and paste this code<br>
To the position you want on your webpage<br>
You can then customize the arrangement<br>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;In-Feed Ads - Image on Top</h4>
{% include google/adsense/ad_dynamic_top.html %}
<br>

<div style ="border:3px solid green;"  alt="Cover" width="30%" >
 <p style = "background-color:tomato; color:white;">Additional Note 1</p>
 What is a domain name?<br><br>

 Actually, if you want to put your website on the internet for people to browse<br>
 You need to have an open IP address first<br>
 Then put your website in the root directory of the open IP<br>
 And run your server (if you have one)<br>
 Or at the very least, put an index.html file or .txt file so others can browse it with a browser<br><br>

 At this point, if you don't want others to connect using the IP<br>
 (Sometimes for user convenience, future server migration considerations, etc.)<br>
 You can find a domain name to replace your IP address<br>
 So that users can connect using an easy-to-remember URL<br><br>

 Usually<br>
 You can rent from some third-party domain name rental websites<br>
 Or use some third-party website providers<br>
 That offer a complete set of services<br>
 But if you have the ability to do everything yourself<br>
 It is, of course, the most cost-effective<br>
</div>
