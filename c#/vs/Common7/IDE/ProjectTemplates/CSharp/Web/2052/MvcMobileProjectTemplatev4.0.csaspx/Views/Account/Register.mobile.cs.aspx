<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<$safeprojectname$.Models.RegisterModel>" %>

<asp:Content ID="registerTitle" ContentPlaceHolderID="Title" runat="server">
    注册
</asp:Content>

<asp:Content ID="registerContent" ContentPlaceHolderID="MainContent" runat="server">
    <p>
        密码必须至少包含 <%: Membership.MinRequiredPasswordLength %> 个字符。
    </p>

    <% using (Html.BeginForm()) { %>
        <%: Html.ValidationSummary() %>

        <ul data-role="listview" data-inset="true">
            <li data-role="list-divider">详细信息</li>

            <li data-role="fieldcontain">
                <%: Html.LabelFor(m => m.UserName) %>
                <%: Html.TextBoxFor(m => m.UserName) %>                
            </li>

            <li data-role="fieldcontain">
                <%: Html.LabelFor(m => m.Email) %>
                <%: Html.TextBoxFor(m => m.Email) %>                
            </li>

            <li data-role="fieldcontain">
                <%: Html.LabelFor(m => m.Password) %>
                <%: Html.PasswordFor(m => m.Password) %>                
            </li>

            <li data-role="fieldcontain">
                <%: Html.LabelFor(m => m.ConfirmPassword) %>
                <%: Html.PasswordFor(m => m.ConfirmPassword) %>                
            </li>

            <li data-role="fieldcontain">
                <input type="submit" value="注册" />
            </li>
        </ul>
    <% } %>
</asp:Content>

<asp:Content ID="scriptsContent" ContentPlaceHolderID="ScriptsSection" runat="server">
    <%: Scripts.Render("~/bundles/jqueryval") %>
</asp:Content>
