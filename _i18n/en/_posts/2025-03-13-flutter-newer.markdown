---
layout: post
title: "What is Flutter?"
date: 2025-03-13 09:29:10 +0800
image: cover/flutter-cover.svg
tags: [flutter]
permalink: /flutter-newer
categories: flutter
excerpt: "What is Flutter?"
---

<div class="c-border-main-title-2">What is Flutter?</div>
* Flutter is a **cross-platform UI framework** developed by Google used to build applications for **Android, iOS, Web, Windows, macOS, and Linux**.

<div class="c-border-main-title-2">🛠 Installing the Environment</div>
#### 0. (macOS only) You can install using homebrew. If you don't have it yet, install homebrew with the following command:
```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
Then use homebrew to install `fvm`
```sh
brew tap leoafarias/fvm
brew install fvm
```

You can also install fvm on other platforms
If you're interested, check the [documentation](https://fvm.app/documentation/getting-started/installation) directly


#### 1. [Download Flutter SDK from the official site](https://flutter-ko.dev/get-started/install/macos) or install using `fvm` introduced in the previous step
a. (mac/windows) Download the officially provided version from the link above<br>
<img src="/images/flutter/001.png" alt="flutter"><br>
b. Or download using `fvm`<br>

```sh
fvm install stable  # Install the latest stable version
```
<br>
Then set the `default Flutter version` globally<br>
```sh
fvm global stable
```

#### 2. Set up Flutter in your environment variables
(`windows`) Set the following path in environment variables (if manually downloaded, replace with the corresponding bin path)
```
$HOME/fvm/default/bin
```

(`macos`) Set in terminal configuration,
for example in the common `.zshrc`:

```sh
open ~/.zshrc
```

Then add the following to .zshrc
```
export PATH=$PATH:"$HOME/fvm/default/bin"
```

#### 3. Use `flutter doctor` to check what's missing in your current environment and install what's needed
* If you're building for `android, macos, ios`, you'll need to download Android Studio and Xcode
* Even with everything installed, you might encounter errors due to incomplete installation of Android Tools or iOS CocoapPods<br>
  <img src="/images/flutter/002.png" alt="flutter"><br>

* In my case, I encountered three issues
  - `cmdline-tools` not found<br>
    <img src="/images/flutter/003.png" alt="flutter"><br>
    - Use `sdkManager` in `Android tool` to install. If you know the path to sdkManager or have it set in environment variables, install `cmdline-tools` directly with the command
       ```cmd
       $ANDROID_SDK_ROOT/tools/bin/sdkmanager --install "cmdline-tools;latest"
       ```
    - You might encounter Java version compatibility issues. If so, switch your local Java version. In my case, reverting to Java 8 fixed it<br>
      <img src="/images/flutter/004.png" alt="flutter"><br>
  - `CocoaPods` compatibility issue:<br>
    <img src="/images/flutter/005.png" alt="flutter"><br>

    - You can install the latest version using the `sudo gem install cocoapods` command
  - Haven't `agreed` to Android licenses:<br>
    <img src="/images/flutter/006.png" alt="flutter"><br>
    You can `agree` with the following command
      ```
       flutter doctor --android-licenses
      ```

* `Run flutter doctor again` to see if you were successful. If successful, you'll be able to develop or compile Flutter<br>
  <img src="/images/flutter/007.png" alt="flutter"><br>

## Running Directly on Target Device
* Navigate to the `root directory` of your Flutter project<br>
  <img src="/images/flutter/008.png" alt="flutter"><br>
* When you run directly, any missing resources or tools will be downloaded, then you'll be asked to `select a target platform` to run on
    ```
    flutter run
    ```
  <br>
  <img src="/images/flutter/009.png" alt="flutter"><br>

## Building a dmg file for macOS

* Navigate to the `root directory` of your Flutter project<br>
  <img src="/images/flutter/008.png" alt="flutter"><br>

* Make sure compilation for macOS is enabled
    ```
    flutter config --enable-macos-desktop
    ```
* Build for a specific platform. The following example is for macOS
    ```
    flutter build macos
    ```
  - After the build is complete, an `xxx.app` is generated
    <br><img src="/images/flutter/010.png" alt="flutter"><br>

* The xxx.app generated above is still just an application. If you need a `.dmg`, you need to package it further

  - You'll need to use the `create-dmg` plugin, so install it with `npm`
    ```
    npm install -g create-dmg
    ```
  - Package the xxx.app you just built:
    - `--dmg-title`: You can set the name of the installation package on disk
      <br><img src="/images/flutter/011.png" alt="flutter"><br>
    ```
    create-dmg build/macos/Build/Products/Release/xxx.app --dmg-title="Application Name" --overwrite
    ```

<div class="c-border-main-title-2">Running a Project Using an IDE (Cursor/vscode)</div>

* I've written about this in another article, <a href="{{site.baseurl}}/flutter-use-cursor">please refer to it</a> 