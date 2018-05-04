Imports System.ComponentModel
Imports System.ComponentModel.DataAnnotations
Imports System.Globalization

Public Class ChangePasswordModel
    Private oldPasswordValue As String
    Private newPasswordValue As String
    Private confirmPasswordValue As String

    <Required()> _
    <DataType(DataType.Password)> _
    <Display(Name:="当前密码")> _
    Public Property OldPassword() As String
        Get
            Return oldPasswordValue
        End Get
        Set(ByVal value As String)
            oldPasswordValue = value
        End Set
    End Property

    <Required()> _
    <StringLength(100, ErrorMessage:="{0} 必须至少包含 {2} 个字符。", MinimumLength:=6)> _
    <DataType(DataType.Password)> _
    <Display(Name:="新密码")> _
    Public Property NewPassword() As String
        Get
            Return newPasswordValue
        End Get
        Set(ByVal value As String)
            newPasswordValue = value
        End Set
    End Property

    <DataType(DataType.Password)> _
    <Display(Name:="确认新密码")> _
    <System.Web.Mvc.Compare("NewPassword", ErrorMessage:="新密码和确认密码不匹配。")> _
    Public Property ConfirmPassword() As String
        Get
            Return confirmPasswordValue
        End Get
        Set(ByVal value As String)
            confirmPasswordValue = value
        End Set
    End Property
End Class

Public Class LogOnModel
    Private userNameValue As String
    Private passwordValue As String
    Private rememberMeValue As Boolean

    <Required()> _
    <Display(Name:="用户名")> _
    Public Property UserName() As String
        Get
            Return userNameValue
        End Get
        Set(ByVal value As String)
            userNameValue = value
        End Set
    End Property

    <Required()> _
    <DataType(DataType.Password)> _
    <Display(Name:="密码")> _
    Public Property Password() As String
        Get
            Return passwordValue
        End Get
        Set(ByVal value As String)
            passwordValue = value
        End Set
    End Property

    <Display(Name:="记住我?")> _
    Public Property RememberMe() As Boolean
        Get
            Return rememberMeValue
        End Get
        Set(ByVal value As Boolean)
            rememberMeValue = value
        End Set
    End Property
End Class

Public Class RegisterModel
    Private userNameValue As String
    Private passwordValue As String
    Private confirmPasswordValue As String
    Private emailValue As String

    <Required()> _
    <Display(Name:="用户名")> _
    Public Property UserName() As String
        Get
            Return userNameValue
        End Get
        Set(ByVal value As String)
            userNameValue = value
        End Set
    End Property

    <Required()> _
    <DataType(DataType.EmailAddress)> _
    <Display(Name:="电子邮件地址")> _
    Public Property Email() As String
        Get
            Return emailValue
        End Get
        Set(ByVal value As String)
            emailValue = value
        End Set
    End Property

    <Required()> _
    <StringLength(100, ErrorMessage:="{0} 必须至少包含 {2} 个字符。", MinimumLength:=6)> _
    <DataType(DataType.Password)> _
    <Display(Name:="密码")> _
    Public Property Password() As String
        Get
            Return passwordValue
        End Get
        Set(ByVal value As String)
            passwordValue = value
        End Set
    End Property

    <DataType(DataType.Password)> _
    <Display(Name:="确认密码")> _
    <System.Web.Mvc.Compare("Password", ErrorMessage:="密码和确认密码不匹配。")> _
    Public Property ConfirmPassword() As String
        Get
            Return confirmPasswordValue
        End Get
        Set(ByVal value As String)
            confirmPasswordValue = value
        End Set
    End Property
End Class
