Imports System.Web.Routing
Imports System.Web.DynamicData
Imports System.Web.UI

Public Class Global_asax
    Inherits HttpApplication

    Private Shared s_defaultModel As New MetaModel
    Public Shared ReadOnly Property DefaultModel() As MetaModel
        Get
            Return s_defaultModel
        End Get
    End Property
    
    Public Shared Sub RegisterRoutes(ByVal routes As RouteCollection)
        '                     重要事项: 数据模型注册
        ' 取消注释此行，以便为 ASP.NET Dynamic Data 注册 ADO.NET Entity Framework 模型。
        ' 若要设置 ScaffoldAllTables = true，需符合以下条件，即确定希望数据模型中的所有表
        ' 都支持支架(即模板)视图。若要控制单个表的
        ' 支架，请为该表创建一个分部类，并将
        ' <ScaffoldTable(true)> 特性应用到该分部类。
        ' 注意: 确保将 "YourDataContextType" 更改为应用程序中
        ' 数据上下文类的名称。
        ' See http://go.microsoft.com/fwlink/?LinkId=257395 for more information on how to add and configure an Entity Data model to this project
        ' DefaultModel.RegisterContext(GetType(YourDataContextType), New ContextConfiguration() With {.ScaffoldAllTables = False})
    
        ' 下面的语句支持 separate-page 模式，在这种模式下，“列表”、“详细”、“插入”和
        ' “更新”任务是使用不同页执行的。若要启用此模式，请取消注释以下
        ' route 定义，并注释掉后面的 combined-page 模式节中的 route 定义。
        routes.Add(New DynamicDataRoute("{table}/{action}.aspx") With {
            .Constraints = New RouteValueDictionary(New With {.Action = "List|Details|Edit|Insert"}),
            .Model = DefaultModel})
    
        ' 下面的语句支持 combined-page 模式，在这种模式下，“列表”、“详细”、“插入”和
        ' “更新”任务是使用同一页执行的。若要启用此模式，请取消注释
        ' 以下 routes，并注释掉以上 separate-page 模式节中的 route 定义。
        'routes.Add(New DynamicDataRoute("{table}/ListDetails.aspx") With {
        '    .Action = PageAction.List,
        '    .ViewName = "ListDetails",
        '    .Model = DefaultModel})
    
        'routes.Add(New DynamicDataRoute("{table}/ListDetails.aspx") With {
        '    .Action = PageAction.Details,
        '    .ViewName = "ListDetails",
        '    .Model = DefaultModel})
    End Sub

    Private Shared Sub RegisterScripts()
        ScriptManager.ScriptResourceMapping.AddDefinition("jquery", New ScriptResourceDefinition With {
            .Path = "~/Scripts/jquery-1.7.1.min.js",
            .DebugPath = "~/Scripts/jquery-1.7.1.js",
            .CdnPath = "http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.1.min.js",
            .CdnDebugPath = "http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.1.js",
            .CdnSupportsSecureConnection = True$if$ ($targetframeworkversion$ >= 4.5),
            .LoadSuccessExpression = "window.jQuery"$endif$
        })
    End Sub

    Private Sub Application_Start(ByVal sender As Object, ByVal e As EventArgs)
        RegisterRoutes(RouteTable.Routes)
        RegisterScripts()
    End Sub

End Class
