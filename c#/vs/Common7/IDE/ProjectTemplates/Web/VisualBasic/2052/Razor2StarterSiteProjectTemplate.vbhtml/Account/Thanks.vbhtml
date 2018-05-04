@Code
    ' 设置布局页和页标题
    Layout = "~/_SiteLayout.vbhtml"
    PageData("Title") = "感谢你的注册"
End Code

@If Not WebSecurity.IsAuthenticated Then
    @<hgroup class="title">
        <h1>@PageData("Title").</h1>
        <h2>但你还未完成!</h2>
    </hgroup>

    @<p>
       一封包含有关如何激活帐户的说明的电子邮件已发送给你。
    </p>
Else
    @<hgroup class="title">
        <h1>@PageData("Title").</h1>
        <h2>一切就绪。</h2>
    </hgroup>

    @<p>
        看起来你已经确认你的帐户，一切就绪。
    </p>
End If