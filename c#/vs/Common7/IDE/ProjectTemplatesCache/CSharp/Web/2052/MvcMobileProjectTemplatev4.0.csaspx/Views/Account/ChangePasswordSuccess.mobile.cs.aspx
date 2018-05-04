<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="changePasswordTitle" ContentPlaceHolderID="Title" runat="server">
    更改密码
</asp:Content>

<asp:Content ID="changePasswordSuccessContent" ContentPlaceHolderID="MainContent" runat="server">
    <h2>更改密码</h2>
    <p>
        你的密码已更改。
    </p>

    <ul data-role="listview" data-inset="true">
        <li><%: Html.ActionLink("主页", "Index", "Home") %></li>
    </ul>
</asp:Content>