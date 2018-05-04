<%@ Page Language="VB" Inherits="System.Web.Mvc.ViewPage(Of $safeprojectname$.LocalPasswordModel)" %>

<h3>更改密码</h3>

<% Using Html.BeginForm("Manage", "Account") %>
    <%: Html.AntiForgeryToken() %>
    <%: Html.ValidationSummary() %>

    <fieldset>
        <legend>“更改密码”表单</legend>
        <ol>
            <li>
                <%: Html.LabelFor(Function(m) m.OldPassword) %>
                <%: Html.PasswordFor(Function(m) m.OldPassword) %>
            </li>
            <li>
                <%: Html.LabelFor(Function(m) m.NewPassword) %>
                <%: Html.PasswordFor(Function(m) m.NewPassword) %>
            </li>
            <li>
                <%: Html.LabelFor(Function(m) m.ConfirmPassword) %>
                <%: Html.PasswordFor(Function(m) m.ConfirmPassword) %>
            </li>
        </ol>
        <input type="submit" value="更改密码" />
    </fieldset>
<% End Using %>
