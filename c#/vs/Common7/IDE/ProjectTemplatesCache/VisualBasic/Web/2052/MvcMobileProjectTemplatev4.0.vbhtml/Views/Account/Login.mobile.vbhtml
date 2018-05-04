@ModelType $safeprojectname$.LoginModel

@Code
    ViewData("Title") = "登录"
End Code

@section Header
    @Html.ActionLink("取消", "Index", "Home", Nothing, New With {.data_icon = "arrow-l", .data_rel = "back"})
    <h1>@ViewData("Title")</h1>
End Section

<p>
    请输入用户名和密码。如果您没有帐户，请 @Html.ActionLink("注册", "Register")。
</p>

@Using Html.BeginForm()
    @Html.ValidationSummary()

    @<ul data-role="listview" data-inset="true">
        <li data-role="list-divider">详细信息</li>

        <li data-role="fieldcontain">
            @Html.LabelFor(Function(m) m.UserName)
            @Html.TextBoxFor(Function(m) m.UserName)
        </li>

        <li data-role="fieldcontain">
            @Html.LabelFor(Function(m) m.Password)
            @Html.PasswordFor(Function(m) m.Password)            
        </li>

        <li data-role="fieldcontain">
            @Html.LabelFor(Function(m) m.RememberMe)
            @Html.CheckBoxFor(Function(m) m.RememberMe)
        </li>

        <li data-role="fieldcontain">
            <input type="submit" value="登录" />
        </li>
    </ul>
End Using

@Section Scripts
    @Scripts.Render("~/bundles/jqueryval")
End Section