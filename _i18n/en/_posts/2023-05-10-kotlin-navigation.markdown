---
layout: post
title: "Create a Smooth Android App Navigation Experience! Navigation with Kotlin: Solve Your App Navigation Issues in One Article!"
date: 2023-05-15 16:06:16 +0800
image: cover/navigation_with_kotlin-1.png
tags: [Kotlin,Navigation,Android]
permalink: /navigation_with_kotlin
categories: Android教學
excerpt: "Create a Smooth Android App Navigation Experience! Using Jetpack Navigation with Kotlin, your app navigation issues will no longer be a problem. With the powerful features of Jetpack Navigation with Kotlin, you can easily manage the various screens and workflows within your app, creating a smoother and more user-friendly experience."
---

<div class="c-border-main-title-2">Introduction to Navigation</div>
<div class="c-border-content-title-4">
    Navigation is a powerful library<br>
</div>
<p>
    It provides a simple way to handle navigation between different fragments in an Android application.<br>
    The following example<br>
    shows how to import navigation into a project<br>
    and set up navigation.<br>
    When we complete a project<br>
    we can clearly see the entire navigation logic at a glance.<br>
</p>

<div class="p-img-container-single">
  <img src="/images/navigation/01.png" alt="navigation">
</div><br>

<div class="c-border-main-title-2">Navigation Development</div>
<div class="c-border-content-title-4">
    Add the Navigation library to the project's build.gradle file<br>
</div>
<p>
    Add the relevant library to build.gradle<br>
    <b>Note: The "Navigation" component requires Android Studio 3.3 or above</b>
</p>
<img src="/images/navigation/02.png" alt=""><br>

<div class="c-border-main-title-2">Navigation Development</div>
<div class="c-border-content-title-4">0. Quickly Create via IDE</div>
<p>
  Through Android Studio<br>
  <b>
    Right-click the res folder in the project directory > New > Android Resource File to add a Navigation XML.
  </b><br>
  Alternatively, if you want to add it manually, you can create a navigation folder under res and add nav_graph.xml inside it.<br>
</p>

<div class="p-img-container">
  <img src="/images/navigation/03.png" alt="navigation_03">
  <img src="/images/navigation/04.png" alt="navigation_04">
</div>

<div class="c-border-content-title-4">1. Create &lt;fragment&gt; and Set startDestination</div>

<div class ="table_container">
  <b>Actual folder structure</b>
</div>
<div class="p-img-container-single">
  <img src="/images/navigation/05.png" alt="navigation_05">
</div>

<p>Add fragment<br>
  id = name <br>
  name = path of the fragment<br>
  label = label message or similar tag<br>
  tools:layout = layout XML resource to preview
</p>

<p>Add startDestination<br>
  <b>Example: app:startDestination="@id/landingFragment"</b><br>
</p>
<div class="p-img-container-single">
  <img src="/images/navigation/06.png" alt="navigation_06">
</div>

<div class="c-border-content-title-4">2. Add the following three lines to the FragmentContainerView in the Activity</div>
<p>android:name="androidx.navigation.fragment.NavHostFragment"<br>
app:navGraph="@navigation/navigation_main" (optional, adds preview in IDE)<br>
app:defaultNavHost="true" </p>
<div class="p-img-container-single">
  <img src="/images/navigation/07.png" alt="navigation_07">
</div><br>

<div class="c-border-content-title-4">3. Add &lt;action&gt; and set the destination</div>
<p>
Add action within the fragment <br>
After adding, set the destination<br>
For example: app:destination="@id/signInFragment" <br>
(action can also be written outside for global navigation)</p>
<div class="p-img-container-single">
  <img src="/images/navigation/08.png" alt="navigation_08">
</div><br>

<div class="c-border-content-title-4">4. Add code to navigate to the destination</div>
<p>
  Directly add the following code where you want to navigate<br>
  findNavController().navigate(R.id.action_FirstFragment_to_SecondFragment)
</p>

<div class="p-img-container-single">
  <img src="/images/navigation/09.png" alt="navigation_09">
</div><br>


<div class="c-border-content-title-4">5. To navigate to an Activity, use &lt;activity&gt; similar to &lt;fragment&gt;</div><br>
<div class="p-img-container-single">
  <img src="/images/navigation/010.png" alt="navigation_010">
</div><br>
<div class="c-border-content-title-4">6. For multiple nav graphs, use nesting or include</div>
<p></p>

<p>
  Directly add another navigation graph:
</p>

<div class="p-img-container-single">
  <img src="/images/navigation/011.png" alt="navigation_011">
</div>

<p>
  After adding a new nav graph XML<br>
  Use include to import it:
</p>
<div class="p-img-container-single">
  <img src="/images/navigation/012.png" alt="navigation_012">
</div><br>


<div class="c-border-main-title-2">Navigation Development Example - Dialog Fragment</div>
<div class="c-border-content-title-4">Enter from dialog fragment</div>
<p>
  Similar to above, directly add a dialog tag in the nav graph<br>
  And import your created DialogFragment to use it<br><br>
  (id = name, name = fragment path, label = display message or similar tag, tools:layout = layout XML resource to display)<br>
</p>

<div class="p-img-container-single">
  <img src="/images/navigation/013.png" alt="navigation_013">
