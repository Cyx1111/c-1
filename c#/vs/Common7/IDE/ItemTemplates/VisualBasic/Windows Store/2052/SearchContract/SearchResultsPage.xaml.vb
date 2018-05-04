' “搜索合同”项模板在 http://go.microsoft.com/fwlink/?LinkId=234240 上提供

$wizardcomment$''' <summary>
''' 此页显示全局搜索定向到此应用程序时的搜索结果。
''' </summary>
Public NotInheritable Class $safeitemname$
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

        ' 拆开传入参数对象的两个值: 查询文本和上一个
        ' 窗口内容
        Dim queryText As String = DirectCast(navigationParameter, String)

        ' TODO: 特定于应用程序的搜索逻辑。搜索进程负责
        '       创建用户可选的结果类别列表:
        '
        '       filterList.Add(New Filter("<filter name>", <result count>))
        '
        '       仅第一个筛选器(通常为“全部”)应将 true 作为第三个参数传入
        '       以便以活动状态开始。活动筛选器的结果在
        '       下面的 Filter_SelectionChanged 中提供。

        Dim filterList As New List(Of Filter)()
        filterList.Add(New Filter("All", 0, True))

        ' 通过视图模型沟通结果
        Dim bindableProperties As New PropertySet()
        Me.DefaultViewModel("QueryText") = ChrW(&H201C) + queryText + ChrW(&H201D)
        Me.DefaultViewModel("Filters") = filterList
        Me.DefaultViewModel("ShowFilters") = filterList.Count > 1
    End Sub

    ''' <summary>
    ''' 在使用处于对齐视图状态的 ComboBox 选择筛选器时进行调用。
    ''' </summary>
    ''' <param name="sender">ComboBox 实例。</param>
    ''' <param name="e">描述如何更改选定筛选器的事件数据。</param>
    Protected Sub Filter_SelectionChanged(sender As Object, e As SelectionChangedEventArgs)

        ' 确定选定的筛选器
        Dim selectedFilter As Filter = TryCast(e.AddedItems.FirstOrDefault(), Filter)
        If selectedFilter IsNot Nothing Then

            ' 将结果镜像到相应的筛选器对象中，以允许
            ' 在未对齐以反映更改时使用的 RadioButton 表示形式
            selectedFilter.Active = True

            ' TODO: 通过设置 Me.DefaultViewModel("Results") 对活动筛选器中的更改作出响应
            '       具有可绑定的 Image、Title、Subtitle 和 Description 属性的项的集合

            ' 确保找到结果
            Dim results As Object = Nothing

            If Me.DefaultViewModel.TryGetValue("Results", results) Then
                Dim ResultsCollection As ICollection = TryCast(results, ICollection)
                If ResultsCollection IsNot Nothing AndAlso ResultsCollection.Count <> 0 Then
                    VisualStateManager.GoToState(Me, "ResultsFound", True)
                    Return
                End If
            End If
        End If

        ' 无搜索结果时显示信息性文本。
        VisualStateManager.GoToState(Me, "NoResultsFound", True)
    End Sub

    ''' <summary>
    ''' 在未对齐的情况下使用 RadioButton 选定筛选器时进行调用。
    ''' </summary>
    ''' <param name="sender">选定的 RadioButton 实例。</param>
    ''' <param name="e">描述如何选定 RadioButton 的事件数据。</param>
    Protected Sub Filter_Checked(sender As Object, e As RoutedEventArgs)

        ' 将更改镜像到对应的 ComboBox 使用的 CollectionViewSource 中
        ' 以确保在对齐后反映更改
        If filtersViewSource.View IsNot Nothing Then
            Dim filter As Object = DirectCast(sender, FrameworkElement).DataContext
            filtersViewSource.View.MoveCurrentTo(filter)
        End If
    End Sub

    ''' <summary>
    ''' 描述可用于查看搜索结果的筛选器之一的视图模型。
    ''' </summary>
    Private NotInheritable Class Filter
        Inherits Common.BindableBase

        Private _name As String
        Private _count As Integer
        Private _active As Boolean

        Public Sub New(name As String, count As Integer, Optional active As Boolean = false)
            Me.Name = name
            Me.Count = count
            Me.Active = active
        End Sub

        Public Overrides Function ToString() As String
            Return Description
        End Function

        Public Property Name As String
            Get
                Return _name
            End Get
            Set(value As String)
                If Me.SetProperty(_name, value) Then Me.OnPropertyChanged("Description")
            End Set
        End Property

        Public Property Count As Integer
            Get
                Return _count
            End Get
            Set(value As Integer)
                If Me.SetProperty(_count, value) Then Me.OnPropertyChanged("Description")
            End Set
        End Property

        Public Property Active As Boolean
            Get
                Return _active
            End Get
            Set(value As Boolean)
                Me.SetProperty(_active, value)
            End Set
        End Property

        Public ReadOnly Property Description As String
            Get
                Return String.Format("{0} ({1})", _name, _count)
            End Get
        End Property

    End Class
    
End Class
