<%@ Page Language="VB" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage(Of $safeprojectname$.LoginModel)" %>

<asp:Content runat="server" ID="indexTitle" ContentPlaceHolderID="Title">
    您的帐户
</asp:Content>

<asp:Content runat="server" ID="indexHeader" ContentPlaceHolderID="Header">
    <%: Html.ActionLink("后退", "Index", "Home", Nothing, New With {.data_icon = "arrow-l", .data_rel = "back" }) %>
    <h1>您的帐户</h1>
</asp:Content>

<asp:Content runat="server" ID="indexContent" ContentPlaceHolderID="MainContent">
    <p>
        以 <strong><%: Page.User.Identity.Name %></strong> 身份登录。
    </p>

    <ul data-role="listview" data-inset="true">
        <li><%: Html.ActionLink("更改密码", "ChangePassword") %></li>
        <li><%: Html.ActionLink("注销", "LogOff") %></li>
    </ul>
</asp:Content>