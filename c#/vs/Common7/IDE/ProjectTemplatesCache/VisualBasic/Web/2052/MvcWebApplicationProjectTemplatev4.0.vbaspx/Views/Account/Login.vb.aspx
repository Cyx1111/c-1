<%@ Page Language="VB" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage(Of $safeprojectname$.LoginModel)" %>

<asp:Content ID="loginTitle" ContentPlaceHolderID="TitleContent" runat="server">
    登录
</asp:Content>

<asp:Content ID="loginContent" ContentPlaceHolderID="MainContent" runat="server">
    <hgroup class="title">
        <h1>登录。</h1>
    </hgroup>

    <section id="loginForm">
    <h2>使用本地帐户登录。</h2>
    <% Using Html.BeginForm(New With { .ReturnUrl = ViewData("ReturnUrl") }) %>
        <%: Html.AntiForgeryToken() %>
        <%: Html.ValidationSummary(true) %>

        <fieldset>
            <legend>“登录”表单</legend>
            <ol>
                <li>
                    <%: Html.LabelFor(Function(m) m.UserName) %>
                    <%: Html.TextBoxFor(Function(m) m.UserName) %>
                    <%: Html.ValidationMessageFor(Function(m) m.UserName) %>
                </li>
                <li>
                    <%: Html.LabelFor(Function(m) m.Password) %>
                    <%: Html.PasswordFor(Function(m) m.Password) %>
                    <%: Html.ValidationMessageFor(Function(m) m.Password) %>
                </li>
                <li>
                    <%: Html.CheckBoxFor(Function(m) m.RememberMe) %>
                    <%: Html.LabelFor(Function(m) m.RememberMe, New With { .Class = "checkbox" }) %>
                </li>
            </ol>
            <input type="submit" value="登录" />
        </fieldset>
        <p>
            <%: Html.ActionLink("注册", "Register") %> 如果您没有帐户。
        </p>
    <% End Using %>
    </section>

    <section class="social" id="socialLoginForm">
        <h2>使用其他服务登录。</h2>
        <%: Html.Action("ExternalLoginsList", New With { .ReturnUrl = ViewData("ReturnUrl") }) %>
    </section>
</asp:Content>

<asp:Content ID="scriptsContent" ContentPlaceHolderID="ScriptsSection" runat="server">
    <%: Scripts.Render("~/bundles/jqueryval") %>
</asp:Content>
