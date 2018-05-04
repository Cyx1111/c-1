@Code
    '  设置布局页和页标题
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "密码重置"

    Dim newPasswordError = ""
    Dim confirmPasswordError = ""
    Dim passwordResetTokenError = ""
    Dim passwordResetToken = If(Request.Form("resetToken"), Request.QueryString("resetToken"))
    Dim disabledAttribute = ""

    Dim isValid As Boolean = True
    Dim tokenExpired As Boolean = False
    Dim isSuccess As Boolean = False

    If IsPost Then
        Dim newPassword = Request("newPassword")
        Dim confirmPassword = Request("confirmPassword")

        If newPassword.IsEmpty() Then
            newPasswordError = "请输入新密码。"
            isValid = False
        End If

        If confirmPassword <> newPassword Then
            confirmPasswordError = "确认密码和新密码不匹配。"
            isValid = False
        End If

        If passwordResetToken.IsEmpty() Then
            passwordResetTokenError = "请输入密码重置令牌。 它应该已通过电子邮件发送给您。"
            isValid = False
        End If

        If isValid Then
            If WebSecurity.ResetPassword(passwordResetToken, newPassword) Then
                disabledAttribute = "disabled=""disabled"""
                isSuccess = True
            Else
                passwordResetTokenError = "密码重置令牌无效。"
                tokenExpired = True
                isValid = False
            End If
        Else
            isValid = False
        End If
    End If
End Code

@If Not isValid Then
    @<p class="message error">
        @If tokenExpired Then
            @<text>密码重置令牌错误或可能已过期。 请访问<a href="@Href("~/Account/ForgotPassword")">忘记密码页</a>，生成新令牌。</text>
        Else
            @<text>无法重置密码。 请更正错误并重试。</text>
        End If
    </p>
End If

@If isSuccess Then
    @<p class="message success">
        密码已更改!  单击<a href="@Href("~/Account/Login")" title="Login">此处</a>登录。
    </p>
End If

<form method="post" action="">
    <fieldset>
        <legend>密码更改表单</legend>
        @If Not WebMail.SmtpServer.IsEmpty() Then
            @<p>请在下方键入新密码并单击<em>重置密码</em>按钮以更改密码。</p>
            @<ol>
                <li class="new-password">
                    <label for="newPassword">新密码:</label> 
                    <input type="password" id="newPassword" name="newPassword" title="新密码" @disabledAttribute @IIf((Not newPasswordError.IsEmpty()), "class=""error-field", Nothing) />
                    @If Not newPasswordError.IsEmpty() Then
                        @<label for="newPassword" class="validation-error">@newPasswordError</label>
                    End If
                </li>
                <li class="confirm-password">
                    <label for="confirmPassword">确认密码:</label> 
                    <input type="password" id="confirmPassword" name="confirmPassword" title="确认新密码" @disabledAttribute @IIf((Not confirmPasswordError.IsEmpty()), "class=""error-field", Nothing)/>
                    @If Not confirmPasswordError.IsEmpty() Then
                        @<label for="confirmPassword" class="validation-error">@confirmPasswordError</label>
                    End If
                </li>
                <li class="reset-toekn">
                    <label for="resetToken">密码重置令牌:</label> 
                    <input type="text" id="resetToken" name="resetToken" value="@passwordResetToken" title="密码重置令牌" @disabledAttribute @IIf((Not passwordResetTokenError.IsEmpty()), "class=""error-field" ,Nothing)/>
                    @If Not passwordResetTokenError.IsEmpty() Then
                        @<label for="resetToken" class="validation-error">@passwordResetTokenError</label>
                    End If
                </li>
            </ol>
            @<p class="form-actions">
                <input type="submit" value="Reset Password" title="重置密码" @disabledAttribute/>
            </p>
        Else
            @<p class="message info">
                因为没有正确配置 SMTP 服务器，所以此网站禁用了 
                密码恢复功能。 要重置密码，请与此站点的所有者 
                联系。
            </p>
        End If
    </fieldset>
</form>

