﻿@Code
    WebSecurity.InitializeDatabaseConnection("StarterSite", "UserProfile", "UserId", "Email", autoCreateTables:=true)

    ' 若要允许此站点的用户使用他们在其他站点(例如 Microsoft、Facebook 和 Twitter)上拥有的帐户登录，
    ' 必须更新此站点。有关详细信息，请访问 http://go.microsoft.com/fwlink/?LinkID=226949

    ' OAuthWebSecurity.RegisterMicrosoftClient(
    '     clientId:="",
    '     clientSecret:="")

    ' OAuthWebSecurity.RegisterTwitterClient(
    '     consumerKey:="",
    '     consumerSecret:="")

    ' OAuthWebSecurity.RegisterFacebookClient(
    '     appId:="",
    '     appSecret:="")

    ' OAuthWebSecurity.RegisterGoogleClient()

    ' WebMail.SmtpServer = "mailserver.example.com"
    ' WebMail.EnableSsl = True
    ' WebMail.UserName = "username@example.com"
    ' WebMail.Password = "your-password"
    ' WebMail.From = "your-name-here@example.com"

    ' 若要了解如何优化站点中的脚本和样式表，请转到 http://go.microsoft.com/fwlink/?LinkID=248974
End Code