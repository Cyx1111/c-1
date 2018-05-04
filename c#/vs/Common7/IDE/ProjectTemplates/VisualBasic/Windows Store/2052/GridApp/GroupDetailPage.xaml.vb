' “组详细信息页”项模板在 http://go.microsoft.com/fwlink/?LinkId=234229 上提供

''' <summary>
''' 显示单个组的概述的页，包括组内各项
''' 的预览。
''' </summary>
Public NotInheritable Class GroupDetailPage
    Inherits Common.LayoutAwarePage

    ''' <summary>
    ''' 使用在导航过程中传递的内容填充页。在从以前的会话
    ''' 重新创建页时，也会提供任何已保存状态。
    ''' </summary>
    ''' <param name="navigationParameter">最初请求此页时传递给
    ''' <see cref="Frame.Navigate"/> 的参数值。
    ''' </param>
    ''' <param name="pageState">此页在以前会话期间保留的状态
    ''' 字典。首次访问页面时为 null。</param>
    Protected Overrides Sub LoadState(navigationParameter As Object, pageState As Dictionary(Of String, Object))

        ' TODO: 创建适用于问题域的合适数据模型以替换示例数据
        Dim group As Data.SampleDataGroup = Data.SampleDataSource.GetGroup(DirectCast(navigationParameter, String))
        Me.DefaultViewModel("Group") = group
        Me.DefaultViewModel("Items") = group.Items
    End Sub

    ''' <summary>
    ''' 在单击某个项时进行调用。
    ''' </summary>
    ''' <param name="sender">显示所单击项的 GridView (在应用程序处于对齐状态时
    ''' 为 ListView)。</param>
    ''' <param name="e">描述所单击项的事件数据。</param>
    Private Sub ItemView_ItemClick(sender As Object, e As ItemClickEventArgs)

        ' 导航至相应的目标页，并
        ' 通过将所需信息作为导航参数传入来配置新页
        Dim itemId As String = DirectCast(e.ClickedItem, Data.SampleDataItem).UniqueId
        Me.Frame.Navigate(GetType(ItemDetailPage), itemId)
    End Sub

End Class
