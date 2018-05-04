﻿@If OAuthWebSecurity.RegisteredClientData.Count = 0 Then
    @<div class="message-info">
        <p>
            未配置外部身份验证服务。请参见<a href="http://go.microsoft.com/fwlink/?LinkId=226949">此文章</a>，
            以详细了解如何将此 ASP.NET 应用程序设置为支持通过外部服务登录。
        </p>
    </div>
Else
    @<form method="post">
    @AntiForgery.GetHtml()
    <fieldset id="socialLoginList">
        <legend>使用其他服务登录</legend>
        <p>
            @For Each client As AuthenticationClientData In OAuthWebSecurity.RegisteredClientData
                @<button type="submit" name="provider" value="@client.AuthenticationClient.ProviderName"
                         title="使用你的 @client.DisplayName 帐户登录">@client.DisplayName</button>
            Next
        </p>
    </fieldset>
    </form>
End If