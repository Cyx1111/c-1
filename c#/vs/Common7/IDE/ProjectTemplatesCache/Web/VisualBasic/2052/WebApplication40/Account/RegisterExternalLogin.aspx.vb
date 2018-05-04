Imports System.Web.Security
Imports DotNetOpenAuth.AspNet
Imports Microsoft.AspNet.Membership.OpenAuth

Partial Class Account_RegisterExternalLogin
    Inherits System.Web.UI.Page

    Protected Property ProviderName As String
        Get
            Return If(DirectCast(ViewState("ProviderName"), String), String.Empty)
        End Get
        Private Set(value As String)
            ViewState("ProviderName") = value
        End Set
    End Property

    Protected Property ProviderDisplayName As String
        Get
            Return If(DirectCast(ViewState("PropertyProviderDisplayName"), String), String.Empty)
        End Get
        Private Set(value As String)
            ViewState("ProviderDisplayName") = value
        End Set
    End Property

    Protected Property ProviderUserId As String
        Get
            Return If(DirectCast(ViewState("ProviderUserId"), String), String.Empty)
        End Get

        Private Set(value As String)
            ViewState("ProviderUserId") = value
        End Set
    End Property

    Protected Property ProviderUserName As String
        Get
            Return If(DirectCast(ViewState("ProviderUserName"), String), String.Empty)
        End Get

        Private Set(value As String)
            ViewState("ProviderUserName") = value
        End Set
    End Property

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If Not IsPostBack Then
            ProcessProviderResult()
        End If
    End Sub

    Protected Sub logIn_Click(ByVal sender As Object, ByVal e As System.EventArgs)
        CreateAndLoginUser()
    End Sub

    Protected Sub cancel_Click(ByVal sender As Object, ByVal e As System.EventArgs)
        RedirectToReturnUrl()
    End Sub

    Private Sub ProcessProviderResult()
        ' 处理请求中的身份验证提供程序返回的结果
        ProviderName = OpenAuth.GetProviderNameFromCurrentRequest()

        If String.IsNullOrEmpty(ProviderName) Then
            Response.Redirect(FormsAuthentication.LoginUrl)
        End If

        ProviderDisplayName = OpenAuth.GetProviderDisplayName(ProviderName)

        ' 生成重定向 URL 以进行 OpenAuth 验证
        Dim redirectUrl As String = "~/Account/RegisterExternalLogin.aspx"
        Dim returnUrl As String = Request.QueryString("ReturnUrl")
        If Not String.IsNullOrEmpty(returnUrl) Then
            redirectUrl &= "?ReturnUrl=" & HttpUtility.UrlEncode(returnUrl)
        End If

        ' 验证 OpenAuth 负载
        Dim authResult As AuthenticationResult = OpenAuth.VerifyAuthentication(redirectUrl)
        If Not authResult.IsSuccessful Then
            Title = "外部登录失败"
            userNameForm.Visible = False
            $if$ ($targetframeworkversion$ >= 4.5)
            ModelState.AddModelError("Provider", String.Format("使用 {0} 进行外部登录失败。", ProviderDisplayName))
            $else$
            providerMessage.Text = String.Format("外部登录 {0} 失败。", ProviderDisplayName)
            $endif$
            ' 若要查看此错误，请在 web.config 中启用页跟踪(<system.web><trace enabled="true"/></system.web>)，然后访问 ~/Trace.axd
            Trace.Warn("OpenAuth", String.Format("使用 {0}) 验证身份验证时出错", ProviderDisplayName), authResult.Error)
            Return
        End If

        ' 用户已成功地使用提供程序登录
        ' 检查用户是否已在本地注册
        If OpenAuth.Login(authResult.Provider, authResult.ProviderUserId, createPersistentCookie:=False) Then
            RedirectToReturnUrl()
        End If

        ' 在 ViewState 中存储提供程序详细信息
        ProviderName = authResult.Provider
        ProviderUserId = authResult.ProviderUserId
        ProviderUserName = authResult.UserName

        ' 从操作中去除查询字符串
        Form.Action = ResolveUrl(redirectUrl)

        If (User.Identity.IsAuthenticated) Then
            ' 用户已进行身份验证，请添加外部登录并重定向到返回 URL
            OpenAuth.AddAccountToExistingUser(ProviderName, ProviderUserId, ProviderUserName, User.Identity.Name)
            RedirectToReturnUrl()
        Else
            ' 这是新用户，请要求该用户提供所需的成员名称
            userName.Text = authResult.UserName
        End If
    End Sub

    Private Sub CreateAndLoginUser()
        If Not IsValid Then
            Return
        End If

        Dim createResult As CreateResult = OpenAuth.CreateUser(ProviderName, ProviderUserId, ProviderUserName, userName.Text)

        If Not createResult.IsSuccessful Then
            $if$ ($targetframeworkversion$ >= 4.5)
            ModelState.AddModelError("UserName", createResult.ErrorMessage)
            $else$
            userNameMessage.Text = createResult.ErrorMessage
            $endif$
        Else
            ' 已成功创建并关联用户
            If OpenAuth.Login(ProviderName, ProviderUserId, createPersistentCookie:=False) Then
                RedirectToReturnUrl()
            End If
        End If
    End Sub

    Private Sub RedirectToReturnUrl()
        Dim returnUrl As String = Request.QueryString("ReturnUrl")
        If Not String.IsNullOrEmpty(returnUrl) And OpenAuth.IsLocalUrl(returnUrl) Then
            Response.Redirect(returnUrl)
        Else
            Response.Redirect("~/")
        End If
    End Sub
End Class