</div><br>


<div class="c-border-main-title-2">Navigation Development Example - Passing Variables</div>
<div class="c-border-content-title-4">Add argument</div>
<p>
  Similarly, directly add an argument in the nav graph<br>
  You can preset the variables to be passed
  (argType = variable type, defaultValue = default value)<br>
</p>

<div class="p-img-container-single">
  <img src="/images/navigation/014.png" alt="navigation_014">
</div><br>

<div class="c-border-content-title-4">Passing Variables in Code</div>
a. Without using the default value method in the above XML<br>
You can directly pass variables using the two sets of code below<br><br>

b. If default values are passed using the XML method<br>
You can directly receive them using the code below<br>
<script src="https://gist.github.com/KuanChunChen/ba53d799a44b2bf910a805eec4b6aa4e.js"></script>

<div class="c-border-content-title-4">Variable Types Supported by Navigation</div>
<div class="p-img-container-single">
  <img src="/images/navigation/020.png" alt="navigation_020">
</div><br>

<div class="c-border-main-title-2">Navigation Development Case - Animation</div>

<div class="c-border-content-title-4">Support for Directly Setting Transition Animations</div>
By passing enterAnim, exitAnim, popEnterAnim, and popExitAnim, you can easily set transition animations
<script src="https://gist.github.com/KuanChunChen/695048f8e71483c8671bacb0a8f71473.js"></script>

<div class="c-border-content-title-4">Support for Adding Exit Animations to Activities</div>
Using the code below, you can use the built-in activity exit animations in navigation
<script src="https://gist.github.com/KuanChunChen/4934a5ee1a72f6164912d589ab9d5f8b.js"></script>

<div class="c-border-main-title-2">Navigation Development Case - Supporting Multiple Back Stacks</div>

<div class="c-border-content-title-4">Method for Handling Multiple Back Stacks</div>
By using the API provided by Navigation to associate related views<br>
You can handle the issue of multiple back stack transitions<br>
For example, setupWithNavController to associate with the bottom navigation view<br>
setupActionBarWithNavController to associate with the action bar<br>
<script src="https://gist.github.com/KuanChunChen/fe1ee57edeaed321729525d4346014bc.js"></script>

<div class="c-border-main-title-2">Navigation Development Case - popUpTo and popUpToInclusive</div>
<div class="c-border-content-title-4">Using popUpTo to Remove All Pages on the Stack When Navigating to the Destination Page</div>
<div class="c-border-content-title-4">Using popUpToInclusive to Remove the Topmost Same Page</div>

<p>
  This diagram illustrates the general transition logic<br>
</p>
<div class="p-img-container-single">
  <img src="/images/navigation/015.png" alt="navigation_015">
</div><br>

<p>
Fragments transition in order 1 -> 2 -> 3 and then back from 3 to 1<br>
And then transition again 1 -> 2 -> 3 and back to 1<br>
At this point, the fragments in the back stack are in the order [1,2,3,1,2,3,1]<br>

<script src="https://gist.github.com/KuanChunChen/78e62e0684ea4f1ae46962bd13c67b1b.js"></script>
If you want to transition back to 1 without having the destination fragment above in the stack, you can add<br>
popUpTo and popUpToInclusive in the XML action<br>
This will allow the next transition back to the destination fragment to have a stack instance cleared above it<br>
</p>

<div class="c-border-content-title-4">Before Adding, Based on Actual Example</div>

<video style="align-items: center;height: 100vh;" width="70%" controls>
  <source src="/images/navigation/016.mov" type="video/mp4">
</video>

<div class="c-border-content-title-4">After Adding, Based on Actual Example</div>

<video style="align-items: center;height: 100vh;" width="70%" controls>
  <source src="/images/navigation/017.mov" type="video/mp4">
</video>


<div class="c-border-main-title-2">Navigation Development Case - NavOptions</div>
<div class="c-border-content-title-4">Set NavController through NavOptions</div><br>
Similarly, navigation also provides a corresponding builder to set some of the features mentioned above. NavOptions example:<br>

```
val options = NavOptions.Builder()
    .set....
    .build()
```

Finally, pass it in when navigating
```
findNavController().navigate(R.id.action_FirstFragment_to_SecondFragment, null, options)
```
<div class="c-border-content-title-4">Configurable Items Include:</div>
<div class="p-img-container-single">
  <img src="/images/navigation/018.png" alt="navigation_018">
</div><br>

<div class="c-border-main-title-2">Navigation Reference Materials</div><br>

<div class = "table_container">
  <a href="https://developer.android.com/guide/navigation?hl=zh-tw">Official Documentation</a><br>
  <a href="https://tome.app/kcchen/navigation-with-kotlin-clhh1vxwh02wk9w3ynag6cmat">Slide Presentation</a>
</div><br>


<div class="card py-4 h-100">
    <div class="card-body text-center">
        <i class="fas fa-map-marked-alt text-primary mb-2"></i>
        <h4 class="text-uppercase m-0">Navigation Sample Code</h4>
        <hr class="my-4 mx-auto" />
        <div style="font-size: 1.5em;">
          <a href="https://github.com/KuanChunChen/NavigationGraphDemo">Github Source Code</a>
        </div>
    </div>
</div>
