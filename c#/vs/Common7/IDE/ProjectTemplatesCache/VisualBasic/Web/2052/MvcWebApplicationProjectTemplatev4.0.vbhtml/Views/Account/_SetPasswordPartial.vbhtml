@ModelType $safeprojectname$.LocalPasswordModel

<p>
    你没有此站点的本地密码。请添加一个本地
                密码，这样，无需外部登录便可以登录了。
</p>

@Using Html.BeginForm("Manage", "Account")
    @Html.AntiForgeryToken()
    @Html.ValidationSummary()

    @<fieldset>
        <legend>“设置密码”表单</legend>
        <ol>
            <li>
                @Html.LabelFor(Function(m) m.NewPassword)
                @Html.PasswordFor(Function(m) m.NewPassword)
            </li>
            <li>
                @Html.LabelFor(Function(m) m.ConfirmPassword)
                @Html.PasswordFor(Function(m) m.ConfirmPassword)
            </li>
        </ol>
        <input type="submit" value="设置密码" />
    </fieldset>
End Using
