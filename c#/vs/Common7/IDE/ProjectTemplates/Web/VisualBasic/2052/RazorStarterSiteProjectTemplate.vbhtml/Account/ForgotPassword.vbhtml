@Code
    '  设置布局页和页标题
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "忘记密码?"

    Dim passwordSent As Boolean = False
    Dim isValid As Boolean = True
    Dim errorMessage = ""
    Dim emailError = ""
    Dim disabledAttribute = ""
    Dim resetToken = ""
    Dim email = If(Request.Form("email"), Request.QueryString("email"))

    If IsPost Then
        ' 验证电子邮件
        If email.IsEmpty() OrElse (Not email.Contains("@")) Then
            emailError = "请输入有效的电子邮件"
            isValid = False
        End If
        If isValid Then
            If WebSecurity.GetUserId(email) > -1 AndAlso WebSecurity.IsConfirmed(email) Then
                resetToken = WebSecurity.GeneratePasswordResetToken(email) '也可以为令牌指定到期日期
            Else
                passwordSent = True ' 我们不希望公开该用户不存在的信息。
                isValid = False
            End If
        End If
        If isValid Then
            Dim hostUrl = Request.Url.GetComponents(UriComponents.SchemeAndServer, UriFormat.Unescaped)
            Dim resetUrl = hostUrl + VirtualPathUtility.ToAbsolute("~/Account/PasswordReset?resetToken=" & HttpUtility.UrlEncode(resetToken))
            WebMail.Send(to:= email, subject:= "请重置密码", body:= "请使用此密码重置令牌重置您的密码。 令牌为:  " & resetToken & ". 访问 <a href=""" & resetUrl & """>" & resetUrl & "</a>，重置您的密码。")
            passwordSent = True
            disabledAttribute = "disabled=""disabled"""
        End If
    End If
End Code

<form method="post" action="">
    <fieldset>
        <legend>密码重置说明表单</legend>
        @If Not WebMail.SmtpServer.IsEmpty() Then
            @<p>
                我们会向与帐户关联的电子邮件地址发送密码重置说明。 
            </p>
            If passwordSent Then
                @<p class="message success">
                    我们已向指定的电子邮件地址发送了密码重置说明。
                </p>
            End If
            If Not errorMessage.IsEmpty() Then
                @<p class="message error">
                    @errorMessage
                </p>
            End If
            @<ol>
                <li class="email">
                    <label for="email">电子邮件地址</label>
                    <input type="text" id="email" name="email" title="电子邮件地址" value="@email" @disabledAttribute @IIf((Not emailError.IsEmpty()), "class=""error-field",Nothing)/>
                    @If Not emailError.IsEmpty() Then
                        @<label class="validation-error">@emailError</label>
                    End If
                </li>
            </ol>
            @<p class="form-actions">
                <input type="submit" value="Send Instructions" @disabledAttribute/>
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

