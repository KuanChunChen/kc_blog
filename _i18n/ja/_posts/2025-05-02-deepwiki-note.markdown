---
layout: post
title: "Deepwikiツールで第三者ライブラリを素早く理解する"
date: 2025-05-02 06:28:10 +0800
image: cover/deepwiki.png
tags: [deepwiki]
permalink: /deepwiki
categories: deepwiki
excerpt: "Deepwikiツールで第三者ライブラリを素早く理解する"
---

<div class="c-border-main-title-2">Deepwiki</div>
* このAIツールは`Githubリポジトリのスキャン分析`と`ドキュメント生成`を提供し、ユーザーがGithub上の第三者ライブラリをより迅速に理解できるようにします<br>
：https://deepwiki.com/<br>
 例：GreenDao、lottie-android<br>
 第三者ライブラリをより早く理解するのに役立ちます<br>
 またはドキュメントを直接AIに渡して理解させ、コードを修正させることもできます<br>

<div class="c-border-main-title-2">機能概要</div>
- 自動ドキュメント生成<br>
      - DeepWikiはコード、READMEファイル、設定ファイルを分析し、プロジェクトの目標、コアモジュール、依存関係図などを含む構造化された技術ドキュメントを自動生成します。生成されるドキュメントは従来のREADMEよりも詳細で、ドキュメントが不足しているプロジェクトにも明確な説明を提供できます。
  - 対話型AIアシスタント<br>
      - ユーザーは自然言語で質問でき、「ディープリサーチ（Deep Research）」モードでは潜在的な脆弱性、最適化提案、またはクロスリポジトリ比較分析を検出できます。

<div class="c-border-main-title-2">使用方法</div>
  - すでに誰かがスキャンしたGithubリポジトリは直接検索できます。そうでない場合は、次のステップを確認してください<br>
    <br><img src="/images/cursor/056.png" alt="flutter"><br>
  - GitHubに接続する際、ドメイン名を`github.com`から`deepwiki.com`に変更します。例：
https://github.com/microsoft/vscode → https://deepwiki.com/microsoft/vscode。
  - まだ分析されていないリポジトリは、インデックス化・分析されていないと表示され、しばらく待つ必要があります
    <br><img src="/images/cursor/057.png" alt="flutter"><br>
  - 次にメールアドレスを入力し、`indexing repository`をクリックすると分析が開始されます<br>
    <br><img src="/images/cursor/058.png" alt="flutter"><br>
  - 分析が完了すると、ホームページでインデックス化された内容を検索できるようになります<br>
    <br><img src="/images/cursor/059.png" alt="flutter"><br>

<div class="c-border-main-title-2">応用シナリオ</div>
  - 新人が複雑なプロジェクト構造を迅速に理解するのを支援し、学習コストを削減します。共有ドキュメントを通じてチームのコラボレーション効率を向上させます。<br>
  - ドキュメント不足の問題を解決します。オープンソースのコンテンツに公式ドキュメントがない場合、理解するのが難しいことがあります。<br>
  例：RSでは過去に`lottie`という第三者ライブラリを使用してアニメーションを表示していました。ここではAIを使って最適化の余地があるかどうかを確認します<br>
  <br><img src="/images/cursor/060.png" alt="flutter"><br>
  第三者ライブラリを使用する際に締め切りが短い場合、ソースコードを詳しく見る時間がない可能性があります。このような場合、AI提案に従って最適化することができます。例えばリソースの最適化：<br>
  <br><img src="/images/cursor/061.png" alt="flutter"><br>

<div class="c-border-main-title-2">課題</div>
* 精度の検証：AI生成コンテンツには誤差がある可能性があり、特に複雑なロジックや極端なケースでは人間による検証と組み合わせる必要があります。

<div class="c-border-main-title-2">公式ドキュメント</div>
* https://deepwiki.com/deepskies/DeepWiki/1-home 