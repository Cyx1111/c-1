@Code
    ' 设置布局页和页标题
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "注册确认页"

    Dim message As String = ""
    Dim confirmationToken = Request("confirmationCode")

    WebSecurity.Logout()
    If Not confirmationToken.IsEmpty() Then
        If WebSecurity.ConfirmAccount(confirmationToken) Then
            message = "已确认注册! 单击""登录""选项卡即可登录该网站。"
        Else
            message = "未能确认您的注册信息"
        End If
    End If
End Code

@If Not message.IsEmpty() Then
    @<p>@message</p>
Else
    @<form method="post" action="">
        <fieldset>
            <legend>确认代码</legend>
            <label for="confirmationCode">
                请输入通过电子邮件发送给您的确认代码，
                然后单击<em>确认</em>按钮。
            </label>
            <input type="text" id="confirmationCode" name="confirmationCode" title="确认代码" />
            <input type="submit" value="确认" title="确认注册" />
        </fieldset>
    </form>
End If