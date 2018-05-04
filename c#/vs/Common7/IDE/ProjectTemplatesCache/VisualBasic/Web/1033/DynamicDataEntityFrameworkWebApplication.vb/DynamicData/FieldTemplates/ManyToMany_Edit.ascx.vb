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
        ' Register for the DataSource's updating event
        Dim ds As EntityDataSource = CType(Me.FindDataSourceControl, EntityDataSource)
        ' This field template is used both for Editing and Inserting
        AddHandler ds.Updating, AddressOf Me.DataSource_UpdatingOrInserting
        AddHandler ds.Inserting, AddressOf Me.DataSource_UpdatingOrInserting
    End Sub
    
    Private Sub DataSource_UpdatingOrInserting(ByVal sender As Object, ByVal e As EntityDataSourceChangingEventArgs)
        Dim childTable As MetaTable = ChildrenColumn.ChildTable
        ' Comments assume employee/territory for illustration, but the code is generic
        ' Get the collection of territories for this employee
        Dim entityCollection = CType(Column.EntityTypeProperty.GetValue(e.Entity, Nothing), RelatedEnd)
        ' In Edit mode, make sure it's loaded (doesn't make sense in Insert mode)
        If Mode = DataBoundControlMode.Edit AndAlso Not entityCollection.IsLoaded Then
            entityCollection.Load()
        End If
        ' Get an IList from it (i.e. the list of territories for the current employee)
        Dim entityList As IList = CType(entityCollection, IListSource).GetList
        ' Go through all the territories (not just those for this employee)
        For Each childEntity As Object In childTable.GetQuery(e.Context)
            ' Check if the employee currently has this territory
            Dim isCurrentlyInList As Boolean = entityList.Contains(childEntity)
            ' Find the checkbox for this territory, which gives us the new state
            Dim pkString As String = childTable.GetPrimaryKeyString(childEntity)
            Dim listItem As ListItem = CheckBoxList1.Items.FindByValue(pkString)
            If (listItem Is Nothing) Then
                Continue For
            End If
            ' If the states differs, make the appropriate add/remove change
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
        ' Comments assume employee/territory for illustration, but the code is generic
        Dim entityList As IList = Nothing
        Dim objectContext As ObjectContext = Nothing
        If Mode = DataBoundControlMode.Edit Then
            Dim entity As Object
            Dim rowDescriptor = TryCast(Row, ICustomTypeDescriptor)
            If rowDescriptor IsNot Nothing Then
                ' Get the real entity from the wrapper
                entity = rowDescriptor.GetPropertyOwner(Nothing)
            Else
                entity = Row
            End If
    
            ' Get the collection of territories for this employee and make sure it's loaded
            Dim entityCollection = TryCast(Column.EntityTypeProperty.GetValue(entity, Nothing), RelatedEnd)
            If entityCollection Is Nothing Then
                Throw New InvalidOperationException(String.Format("The ManyToMany template does not support the collection type of the '{0}' column on the '{1}' table.", Column.Name, Table.Name))
            End If
            If Not entityCollection.IsLoaded Then
                entityCollection.Load()
            End If
            ' Get an IList from it (i.e. the list of territories for the current employee)
            entityList = CType(entityCollection, IListSource).GetList
            ' Get the current ObjectContext
            Dim objectQuery = CType(entityCollection.GetType.GetMethod("CreateSourceQuery").Invoke(entityCollection, Nothing), ObjectQuery)
            objectContext = objectQuery.Context
        End If
        ' Go through all the territories (not just those for this employee)
        For Each childEntity As Object In childTable.GetQuery(objectContext)
            Dim actualTable As MetaTable = MetaTable.GetTable(childEntity.GetType())
            ' Create a checkbox for it
            Dim listItem As New ListItem(actualTable.GetDisplayString(childEntity), actualTable.GetPrimaryKeyString(childEntity))
            ' Make it selected if the current employee has that territory
            If Mode = DataBoundControlMode.Edit Then
                listItem.Selected = entityList.Contains(childEntity)
            End If
            CheckBoxList1.Items.Add(listItem)
        Next
    End Sub
    
End Class
