<%@ Control Language="VB" Inherits="System.Web.Mvc.ViewUserControl" %>
<%-- The following line works around an ASP.NET compiler warning --%>
<%: ""%>
<%
    If Request.IsAuthenticated Then
    %>
        欢迎 <strong><%: Page.User.Identity.Name %></strong>!
        [ <%: Html.ActionLink("注销", "LogOff", "Account")%> ]
    <%
    Else
    %>
        [ <%: Html.ActionLink("登录", "LogOn", "Account")%> ]
    <%        
    End If
%>