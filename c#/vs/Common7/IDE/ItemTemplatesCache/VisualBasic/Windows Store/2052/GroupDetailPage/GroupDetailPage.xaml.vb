' “组详细信息页”项模板在 http://go.microsoft.com/fwlink/?LinkId=234229 上提供

''' <summary>
''' 显示单个组的概述的页，包括组内各项
''' 的预览。
''' </summary>
Public NotInheritable Class $safeitemname$
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
        ' TODO: 将可绑定组分配给 Me.DefaultViewModel("Group")
        ' TODO: 将可绑定项集合分配给 Me.DefaultViewModel("Items")
    End Sub

End Class
