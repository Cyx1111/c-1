Imports System.ComponentModel
Imports System.ComponentModel.DataAnnotations
Imports System.ComponentModel.DataAnnotations.Schema
Imports System.Globalization
Imports System.Data.Entity

Public Class UsersContext
    Inherits DbContext

    Public Sub New()
        MyBase.New("DefaultConnection")
    End Sub

    Public Property UserProfiles As DbSet(Of UserProfile)
End Class

<Table("UserProfile")> _
Public Class UserProfile
    <Key()> _
    <DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)> _
    Public Property UserId As Integer

    Public Property UserName As String
End Class

Public Class RegisterExternalLoginModel
    <Required()> _
    <Display(Name:="用户名")> _
    Public Property UserName As String

    Public Property ExternalLoginData As String
End Class

Public Class LocalPasswordModel
    <Required()> _
    <DataType(DataType.Password)> _
    <Display(Name:="当前密码")> _
    Public Property OldPassword As String

    <Required()> _
    <StringLength(100, ErrorMessage:="{0} 必须至少包含 {2} 个字符。", MinimumLength:=6)> _
    <DataType(DataType.Password)> _
    <Display(Name:="新密码")> _
    Public Property NewPassword As String

    <DataType(DataType.Password)> _
    <Display(Name:="确认新密码")> _
    <Compare("NewPassword", ErrorMessage:="新密码和确认密码不匹配。")> _
    Public Property ConfirmPassword As String
End Class

Public Class LoginModel
    <Required()> _
    <Display(Name:="用户名")> _
    Public Property UserName As String

    <Required()> _
    <DataType(DataType.Password)> _
    <Display(Name:="密码")> _
    Public Property Password As String

    <Display(Name:="记住我?")> _
    Public Property RememberMe As Boolean
End Class

Public Class RegisterModel
    <Required()> _
    <Display(Name:="用户名")> _
    Public Property UserName As String

    <Required()> _
    <StringLength(100, ErrorMessage:="{0} 必须至少包含 {2} 个字符。", MinimumLength:=6)> _
    <DataType(DataType.Password)> _
    <Display(Name:="密码")> _
    Public Property Password As String

    <DataType(DataType.Password)> _
    <Display(Name:="确认密码")> _
    <Compare("Password", ErrorMessage:="密码和确认密码不匹配。")> _
    Public Property ConfirmPassword As String
End Class

Public Class ExternalLogin
    Public Property Provider As String
    Public Property ProviderDisplayName As String
    Public Property ProviderUserId As String
End Class
