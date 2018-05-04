﻿<%@ Page Language="VB" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="indexTitle" ContentPlaceHolderID="Title" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="indexContent" ContentPlaceHolderID="MainContent" runat="server">
    <h2><%: ViewData("Message") %></h2>
    <p>
        To learn more about ASP.NET MVC visit <a href="http://asp.net/mvc" title="ASP.NET MVC Website">http://asp.net/mvc</a>.
    </p>

    <ul data-role="listview" data-inset="true">
        <li data-role="list-divider">Navigation</li>
        <li><%: Html.ActionLink("About", "About", "Home") %></li>
        <li><%: Html.ActionLink("Contact", "Contact", "Home") %></li>
    </ul>
</asp:Content>