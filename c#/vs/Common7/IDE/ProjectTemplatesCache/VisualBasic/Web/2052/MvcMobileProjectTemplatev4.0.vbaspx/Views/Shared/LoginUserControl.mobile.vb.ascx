<%@ Control Language="VB" Inherits="System.Web.Mvc.ViewUserControl" %>
<% If Request.IsAuthenticated Then %>
    <%: Html.ActionLink(Page.User.Identity.Name, "Index", "Account", routeValues:=Nothing, htmlAttributes:=New With {.data_icon = "gear" }) %>
<% Else %>
    <%: Html.ActionLink("登录", "Login", "Account", routeValues:=Nothing, htmlAttributes:=New With {.data_icon = "gear" }) %>
<% End If %>
