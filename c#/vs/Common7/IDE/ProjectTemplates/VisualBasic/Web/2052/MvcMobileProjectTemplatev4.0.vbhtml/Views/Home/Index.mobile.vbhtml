﻿@Code
    ViewData("Title") = "主页"
End Code

<h2>@ViewData("消息")</h2>
<p>
    若要了解有关 ASP.NET MVC 的详细信息，请访问 <a href="http://asp.net/mvc" title="ASP.NET MVC Website">http://asp.net/mvc</a>。
</p>

<ul data-role="listview" data-inset="true">
    <li data-role="list-divider">导航</li>
    <li>@Html.ActionLink("关于", "About", "Home")</li>
    <li>@Html.ActionLink("联系方式", "Contact", "Home")</li>
</ul>