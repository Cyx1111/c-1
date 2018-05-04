Imports System.Web.Routing
Imports System.Web.DynamicData

Public Class Global_asax
    Inherits System.Web.HttpApplication

    Public Shared Sub RegisterRoutes(ByVal routes As RouteCollection)
    Dim model As New MetaModel

    '                     重要事项: 数据模型注册
    ' 取消注释此行，以便为 ASP.NET Dynamic Data 注册 LINQ to SQL 类
    ' 模型。若要设置 ScaffoldAllTables = true，需符合以下条件，
    ' 即确定希望数据模型中的所有表都支持支架(即模板)
    ' 视图。若要控制单个表的支架，请为该表创建一个分部类，
    ' 并将 [Scaffold(true)] 特性应用到该分部类。
    ' 注意: 确保将 "YourDataContextType" 更改为应用程序中
    ' 数据上下文类的名称。
    ' model.RegisterContext(GetType(YourDataContextType), New ContextConfiguration() With {.ScaffoldAllTables = False})

    ' 下面的语句支持 separate-page 模式，在这种模式下，“列表”、“详细”、“插入”和
    ' “更新”任务是使用不同页执行的。若要启用此模式，请取消注释以下
    ' route 定义，并注释掉后面的 combined-page 模式节中的 route 定义。
    routes.Add(New DynamicDataRoute("{table}/{action}.aspx") With { _
        .Constraints = New RouteValueDictionary(New With {.Action = "List|Details|Edit|Insert"}), _
        .Model = model})

    ' 下面的语句支持 combined-page 模式，在这种模式下，“列表”、“详细”、“插入”和
    ' “更新”任务是使用同一页执行的。若要启用此模式，请取消注释
    ' 以下 routes，并注释掉以上 separate-page 模式节中的 route 定义。
    'routes.Add(New DynamicDataRoute("{table}/ListDetails.aspx") With { _
    '    .Action = PageAction.List, _
    '    .ViewName = "ListDetails", _
    '    .Model = model})

    'routes.Add(New DynamicDataRoute("{table}/ListDetails.aspx") With { _
    '    .Action = PageAction.Details, _
    '    .ViewName = "ListDetails", _
    '    .Model = model})
End Sub

Private Sub Application_Start(ByVal sender As Object, ByVal e As EventArgs)
    RegisterRoutes(RouteTable.Routes)
End Sub

End Class
