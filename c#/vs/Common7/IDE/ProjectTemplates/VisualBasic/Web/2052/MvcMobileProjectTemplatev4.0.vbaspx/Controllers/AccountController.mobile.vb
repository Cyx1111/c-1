Imports System.Diagnostics.CodeAnalysis
Imports System.Security.Principal
Imports System.Web.Routing

<Authorize()> _
Public Class AccountController
    Inherits System.Web.Mvc.Controller

    '
    ' GET: /Account/Index

    Public Function Index() As ActionResult
        Return View()
    End Function

    '
    ' GET: /Account/Login

    <AllowAnonymous()> _
    Public Function Login() As ActionResult
        Return View()
    End Function

    '
    ' POST: /Account/Login

    <AllowAnonymous()> _
    <HttpPost()> _
    Public Function Login(ByVal model As LoginModel, ByVal returnUrl As String) As ActionResult
        If ModelState.IsValid Then
            If Membership.ValidateUser(model.UserName, model.Password) Then
                FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe)
                If Url.IsLocalUrl(returnUrl) Then
                    Return Redirect(returnUrl)
                Else
                    Return RedirectToAction("Index", "Home")
                End If
            Else
                ModelState.AddModelError("", "提供的用户名或密码不正确。")
            End If
        End If

        ' 如果我们进行到这一步时某个地方出错，则重新显示表单
        Return View(model)
    End Function

    '
    ' GET: /Account/LogOff

    Public Function LogOff() As ActionResult
        FormsAuthentication.SignOut()

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

    <AllowAnonymous()> _
    <HttpPost()> _
    Public Function Register(ByVal model As RegisterModel) As ActionResult
        If ModelState.IsValid Then
            ' 尝试注册用户
            Dim createStatus As MembershipCreateStatus
            Membership.CreateUser(model.UserName, model.Password, model.Email, passwordQuestion:=Nothing, passwordAnswer:=Nothing, isApproved:=True, providerUserKey:=Nothing, status:=createStatus)

            If createStatus = MembershipCreateStatus.Success Then
                FormsAuthentication.SetAuthCookie(model.UserName, createPersistentCookie:=False)
                Return RedirectToAction("Index", "Home")
            Else
                ModelState.AddModelError("", ErrorCodeToString(createStatus))
            End If
        End If

        ' 如果我们进行到这一步时某个地方出错，则重新显示表单
        Return View(model)
    End Function

    '
    ' GET: /Account/ChangePassword

    Public Function ChangePassword() As ActionResult
        Return View()
    End Function

    '
    ' POST: /Account/ChangePassword

    <HttpPost()> _
    Public Function ChangePassword(ByVal model As ChangePasswordModel) As ActionResult
        If ModelState.IsValid Then
            ' 在某些出错情况下，ChangePassword 将引发异常，
            ' 而不是返回 false。
            Dim changePasswordSucceeded As Boolean

            Try
                Dim currentUser As MembershipUser = Membership.GetUser(User.Identity.Name, userIsOnline:=True)
                changePasswordSucceeded = currentUser.ChangePassword(model.OldPassword, model.NewPassword)
            Catch ex As Exception
                changePasswordSucceeded = False
            End Try

            If changePasswordSucceeded Then
                Return RedirectToAction("ChangePasswordSuccess")
            Else
                ModelState.AddModelError("", "当前密码不正确或新密码无效。")
            End If
        End If

        ' 如果我们进行到这一步时某个地方出错，则重新显示表单
        Return View(model)
    End Function

    '
    ' GET: /Account/ChangePasswordSuccess

    Public Function ChangePasswordSuccess() As ActionResult
        Return View()
    End Function

#Region "状态代码"
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
