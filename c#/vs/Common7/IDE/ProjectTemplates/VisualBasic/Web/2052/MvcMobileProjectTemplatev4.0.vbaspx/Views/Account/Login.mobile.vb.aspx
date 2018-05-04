<%@ Page Language="VB" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage(Of $safeprojectname$.LoginModel)" %>

<asp:Content ID="loginTitle" ContentPlaceHolderID="Title" runat="server">
    登录
</asp:Content>

<asp:Content ID="loginHeader" ContentPlaceHolderID="Header" runat="server">
    <%: Html.ActionLink("取消", "Index", "Home", Nothing, New With {.data_icon = "arrow-l", .data_rel = "back" }) %>
    <h1>登录</h1>
</asp:Content>

<asp:Content ID="loginContent" ContentPlaceHolderID="MainContent" runat="server">
    <p>
        请输入用户名和密码。 <%: Html.ActionLink("注册", "Register") %> 如果您没有帐户。
    </p>

    <% Using Html.BeginForm() %>
        <%: Html.ValidationSummary() %>

        <ul data-role="listview" data-inset="true">
            <li data-role="list-divider">详细信息</li>

            <li data-role="fieldcontain">
                <%: Html.LabelFor(Function(m) m.UserName) %>
                <%: Html.TextBoxFor(Function(m) m.UserName) %>                
            </li>

            <li data-role="fieldcontain">
                <%: Html.LabelFor(Function(m) m.Password) %>
                <%: Html.PasswordFor(Function(m) m.Password) %>                
            </li>

            <li data-role="fieldcontain">
                <%: Html.LabelFor(Function(m) m.RememberMe) %>
                <%: Html.CheckBoxFor(Function(m) m.RememberMe) %>
            </li>

            <li data-role="fieldcontain">
                <input type="submit" value="登录" />
            </li>
        </ul>
    <% End Using %>
</asp:Content>

<asp:Content ID="scriptsContent" ContentPlaceHolderID="ScriptsSection" runat="server">
    <%: Scripts.Render("~/bundles/jqueryval") %>
</asp:Content>
