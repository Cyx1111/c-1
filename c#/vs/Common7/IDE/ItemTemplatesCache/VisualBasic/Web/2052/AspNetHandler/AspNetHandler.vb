Imports System.Web
Public Class $safeitemrootname$
    Implements IHttpHandler

    ''' <summary>
    '''  您将需要在网站的 Web.config 文件中配置此处理程序 
    '''  并向 IIS 注册它，然后才能使用它。有关详细信息，
    '''  请参见下面的链接: http://go.microsoft.com/?linkid=8101007
    ''' </summary>
#Region "IHttpHandler 成员"

    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            ' 如果无法为其他请求重用托管处理程序，则返回 false。
            ' 如果按请求保留某些状态信息，则通常这将为 false。
            Return True
        End Get
    End Property

    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest

        ' 在此处写入您的处理程序实现。

    End Sub

#End Region

End Class
