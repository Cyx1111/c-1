﻿<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>My ASP.NET Web Page - @PageData("Title")</title>
    <link href="@Href("~/Styles/Site.css")" rel="stylesheet" />
    <link href="@Href("~/favicon.ico")" rel="shortcut icon" type="image/x-icon" />
</head>
<body>
    <div id="page">
        <div id="header">
            <p class="site-title">My ASP.NET Web Page</p>
            <div id="login">
                @If WebSecurity.IsAuthenticated Then
                    @<p>
                        Welcome <a href="@Href("~/Account/ChangePassword")" title="Change password">@WebSecurity.CurrentUserName</a>!
                        <a href="@Href("~/Account/Logout")">Logout</a>
                    </p>
                Else
                    @<ul>
                        <li><a href="@Href("~/Account/Register")">Register</a></li>
                        <li><a href="@Href("~/Account/Login")">Login</a></li>
                    </ul>
                End If
            </div>
            <ul id="menu">
                <li><a href="@Href("~/")">Home</a></li>
                <li><a href="@Href("~/About")">About</a></li>
            </ul>
        </div>
        <div id="main">
            <div id="content">
                <h1>@PageData("Title")</h1>
                @RenderBody()
            </div>
            <div id="footer">
                &copy; @DateTime.Now.Year - My ASP.NET Web Page
            </div>
        </div>
    </div>
</body>
</html>