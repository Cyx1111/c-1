﻿' “项详细信息页”项模板在 http://go.microsoft.com/fwlink/?LinkId=234232 上提供

''' <summary>
''' 显示组内单一项的详细信息同时允许使用手势
''' 浏览同一组的其他项的页。
''' </summary>
Public NotInheritable Class ItemDetailPage
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

        ' 允许已保存页状态重写要显示的初始项
        If pageState IsNot Nothing AndAlso pageState.ContainsKey("SelectedItem") Then
            navigationParameter = pageState("SelectedItem")
        End If

        ' TODO: 创建适用于问题域的合适数据模型以替换示例数据
        Dim item As Data.SampleDataItem = Data.SampleDataSource.GetItem(DirectCast(navigationParameter, String))
        Me.DefaultViewModel("Group") = item.Group
        Me.DefaultViewModel("Items") = item.Group.Items
        Me.flipView.SelectedItem = item
    End Sub

    ''' <summary>
    ''' 保留与此页关联的状态，以防挂起应用程序或
    ''' 从导航缓存中放弃此页。值必须符合
    ''' <see cref="Common.SuspensionManager.SessionState"/> 的序列化要求。
    ''' </summary>
    ''' <param name="pageState">要使用可序列化状态填充的空字典。</param>
    Protected Overrides Sub SaveState(pageState As Dictionary(Of String, Object))
        Dim selectedItem As Data.SampleDataItem = DirectCast(Me.flipView.SelectedItem, Data.SampleDataItem)
        pageState("SelectedItem") = selectedItem.UniqueId
    End Sub

End Class
