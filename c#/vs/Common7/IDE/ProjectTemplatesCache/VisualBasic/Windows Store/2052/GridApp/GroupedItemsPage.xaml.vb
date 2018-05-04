' “分组项页”项模板在 http://go.microsoft.com/fwlink/?LinkId=234231 上提供

''' <summary>
''' 显示分组的项集合的页。
''' </summary>
Public NotInheritable Class GroupedItemsPage
    Inherits Common.LayoutAwarePage

    ''' <summary>
    ''' 使用在导航过程中传递的内容填充页。在从以前的会话
    ''' 重新创建页时，也会提供任何已保存状态。
    ''' </summary>
    ''' <param name="navigationParameter">最初请求此页时传递给 <see cref="Frame.Navigate"/>
    ''' 的参数值。
    ''' </param>
    ''' <param name="pageState">此页在以前会话期间保留的状态
    ''' 字典。首次访问页面时为 null。</param>
    Protected Overrides Sub LoadState(navigationParameter As Object, pageState As Dictionary(Of String, Object))

        ' TODO: 创建适用于问题域的合适数据模型以替换示例数据
        Dim sampleDataGroups As IEnumerable(Of Data.SampleDataGroup) = Data.SampleDataSource.GetGroups(DirectCast(navigationParameter, String))
        Me.DefaultViewModel("Groups") = sampleDataGroups
    End Sub

    ''' <summary>
    ''' 在单击组标题时进行调用。
    ''' </summary>
    ''' <param name="sender">用作选定组的组标题的 Button。</param>
    ''' <param name="e">描述如何启动单击的事件数据。</param>
    Private Sub Header_Click(sender As Object, e As RoutedEventArgs)

        ' 确定 Button 实例表示的组
        Dim group As Object = DirectCast(sender, FrameworkElement).DataContext

        ' 导航至相应的目标页，并
        ' 通过将所需信息作为导航参数传入来配置新页
        Me.Frame.Navigate(GetType(GroupDetailPage), DirectCast(group, Data.SampleDataGroup).UniqueId)
    End Sub

    ''' <summary>
    ''' 在单击组内的项时进行调用。
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
