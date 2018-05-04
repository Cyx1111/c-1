@Code
    ' 退出当前用户上下文
    WebSecurity.Logout()

    ' 重定向回主页或返回 URL
    Dim returnUrl = Request.QueryString("ReturnUrl")
    If returnUrl.IsEmpty() Then
        Response.Redirect("~/")
    Else
        Response.Redirect(returnUrl)
    End If
End Code