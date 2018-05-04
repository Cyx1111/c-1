@Code
    ' 设置布局页和页标题
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "感谢您的注册"
End Code

@If Not WebSecurity.IsAuthenticated Then
    @<h2>但您还未完成!</h2>
    @<p>
       包含有关如何激活您的帐户的说明的电子邮件正在发送给
       您。
    </p>
Else
    @<h2>一切就绪。</h2>
    @<p>
        看起来您已经确认您的帐户，
        一切就绪。
    </p>
End If