﻿Imports System.Collections.Specialized

Namespace Data

    ' 此文件定义的数据模型可充当在添加、移除或修改成员时
    ' 支持通知的强类型模型的代表性示例。所选
    ' 属性名称与标准项模板中的数据绑定一致。
    '
    ' 应用程序可以使用此模型作为起始点并以它为基础构建，或完全放弃它并
    ' 替换为适合其需求的其他内容。

    ''' <summary>
    ''' <see cref="SampleDataItem"/> 和 <see cref="SampleDataGroup"/> 的基类，
    ''' 定义对两者通用的属性。
    ''' </summary>
    <Windows.Foundation.Metadata.WebHostHidden>
    Public MustInherit Class SampleDataCommon
        Inherits Common.BindableBase

        Public Sub New(uniqueId As String, title As String, subtitle As String, imagePath As String, description As String)
            Me._uniqueId = uniqueId
            Me._title = title
            Me._subtitle = subtitle
            Me._imagePath = imagePath
            Me._description = description
        End Sub

        Private Shared _baseUri As New Uri("ms-appx:'''")

        Private _uniqueId As String = String.Empty
        Public Property UniqueId As String
            Get
                Return Me._uniqueId
            End Get
            Set(value As String)
                Me.SetProperty(Me._uniqueId, value)
            End Set
        End Property

        Private _title As String = String.Empty
        Public Property Title As String
            Get
                Return Me._title
            End Get
            Set(value As String)
                Me.SetProperty(Me._title, value)
            End Set
        End Property

        Private _subtitle As String = String.Empty
        Public Property Subtitle As String
            Get
                Return Me._subtitle
            End Get
            Set(value As String)
                Me.SetProperty(Me._subtitle, value)
            End Set
        End Property

        Private _description As String = String.Empty
        Public Property Description As String
            Get
                Return Me._description
            End Get
            Set(value As String)
                Me.SetProperty(Me._description, value)
            End Set
        End Property

        Private _image As ImageSource
        Private _imagePath As String
        Public Property Image As ImageSource
            Get
                If Me._image Is Nothing AndAlso Me._imagePath IsNot Nothing Then
                    Me._image = New BitmapImage(New Uri(SampleDataCommon._baseUri, Me._imagePath))
                End If
                Return Me._image
            End Get

            Set(value As ImageSource)
                Me._imagePath = Nothing
                Me.SetProperty(Me._image, value)
            End Set
        End Property

        Public Sub SetImage(path As String)
            Me._image = Nothing
            Me._imagePath = path
            Me.OnPropertyChanged("Image")
        End Sub

        Public Overrides Function ToString() As String
            Return Me.Title
        End Function
    End Class

    ''' <summary>
    ''' 泛型项数据模型。
    ''' </summary>
    Public NotInheritable Class SampleDataItem
        Inherits SampleDataCommon

        Public Sub New(uniqueId As String, title As String, subtitle As String, imagePath As String, description As String,
                       content As String, group As SampleDataGroup)
            MyBase.New(uniqueId, title, subtitle, imagePath, description)
            Me._content = content
            Me._group = group
        End Sub

        Private _content As String = String.Empty
        Public Property Content As String
            Get
                Return Me._content
            End Get
            Set(value As String)
                SetProperty(Me._content, value)
            End Set
        End Property

        Private _group As SampleDataGroup
        Public Property Group As SampleDataGroup
            Get
                Return Me._group
            End Get
            Set(value As SampleDataGroup)
                SetProperty(Me._group, value)
            End Set
        End Property

    End Class

    ''' <summary>
    ''' 泛型组数据模型。
    ''' </summary>
    Public NotInheritable Class SampleDataGroup
        Inherits SampleDataCommon

        Public Sub New(uniqueId As String, title As String, subtitle As String, imagePath As String, description As String)
            MyBase.New(uniqueId, title, subtitle, imagePath, description)
        End Sub

        Private WithEvents _items As New ObservableCollection(Of SampleDataItem)()
        Public ReadOnly Property Items As ObservableCollection(Of SampleDataItem)
            Get
                Return Me._items
            End Get
        End Property

        Private _topitems As New ObservableCollection(Of SampleDataItem)()
        Public ReadOnly Property TopItems As ObservableCollection(Of SampleDataItem)
            Get
                Return Me._topitems
            End Get
        End Property

        Private Sub ItemsCollectionChanged(sender As Object, e As NotifyCollectionChangedEventArgs) Handles _items.CollectionChanged
            ' 由于两个原因提供要从 GroupedItemsPage 绑定到的完整
            ' 项集合的子集: GridView 不会虚拟化大型项集合，并且它
            ' 可在浏览包含大量项的组时改进用户
            ' 体验。
            '
            ' 最多显示 12 项，因为无论显示 1、2、3、4 还是 6 行，
            ' 它都生成填充网格列

            Select Case e.Action
                Case NotifyCollectionChangedAction.Add
                    If e.NewStartingIndex < 12 Then
                        TopItems.Insert(e.NewStartingIndex, Items(e.NewStartingIndex))
                        If TopItems.Count > 12 Then
                            TopItems.RemoveAt(12)
                        End If
                    End If
                Case NotifyCollectionChangedAction.Move
                    If e.NewStartingIndex < 12 And e.OldStartingIndex < 12 Then
                        TopItems.Move(e.OldStartingIndex, e.NewStartingIndex)
                    ElseIf e.OldStartingIndex < 12 Then
                        TopItems.RemoveAt(e.OldStartingIndex)
                        TopItems.Add(Items(11))
                    ElseIf e.NewStartingIndex < 12 Then
                        TopItems.Insert(e.NewStartingIndex, Items(e.NewStartingIndex))
                        TopItems.RemoveAt(12)
                    End If
                Case NotifyCollectionChangedAction.Remove
                    If e.OldStartingIndex < 12 Then
                        TopItems.RemoveAt(e.OldStartingIndex)
                        If Items.Count >= 12 Then
                            TopItems.Add(Items(11))
                        End If
                    End If
                Case NotifyCollectionChangedAction.Replace
                    If e.OldStartingIndex < 12 Then
                        TopItems(e.OldStartingIndex) = Items(e.OldStartingIndex)
                    End If
                Case NotifyCollectionChangedAction.Reset
                    TopItems.Clear()
                    While TopItems.Count < Items.Count And TopItems.Count < 12
                        TopItems.Add(Items(TopItems.Count))
                    End While
            End Select
        End Sub

    End Class

    ''' <summary>
    ''' 创建包含硬编码内容的组和项的集合。
    ''' 
    ''' SampleDataSource 用占位符数据而不是实时生产数据
    ''' 初始化，因此在设计时和运行时均需提供示例数据。
    ''' </summary>
    Public NotInheritable Class SampleDataSource
        Private Shared _sampleDataSource As New SampleDataSource()

        Private _allGroups As New ObservableCollection(Of SampleDataGroup)
        Public ReadOnly Property AllGroups As ObservableCollection(Of SampleDataGroup)
            Get
                Return Me._allGroups
            End Get
        End Property

        Public Shared Function GetGroups(uniqueId As String) As IEnumerable(Of SampleDataGroup)
            If Not uniqueId.Equals("AllGroups") Then Throw New ArgumentException("Only 'AllGroups' is supported as a collection of groups")

            Return _sampleDataSource.AllGroups
        End Function

        Public Shared Function GetGroup(uniqueId As String) As SampleDataGroup

            ' 对于小型数据集可接受简单线性搜索
            Dim matches As IEnumerable(Of SampleDataGroup) = _sampleDataSource.AllGroups.Where(Function(group) group.UniqueId.Equals(uniqueId))
            If matches.Count() = 1 Then Return matches.First()
            Return Nothing
        End Function

        Public Shared Function GetItem(uniqueId As String) As SampleDataItem

            ' 对于小型数据集可接受简单线性搜索
            Dim matches As IEnumerable(Of SampleDataItem) = _sampleDataSource.AllGroups.SelectMany(Function(group) group.Items).Where(Function(item) item.UniqueId.Equals(uniqueId))
            If matches.Count() = 1 Then Return matches.First()
            Return Nothing
        End Function

        Public Sub New()
            Dim ITEM_CONTENT As String = String.Format("Item Content: {0}\n\n{0}\n\n{0}\n\n{0}\n\n{0}\n\n{0}\n\n{0}",
                        "Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat")

            Dim group1 As New SampleDataGroup("Group-1",
                    "Group Title: 1",
                    "Group Subtitle: 1",
                    "Assets/DarkGray.png",
                    "Group Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor scelerisque lorem in vehicula. Aliquam tincidunt, lacus ut sagittis tristique, turpis massa volutpat augue, eu rutrum ligula ante a ante")
            group1.Items.Add(New SampleDataItem("Group-1-Item-1",
                    "Item Title: 1",
                    "Item Subtitle: 1",
                    "Assets/LightGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group1))
            group1.Items.Add(New SampleDataItem("Group-1-Item-2",
                    "Item Title: 2",
                    "Item Subtitle: 2",
                    "Assets/DarkGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group1))
            group1.Items.Add(New SampleDataItem("Group-1-Item-3",
                    "Item Title: 3",
                    "Item Subtitle: 3",
                    "Assets/MediumGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group1))
            group1.Items.Add(New SampleDataItem("Group-1-Item-4",
                    "Item Title: 4",
                    "Item Subtitle: 4",
                    "Assets/DarkGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group1))
            group1.Items.Add(New SampleDataItem("Group-1-Item-5",
                    "Item Title: 5",
                    "Item Subtitle: 5",
                    "Assets/MediumGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group1))
            Me.AllGroups.Add(group1)

            Dim group2 As New SampleDataGroup("Group-2",
                    "Group Title: 2",
                    "Group Subtitle: 2",
                    "Assets/LightGray.png",
                    "Group Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor scelerisque lorem in vehicula. Aliquam tincidunt, lacus ut sagittis tristique, turpis massa volutpat augue, eu rutrum ligula ante a ante")
            group2.Items.Add(New SampleDataItem("Group-2-Item-1",
                    "Item Title: 1",
                    "Item Subtitle: 1",
                    "Assets/DarkGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group2))
            group2.Items.Add(New SampleDataItem("Group-2-Item-2",
                    "Item Title: 2",
                    "Item Subtitle: 2",
                    "Assets/MediumGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group2))
            group2.Items.Add(New SampleDataItem("Group-2-Item-3",
                    "Item Title: 3",
                    "Item Subtitle: 3",
                    "Assets/LightGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group2))
            Me.AllGroups.Add(group2)

            Dim group3 As New SampleDataGroup("Group-3",
                    "Group Title: 3",
                    "Group Subtitle: 3",
                    "Assets/MediumGray.png",
                    "Group Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor scelerisque lorem in vehicula. Aliquam tincidunt, lacus ut sagittis tristique, turpis massa volutpat augue, eu rutrum ligula ante a ante")
            group3.Items.Add(New SampleDataItem("Group-3-Item-1",
                    "Item Title: 1",
                    "Item Subtitle: 1",
                    "Assets/MediumGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group3))
            group3.Items.Add(New SampleDataItem("Group-3-Item-2",
                    "Item Title: 2",
                    "Item Subtitle: 2",
                    "Assets/LightGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group3))
            group3.Items.Add(New SampleDataItem("Group-3-Item-3",
                    "Item Title: 3",
                    "Item Subtitle: 3",
                    "Assets/DarkGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group3))
            group3.Items.Add(New SampleDataItem("Group-3-Item-4",
                    "Item Title: 4",
                    "Item Subtitle: 4",
                    "Assets/LightGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group3))
            group3.Items.Add(New SampleDataItem("Group-3-Item-5",
                    "Item Title: 5",
                    "Item Subtitle: 5",
                    "Assets/MediumGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group3))
            group3.Items.Add(New SampleDataItem("Group-3-Item-6",
                    "Item Title: 6",
                    "Item Subtitle: 6",
                    "Assets/DarkGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group3))
            group3.Items.Add(New SampleDataItem("Group-3-Item-7",
                    "Item Title: 7",
                    "Item Subtitle: 7",
                    "Assets/MediumGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group3))
            Me.AllGroups.Add(group3)

            Dim group4 As New SampleDataGroup("Group-4",
                    "Group Title: 4",
                    "Group Subtitle: 4",
                    "Assets/LightGray.png",
                    "Group Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor scelerisque lorem in vehicula. Aliquam tincidunt, lacus ut sagittis tristique, turpis massa volutpat augue, eu rutrum ligula ante a ante")
            group4.Items.Add(New SampleDataItem("Group-4-Item-1",
                    "Item Title: 1",
                    "Item Subtitle: 1",
                    "Assets/DarkGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group4))
            group4.Items.Add(New SampleDataItem("Group-4-Item-2",
                    "Item Title: 2",
                    "Item Subtitle: 2",
                    "Assets/LightGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group4))
            group4.Items.Add(New SampleDataItem("Group-4-Item-3",
                    "Item Title: 3",
                    "Item Subtitle: 3",
                    "Assets/DarkGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group4))
            group4.Items.Add(New SampleDataItem("Group-4-Item-4",
                    "Item Title: 4",
                    "Item Subtitle: 4",
                    "Assets/LightGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group4))
            group4.Items.Add(New SampleDataItem("Group-4-Item-5",
                    "Item Title: 5",
                    "Item Subtitle: 5",
                    "Assets/MediumGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group4))
            group4.Items.Add(New SampleDataItem("Group-4-Item-6",
                    "Item Title: 6",
                    "Item Subtitle: 6",
                    "Assets/LightGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group4))
            Me.AllGroups.Add(group4)

            Dim group5 As New SampleDataGroup("Group-5",
                    "Group Title: 5",
                    "Group Subtitle: 5",
                    "Assets/MediumGray.png",
                    "Group Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor scelerisque lorem in vehicula. Aliquam tincidunt, lacus ut sagittis tristique, turpis massa volutpat augue, eu rutrum ligula ante a ante")
            group5.Items.Add(New SampleDataItem("Group-5-Item-1",
                    "Item Title: 1",
                    "Item Subtitle: 1",
                    "Assets/LightGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group5))
            group5.Items.Add(New SampleDataItem("Group-5-Item-2",
                    "Item Title: 2",
                    "Item Subtitle: 2",
                    "Assets/DarkGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group5))
            group5.Items.Add(New SampleDataItem("Group-5-Item-3",
                    "Item Title: 3",
                    "Item Subtitle: 3",
                    "Assets/LightGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group5))
            group5.Items.Add(New SampleDataItem("Group-5-Item-4",
                    "Item Title: 4",
                    "Item Subtitle: 4",
                    "Assets/MediumGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group5))
            Me.AllGroups.Add(group5)

            Dim group6 As New SampleDataGroup("Group-6",
                    "Group Title: 6",
                    "Group Subtitle: 6",
                    "Assets/DarkGray.png",
                    "Group Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor scelerisque lorem in vehicula. Aliquam tincidunt, lacus ut sagittis tristique, turpis massa volutpat augue, eu rutrum ligula ante a ante")
            group6.Items.Add(New SampleDataItem("Group-6-Item-1",
                    "Item Title: 1",
                    "Item Subtitle: 1",
                    "Assets/LightGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group6))
            group6.Items.Add(New SampleDataItem("Group-6-Item-2",
                    "Item Title: 2",
                    "Item Subtitle: 2",
                    "Assets/DarkGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group6))
            group6.Items.Add(New SampleDataItem("Group-6-Item-3",
                    "Item Title: 3",
                    "Item Subtitle: 3",
                    "Assets/MediumGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group6))
            group6.Items.Add(New SampleDataItem("Group-6-Item-4",
                    "Item Title: 4",
                    "Item Subtitle: 4",
                    "Assets/DarkGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group6))
            group6.Items.Add(New SampleDataItem("Group-6-Item-5",
                    "Item Title: 5",
                    "Item Subtitle: 5",
                    "Assets/LightGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group6))
            group6.Items.Add(New SampleDataItem("Group-6-Item-6",
                    "Item Title: 6",
                    "Item Subtitle: 6",
                    "Assets/MediumGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group6))
            group6.Items.Add(New SampleDataItem("Group-6-Item-7",
                    "Item Title: 7",
                    "Item Subtitle: 7",
                    "Assets/DarkGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group6))
            group6.Items.Add(New SampleDataItem("Group-6-Item-8",
                    "Item Title: 8",
                    "Item Subtitle: 8",
                    "Assets/LightGray.png",
                    "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                    ITEM_CONTENT,
                    group6))
            Me.AllGroups.Add(group6)
        End Sub

    End Class

End Namespace
