@ModelType $safeprojectname$.LocalPasswordModel
@Code
    ViewData("Title") = "管理帐户"
End Code

<hgroup class="title">
    <h1>@ViewData("Title").</h1>
</hgroup>

<p class="message-success">@ViewData("StatusMessage")</p>

<p>你已使用 <strong>@User.Identity.Name</strong>.</p>

@If ViewData("HasLocalPassword") Then
    @Html.Partial("_ChangePasswordPartial")
Else
    @Html.Partial("_SetPasswordPartial")
End If

<section id="externalLogins">
    @Html.Action("RemoveExternalLogins")

    <h3>添加外部登录</h3>
    @Html.Action("ExternalLoginsList", New With {.ReturnUrl = ViewData("ReturnUrl")})
</section>

@Section Scripts
    @Scripts.Render("~/bundles/jqueryval")
End Section
