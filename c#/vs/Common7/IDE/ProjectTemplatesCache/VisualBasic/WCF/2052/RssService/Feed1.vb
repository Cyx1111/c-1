' 注意: 使用上下文菜单上的“重命名”命令可以同时更改代码和配置文件中的类名“Feed1”。
Public Class Feed1
    Implements IFeed1

    Public Function CreateFeed() As SyndicationFeedFormatter Implements IFeed1.CreateFeed
        ' 新建整合源。
        Dim feed As New SyndicationFeed("Feed Title", "A WCF Syndication Feed", Nothing)
        Dim items As New List(Of SyndicationItem)

        ' 新建整合项。
        Dim item As New SyndicationItem("An item", "Item content", Nothing)
        items.Add(item)
        feed.Items = items

        ' 根据查询字符串返回 ATOM 或 RSS
        ' rss -> http://localhost:8733/Design_Time_Addresses/$safeprojectname$/Feed1/
        ' atom -> http://localhost:8733/Design_Time_Addresses/$safeprojectname$/Feed1/?format=atom
        Dim query As String = WebOperationContext.Current.IncomingRequest.UriTemplateMatch.QueryParameters.Get("format")
        Dim formatter As SyndicationFeedFormatter = Nothing
        If (query = "atom") Then
            formatter = New Atom10FeedFormatter(feed)
        Else
            formatter = New Rss20FeedFormatter(feed)
        End If

        Return formatter
    End Function

End Class
