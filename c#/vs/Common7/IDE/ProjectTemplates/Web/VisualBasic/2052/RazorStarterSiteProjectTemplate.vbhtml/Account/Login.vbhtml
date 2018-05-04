@Code
	' 设置布局页和页标题 
	Layout = "~/_SiteLayout.vbhtml" 
	PageData("Title") = "登录"

	' 初始化常规页变量 
	Dim email = "" 
	Dim password = "" 
	Dim rememberMe = False

	' 验证 
	Dim isValid = True 
	Dim emailErrorMessage = "" 
	Dim passwordErrorMessage = ""

		' 如果这是 POST 请求，则验证并处理数据 
		If IsPost Then 
			email = Request.Form("email") 
			password = Request.Form("password") 
			rememberMe = Request.Form("rememberMe").AsBool()

		' 验证用户的电子邮件 
		If email.IsEmpty() Then 
			emailErrorMessage = "你必须指定电子邮件地址。" 
			isValid = False 
		End If

		' 验证用户的密码 
		If password.IsEmpty() Then 
			passwordErrorMessage = "你必须指定密码。" 
			isValid = False 
		End If

		' 确认没有验证错误 
		If isValid Then 
			If WebSecurity.UserExists(email) AndAlso WebSecurity.GetPasswordFailuresSinceLastSuccess(email) > 4 AndAlso WebSecurity.GetLastPasswordFailureDate(email).AddSeconds(60) > Date.UtcNow Then 
				Response.Redirect("~/account/AccountLockedOut") 
				Return 
			End If

			' 试图使用提供的凭据登录安全对象 
			If WebSecurity.Login(email, password, rememberMe) Then 
				Dim returnUrl = Request.QueryString("ReturnUrl") 
				If returnUrl.IsEmpty() Then 
					Response.Redirect("~/") 
				Else 
					Response.Redirect(returnUrl) 
				End If 
			End If

			' 如果我们到达这里，则表示登录失败；向用户转达该信息 
			isValid = False 
		End If 
	End If 
End Code

<p>
	请在下面输入你的电子邮件地址和密码。如果你没有帐户，
	请访问<a href="@Href("~/Account/Register")">注册页</a>，然后创建一个帐户。
</p>

@*如果存在一个或多个验证错误，则显示以下错误*@ 
@If Not isValid Then 
	@<p class="message error">登录有问题和/或表单有错误。</p>
End If

<form method="post" action="">
    <fieldset>
		<legend>登录你的帐户</legend>
        <ol>
            <li class="email">
				<label for="email">电子邮件地址:</label>
				<input type="text" id="email" name="email" value="@email" title="电子邮件" @IIf((Not emailErrorMessage.IsEmpty()), "class=""error-field", Nothing)/>
				@*将任何电子邮件验证错误写入此页*@ 
				@If Not emailErrorMessage.IsEmpty() Then 
				@<label for="email" class="validation-error">
					@emailErrorMessage
                </label>
				End If
            </li>
            <li class="password">
				<label for="password">密码:</label>
				<input type="password" id="password" name="password" title="密码" @IIf((Not passwordErrorMessage.IsEmpty()), "class=""error-field", Nothing)/>
				@*将任何密码验证错误写入此页*@ 
				@If Not passwordErrorMessage.IsEmpty() Then 
				@<label for="password" class="validation-error">
					@passwordErrorMessage
                </label>
				End If
            </li>
            <li class="remember-me">
				<label class="checkbox" for="rememberMe">记住我?</label>
				<input type="checkbox" id="rememberMe" name="rememberMe" value="true" title="记住我" @IIf((rememberMe), "checked=""checked", Nothing)/>
            </li>
        </ol>
        <p class="form-actions">
			<input type="submit" value="登录" title="登录"/>
        </p>
		<p><a href="@Href("~/Account/ForgotPassword")">忘记了密码?</a></p>
    </fieldset>
</form>