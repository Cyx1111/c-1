﻿<!DOCTYPE html>
<html lang="zh">
    <head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta charset="utf-8" />
        <title>@PageData("Title") - 我的 ASP.NET 网页</title>
        <link href="~/Content/themes/base/jquery.ui.all.css" rel="stylesheet" type="text/css" />
        <link href="~/Content/Site.css" rel="stylesheet" type="text/css" />
        <link href="~/favicon.ico" rel="shortcut icon" type="image/x-icon" />
        <script src="~/Scripts/jquery-1.7.1.min.js"></script>
        <script src="~/Scripts/jquery-ui-1.8.20.js"></script>
        <script src="~/Scripts/modernizr-2.5.3.js"></script>
        <meta name="viewport" content="width=device-width" />
    </head>
    <body>
        <header>
            <div class="content-wrapper">
                <div class="float-left">
                    <p class="site-title"><a href="~/">将你的徽标放置在此处</a></p>
                </div>
                <div class="float-right">
                    <section id="login">
                        @If WebSecurity.IsAuthenticated Then
                            @<text>
                                你好，<a class="email" href="~/Account/Manage" title="Manage">@WebSecurity.CurrentUserName</a>!
                                <form id="logoutForm" action="~/Account/Logout" method="post">
                                    @AntiForgery.GetHtml()
                                    <a href="javascript:document.getElementById('logoutForm').submit()">注销</a>
                                </form>
                            </text>
                        Else
                            @<ul>
                                <li><a href="~/Account/Register">注册</a></li>
                                <li><a href="~/Account/Login">登录</a></li>
                            </ul>
                        End If
                    </section>
                    <nav>
                        <ul id="menu">
                            <li><a href="~/">主页</a></li>
                            <li><a href="~/About">关于</a></li>
                            <li><a href="~/Contact">联系方式</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
        <div id="body">
            @RenderSection("featured", required:=false)
            <section class="content-wrapper main-content clear-fix">
                @RenderBody()
            </section>
        </div>
        <footer>
            <div class="content-wrapper">
                <div class="float-left">
                    <p>&copy; @DateTime.Now.Year - 我的 ASP.NET 网页</p>
                </div>
            </div>
        </footer>

        @RenderSection("Scripts", required:=False)
    </body>
</html>