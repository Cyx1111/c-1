@ModelType $safeprojectname$.ChangePasswordModel

@Code
    ViewData("Title") = "更改密码"
End Code

@section Header
    @Html.ActionLink("取消", "Index", "Home", Nothing, New With {.data_icon = "arrow-l", .data_rel = "back"})
    <h1>@ViewData("Title")</h1>
End Section

<p>
    密码必须至少包含 @Membership.MinRequiredPasswordLength 个字符。
</p>

@Using Html.BeginForm()
    @Html.ValidationSummary()

    @<ul data-role="listview" data-inset="true">
        <li data-role="list-divider">帐户信息</li>

        <li data-role="fieldcontain">
            @Html.LabelFor(Function(m) m.OldPassword)
            @Html.PasswordFor(Function(m) m.OldPassword)
        </li>

        <li data-role="fieldcontain">
            @Html.LabelFor(Function(m) m.NewPassword)
            @Html.PasswordFor(Function(m) m.NewPassword)
        </li>

        <li data-role="fieldcontain">
            @Html.LabelFor(Function(m) m.ConfirmPassword)
            @Html.PasswordFor(Function(m) m.ConfirmPassword)
        </li>

        <li data-role="fieldcontain">
            <input type="submit" value="更改密码" />
        </li>
    </ul>
End Using

@Section Scripts
    @Scripts.Render("~/bundles/jqueryval")
End Section
