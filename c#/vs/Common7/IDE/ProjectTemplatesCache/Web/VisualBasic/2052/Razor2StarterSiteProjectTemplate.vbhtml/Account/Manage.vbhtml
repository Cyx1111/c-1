@* Remove this section if you are using bundling *@
@Section Scripts
    <script src="~/Scripts/jquery.validate.min.js"></script>
    <script src="~/Scripts/jquery.validate.unobtrusive.min.js"></script>
End Section

@Code
    WebSecurity.RequireAuthenticatedUser()

    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "Manage Account"

    Dim action As String = Request.Form("action")

    Dim hasLocalAccount As Boolean = OAuthWebSecurity.HasLocalAccount(WebSecurity.CurrentUserId)

    Dim successMessage As String = ""
    Dim message As String = Request.QueryString("message")
    If message = "ChangedPassword" Then
        successMessage = "Your password has been changed."
    ElseIf message = "SetPassword" Then
        successMessage = "Your password has been set."
    ElseIf message = "RemovedLogin" Then
        successMessage = "The external login was removed."
    End If

    Dim externalLogins =
        (From account In OAuthWebSecurity.GetAccountsFromUserName(WebSecurity.CurrentUserName)
         Let clientData = OAuthWebSecurity.GetOAuthClientData(account.Provider)
         Select New With { .Provider = account.Provider, .ProviderDisplayName = clientData.DisplayName, .UserId = account.ProviderUserId }).ToList()
    Dim canRemoveLogin As Boolean = externalLogins.Count > 1 OrElse hasLocalAccount

    ' Setup validation
    If hasLocalAccount Then
        Validation.RequireField("currentPassword", "The current password field is required.")
        Validation.Add("currentPassword",
            Validator.StringLength(
                maxLength:=Int32.MaxValue,
                minLength:=6,
                errorMessage:="Current password must be at least 6 characters"))
    End If
    Validation.RequireField("newPassword", "The new password field is required.")
    Validation.Add("confirmPassword",
        Validator.Required("The confirm new password field is required."),
        Validator.EqualsTo("newPassword", "The new password and confirmation password do not match."))
    Validation.Add("newPassword",
        Validator.StringLength(
            maxLength:=Int32.MaxValue,
            minLength:=6,
            errorMessage:="New password must be at least 6 characters"))

    If IsPost Then
        AntiForgery.Validate()
        If action = "password" Then
            ' Handle local account password operations
            Dim currentPassword As String = Request.Form("currentPassword")
            Dim newPassword As String = Request.Form("newPassword")
            Dim confirmPassword As String = Request.Form("confirmPassword")

            If Validation.IsValid() Then
                If hasLocalAccount Then
                    If WebSecurity.ChangePassword(WebSecurity.CurrentUserName, currentPassword, newPassword) Then
                        Response.Redirect("~/Account/Manage?message=ChangedPassword")
                        Return
                    Else
                        ModelState.AddFormError("An error occurred when attempting to change the password. Please contact the site owner.")
                    End If
                Else
                    Dim requireEmailConfirmation As Boolean = Not WebMail.SmtpServer.IsEmpty()
                    Try
                        WebSecurity.CreateAccount(WebSecurity.CurrentUserName, newPassword, requireEmailConfirmation)
                        Response.Redirect("~/Account/Manage?message=SetPassword")
                        Return
                    Catch e As System.Web.Security.MembershipCreateUserException
                        ModelState.AddFormError(e.Message)
                    End Try
                End If
            Else
                ModelState.AddFormError("Password change was unsuccessful. Please correct the errors and try again.")
            End If
        ElseIf action = "removeLogin" Then
            ' Remove external login
            Dim provider As String = Request.Form("provider")
            Dim userId As String = Request.Form("userId")

            message = Nothing
            Dim ownerAccount As String = OAuthWebSecurity.GetUserName(provider, userId)
            ' Only remove the external login if it is owned by the currently logged in user and it is not the users last login credential
            If ownerAccount = WebSecurity.CurrentUserName AndAlso canRemoveLogin Then
                OAuthWebSecurity.DeleteAccount(provider, userId)
                message = "RemovedLogin"
            End If
            Response.Redirect(Href("~/Account/Manage", New With { message }))
            Return
        Else
            ' Assume this an external login request
            Dim provider As String = Request.Form("provider")
            If Not provider.IsEmpty() Then
                OAuthWebSecurity.RequestAuthentication(provider, Href("~/Account/RegisterService", New With {.returnUrl = Href("~/Account/Manage")}))
                Return
            End If
        End If
    End If
