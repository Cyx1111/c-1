@ModelType $safeprojectname$.LoginModel

@Code
    ViewData("Title") = "登录"
End Code

<hgroup class="title">
    <h1>@ViewData("Title").</h1>
</hgroup>

<section id="loginForm">
<h2>使用本地帐户登录。</h2>
@Using Html.BeginForm(New With { .ReturnUrl = ViewData("ReturnUrl") })
    @Html.AntiForgeryToken()
    @Html.ValidationSummary(true)

    @<fieldset>
        <legend>“登录”表单</legend>
        <ol>
            <li>
                @Html.LabelFor(Function(m) m.UserName)
                @Html.TextBoxFor(Function(m) m.UserName)
                @Html.ValidationMessageFor(Function(m) m.UserName)
            </li>
            <li>
                @Html.LabelFor(Function(m) m.Password)
                @Html.PasswordFor(Function(m) m.Password)
                @Html.ValidationMessageFor(Function(m) m.Password)
            </li>
            <li>
                @Html.CheckBoxFor(Function(m) m.RememberMe)
                @Html.LabelFor(Function(m) m.RememberMe, New With { .Class = "checkbox" })
            </li>
        </ol>
        <input type="submit" value="登录" />
    </fieldset>
    @<p>
        @Html.ActionLink("Register", "Register") (如果你没有帐户)。
    </p>
End Using
</section>

<section class="social" id="socialLoginForm">
    <h2>使用其他服务登录。</h2>
    @Html.Action("ExternalLoginsList", New With {.ReturnUrl = ViewData("ReturnUrl")})
</section>

@Section Scripts
    @Scripts.Render("~/bundles/jqueryval")
End Section
