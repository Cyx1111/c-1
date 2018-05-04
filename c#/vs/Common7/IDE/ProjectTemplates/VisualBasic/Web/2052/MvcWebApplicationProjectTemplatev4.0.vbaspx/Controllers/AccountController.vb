Imports System.Diagnostics.CodeAnalysis
Imports System.Security.Principal
Imports System.Transactions
Imports System.Web.Routing
Imports DotNetOpenAuth.AspNet
Imports Microsoft.Web.WebPages.OAuth
Imports WebMatrix.WebData

<Authorize()> _
<InitializeSimpleMembership()> _
Public Class AccountController
    Inherits System.Web.Mvc.Controller

    '
    ' GET: /Account/Login

    <AllowAnonymous()> _
    Public Function Login(ByVal returnUrl As String) As ActionResult
        ViewData("ReturnUrl") = returnUrl
        Return View()
    End Function

    '
    ' POST: /Account/Login

    <HttpPost()> _
    <AllowAnonymous()> _
    <ValidateAntiForgeryToken()> _
    Public Function Login(ByVal model As LoginModel, ByVal returnUrl As String) As ActionResult
        If ModelState.IsValid AndAlso WebSecurity.Login(model.UserName, model.Password, persistCookie:=model.RememberMe) Then
            Return RedirectToLocal(returnUrl)
        End If

        ' 如果我们进行到这一步时某个地方出错，则重新显示表单
        ModelState.AddModelError("", "提供的用户名或密码不正确。")
        Return View(model)
    End Function

    '
    ' POST: /Account/LogOff

    <HttpPost()> _
    <ValidateAntiForgeryToken()> _
    Public Function LogOff() As ActionResult
        WebSecurity.Logout()

        Return RedirectToAction("Index", "Home")
    End Function

    '
    ' GET: /Account/Register

    <AllowAnonymous()> _
    Public Function Register() As ActionResult
        Return View()
    End Function

    '
    ' POST: /Account/Register

    <HttpPost()> _
    <AllowAnonymous()> _
    <ValidateAntiForgeryToken()> _
    Public Function Register(ByVal model As RegisterModel) As ActionResult
        If ModelState.IsValid Then
            ' 尝试注册用户
            Try
                WebSecurity.CreateUserAndAccount(model.UserName, model.Password)
                WebSecurity.Login(model.UserName, model.Password)
                Return RedirectToAction("Index", "Home")
            Catch e As MembershipCreateUserException

                ModelState.AddModelError("", ErrorCodeToString(e.StatusCode))
            End Try
        End If

        ' 如果我们进行到这一步时某个地方出错，则重新显示表单
        Return View(model)
    End Function

    '
    ' POST: /Account/Disassociate

    <HttpPost()> _
    <ValidateAntiForgeryToken()> _
    Public Function Disassociate(ByVal provider As String, ByVal providerUserId As String) As ActionResult
        ' 包装一个事务以防止用户意外地一次性取消关联所有帐户。

        Dim ownerAccount = OAuthWebSecurity.GetUserName(provider, providerUserId)
        Dim message As ManageMessageId? = Nothing

        ' 只有在当前登录用户是所有者时才取消关联帐户
        If ownerAccount = User.Identity.Name Then
            ' 使用事务来防止用户删除其上次使用的登录凭据
            Using scope As New TransactionScope(TransactionScopeOption.Required, New TransactionOptions With {.IsolationLevel = IsolationLevel.Serializable})
                Dim hasLocalAccount = OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name))
                If hasLocalAccount OrElse OAuthWebSecurity.GetAccountsFromUserName(User.Identity.Name).Count > 1 Then
                    OAuthWebSecurity.DeleteAccount(provider, providerUserId)
                    scope.Complete()
                    message = ManageMessageId.RemoveLoginSuccess
                End If
            End Using
        End If

        Return RedirectToAction("Manage", New With {.Message = message})
    End Function

    '
    ' GET: /Account/Manage

    Public Function Manage(ByVal message As ManageMessageId?) As ActionResult
        ViewData("StatusMessage") =
            If(message = ManageMessageId.ChangePasswordSuccess, "已更改你的密码。", _
                If(message = ManageMessageId.SetPasswordSuccess, "已设置你的密码。", _
                    If(message = ManageMessageId.RemoveLoginSuccess, "已删除外部登录。", _
                        "")))

        ViewData("HasLocalPassword") = OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name))
        ViewData("ReturnUrl") = Url.Action("Manage")
        Return View()
    End Function

    '
    ' POST: /Account/Manage

    <HttpPost()> _
    <ValidateAntiForgeryToken()> _
    Public Function Manage(ByVal model As LocalPasswordModel) As ActionResult
        Dim hasLocalAccount = OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name))
        ViewData("HasLocalPassword") = hasLocalAccount
        ViewData("ReturnUrl") = Url.Action("Manage")
        If hasLocalAccount Then
            If ModelState.IsValid Then
                ' 在某些失败方案中，ChangePassword 将引发异常，而不是返回 false。
                Dim changePasswordSucceeded As Boolean

                Try
                    changePasswordSucceeded = WebSecurity.ChangePassword(User.Identity.Name, model.OldPassword, model.NewPassword)
                Catch e As Exception
                    changePasswordSucceeded = False
                End Try

                If changePasswordSucceeded Then
                    Return RedirectToAction("Manage", New With {.Message = ManageMessageId.ChangePasswordSuccess})
                Else
                    ModelState.AddModelError("", "当前密码不正确或新密码无效。")
                End If
            End If
        Else
            ' 用户没有本地密码，因此将删除由于缺少
            ' OldPassword 字段而导致的所有验证错误
            Dim state = ModelState("OldPassword")
            If state IsNot Nothing Then
                state.Errors.Clear()
            End If

            If ModelState.IsValid Then
                Try
                    WebSecurity.CreateAccount(User.Identity.Name, model.NewPassword)
                    Return RedirectToAction("Manage", New With {.Message = ManageMessageId.SetPasswordSuccess})
                Catch e As Exception
                    ModelState.AddModelError("", e)
                End Try
            End If
        End If

        ' 如果我们进行到这一步时出现错误，则重新显示表单
        Return View(model)
    End Function

    '
    ' POST: /Account/ExternalLogin

    <HttpPost()> _
    <AllowAnonymous()> _
    <ValidateAntiForgeryToken()> _
    Public Function ExternalLogin(ByVal provider As String, ByVal returnUrl As String) As ActionResult
        Return New ExternalLoginResult(provider, Url.Action("ExternalLoginCallback", New With {.ReturnUrl = returnUrl}))
    End Function

    '
    ' GET: /Account/ExternalLoginCallback

    <AllowAnonymous()> _
    Public Function ExternalLoginCallback(ByVal returnUrl As String) As ActionResult
        Dim result = OAuthWebSecurity.VerifyAuthentication(Url.Action("ExternalLoginCallback", New With {.ReturnUrl = returnUrl}))
        If Not result.IsSuccessful Then
            Return RedirectToAction("ExternalLoginFailure")
        End If

        If OAuthWebSecurity.Login(result.Provider, result.ProviderUserId, createPersistentCookie:=False) Then
            Return RedirectToLocal(returnUrl)
        End If

        If User.Identity.IsAuthenticated Then
            ' 如果当前用户已登录，则添加新帐户
            OAuthWebSecurity.CreateOrUpdateAccount(result.Provider, result.ProviderUserId, User.Identity.Name)
            Return RedirectToLocal(returnUrl)
        Else
            ' 该用户是新用户，因此将要求该用户提供所需的成员名称
            Dim loginData = OAuthWebSecurity.SerializeProviderUserId(result.Provider, result.ProviderUserId)
            ViewData("ProviderDisplayName") = OAuthWebSecurity.GetOAuthClientData(result.Provider).DisplayName
            ViewData("ReturnUrl") = returnUrl
            Return View("ExternalLoginConfirmation", New RegisterExternalLoginModel With {.UserName = result.UserName, .ExternalLoginData = loginData})
        End If
    End Function

    '
    ' POST: /Account/ExternalLoginConfirmation

    <HttpPost()> _
    <AllowAnonymous()> _
    <ValidateAntiForgeryToken()> _
    Public Function ExternalLoginConfirmation(ByVal model As RegisterExternalLoginModel, ByVal returnUrl As String) As ActionResult
        Dim provider As String = Nothing
        Dim providerUserId As String = Nothing

        If User.Identity.IsAuthenticated OrElse Not OAuthWebSecurity.TryDeserializeProviderUserId(model.ExternalLoginData, provider, providerUserId) Then
            Return RedirectToAction("管理")
        End If

        If ModelState.IsValid Then
            ' 将新用户插入到数据库
            Using db As New UsersContext()
                Dim user = db.UserProfiles.FirstOrDefault(Function(u) u.UserName.ToLower() = model.UserName.ToLower())
                ' 检查用户是否已存在
                If user Is Nothing Then
                    ' 将名称插入到配置文件表
                    db.UserProfiles.Add(New UserProfile With {.UserName = model.UserName})
                    db.SaveChanges()

                    OAuthWebSecurity.CreateOrUpdateAccount(provider, providerUserId, model.UserName)
                    OAuthWebSecurity.Login(provider, providerUserId, createPersistentCookie:=False)

                    Return RedirectToLocal(returnUrl)
                Else
                    ModelState.AddModelError("UserName", "用户名已存在。请输入其他用户名。")
                End If
            End Using
        End If

        ViewData("ProviderDisplayName") = OAuthWebSecurity.GetOAuthClientData(provider).DisplayName
        ViewData("ReturnUrl") = returnUrl
        Return View(model)
    End Function

    '
    ' GET: /Account/ExternalLoginFailure

    <AllowAnonymous()> _
    Public Function ExternalLoginFailure() As ActionResult
        Return View()
    End Function

    <AllowAnonymous()> _
    <ChildActionOnly()> _
    Public Function ExternalLoginsList(ByVal returnUrl As String) As ActionResult
        ViewData("ReturnUrl") = returnUrl
        Return PartialView("_ExternalLoginsListPartial", OAuthWebSecurity.RegisteredClientData)
    End Function

    <ChildActionOnly()> _
    Public Function RemoveExternalLogins() As ActionResult
        Dim accounts = OAuthWebSecurity.GetAccountsFromUserName(User.Identity.Name)
        Dim externalLogins = New List(Of ExternalLogin)()
        For Each account As OAuthAccount In accounts
            Dim clientData = OAuthWebSecurity.GetOAuthClientData(account.Provider)

            externalLogins.Add(New ExternalLogin With { _
                .Provider = account.Provider, _
                .ProviderDisplayName = clientData.DisplayName, _
                .ProviderUserId = account.ProviderUserId _
            })
        Next

        ViewData("ShowRemoveButton") = externalLogins.Count > 1 OrElse OAuthWebSecurity.HasLocalAccount(WebSecurity.GetUserId(User.Identity.Name))
        Return PartialView("_RemoveExternalLoginsPartial", externalLogins)
    End Function

