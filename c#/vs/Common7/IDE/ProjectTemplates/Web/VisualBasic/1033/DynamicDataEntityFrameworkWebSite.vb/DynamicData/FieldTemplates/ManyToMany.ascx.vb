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
            ' Get the real entity from the wrapper
            entity = rowDescriptor.GetPropertyOwner(Nothing)
        Else
            entity = Row
        End If
    
        ' Get the collection and make sure it's loaded
        Dim entityCollection = TryCast(Column.EntityTypeProperty.GetValue(entity, Nothing), RelatedEnd)
        If entityCollection Is Nothing Then
            Throw New InvalidOperationException(String.Format("The ManyToMany template does not support the collection type of the '{0}' column on the '{1}' table.", Column.Name, Table.Name))
        End If
        If Not entityCollection.IsLoaded Then
            entityCollection.Load()
        End If
    
        ' Bind the repeater to the list of children entities
        Repeater1.DataSource = entityCollection
        Repeater1.DataBind()
    End Sub
    
End Class
