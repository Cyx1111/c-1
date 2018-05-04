@ModelType $safeprojectname$.LogOnModel

@Code
    ViewData("Title") = "登录"
End Code

<h2>登录</h2>
<p>
    请输入用户名和密码。如果您没有帐户，请 @Html.ActionLink("注册", "Register")。
</p>

<script src="@Url.Content("~/Scripts/jquery.validate.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.validate.unobtrusive.min.js")" type="text/javascript"></script>

@Html.ValidationSummary(True, "登录不成功。请更正错误并重试。")

@Using Html.BeginForm()
    @<div>
        <fieldset>
            <legend>帐户信息</legend>

            <div class="editor-label">
                @Html.LabelFor(Function(m) m.UserName)
            </div>
            <div class="editor-field">
                @Html.TextBoxFor(Function(m) m.UserName)
                @Html.ValidationMessageFor(Function(m) m.UserName)
            </div>

            <div class="editor-label">
                @Html.LabelFor(Function(m) m.Password)
            </div>
            <div class="editor-field">
                @Html.PasswordFor(Function(m) m.Password)
                @Html.ValidationMessageFor(Function(m) m.Password)
            </div>

            <div class="editor-label">
                @Html.CheckBoxFor(Function(m) m.RememberMe)
                @Html.LabelFor(Function(m) m.RememberMe)
            </div>

            <p>
                <input type="submit" value="登录" />
            </p>
        </fieldset>
    </div>
End Using
