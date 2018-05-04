@ModelType $safeprojectname$.RegisterModel
@Code
    ViewData("Title") = "注册"
End Code

<hgroup class="title">
    <h1>@ViewData("Title").</h1>
    <h2>新建帐户。</h2>
</hgroup>

@Using Html.BeginForm()
    @Html.AntiForgeryToken()
    @Html.ValidationSummary()

    @<fieldset>
        <legend>注册表单</legend>
        <ol>
            <li>
                @Html.LabelFor(Function(m) m.UserName)
                @Html.TextBoxFor(Function(m) m.UserName)
            </li>
            <li>
                @Html.LabelFor(Function(m) m.Password)
                @Html.PasswordFor(Function(m) m.Password)
            </li>
            <li>
                @Html.LabelFor(Function(m) m.ConfirmPassword)
                @Html.PasswordFor(Function(m) m.ConfirmPassword)
            </li>
        </ol>
        <input type="submit" value="注册" />
    </fieldset>
End Using

@Section Scripts
    @Scripts.Render("~/bundles/jqueryval")
End Section
