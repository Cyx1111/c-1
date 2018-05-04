@* Remove this section if you are using bundling *@
@Section Scripts
    <script src="~/Scripts/jquery.validate.min.js"></script>
    <script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
End Section

@Code
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "Password Reset"

    Dim passwordResetToken As String = Request.Form("resetToken")

    If passwordResetToken Is Nothing Then
        passwordResetToken = Request.QueryString("resetToken")
    End If

    Dim tokenExpired As Boolean = False
    Dim isSuccess As Boolean = False

    ' Setup validation
    Validation.RequireField("newPassword", "The new password field is required.")
    Validation.Add("confirmPassword",
        Validator.EqualsTo("newPassword", "The new password and confirmation password do not match."))
    Validation.RequireField("passwordResetToken", "The password reset token field is required.")
    Validation.Add("newPassword",
        Validator.StringLength(
            maxLength:=Int32.MaxValue,
            minLength:=6,
            errorMessage:="New password must be at least 6 characters"))

    If IsPost AndAlso Validation.IsValid() Then
        AntiForgery.Validate()
        Dim newPassword As String = Request("newPassword")
        Dim confirmPassword As String = Request("confirmPassword")

        If WebSecurity.ResetPassword(passwordResetToken, newPassword) Then
            isSuccess = True
        Else
            ModelState.AddError("passwordResetToken", "The password reset token is invalid.")
            tokenExpired = True
        End If
    End If
End Code

<hgroup class="title">
    <h1>@PageData("Title").</h1>
    <h2>使用以下表单重置密码。</h2>
</hgroup>

@If Not WebMail.SmtpServer.IsEmpty() Then
    If Not Validation.IsValid() Then
        @<p class="validation-summary-errors">
            @If tokenExpired Then
                @<text>密码重置标记不正确，或者可能已过期。请访问<a href="~/Account/ForgotPassword">“忘记了密码”页</a> 
                生成一个新密码。</text>
            Else
                @<text>无法重置密码。请更正错误，然后重试。</text>
            End If
        </p>
    End If

    If isSuccess Then
        @<p class="message-success">
            密码已更改! 请单击<a href="~/Account/Login" title="Log in">此处</a>登录。
        </p>
    End If

    @<form method="post">
        @AntiForgery.GetHtml()
        <fieldset>
            <legend>“密码更改”表单</legend>
            <ol>
                <li class="new-password">
                    <label for="newPassword" @If Not ModelState.IsValidField("newPassword") Then@<text>class="error-label"</text> End If>新密码</label> 
                    <input type="password" id="newPassword" name="newPassword" disabled="@isSuccess" @Validation.For("newPassword") />
                    @Html.ValidationMessage("newPassword")
                </li>
                <li class="confirm-password">
                    <label for="confirmPassword" @If Not ModelState.IsValidField("confirmPassword") Then@<text>class="error-label"</text> End If>确认密码</label> 
                    <input type="password" id="confirmPassword" name="confirmPassword" disabled="@isSuccess" @Validation.For("confirmPassword") />
                    @Html.ValidationMessage("confirmPassword")
                </li>
                <li class="reset-token">
                    <label for="resetToken" @If Not ModelState.IsValidField("resetToken") Then@<text>class="error-label"</text> End If>密码重置标记</label> 
                    <input type="text" id="resetToken" name="resetToken" value="@passwordResetToken" disabled="@isSuccess" @Validation.For("resetToken") />
                    @Html.ValidationMessage("resetToken")
                </li>
            </ol>
            <input type="submit" value="重置密码" disabled="@isSuccess" />
        </fieldset>
    </form>
Else
    @<p class="message-info">
        由于 SMTP 服务器的配置不正确，
        因此已对此网站禁用密码恢复。请与此站点的所有者联系以重置
        密码。
    </p>
End If
