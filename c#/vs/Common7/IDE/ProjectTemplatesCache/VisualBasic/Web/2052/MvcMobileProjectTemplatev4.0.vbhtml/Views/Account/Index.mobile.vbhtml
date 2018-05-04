@ModelType $safeprojectname$.LoginModel

@Code
    ViewData("Title") = "您的帐户"
End Code

@section Header
    @Html.ActionLink("Back", "Index", "Home", Nothing, New With {.data_icon = "arrow-l", .data_rel = "back"})
    <h1>@ViewData("Title")</h1>
End Section

<p>
    以 <strong>@User.Identity.Name</strong> 身份登录。
</p>

<ul data-role="listview" data-inset="true">
    <li>@Html.ActionLink("更改密码", "ChangePassword")</li>
    <li>@Html.ActionLink("注销", "LogOff")</li>
</ul>