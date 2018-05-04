@If Request.IsAuthenticated Then
    @<text>欢迎 <strong>@User.Identity.Name</strong>!
    [ @Html.ActionLink("注销", "LogOff", "Account") ]</text>
Else
    @:[ @Html.ActionLink("登录", "LogOn", "Account") ]
End If
