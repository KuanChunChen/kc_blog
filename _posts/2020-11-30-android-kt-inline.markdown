---
layout: post
title: "[Android][Kotlin]「概念篇」你需要知道的 inline / noinline / crossinline 使用詳解"
date: 2020-11-30 21:01:43 +0800
image: cover/inline01.png
tags: [Android,Kotlin,inline,noinline,crossinline]
categories: Android
---
inline /noinline / crossinline 這幾個關鍵字常常可以在kotlin上看到，<br>
為了可以看懂大家在寫什麼，你可以參考我這邊文章，在這邊推薦給大家，<br>
inline主要能用來處理kotlin 函式內帶有function type 變數的效能優化，<br>
或者有些人會稱function type的變數為lambda function。
***

<h1>inline</h1>
inline 實際上的作用，<br>
就是會在編譯的時候把你有使用inline的function內容直接複製到執行處，<br>
而不是直接實例化一個物件，<br>
藉由inline來減少實例化物件來提升效能<br>
先簡單的說，我們寫一個funcion會寫成像下方這樣：<br>
<script src="https://gist.github.com/KuanChunChen/626f82a8e911cb4ab227f0bffc4220b9.js"></script>
<br>


然而，如果帶入一般變數的function直接加上inline，<br>
某些IDE可能會提醒你這樣直接使用，<br>
並不會增加效能表現。
像是下面這邊示範，<br>
只有帶入一般變數並使用inline，<br>
則編譯器跳黃底提醒，<br>
說明了預期要帶入function type 變數才能有效提升效能表現。<br>

<div align="center">
  <img src="/images/cover/inline/inline-02.png" alt="Cover" width="1000%"/>
</div>
<br>
所以，我們試著寫出一個帶入function type的function，<br>
並寫一個一樣的function帶有inline，就像這樣：<br>

<script src="https://gist.github.com/KuanChunChen/0b924c1634435c157fba4a73f3c4afc9.js"></script>
<br>

這兩個執行後你會發現返回的結果一樣，<br>
但是實際上，<br>
如果你反編譯這段code出來看的話(如下)，<br>
你會發現，沒有用inline，<br>
程式在跑的時候，<br>
會針對你的lambda function創建一個新的instance，<br>
也就是會實例化一個新的物件，<br>
如果你剛好有一段code需要重複運用到這個function，<br>
他就會重複創建物件，<br>
因此可能會花比較多效能去處理這個lambda function，<br>
所以如果使用inline 就可以降低這方面效能的消耗。<br>

<script src="https://gist.github.com/KuanChunChen/0edf38ee27045d23b0b490ca4381f286.js"></script>

<br>

提示：**(Function1）null.INSTANCE**，是反編譯器找不到等效的Java 類的顯示。


從上面的例子可以單看出，使用lambda function的當下，<br>
如果用inline，可以提升處理的效能，<br>
但實際上，我們會使用的時機呢？這邊我舉個例子<br>

假設你有個情境，是需要重複呼叫某個帶有lambda 的function，比較沒經驗的可能會直接這樣寫：

<script src="https://gist.github.com/KuanChunChen/6f5a374bee3a35b754d5f551b170f969.js"></script>
<br>

可以看到，在你反編譯後，<br>
你會看到你雖然達成了你用的重複執行10次，<br>
但同時，你也重複創建了10次同樣的物件，<br>

所以當你比較有經驗後，你可以：<br>
**1.把lambda function在迴圈外部創建**<br>
這樣同樣能提升效能，但既然都使用kotlin了，那就使用inline也可以。<br>
<script src="https://gist.github.com/KuanChunChen/c7535ba99806202c354e571447b99c68.js"></script>
<br>

**2.使用inline來創建：**<br>

<script src="https://gist.github.com/KuanChunChen/ad7d6e31cce3d9badd7cc9b2fa36b57a.js"></script>

<br>


這樣的話，你就能看出，使用inline的優勢，<br>

好了，接下來說說noinline 跟crossinline有什麼差別嗎，<br>
其實剩下這兩個關鍵字，<br>
我感覺是用來輔助inline的，<br>
他不像inline一樣，是加在fun前面，<br>
他反而是用來設定function type(or lambda function)的。<br>


<h1>noinline</h1>
noinline的概念，其實更簡單了，<br>
當你了解inline，就會明白為何我說這兩個是輔助了，<br>
這個的用途，<br>
是當你一個inline function內含有多個function type時，<br>
你可以去控制，哪個lambda 要使用inline，例如：

<script src="https://gist.github.com/KuanChunChen/b6f489a19d880c3a6f89e53d90521dd5.js"></script>
<br>
因此，你也能依照需求，去選擇要不要用inline
<br>
<h1>crossinline</h1>

先來個前導概念：<br>
當你在使用lambda function時，<br>
如果在宣告的lambda function 裡面加入return ，<br>
會導致呼叫時，使用lambda function的地方直接return出該function：<br>
<script src="https://gist.github.com/KuanChunChen/e9fdbb9fc2aefe4841853b23d1db8714.js"></script><br>



這時候，你不想要跳出整個inline function ，<br>
你可以用像上方code提到的，直接將原本的return改成 return@getMinutesWithInline 這樣，<br>
他就只會跳出宣告的lambda function。<br>
或是你也能使用crossinline的關鍵字，<br>
他也是用來修飾lambda function的，<br>
也是輔助inline使用的，<br>
功效是可以避免有return時，直接被return出去！<br>


<script src="https://gist.github.com/KuanChunChen/940839c5f5bbaf854a0c243748192758.js"></script>



<h1>結論</h1>
使用 inline<br>
能夠降低程式呼叫lambda function時重複創建實例化<br>
藉此提升效率<br>
使用 inline 能避免建立過多的實例化物件<br>
使用 noinline 可以讓lambda 不使用inline<br>
使用 crossinline 可以避免lambda 中的 return 影響外部程式流程<br>


<div align="start">

  <a href="https://github.com/KuanChunChen/KC_InlineDemo/blob/master/app/src/main/java/k/c/horialtal/move/sheet/kc_inlinedemo/InlineUtil.kt">[Android][Kotlin]KuanChunChen
/
KC_InlineDemo</a>


  <a href="https://github.com/KuanChunChen/KC_InlineDemo/blob/master/app/src/main/java/k/c/horialtal/move/sheet/kc_inlinedemo/InlineUtil.kt">
    <img src="/images/kc_icon.png" alt="Cover" width="10%" >
  </a>


</div>
