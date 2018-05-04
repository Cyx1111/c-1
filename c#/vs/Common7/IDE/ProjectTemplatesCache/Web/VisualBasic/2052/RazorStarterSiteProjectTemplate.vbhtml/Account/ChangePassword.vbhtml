@Code
    WebSecurity.RequireAuthenticatedUser()

    '  设置布局页和页标题
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "更改密码"

    Dim isValid As Boolean = True
    Dim isSuccess As Boolean = False
    Dim errorMessage = ""
    Dim currentPasswordError = ""
    Dim newPasswordError = ""
    Dim confirmPasswordError = ""
    Dim currentPassword = Request("currentPassword")
    Dim newPassword = Request("newPassword")
    Dim confirmPassword = Request("confirmPassword")

    If IsPost Then
        If currentPassword.IsEmpty() Then
            currentPasswordError = "请输入当前密码。"
            isValid = False
        End If
        If newPassword.IsEmpty() Then
            newPasswordError = "请输入新密码。"
            isValid = False
        End If
        If confirmPassword.IsEmpty() Then
            confirmPasswordError = "请确认新密码。"
            isValid = False
        End If
        If confirmPassword <> newPassword Then
            confirmPasswordError = "确认密码和新密码不匹配。"
            isValid = False
        End If

        If isValid Then
            If WebSecurity.ChangePassword(WebSecurity.CurrentUserName, currentPassword, newPassword) Then
                isSuccess = True
            Else
                errorMessage = "试图更改密码时出错。 请与站点所有者联系。"
            End If
        Else
            errorMessage = "密码更改失败。 请更正错误并重试。"
        End If
    End If
End Code

<form method="post" action="">
    <fieldset>
        <legend>更改密码表单</legend>
        <p>
            请使用此表单更改密码。 您需要输入当前密码。 
            如果您忘记了密码，请单击<a href="@Href("~/Account/ForgotPassword")" title="忘记密码页">此处</a>。
        </p>
        @If isSuccess Then
            @<p class="message success">
                您的密码已更新!
            </p>
        End If
        @If Not errorMessage.IsEmpty() Then
            @<p class="message error">
                @errorMessage
            </p>
        End If
        <ol>
            <li class="current-password">
                <label for="currentPassword">当前密码:</label>
                <input type="password" id="currentPassword" name="currentPassword" title="当前密码" @IIf((Not currentPasswordError.IsEmpty()), "class=""error-field", Nothing)/>
                @If Not currentPasswordError.IsEmpty() Then
                    @<label for="currentPassword" class="validation-error">@currentPasswordError</label>
                End If
            </li>
            <li class="new-password">
                <label for="newPassword">新密码:</label> 
                <input type="password" id="newPassword" name="newPassword" title="新密码" @IIf((Not newPasswordError.IsEmpty()),"class=""error-field", Nothing)/>
                @If Not newPasswordError.IsEmpty() Then
                    @<label for="newPassword" class="validation-error">@newPasswordError</label>
                End If
            </li>
            <li class="confirm-password">
                <label for="confirmPassword">确认密码:</label> 
                <input type="password" id="confirmPassword" name="confirmPassword" title="确认新密码" @IIf((Not confirmPasswordError.IsEmpty()),"class=""error-field",Nothing)/>
                @If Not confirmPasswordError.IsEmpty() Then
                    @<label for="confirmPassword" class="validation-error">@confirmPasswordError</label>
                End If
            </li>
        </ol>
        <p class="form-actions">
            <input type="submit" value="更改密码" title="更改密码" />
        </p>
    </fieldset>
</form>

