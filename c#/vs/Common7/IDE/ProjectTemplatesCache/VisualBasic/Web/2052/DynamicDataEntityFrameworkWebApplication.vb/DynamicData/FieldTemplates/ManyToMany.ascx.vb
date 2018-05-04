Imports System.ComponentModel.DataAnnotations
Imports System.Web.DynamicData
Imports System.Data.Objects
Imports System.Data.Objects.DataClasses
Imports System.ComponentModel

Class ManyToManyField
    Inherits FieldTemplateUserControl

    Public Overrides ReadOnly Property DataControl As Control
        Get
            Return Repeater1
        End Get
    End Property
    
    Protected Overrides Sub OnDataBinding(ByVal e As EventArgs)
        MyBase.OnDataBinding(e)
    
        Dim entity As Object
        Dim rowDescriptor = TryCast(Row, ICustomTypeDescriptor)
        If rowDescriptor IsNot Nothing Then
            ' 从包装中获取实际实体
            entity = rowDescriptor.GetPropertyOwner(Nothing)
        Else
            entity = Row
        End If
    
        ' 获取集合并确保加载它
        Dim entityCollection = TryCast(Column.EntityTypeProperty.GetValue(entity, Nothing), RelatedEnd)
        If entityCollection Is Nothing Then
            Throw New InvalidOperationException(String.Format("ManyToMany 模板不支持'{1}'表上的'{0}'列的集合类型。", Column.Name, Table.Name))
        End If
        If Not entityCollection.IsLoaded Then
            entityCollection.Load()
        End If
    
        ' 将 Repeater 绑定到子实体的列表
        Repeater1.DataSource = entityCollection
        Repeater1.DataBind()
    End Sub
    
End Class
