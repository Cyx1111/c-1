﻿<!DOCTYPE html>
<html>
<head>$if$ ($usehtml5$ == True)
    <meta charset="utf-8" />$endif$
    <title>@ViewData("Title")</title>
    <link href="@Url.Content("~/Content/Site.css")" rel="stylesheet" type="text/css" />
    <script src="@Url.Content("~/Scripts/jquery-1.7.1.min.js")" type="text/javascript"></script>$if$ ($usehtml5$ == True)
    <script src="@Url.Content("~/Scripts/modernizr-2.5.3.js")" type="text/javascript"></script>$endif$
</head>
<body>
    <div class="page">$if$ ($usehtml5$ != True)
        <div id="header">
            <div id="title">
                <h1>我的 MVC 应用程序</h1>
            </div>
            <div id="logindisplay">
                欢迎 <strong>@User.Identity.Name</strong>!
            </div>
            <div id="menucontainer">
                <ul id="menu">
                    <li>@Html.ActionLink("主页", "Index", "Home")</li>
                    <li>@Html.ActionLink("关于", "About", "Home")</li>
                </ul>
            </div>
        </div>
        <div id="main">
            @RenderBody()
        </div>
        <div id="footer">
        </div>$else$
        <header>
            <div id="title">
                <h1>我的 MVC 应用程序</h1>
            </div>
            <div id="logindisplay">
                欢迎 <strong>@User.Identity.Name</strong>!
            </div>
            <nav>
                <ul id="menu">
                    <li>@Html.ActionLink("主页", "Index", "Home")</li>
                    <li>@Html.ActionLink("关于", "About", "Home")</li>
                </ul>
            </nav>
        </header>
        <section id="main">
            @RenderBody()
        </section>
        <footer>
        </footer>$endif$
    </div>
</body>
</html>
