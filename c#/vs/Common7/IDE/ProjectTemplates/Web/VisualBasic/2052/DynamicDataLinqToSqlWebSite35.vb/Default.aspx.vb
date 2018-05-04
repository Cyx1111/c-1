Imports System.Web.DynamicData

Partial Class _Default
    Inherits System.Web.UI.Page

        
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As EventArgs)
        Dim visibleTables As System.Collections.IList = MetaModel.Default.VisibleTables
        If (visibleTables.Count = 0) Then
            Throw New InvalidOperationException("没有可访问的表。请确保至少在 Global.asax 中注册了一个数据模型"& _ 
                "并启用了支架，或者实现自定义页。")
        End If
        Menu1.DataSource = visibleTables
        Menu1.DataBind
    End Sub


End Class
