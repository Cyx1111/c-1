<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta charset="utf-8" />
    <title>我的 ASP.NET 网页 - @PageData("Title")</title>
    <link href="@Href("~/Styles/Site.css")" rel="stylesheet" />
    <link href="@Href("~/favicon.ico")" rel="shortcut icon" type="image/x-icon" />
</head>
<body>
    <div id="page">
        <div id="header">
            <p class="site-title">我的 ASP.NET 网页</p>
            <div id="login">
                @If WebSecurity.IsAuthenticated Then
                    @<p>
                        欢迎使用 <a href="@Href("~/Account/ChangePassword")" title="更改密码">@WebSecurity.CurrentUserName</a>!
                        <a href="@Href("~/Account/Logout")">注销</a>
                    </p>
                Else
                    @<ul>
                        <li><a href="@Href("~/Account/Register")">注册</a></li>
                        <li><a href="@Href("~/Account/Login")">登录</a></li>
                    </ul>
                End If
            </div>
            <ul id="menu">
                <li><a href="@Href("~/")">主页</a></li>
                <li><a href="@Href("~/About")">关于</a></li>
            </ul>
        </div>
        <div id="main">
            <div id="content">
                <h1>@PageData("Title")</h1>
                @RenderBody()
            </div>
            <div id="footer">
                &copy; @DateTime.Now.Year - 我的 ASP.NET 网页
            </div>
        </div>
    </div>
</body>
</html>