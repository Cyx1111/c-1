@* Remove this section if you are using bundling *@
@Section Scripts
    <script src="~/Scripts/jquery.validate.min.js"></script>
    <script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
End Section

@Code
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "Forget Your Password"

    Dim passwordSent As Boolean = False
    Dim resetToken As String = ""
    Dim email As String = Request.Form("email")

    If email Is Nothing Then
        email = Request.QueryString("email")
    End If

    ' Setup validation
    Validation.RequireField("email", "The email address field is required.")

    If IsPost Then
        AntiForgery.Validate()
        ' validate email
        Dim isValid As Boolean = True
        If Validation.IsValid() Then
            If WebSecurity.GetUserId(email) > -1 AndAlso WebSecurity.IsConfirmed(email) Then
                resetToken = WebSecurity.GeneratePasswordResetToken(email) ' Optionally specify an expiration date for the token
            Else
                passwordSent = True ' We don't want to disclose that the user does not exist.
                isValid = False '
            End If
        End If
        If isValid Then
            Dim hostUrl As String = Request.Url.GetComponents(UriComponents.SchemeAndServer, UriFormat.Unescaped)
            Dim resetUrl As String = hostUrl + VirtualPathUtility.ToAbsolute("~/Account/PasswordReset?resetToken=" + HttpUtility.UrlEncode(resetToken))
            WebMail.Send(
                to:=email,
                subject:="Please reset your password",
                body:="Use this password reset token to reset your password. The token is: " + resetToken + ". Visit <a href=""" + HttpUtility.HtmlAttributeEncode(resetUrl) + """>" + resetUrl + "</a> to reset your password."
            )
            passwordSent = True
        End If
    End If
End Code

<hgroup class="title">
    <h1>@PageData("Title").</h1>
    <h2>使用以下表单重置密码。</h2>
</hgroup>

@If Not WebMail.SmtpServer.IsEmpty() Then
    @<p>
        我们会将密码重置说明发送到与你的帐户关联的电子邮件地址。
    </p>

    If passwordSent Then
        @<p class="message-success">
            重置密码说明已发送到指定的电子邮件地址。
        </p>
    End If

    @<form method="post">
        @AntiForgery.GetHtml()
        @Html.ValidationSummary(excludeFieldErrors:=True)

        <fieldset>
            <legend>密码重置说明表单</legend>
            <ol>
                <li class="email">
                    <label for="email" @If Not ModelState.IsValidField("email") Then@<text>class="error-label"</text> End If>电子邮件地址</label>
                    <input type="text" id="email" name="email" value="@email" disabled="@passwordSent" @Validation.For("email") />
                    @Html.ValidationMessage("email")
                </li>
            </ol>
            <p class="form-actions">
                <input type="submit" value="发送说明" disabled="@passwordSent" />
            </p>
        </fieldset>
    </form>
Else
   @<p class="message-info">
       由于 SMTP 服务器的配置不正确，
       因此已对此网站禁用密码恢复。请与此站点的所有者联系以重置 
       密码。
   </p>
End If