#Region "帮助程序"
    Private Function RedirectToLocal(ByVal returnUrl As String) As ActionResult
        If Url.IsLocalUrl(returnUrl) Then
            Return Redirect(returnUrl)
        Else
            Return RedirectToAction("Index", "Home")
        End If
    End Function

    Public Enum ManageMessageId
        ChangePasswordSuccess
        SetPasswordSuccess
        RemoveLoginSuccess
    End Enum

    Friend Class ExternalLoginResult
        Inherits System.Web.Mvc.ActionResult

        Private ReadOnly _provider As String
        Private ReadOnly _returnUrl As String

        Public Sub New(ByVal provider As String, ByVal returnUrl As String)
            _provider = provider
            _returnUrl = returnUrl
        End Sub

        Public ReadOnly Property Provider() As String
            Get
                Return _provider
            End Get
        End Property

        Public ReadOnly Property ReturnUrl() As String
            Get
                Return _returnUrl
            End Get
        End Property

        Public Overrides Sub ExecuteResult(ByVal context As ControllerContext)
            OAuthWebSecurity.RequestAuthentication(Provider, ReturnUrl)
        End Sub
    End Class

    Public Function ErrorCodeToString(ByVal createStatus As MembershipCreateStatus) As String
        ' 请参见 http://go.microsoft.com/fwlink/?LinkID=177550 以查看
        ' 状态代码的完整列表。
        Select Case createStatus
            Case MembershipCreateStatus.DuplicateUserName
                Return "用户名已存在。请输入其他用户名。"

            Case MembershipCreateStatus.DuplicateEmail
                Return "该电子邮件地址的用户名已存在。请输入其他电子邮件地址。"

            Case MembershipCreateStatus.InvalidPassword
                Return "提供的密码无效。请输入有效的密码值。"

            Case MembershipCreateStatus.InvalidEmail
                Return "提供的电子邮件地址无效。请检查该值并重试。"

            Case MembershipCreateStatus.InvalidAnswer
                Return "提供的密码取回答案无效。请检查该值并重试。"

            Case MembershipCreateStatus.InvalidQuestion
                Return "提供的密码取回问题无效。请检查该值并重试。"

            Case MembershipCreateStatus.InvalidUserName
                Return "提供的用户名无效。请检查该值并重试。"

            Case MembershipCreateStatus.ProviderError
                Return "身份验证提供程序返回了错误。请验证您的输入并重试。如果问题仍然存在，请与系统管理员联系。"

            Case MembershipCreateStatus.UserRejected
                Return "已取消用户创建请求。请验证您的输入并重试。如果问题仍然存在，请与系统管理员联系。"

            Case Else
                Return "发生未知错误。请验证您的输入并重试。如果问题仍然存在，请与系统管理员联系。"
        End Select
    End Function
#End Region

End Class
