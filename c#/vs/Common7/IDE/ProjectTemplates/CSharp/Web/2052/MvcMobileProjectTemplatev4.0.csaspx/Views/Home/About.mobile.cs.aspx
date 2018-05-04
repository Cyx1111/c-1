<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="aboutTitle" ContentPlaceHolderID="Title" runat="server">
    关于
</asp:Content>

<asp:Content ID="aboutContent" ContentPlaceHolderID="MainContent" runat="server">
    <h2>关于</h2>
    <p>
         将内容放置在此处。
    </p>

    <ul data-role="listview" data-inset="true">
        <li data-role="list-divider">导航</li>
        <li><%: Html.ActionLink("主页", "Index", "Home") %></li>
        <li><%: Html.ActionLink("联系方式", "Contact", "Home") %></li>
    </ul>
</asp:Content>