Imports System.ComponentModel
Imports System.ComponentModel.DataAnnotations
Imports System.Web.DynamicData
Imports System.Data.Objects
Imports System.Data.Objects.DataClasses

Class ManyToMany_EditField
    Inherits FieldTemplateUserControl

    Public Overrides ReadOnly Property DataControl As Control
        Get
            Return CheckBoxList1
        End Get
    End Property
    
    Public Sub Page_Load(ByVal sender As Object, ByVal e As EventArgs)
        ' 注册 DataSource 的更新事件
        Dim ds As EntityDataSource = CType(Me.FindDataSourceControl, EntityDataSource)
        ' 此字段模板用于执行编辑和插入操作
        AddHandler ds.Updating, AddressOf Me.DataSource_UpdatingOrInserting
        AddHandler ds.Inserting, AddressOf Me.DataSource_UpdatingOrInserting
    End Sub
    
    Private Sub DataSource_UpdatingOrInserting(ByVal sender As Object, ByVal e As EntityDataSourceChangingEventArgs)
        Dim childTable As MetaTable = ChildrenColumn.ChildTable
        ' 注释以员工/区域为例来进行说明，但代码是泛型的
        ' 获取此员工对应的区域的集合
        Dim entityCollection = CType(Column.EntityTypeProperty.GetValue(e.Entity, Nothing), RelatedEnd)
        ' 在编辑模式下，确保加载该集合(在插入模式下没有意义)
        If Mode = DataBoundControlMode.Edit AndAlso Not entityCollection.IsLoaded Then
            entityCollection.Load()
        End If
        ' 从该集合获取 IList (即当前员工对应的区域的列表)
        Dim entityList As IList = CType(entityCollection, IListSource).GetList
        ' 检查所有区域(而不仅仅是此员工对应的那些区域)
        For Each childEntity As Object In childTable.GetQuery(e.Context)
            ' 检查该员工当前是否具有此区域
            Dim isCurrentlyInList As Boolean = entityList.Contains(childEntity)
            ' 查找此区域对应的复选框，它会为我们提供新状态
            Dim pkString As String = childTable.GetPrimaryKeyString(childEntity)
            Dim listItem As ListItem = CheckBoxList1.Items.FindByValue(pkString)
            If (listItem Is Nothing) Then
                Continue For
            End If
            ' 如果状态不同，则进行适当的添加/移除更改
            If listItem.Selected Then
                If Not isCurrentlyInList Then
                    entityList.Add(childEntity)
                End If
            ElseIf isCurrentlyInList Then
                entityList.Remove(childEntity)
            End If
        Next
    End Sub
    
    Protected Sub CheckBoxList1_DataBound(ByVal sender As Object, ByVal e As EventArgs)
        Dim childTable As MetaTable = ChildrenColumn.ChildTable
        ' 注释以员工/区域为例来进行说明，但代码是泛型的
        Dim entityList As IList = Nothing
        Dim objectContext As ObjectContext = Nothing
        If Mode = DataBoundControlMode.Edit Then
            Dim entity As Object
            Dim rowDescriptor = TryCast(Row, ICustomTypeDescriptor)
            If rowDescriptor IsNot Nothing Then
                ' 从包装中获取实际实体
                entity = rowDescriptor.GetPropertyOwner(Nothing)
            Else
                entity = Row
            End If
    
            ' 获取此员工对应的区域集合并确保加载该集合
            Dim entityCollection = TryCast(Column.EntityTypeProperty.GetValue(entity, Nothing), RelatedEnd)
            If entityCollection Is Nothing Then
                Throw New InvalidOperationException(String.Format("ManyToMany 模板不支持'{1}'表上的'{0}'列的集合类型。", Column.Name, Table.Name))
            End If
            If Not entityCollection.IsLoaded Then
                entityCollection.Load()
            End If
            ' 从该集合获取 IList (即当前员工对应的区域的列表)
            entityList = CType(entityCollection, IListSource).GetList
            ' 获取当前的 ObjectContext
            Dim objectQuery = CType(entityCollection.GetType.GetMethod("CreateSourceQuery").Invoke(entityCollection, Nothing), ObjectQuery)
            objectContext = objectQuery.Context
        End If
        ' 检查所有区域(而不仅仅是此员工对应的那些区域)
        For Each childEntity As Object In childTable.GetQuery(objectContext)
            Dim actualTable As MetaTable = MetaTable.GetTable(childEntity.GetType())
            ' 为它创建复选框
            Dim listItem As New ListItem(actualTable.GetDisplayString(childEntity), actualTable.GetPrimaryKeyString(childEntity))
            ' 如果当前员工具有该区域，则选定它
            If Mode = DataBoundControlMode.Edit Then
                listItem.Selected = entityList.Contains(childEntity)
            End If
            CheckBoxList1.Items.Add(listItem)
        Next
    End Sub
    
End Class
