---
layout: post
title: "【UseCase】How to detect if your Android app is running on an emulator?"
date: 2024-07-10 10:00:00 +0800
image: cover/android_emulator_detection.png
tags: [Android, Kotlin]
permalink: /android-emulator-detection
categories: Android Tutorial
excerpt: "This article details various methods to check if an Android app is running in an emulator environment, including using built-in properties, checking specific files, checking phone numbers, and provides practical implementations."
---

<div class="c-border-main-title-2">Introduction</div>

Sometimes product managers will request<br>
a feature to prevent the app<br>
from running on emulators after release<br>
Here I've collected various detection methods<br>
to share<br>

<div class="c-border-main-title-2">Detection Methods</div>
<div class="c-border-content-title-1">1. Using Android Built-in Properties</div>
This method uses Android's Build class to check various hardware and software properties:<br>
<script src="https://gist.github.com/waitzShigoto/bbea6bcd92107162c90bcdd5dc8e3b4b.js"></script>

<div class="c-border-content-title-1">2. Checking Specific Files</div>
Some files only exist in emulator environments, we can check if these files exist:<br>
<script src="https://gist.github.com/waitzShigoto/f383dc9e57822547ba1de4b05b0ecf85.js"></script>

<div class="c-border-content-title-1">3. Checking Phone Numbers</div>
Emulators typically have specific phone network settings:
<script src="https://gist.github.com/waitzShigoto/8e9fd3a2433281dd90e0e70fbfdf7d7e.js"></script>

<div class="c-border-content-title-1">4. Combining Multiple Methods</div>
Combining all the methods above<br>
to determine if it's an emulator<br>
But I don't think every emulator can be perfectly detected<br>
If emulator developers know these detection techniques<br>
they could theoretically create emulators that bypass these methods<br>
<script src="https://gist.github.com/waitzShigoto/0c5cf9c9118ac6e044d0386f785490a6.js"></script>

<div class="c-border-main-title-2">Considerations</div>
The above are just methods that may identify an emulator<br>
In practice, you might encounter the following situations:<br>
1. These methods are not 100% reliable, as emulators can be designed to simulate real devices<br>
2. Some real devices might be falsely identified as emulators (if a manufacturer's device happens to be missing properties or characteristics you're checking)<br>
3. Consider a different approach:<br>
you could specifically block emulators you've encountered<br>

<div class="c-border-main-title-2">Conclusion</div>
- Combine multiple detection methods to improve accuracy

- Regularly update detection logic to adapt to new emulators<br>
This might need to be handled case by case<br>
Since QA will help test<br>
When issues arise<br>
they can report them to you<br>
so you can address the specific problems<br>

- Consider whether this method is necessary<br>
to avoid affecting user experience due to false positives<br>

- While these techniques can provide useful information<br>
they are not absolutely reliable<br>
Before implementing any logic based on these detection results<br>
please consider potential impacts and necessity.<br> 