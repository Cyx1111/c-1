﻿@Code
    ViewData("Title") = "联系方式"
End Code

<h2>联系方式</h2>

<h3>电话</h3>
<span>425.555.0100</span>

<h3>电子邮件</h3>
<span><a href="mailto:General@example.com">General@example.com</a></span>

<ul data-role="listview" data-inset="true">
    <li data-role="list-divider">导航</li>
    <li>@Html.ActionLink("主页", "Index", "Home")</li>
    <li>@Html.ActionLink("关于", "About", "Home")</li>
</ul>