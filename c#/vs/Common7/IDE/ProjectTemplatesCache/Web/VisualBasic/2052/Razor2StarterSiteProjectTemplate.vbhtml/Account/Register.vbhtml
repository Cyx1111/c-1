@* 如果你要使用绑定，请删除此部分*@
@Section Scripts
    <script src="~/Scripts/jquery.validate.min.js"></script>
    <script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
End Section

@Code
    Layout = "~/_SiteLayout.vbhtml"
PageData("Title") = "注册"

' 初始化常规页变量
    Dim email As String = ""
    Dim password As String = ""
    Dim confirmPassword As String = ""

' 设置验证
    Validation.RequireField("email", "电子邮件地址字段是必需的.")
    Validation.RequireField("password", "密码不能为空.")
    Validation.Add("confirmPassword",
Validator.EqualsTo("password", "密码和确认密码不匹配."))
    Validation.Add("password",
        Validator.StringLength(
            maxLength:=Int32.MaxValue,
            minLength:=6,
            errorMessage:="密码必须至少包含 6 个字符"))

' 如果这是POST 请求，则验证并处理数据
    If IsPost Then
        AntiForgery.Validate()
        email = Request.Form("email")
        password = Request.Form("password")
        confirmPassword = Request.Form("confirmPassword")

' 验证用户的 captcha 应答
        ' If Not ReCaptcha.Validate("PRIVATE_KEY")) Then
        '     ModelState.AddError("recaptcha", "Captcha 响应不正确")
        ' End If

' 如果所有信息均有效，则创建新帐户
        If Validation.IsValid() Then
            ' 将新用户插入到数据库
            Dim db As Database = Database.Open("StarterSite")

' 检查用户是否已存在
            Dim user As Object = db.QuerySingle("SELECT Email FROM UserProfile WHERE LOWER(Email) = LOWER(@0)", email)
            If user Is Nothing Then
' 将电子邮件插入到配置文件表
                db.Execute("INSERT INTO UserProfile (Email) VALUES (@0)", email)

' 在成员资格数据库中创建并关联新项.
' 如果成功，则继续处理请求
                Try
                    Dim requireEmailConfirmation As Boolean = Not WebMail.SmtpServer.IsEmpty()
                    Dim token As String = WebSecurity.CreateAccount(email, password, requireEmailConfirmation)
                    If requireEmailConfirmation Then
                        Dim hostUrl As String = Request.Url.GetComponents(UriComponents.SchemeAndServer, UriFormat.Unescaped)
                        Dim confirmationUrl As String = hostUrl + VirtualPathUtility.ToAbsolute("~/Account/Confirm?confirmationCode=" + HttpUtility.UrlEncode(token))

                        WebMail.Send(
                            to:=email,
                            subject:="请确认你的帐户",
                            body:="你的确认代码是: " + token + ". 访问<a href=""" + confirmationUrl + """>" + confirmationUrl + "</a> 以激活你的帐户."
                        )
                    End If

                    If requireEmailConfirmation Then
' 感谢用户注册，并让用户知道正在向他们发送一封电子邮件
                        Response.Redirect("~/Account/Thanks")
                    Else
' 导航回主页并退出
                        WebSecurity.Login(email, password)

                        Response.Redirect("~/")
                    End If
                Catch e As System.Web.Security.MembershipCreateUserException
                    ModelState.AddFormError(e.Message)
                End Try
            Else
' 用户已存在
ModelState.AddFormError("电子邮件地址已在使用中.")
            End If
        End If
    End If
End Code

<hgroup class="title">
    <h1>@PageData("Title").</h1>
    <h2>Create a new account.</h2>
</hgroup>

<form method="post">
    @AntiForgery.GetHtml()
@* 如果至少存在一个验证错误，则通知用户*@
    @Html.ValidationSummary("帐户创建失败。请更正错误，然后重试.", excludeFieldErrors:=True, htmlAttributes:=Nothing)

    <fieldset>
<legend>注册表单</legend>
        <ol>
            <li class="email">
<label for="email" @If Not ModelState.IsValidField("email") Then@<text>class="error-label"</text> End If>电子邮件地址</label>
                <input type="text" id="email" name="email" value="@email" @Validation.For("email") />
                @* 将任何电子邮件验证错误写入此页*@
                @Html.ValidationMessage("email")
            </li>
            <li class="password">
                <label for="password" @If Not ModelState.IsValidField("password") Then@<text>class="error-label"</text> End If>Password</label>
                <input type="password" id="password" name="password" @Validation.For("password") />
@* 将任何密码验证错误写入此页*@
                @Html.ValidationMessage("password")
            </li>
            <li class="confirm-password">
<label for="confirmPassword" @If Not ModelState.IsValidField("confirmPassword") Then@<text>class="error-label"</text> End If>确认密码</label>
                <input type="password" id="confirmPassword" name="confirmPassword" @Validation.For("confirmPassword") />
@* 将任何密码验证错误写入此页*@
                @Html.ValidationMessage("confirmPassword")
            </li>
            <li class="recaptcha">
                <div class="message-info">
                    <p>
若要启用 CAPTCHA 验证, <a href="http://go.microsoft.com/fwlink/?LinkId=204140">请安装 
ASP.NET Web Helpers Library</a> ，取消注释 ReCaptcha.GetHtml 并将 'PUBLIC_KEY'
替换为你的公钥. 在此页顶端，取消注释 ReCaptcha. Validate 并
将 'PRIVATE_KEY' 替换为你的私钥.
注册 reCAPTCHA 密钥(在 <a href="http://recaptcha.net">reCAPTCHA.net</a> 上).
                    </p>
                </div>
                @*
                @ReCaptcha.GetHtml("PUBLIC_KEY", theme:="white")
                @Html.ValidationMessage("recaptcha")
                *@
            </li>
        </ol>
        <input type="submit" value="Register" />
    </fieldset>
</form>