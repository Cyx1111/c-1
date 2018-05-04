﻿<%@ Page Language="VB" Inherits="System.Web.Mvc.ViewPage(Of ICollection(Of AuthenticationClientData))" %>
<%@ Import Namespace="Microsoft.Web.WebPages.OAuth" %>

<% If Model.Count = 0 Then %>
    <div class="message-info">
        <p>未配置外部身份验证服务。请参见<a href="http://go.microsoft.com/fwlink/?LinkId=252166">此文章</a>，
        以详细了解如何将此 ASP.NET 应用程序设置为支持通过外部服务登录。</p>
    </div>
<% Else
    Using Html.BeginForm("ExternalLogin", "Account", New With { .ReturnUrl = ViewData("ReturnUrl") }) %>
    <%: Html.AntiForgeryToken() %>
    <fieldset id="socialLoginList">
        <legend>使用其他服务登录</legend>
        <p>
        <% For Each p as AuthenticationClientData in Model %>
            <button type="submit" name="provider" value="<%: p.AuthenticationClient.ProviderName %>" title="使用你的 <%: p.DisplayName %> 帐户登录"><%: p.DisplayName%></button>
        <% Next %>
        </p>
    </fieldset>
    <% End Using
End If %>