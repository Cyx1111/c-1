@* 如果你要使用绑定，请删除此部分 *@
@Section Scripts
    <script src="~/Scripts/jquery.validate.min.js"></script>
    <script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
End Section

@Code
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "注册"

    Dim email As String = ""
    Dim loginData As String = ""
    Dim providerDisplayName As String = ""

    Dim returnUrl As String = Request.QueryString("ReturnUrl")
    If returnUrl.IsEmpty() Then
        ' 某些外部登录提供程序始终需要一个返回 URL 值
        returnUrl = Href("~/")
    End If

    ' 设置验证
    Validation.RequireField("email", "用户名字段是必填字段。")

    If IsPost AndAlso Request.Form("newAccount").AsBool() Then
        ' 处理新帐户注册表单
        AntiForgery.Validate()

        email = Request.Form("email")
        loginData = Request.Form("loginData")

        Dim provider As String = ""
        Dim providerUserId As String = ""
        If WebSecurity.IsAuthenticated OrElse Not OAuthWebSecurity.TryDeserializeProviderUserId(loginData, provider, providerUserId) Then
            Response.Redirect("~/Account/Manage")
            Return
        End If

        providerDisplayName = OAuthWebSecurity.GetOAuthClientData(provider).DisplayName
        If Validation.IsValid() Then
            ' 将新用户插入到数据库
            Dim db As Database = Database.Open("StarterSite")

            ' 检查该用户是否已存在
            Dim user As Object = db.QuerySingle("SELECT Email FROM UserProfile WHERE LOWER(Email) = LOWER(@0)", email)
            If user Is Nothing Then
                ' 将电子邮件插入到配置文件表
                db.Execute("INSERT INTO UserProfile (Email) VALUES (@0)", email)
                OAuthWebSecurity.CreateOrUpdateAccount(provider, providerUserId, email)

                OAuthWebSecurity.Login(provider, providerUserId, createPersistentCookie:= False)

                Context.RedirectLocal(returnUrl)
                Return
            Else
                ModelState.AddError("email", "用户名已存在。请输入其他用户名。")
            End If
        End If
    Else
        ' 处理来自外部登录提供程序的回调

        Dim result As AuthenticationResult = OAuthWebSecurity.VerifyAuthentication(Href("~/Account/RegisterService", New With { .ReturnUrl = returnUrl }))
        If result.IsSuccessful Then
            Dim registered As Boolean = OAuthWebSecurity.Login(result.Provider, result.ProviderUserId, False)
            If registered Then
                Context.RedirectLocal(returnUrl)
                Return
            End If

            If WebSecurity.IsAuthenticated Then
                ' 如果当前用户已登录，请添加新帐户
                OAuthWebSecurity.CreateOrUpdateAccount(result.Provider, result.ProviderUserId, WebSecurity.CurrentUserName)
                Context.RedirectLocal(returnUrl)
                Return
            Else
                ' 该用户是新用户，因此将默认用户名设置为从外部登录提供程序获取的值
                email = result.UserName
                loginData = OAuthWebSecurity.SerializeProviderUserId(result.Provider, result.ProviderUserId)
                providerDisplayName = OAuthWebSecurity.GetOAuthClientData(result.Provider).DisplayName
            End If
        Else
            Response.Redirect("~/Account/ExternalLoginFailure")
            Return
        End If
    End If
End Code

<hgroup class="title">
    <h1>@PageData("Title").</h1>
    <h2>关联你的 @providerDisplayName 帐户。</h2>
</hgroup>

<form method="post">
    @AntiForgery.GetHtml()
    <input type="hidden" name="loginData" value="@loginData" />

    @* 如果至少存在一个验证错误，则通知用户 *@
    @Html.ValidationSummary(excludeFieldErrors:=True)

    <fieldset>
        <legend>注册表单</legend>
        <p>
            你已成功地使用 <strong>@providerDisplayName</strong> 进行身份验证。请
            在下面输入此站点的用户名，然后单击“确认”按钮完成
            登录。
        </p>
        <ol>
            <li class="email">
                <label for="email" @If Not ModelState.IsValidField("email") Then@<text>class="error-label"</text>End If>电子邮件地址</label>
                <input type="text" id="email" name="email" value="@email" @Validation.For("email") />
                @* 将任何电子邮件验证错误写入页中 *@
                @Html.ValidationMessage("email")
            </li>
        </ol>
        <button type="submit" name="newAccount" value="true">注册</button>
    </fieldset>
</form>