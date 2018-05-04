@If Request.IsAuthenticated Then
    @<text>
        你好，@Html.ActionLink(User.Identity.Name, "Manage", "Account", routeValues:=Nothing, htmlAttributes:=New With {.class = "username", .title = "Manage"})!
        @Using Html.BeginForm("LogOff", "Account", FormMethod.Post, New With {.id = "logoutForm"})
            @Html.AntiForgeryToken()
            @<a href="javascript:document.getElementById('logoutForm').submit()">注销</a>
        End Using
    </text>
Else
    @<ul>
        <li>@Html.ActionLink("注册", "Register", "Account", routeValues:=Nothing, htmlAttributes:=New With {.id = "registerLink"})</li>
        <li>@Html.ActionLink("登录", "Login", "Account", routeValues:=Nothing, htmlAttributes:=New With {.id = "loginLink"})</li>
    </ul>
End If
