@Code
    ' 设置布局页和页标题
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "注册帐户"

    ' 初始化常规页变量
    Dim email = ""
    Dim password = ""
    Dim confirmPassword = ""

    ' 验证
    Dim isValid = True
    Dim emailErrorMessage = ""
    Dim passwordErrorMessage = ""
    Dim confirmPasswordMessage = ""
    Dim accountCreationErrorMessage = ""
    ' Dim captchaMessage = ""

    ' 如果这是 POST 请求，则验证和处理数据
    If IsPost Then
        email = Request.Form("email")
        password = Request.Form("password")
        confirmPassword = Request.Form("confirmPassword")

        ' 验证用户的 captcha 应答
        ' If Not ReCaptcha.Validate("PRIVATE_KEY") Then
        '     captchaMessage = "Captcha response was not correct"
        '     isValid = False
        ' End If

        ' 验证用户的电子邮件地址
        If email.IsEmpty() Then
            emailErrorMessage = "您必须指定电子邮件地址。"
            isValid = False
        End If

        ' 验证用户的密码和密码确认
        If password.IsEmpty() Then
            passwordErrorMessage = "密码不能为空。"
            isValid = False
        End If

        If password <> confirmPassword Then
            confirmPasswordMessage = "新密码和确认密码不匹配。"
            isValid = False
        End If

        ' 如果所有信息均有效，则创建新帐户
        If isValid Then
            ' 将新用户插入到数据库
            Dim db = Database.Open("StarterSite")

            ' 检查用户是否已存在
            Dim user = db.QuerySingle("SELECT Email FROM UserProfile WHERE LOWER(Email) = LOWER(@0)", email)
            If user Is Nothing Then
                ' 将电子邮件插入到配置文件表
                db.Execute("INSERT INTO UserProfile (Email) VALUES (@0)", email)
                ' 在成员资格数据库中创建并关联新项。
                ' 如果成功，则继续处理请求
                Try
                    Dim requireEmailConfirmation As Boolean = Not WebMail.SmtpServer.IsEmpty()
                    Dim token = WebSecurity.CreateAccount(email, password, requireEmailConfirmation)
                    If requireEmailConfirmation Then
                        Dim hostUrl = Request.Url.GetComponents(UriComponents.SchemeAndServer, UriFormat.Unescaped)
                        Dim confirmationUrl = hostUrl + VirtualPathUtility.ToAbsolute("~/Account/Confirm?confirmationCode=" & HttpUtility.UrlEncode(token))
                        WebMail.Send(to:= email, subject:= "请确认您的帐户", body:= "您的确认代码是: " & token & ". 请访问 <a href=""" & confirmationUrl & """>" & confirmationUrl & "</a> 来激活您的帐户。")
                    End If

                    If requireEmailConfirmation Then
                        ' 感谢用户注册，并让用户知道正在向他发送一封电子邮件
                        Response.Redirect("~/Account/Thanks")
                    Else
                        ' 导航回主页并退出
                        WebSecurity.Login(email, password)
                        Response.Redirect("~/")
                    End If
                Catch e As System.Web.Security.MembershipCreateUserException
                    isValid = False
                    accountCreationErrorMessage = e.ToString()
                End Try
            Else
                ' 用户已存在
                isValid = False
                accountCreationErrorMessage = "电子邮件地址已在使用中。"
            End If
        End If
    End If
End Code

<p>
   使用以下表单创建新帐户。 
</p>

@*如果至少存在一个验证错误，则通知用户*@
@If Not isValid Then
   @<p class="message error">
    @If accountCreationErrorMessage.IsEmpty() Then
        @:请更正错误并重试。
    Else
        @accountCreationErrorMessage
    End If
   </p>
End If

<form method="post" action="">
    <fieldset>
        <legend>注册表单</legend>
        <ol>
            <li class="email">
                <label for="email">电子邮件:</label>
                <input type="text" id="email" name="email" title="电子邮件地址" value="@email" @IIf((Not emailErrorMessage.IsEmpty()), "class=""error-field", Nothing)/>
                @*将任何电子邮件验证错误写入此页*@
                @If Not emailErrorMessage.IsEmpty() Then
                    @<label for="email" class="validation-error">@emailErrorMessage</label>
                End If
            </li>
            <li class="password">
                <label for="password">密码:</label>
                <input type="password" id="password" name="password" title="密码" @IIf((Not passwordErrorMessage.IsEmpty()), "class=""error-field", Nothing)/>
                @*将任何密码验证错误写入此页*@
                @If Not passwordErrorMessage.IsEmpty() Then
                    @<label for="password" class="validation-error">@passwordErrorMessage</label>
                End If
            </li>
            <li class="confirm-password">
                <label for="confirmPassword">确认密码:</label>
                <input type="password" id="confirmPassword" name="confirmPassword" title="确认密码" @IIf((Not confirmPasswordMessage.IsEmpty()), "class=""error-field", Nothing)/>
                @*将任何密码验证错误写入此页*@
                @If Not confirmPasswordMessage.IsEmpty() Then
                    @<label for="confirmPassword" class="validation-error">@confirmPasswordMessage</label>
                End If
            </li>
            <li class="recaptcha">
                <div class="message info">
                    <p>若要启用 CAPTCHA 验证，请<a href="http://go.microsoft.com/fwlink/?LinkId=204140">安装 ASP.NET Web Helpers Library</a>，取消 ReCaptcha.Render 的注释，并用您的公钥替换
                    "PUBLIC_KEY"。在此页顶部，取消 ReCaptcha.Validate 的注释，并用您的私钥替换
                    "PRIVATE_KEY"。</p>
                    <p>在 <a href="http://recaptcha.net">reCAPTCHA.net</a> 上注册 reCAPTCHA 密钥。</p>
                </div>
                @*
                @ReCaptcha.GetHtml("PUBLIC_KEY", theme: "white")
                @If Not captchaMessage.IsEmpty() Then
                    <label class="validation-error">@captchaMessage</label>
                End If
                *@
            </li>
        </ol>
        <p class="form-actions">
            <input type="submit" value="注册" title="注册" />
        </p>
    </fieldset>
</form>