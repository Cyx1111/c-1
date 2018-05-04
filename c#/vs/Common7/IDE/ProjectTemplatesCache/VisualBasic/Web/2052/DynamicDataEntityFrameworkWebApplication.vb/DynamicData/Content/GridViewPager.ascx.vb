﻿Imports System.Web.DynamicData
Imports System.Globalization

Class GridViewPager
    Inherits UserControl

    Private _gridView As GridView
    
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As EventArgs)
        Dim c As Control = Parent
    
        While c IsNot Nothing
            If TypeOf c Is GridView Then
                _gridView = CType(c, GridView)
                Exit While
            End If
            c = c.Parent
    
        End While
    End Sub
    
    Protected Sub TextBoxPage_TextChanged(ByVal sender As Object, ByVal e As EventArgs)
        If _gridView Is Nothing Then
            Return
        End If
        Dim page As Integer
        If Integer.TryParse(TextBoxPage.Text.Trim, page) Then
            If (page <= 0) Then
                page = 1
            End If
            If (page > _gridView.PageCount) Then
                page = _gridView.PageCount
            End If
            _gridView.PageIndex = (page - 1)
        End If
        TextBoxPage.Text = (_gridView.PageIndex + 1).ToString(CultureInfo.CurrentCulture)
    End Sub
    
    Protected Sub DropDownListPageSize_SelectedIndexChanged(ByVal sender As Object, ByVal e As EventArgs)
        If _gridView Is Nothing Then
            Return
        End If
        Dim dropdownlistpagersize As DropDownList = CType(sender, DropDownList)
        _gridView.PageSize = Convert.ToInt32(dropdownlistpagersize.SelectedValue, CultureInfo.CurrentCulture)
        Dim pageindex As Integer = _gridView.PageIndex
        _gridView.DataBind()
        If (_gridView.PageIndex <> pageindex) Then
            '如果页面索引已更改，则表示上一页无效且已经过调整。使用调整后的页面重新绑定到填充控件
            _gridView.DataBind()
        End If
    End Sub
    
    Protected Sub Page_PreRender(ByVal sender As Object, ByVal e As EventArgs)
        If _gridView IsNot Nothing Then
            LabelNumberOfPages.Text = _gridView.PageCount.ToString(CultureInfo.CurrentCulture)
            TextBoxPage.Text = (_gridView.PageIndex + 1).ToString(CultureInfo.CurrentCulture)
            DropDownListPageSize.SelectedValue = _gridView.PageSize.ToString(CultureInfo.CurrentCulture)
        End If
    End Sub
    
End Class