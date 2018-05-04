Imports System.ComponentModel.DataAnnotations
Imports System.Web.DynamicData
Imports System.Web

Class ForeignKey_EditField
    Inherits FieldTemplateUserControl

    Public Overrides ReadOnly Property DataControl As Control
        Get
            Return DropDownList1
        End Get
    End Property
    
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As EventArgs)
        If (DropDownList1.Items.Count = 0) Then
            If Mode = DataBoundControlMode.Insert OrElse Not Column.IsRequired Then
                DropDownList1.Items.Add(New ListItem("[未设置]", ""))
            End If
            PopulateListControl(DropDownList1)
        End If
        SetUpValidator(RequiredFieldValidator1)
        SetUpValidator(DynamicValidator1)
    End Sub
    
    Protected Overrides Sub OnDataBinding(ByVal e As EventArgs)
        MyBase.OnDataBinding(e)
        Dim selectedValueString As String = GetSelectedValueString()
        Dim item As ListItem = DropDownList1.Items.FindByValue(selectedValueString)
        If item IsNot Nothing Then
            DropDownList1.SelectedValue = selectedValueString
        End If
    End Sub
    
    Protected Overrides Sub ExtractValues(ByVal dictionary As IOrderedDictionary)
        ' 如果它是空字符串，请将其更改为 null
        Dim value As String = DropDownList1.SelectedValue
        If String.IsNullOrEmpty(value) Then
            value = Nothing
        End If
        ExtractForeignKey(dictionary, value)
    End Sub
    
End Class
