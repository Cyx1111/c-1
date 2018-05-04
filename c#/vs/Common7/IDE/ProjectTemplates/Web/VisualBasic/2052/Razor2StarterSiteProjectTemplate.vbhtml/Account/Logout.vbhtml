@Code
    WebSecurity.RequireAuthenticatedUser()

    If IsPost Then
        ' 验证请求是否由用户提交
        AntiForgery.Validate()

        ' 退出当前用户上下文
        WebSecurity.Logout()

        ' 重定向回到返回 URL 或主页
        Dim returnUrl As String = Request.QueryString("ReturnUrl")
        Context.RedirectLocal(returnUrl)
    Else
        Response.Redirect("~/")
    End If
End Code