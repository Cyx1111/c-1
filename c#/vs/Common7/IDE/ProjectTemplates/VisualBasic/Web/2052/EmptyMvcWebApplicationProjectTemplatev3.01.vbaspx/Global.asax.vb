' 注意: 有关启用 IIS6 或 IIS7 经典模式的说明，
' 请访问 http://go.microsoft.com/?LinkId=9394802
Imports System.Data.Entity
Imports System.Data.Entity.Infrastructure

Public Class $globalclassname$
    Inherits System.Web.HttpApplication

    Shared Sub RegisterGlobalFilters(ByVal filters As GlobalFilterCollection)
        filters.Add(New HandleErrorAttribute())
    End Sub

    Shared Sub RegisterRoutes(ByVal routes As RouteCollection)
        routes.IgnoreRoute("{resource}.axd/{*pathInfo}")

        ' MapRoute 按顺序采用以下参数:
        ' (1) 路由名称
        ' (2) 带参数的 URL
        ' (3) 参数默认值
        routes.MapRoute( _
            "Default", _
            "{controller}/{action}/{id}", _
            New With {.controller = "Home", .action = "Index", .id = UrlParameter.Optional} _
        )

    End Sub

    Sub Application_Start()
        AreaRegistration.RegisterAllAreas()

        ' 默认情况下对 Entity Framework 使用 LocalDB
        Database.DefaultConnectionFactory = New SqlConnectionFactory("Data Source=(localdb)\v11.0; Integrated Security=True; MultipleActiveResultSets=True")

        RegisterGlobalFilters(GlobalFilters.Filters)
        RegisterRoutes(RouteTable.Routes)
    End Sub
End Class
