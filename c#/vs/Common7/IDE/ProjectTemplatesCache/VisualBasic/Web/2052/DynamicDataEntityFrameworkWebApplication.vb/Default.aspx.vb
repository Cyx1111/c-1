Imports System.Web.DynamicData

Class _Default
    Inherits Page

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As EventArgs)
        Dim visibleTables As IList = Global_asax.DefaultModel.VisibleTables
        If visibleTables.Count = 0 Then
            Throw New InvalidOperationException("没有可访问的表。" &
                "请确保至少在 Global.asax 中注册了一个数据模型" &
                "并启用了支架，或者实现自定义页。")
        End If
        Menu1.DataSource = visibleTables
        Menu1.DataBind()
    End Sub
    
End Class
