Imports System.Collections.Generic
$if$ ($targetframeworkversion$ == 4.0)
Imports System.Web.UI.WebControls
$endif$
Imports Microsoft.AspNet.Membership.OpenAuth

Public Class Manage
    Inherits System.Web.UI.Page

    Private successMessageTextValue As String
    Protected Property SuccessMessageText As String
        Get
            Return successMessageTextValue
        End Get
        Private Set(value As String)
            successMessageTextValue = value
        End Set
    End Property

    Private canRemoveExternalLoginsValue As Boolean
    Protected Property CanRemoveExternalLogins As Boolean
        Get
            Return canRemoveExternalLoginsValue
        End Get
        Set(value As Boolean)
            canRemoveExternalLoginsValue = value
        End Set
    End Property

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If Not IsPostBack Then
            ' 确定要呈现的节
            Dim hasLocalPassword = OpenAuth.HasLocalPassword(User.Identity.Name)
            setPassword.Visible = Not hasLocalPassword
            changePassword.Visible = hasLocalPassword

            CanRemoveExternalLogins = hasLocalPassword

            ' 呈现成功消息
            Dim message = Request.QueryString("m")
            If Not message Is Nothing Then
                ' 从操作中去除查询字符串
                Form.Action = ResolveUrl("~/Account/Manage.aspx")

                Select Case message
                    Case "ChangePwdSuccess"
                        SuccessMessageText = "已更改你的密码。"
                    Case "SetPwdSuccess"
                        SuccessMessageText = "已设置你的密码。"
                    Case "RemoveLoginSuccess"
                        SuccessMessageText = "已删除外部登录。"
                    Case Else
                        SuccessMessageText = String.Empty
                End Select

                successMessage.Visible = Not String.IsNullOrEmpty(SuccessMessageText)
            End If
        End If

        $if$ ($targetframeworkversion$ == 4.0)
        ' 对外部帐户列表进行数据绑定
        Dim accounts As IEnumerable(Of OpenAuthAccountData) = OpenAuth.GetAccountsForUser(User.Identity.Name)
        CanRemoveExternalLogins = CanRemoveExternalLogins Or accounts.Count() > 1
        externalLoginsList.DataSource = accounts
        externalLoginsList.DataBind()
        $endif$
    End Sub

    Protected Sub setPassword_Click(ByVal sender As Object, ByVal e As System.EventArgs)
        If IsValid Then
            Dim result As SetPasswordResult = OpenAuth.AddLocalPassword(User.Identity.Name, password.Text)
            If result.IsSuccessful Then
                Response.Redirect("~/Account/Manage.aspx?m=SetPwdSuccess")
            Else
                $if$ ($targetframeworkversion$ >= 4.5)
                ModelState.AddModelError("NewPassword", result.ErrorMessage)
                $else$
                newPasswordMessage.Text = result.ErrorMessage
                $endif$
            End If
        End If
    End Sub

    $if$ ($targetframeworkversion$ >= 4.5)
    Public Function GetExternalLogins() As IEnumerable(Of OpenAuthAccountData)
        Dim accounts = OpenAuth.GetAccountsForUser(User.Identity.Name)
        CanRemoveExternalLogins = CanRemoveExternalLogins OrElse accounts.Count() > 1
        Return accounts
    End Function

    Public Sub RemoveExternalLogin(ByVal providerName As String, ByVal providerUserId As String)
        Dim m = If(OpenAuth.DeleteAccount(User.Identity.Name, providerName, providerUserId), "?m=RemoveLoginSuccess", String.Empty)
        Response.Redirect("~/Account/Manage.aspx" & m)
    End Sub
    $else$
    Protected Sub externalLoginsList_ItemDeleting(ByVal sender As Object, ByVal e As ListViewDeleteEventArgs)
        Dim providerName As String = DirectCast(e.Keys("ProviderName"), String)
        Dim providerUserId As String = DirectCast(e.Keys("ProviderUserId"), String)
        Dim m As String = If(OpenAuth.DeleteAccount(User.Identity.Name, providerName, providerUserId), "?m=RemoveLoginSuccess", String.Empty)
        Response.Redirect("~/Account/Manage.aspx" & m)
    End Sub

    Protected Function Item(Of T As Class)() As T
        Return TryCast(GetDataItem(), T)
    End Function
    $endif$

    Protected Shared Function ConvertToDisplayDateTime(ByVal utcDateTime As Nullable(Of DateTime)) As String
        ' 你可以更改此方法，以便将 UTC 日期时间转换为所需的显示
        ' 偏移值和格式。正在使用当前线程区域设置将它转换成服务器时区，并将其设置为
        ' 短日期和长时间字符串的格式。
        Return If(utcDateTime.HasValue, utcDateTime.Value.ToLocalTime().ToString("G"), "[从不]")
    End Function
End Class