End Code

<hgroup class="title">
    <h1>@PageData("Title").</h1>
</hgroup>

@If Not successMessage.IsEmpty() Then
    @<p class="message-success">
        @successMessage
    </p>
End If

<p>你已使用 <strong>@WebSecurity.CurrentUserName</strong> 身份登录。</p>

@If hasLocalAccount Then
    @<h2>更改密码</h2>
Else
    @<h3>选择本地密码</h3>
    @<p>
        你没有此站点的本地密码。请添加一个本地密码，这样，无需外部登录便可以登录了。
    </p>
End If

<form method="post">
    @AntiForgery.GetHtml()
    @Html.ValidationSummary(excludeFieldErrors:=True)

    <fieldset>
        @If hasLocalAccount Then
            @<legend>“更改密码”表单</legend>
        Else
            @<legend>“设置密码”表单</legend>
        End If
        <ol>
            @If hasLocalAccount Then
                @<li class="current-password">
                    <label for="currentPassword" @If Not ModelState.IsValidField("currentPassword") Then@<text>class="error-label"</text> End If>当前密码</label>
                    <input type="password" id="currentPassword" name="currentPassword" @Validation.For("currentPassword")/>
                    @Html.ValidationMessage("currentPassword")
                </li>
            End If
            <li class="new-password">
                <label for="newPassword" @If Not ModelState.IsValidField("newPassword") Then@<text>class="error-label"</text> End If>新密码</label>
                <input type="password" id="newPassword" name="newPassword" @Validation.For("newPassword")/>
                @Html.ValidationMessage("newPassword")
            </li>
            <li class="confirm-password">
                <label for="confirmPassword" @If Not ModelState.IsValidField("confirmPassword") Then@<text>class="error-label"</text> End If>确认新密码</label>
                <input type="password" id="confirmPassword" name="confirmPassword" @Validation.For("confirmPassword")/>
                @Html.ValidationMessage("confirmPassword")
            </li>
        </ol>
        @If hasLocalAccount Then
            @<button type="submit" name="action" value="password">更改密码</button>
            @<p>
                如果你忘记了密码，请单击<a href="~/Account/ForgotPassword" title="Forgot password page">此处</a>。
            </p>
        Else
            @<button type="submit" name="action" value="password">设置密码</button>
        End If
    </fieldset>
</form>

<section id="externalLogins">
    @If externalLogins.Count > 0 Then
        @<h3>已注册外部登录</h3>
        @<table>
            <tbody>
            @For Each externalLogin In externalLogins
                @<tr>
                    <td>@externalLogin.ProviderDisplayName</td>
                    <td>
                        @If canRemoveLogin Then
                            @<form method="post">
                                @AntiForgery.GetHtml()
                                <fieldset>
                                    <input type="hidden" name="provider" value="@externalLogin.Provider" />
                                    <input type="hidden" name="userId" value="@externalLogin.UserId" />
                                    <button type="submit" name="action" value="removeLogin" title="从你的帐户中删除此 @externalLogin.ProviderDisplayName 凭据">删除</button>
                                </fieldset>
                            </form>
                        Else
                            @: &nbsp;
                        End If
                    </td>
                </tr>
            Next
            </tbody>
        </table>
    End If

    <h3>添加外部登录</h3>
    @RenderPage("~/Account/_ExternalLoginsList.vbhtml")
</section>
