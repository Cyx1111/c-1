@Code
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "注册确认页"

    Dim message As String = ""
    Dim confirmationToken As String = Request("confirmationCode")

    WebSecurity.Logout()
    If Not confirmationToken.IsEmpty() Then
        If WebSecurity.ConfirmAccount(confirmationToken) Then
            message = "已确认注册! 单击""登录""选项卡即可登录该网站。"
        Else
            message = "未能确认你的注册信息。"
        End If
    End If
End Code

<hgroup class="title">
    <h1>@PageData("Title").</h1>
    <h2>使用以下表单确认你的帐户。</h2>
</hgroup>

@If Not message.IsEmpty() Then
    @<p>@message</p>
Else
    @<form method="post">
        <fieldset>
            <legend>确认代码</legend>
            <ol>
                <li>
                    <label for="confirmationCode">确认代码</label>
                    <input type="text" id="confirmationCode" name="confirmationCode" />
                </li>
            </ol>
            <input type="submit" value="确认" />
        </fieldset>
    </form>
End If