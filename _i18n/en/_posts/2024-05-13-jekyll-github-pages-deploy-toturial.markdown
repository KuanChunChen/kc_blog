---
layout: post
title: "【Deployment Guide】Migrating Github Pages to Jekyll 4.x and Above - Applicable May 2024"
date: 2024-05-13 14:21:13 +0800
image: cover/jekyll_github_deploy.png
tags: [Jekyll,html,githubpages]
permalink: /jeykll_deploy_4_x
categories: Jekyll部署
excerpt: "This article provides a detailed guide to help you migrate your Github Pages website to Jekyll 4.x and above. It covers each step of the configuration process to ensure you can upgrade smoothly and enjoy the powerful features of the latest Jekyll version."
---

<div class="c-border-main-title-2">Introduction</div>
I recently made some modifications to the layout of my website<br>
and wanted to use the rgb() function in CSS<br>
but I found that this feature was not available in Jekyll 3.9.x<br>
which forced me to upgrade the Jekyll version to 4.x and above<br><br>

After upgrading, I was quite excited<br>
running `bundle exec jekyll serve` locally for testing<br>
everything seemed to be working fine<br><br>

However, when I pushed the changes to the GitHub repository<br>
I encountered some trouble<br>
an error message appeared when deploying to GitHub Pages<br>
`GitHub Pages: github-pages v231 GitHub Pages: jekyll v3.9.5 `
<img src="/images/jekyll_deploy/001.png" alt="jekyll deploy 4.x" /><br>
It turned out the problem was with the GitHub Pages configuration<br>
which prevented me from successfully deploying updates with the default configuration<br>

Considering that GitHub Pages is a free service with usage limitations<br>
it makes sense that it does not `by default` support newer versions of Jekyll<br>
so I had to manually adjust it myself<br>
Below are my notes after multiple failed attempts<br>
<img src="/images/jekyll_deploy/007.png" alt="jekyll deploy 4.x" /><br>
finally achieving a build success<br>
sharing with everyone<br>

<div class="c-border-main-title-2">Deployment Steps</div>
<div class="c-border-content-title-1">1. Adjust Deployment Method</div><br>
First, go to your deployment repo<br>
and enter the settings page<br>
<img src="/images/jekyll_deploy/002.png" alt="jekyll deploy 4.x" /><br><br><br><br>

Then sequentially click on Pages under Code and automation
Select GitHub Actions under `Source`<br><br>
<img src="/images/jekyll_deploy/003.png" alt="jekyll deploy 4.x" /><br><br>

Then you need to start configuring your environment...<br>

<div class="c-border-content-title-1">2. Set Ruby Version</div>

When building a Jekyll project, you will need Ruby<br>
After installing Ruby, the system will have a default version<br>

When you build Jekyll<br>
without specifying a Ruby version<br>
Jekyll will use the default system version<br>

So use this command to check your version
<script src="https://gist.github.com/waitzShigoto/9002c7e6d63823d0c59dc2c4720e323d.js"></script>

We need to deploy to GitHub and use Jekyll 4.x<br>
so we need Ruby version 3.2.3<br>
If you don't have version 3.2.3, you can use some tools to install it<br><br>

However, since my computer happens to have rbenv installed<br>
I will use rbenv as an example<br>

<script src="https://gist.github.com/waitzShigoto/e02a03b088c850d4c4bb6802295d7704.js"></script>
Of course, you can also use other common command-line tools<br>
such as RVM, chruby, or asdf<br>
Adjust and install Ruby according to your own habits~<br>

Finally, you need to create a file `.ruby-version`<br>
in the root directory of your Jekyll project<br><br>

You can use a command similar to the one below directly<br>
<script src="https://gist.github.com/waitzShigoto/bce26899b505b01d4380bbbd2ae29ebb.js"></script>

Or you can create it manually if you prefer<br>
<img src="/images/jekyll_deploy/004.png" alt="jekyll deploy 4.x" /><br><br><br><br>
The file content is just the version number<br>
<img src="/images/jekyll_deploy/005.png" alt="jekyll deploy 4.x" /><br><br>

<div class="c-border-content-title-1">3. Build Jekyll Project</div>

After installing Ruby, start configuring the Jekyll project<br>
First, you need to make the following settings in your `Gemfile`<br>
Import Ruby version 3.2.3<br>
`ruby "3.2.3"`<br>
Then set the Jekyll version to use<br>
`gem "jekyll", "~> 4.3.3"`<br>
The required command is as follows:<br>
<script src="https://gist.github.com/waitzShigoto/b64bfac8864bd597792c65ec75b9f099.js"></script><br>

Here is the complete configuration<br>
For your reference<br>
Including some Jekyll plugins I use<br>
Add them if you need them<br>
<script src="https://gist.github.com/waitzShigoto/67631c36472fc3781800e847033d5250.js"></script>

Next, execute the following in your Jekyll root directory<br>
<script src="https://gist.github.com/waitzShigoto/f860bebfabda529bd7bb3d21e51467ae.js"></script>
The purpose is to generate the `Gemfile.lock` file<br>
And ensure your project runs smoothly<br><br>

After generating, you can use<br>
`bundle exec jekyll serve` to test if it runs successfully<br>
If successful, the following message will be displayed<br>
<img src="/images/jekyll_deploy/006.png" alt="jekyll deploy 4.x" /><br><br><br><br>

<div class="c-border-content-title-1">4. Configure GitHub CI File</div>

Finally,<br>
We need to set up the GitHub auto-deployment configuration file.<br><br>

Usually, `.yml` is used for configuration.<br>
Here is the official recommended initial Jekyll configuration: <a href="https://github.com/actions/starter-workflows/blob/main/pages/jekyll.yml
">Official Recommendation</a><br><br>

All we need to do is modify a few lines in the official recommended `.yml` file:<br>
- Adjust the target branch:<br>
  `branches: ["master"]`<br>
- Specify the current Ruby version:<br>
  `uses: ruby/setup-ruby@v1`<br>
- Ruby version:<br>
  `ruby-version: '3.2.3'`<br><br>

Here is my final complete `.yml` configuration<br>
You can use and modify it directly<br>
<script src="https://gist.github.com/waitzShigoto/4f7e0968d7028a9c23e5749db9cc91e8.js"></script><br>

<div class="c-border-main-title-2">Summary</div>
The steps are actually very simple<br>
You just need to set up the Ruby environment, Jekyll, and GitHub environment<br><br>
Finally, use `git push remote branch` to push your patch<br>
This will trigger GitHub Actions to build your website<br>
And with the deployment settings, it will automatically deploy to GitHub Pages<br>
However, the deployment settings are already provided in the official example<br>
The only things you need to change are the Ruby environment and the target branch~<br><br>

Success
<img src="/images/jekyll_deploy/008.png" alt="jekyll deploy 4.x" />
