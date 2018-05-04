@* Remove this section if you are using bundling *@
@Section Scripts
    <script src="~/Scripts/jquery.validate.min.js"></script>
    <script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
End Section

@Code
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "Log in"

    ' Initialize general page variables
    Dim email As String = ""
    Dim password As String = ""
    Dim rememberMe As Boolean = False

    Dim returnUrl As String = Request.QueryString("ReturnUrl")
    If returnUrl.IsEmpty() Then
        ' Some external login providers always require a return URL value
        returnUrl = Href("~/")
    End If

    ' Setup validation
    Validation.RequireField("email", "You must specify an email address.")
    Validation.RequireField("password", "You must specify a password.")
    Validation.Add("password",
        Validator.StringLength(
            maxLength:=Int32.MaxValue,
            minLength:=6,
            errorMessage:="Password must be at least 6 characters"))

    ' If this is a POST request, validate and process data
    If IsPost Then
        AntiForgery.Validate()
        ' is this an external login request?
        Dim provider As String = Request.Form("provider")
        If Not Provider.IsEmpty() Then
            OAuthWebSecurity.RequestAuthentication(Provider, Href("~/Account/RegisterService", New With { .ReturnUrl = returnUrl }))
            Return
        ElseIf Validation.IsValid() Then
            email = Request.Form("email")
            password = Request.Form("password")
            rememberMe = Request.Form("rememberMe").AsBool()

            If WebSecurity.UserExists(email) AndAlso WebSecurity.GetPasswordFailuresSinceLastSuccess(email) > 4 AndAlso WebSecurity.GetLastPasswordFailureDate(email).AddSeconds(60) > DateTime.UtcNow Then
                Response.Redirect("~/Account/AccountLockedOut")
                Return
            End If

            ' Attempt to log in using provided credentials
            If WebSecurity.Login(email, password, rememberMe) Then
                Context.RedirectLocal(returnUrl)
                Return
            End If
        Else
            ModelState.AddFormError("The user name or password provided is incorrect.")
        End If
    End If
End Code

<hgroup class="title">
    <h1>@PageData("Title").</h1>
</hgroup>

<section id="loginForm">
    <h2>使用本地帐户登录。</h2>
    <form method="post">
        @AntiForgery.GetHtml()
        @* 如果存在一个或多个验证错误，则显示一条错误信息 *@
        @Html.ValidationSummary("登录失败。请更正错误，然后重试。", excludeFieldErrors:=True, htmlAttributes:=Nothing)

        <fieldset>
            <legend>登录到你的帐户</legend>
            <ol>
                <li class="email">
                    <label for="email" @If Not ModelState.IsValidField("email") Then@<text>class="error-label"</text> End If>电子邮件地址</label>
                    <input type="text" id="email" name="email" value="@email" @Validation.For("email")/>
                    @* 将任何用户名验证错误写入页中 *@
                    @Html.ValidationMessage("email")
                </li>
                <li class="password">
                    <label for="password" @If Not ModelState.IsValidField("password") Then@<text>class="error-label"</text> End If>密码</label>
                    <input type="password" id="password" name="password" @Validation.For("password")/>
                    @* 将任何密码验证错误写入页中 *@
                    @Html.ValidationMessage("password")
                </li>
                <li class="remember-me">
                    <input type="checkbox" id="rememberMe" name="rememberMe" value="true" checked="@rememberMe " />
                    <label class="checkbox" for="rememberMe">记住我?</label>
                </li>
            </ol>
            <input type="submit" value="登录" />
        </fieldset>
    </form>
    <p>
        <a href="~/Account/Register">没有帐户?</a>
        <a href="~/Account/ForgotPassword">忘记了密码?</a>
    </p>
</section>

<section class="social" id="socialLoginForm">
    <h2>使用其他服务登录。</h2>
     @RenderPage("~/Account/_ExternalLoginsList.vbhtml")
</section>
