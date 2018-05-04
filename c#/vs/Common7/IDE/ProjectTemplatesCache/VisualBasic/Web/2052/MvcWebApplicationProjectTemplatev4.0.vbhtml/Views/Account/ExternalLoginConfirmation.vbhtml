@ModelType $safeprojectname$.RegisterExternalLoginModel
@Code
    ViewData("Title") = "注册"
End Code

<hgroup class="title">
    <h1>@ViewData("Title").</h1>
    <h2>关联你的 @ViewData("ProviderDisplayName") 帐户。</h2>
</hgroup>

@Using Html.BeginForm("ExternalLoginConfirmation", "Account", New With {.ReturnUrl = ViewData("ReturnUrl")})
    @Html.AntiForgeryToken()
    @Html.ValidationSummary(true)

    @<fieldset>
        <legend>关联表单</legend>
        <p>
            你已成功地使用 <strong>@ViewData("ProviderDisplayName")</strong> 进行身份验证。
            请在下面输入此站点的用户名，然后单击“确认”按钮完成
            登录。
        </p>
        <ol>
            <li class="name">
                @Html.LabelFor(Function(m) m.UserName)
                @Html.TextBoxFor(Function(m) m.UserName)
                @Html.ValidationMessageFor(Function(m) m.UserName)
            </li>
        </ol>
        @Html.HiddenFor(Function(m) m.ExternalLoginData)
        <input type="submit" value="注册" />
    </fieldset>
End Using

@Section Scripts
    @Scripts.Render("~/bundles/jqueryval")
End Section
