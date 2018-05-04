<%@ Page Language="VB" Inherits="System.Web.Mvc.ViewPage" %>
<% If (Request.IsAuthenticated) Then %>
    你好， <%: Html.ActionLink(User.Identity.Name, "Manage", "Account", routeValues:=Nothing, htmlAttributes:=New With {.class = "username", .title = "管理" }) %>!
    <% Using Html.BeginForm("LogOff", "Account", FormMethod.Post, New With { .Id = "logoutForm" }) %>
        <%: Html.AntiForgeryToken() %>
        <a href="javascript:document.getElementById('logoutForm').submit()">注销</a>
    <% End Using %>
<% Else %>
    <ul>
        <li><%: Html.ActionLink("注册", "Register", "Account", routeValues:=Nothing, htmlAttributes:=New With {.id = "registerLink" }) %></li>
        <li><%: Html.ActionLink("登录", "Login", "Account", routeValues:=Nothing, htmlAttributes:=New With {.id = "loginLink" }) %></li>
    </ul>
<% End If %>