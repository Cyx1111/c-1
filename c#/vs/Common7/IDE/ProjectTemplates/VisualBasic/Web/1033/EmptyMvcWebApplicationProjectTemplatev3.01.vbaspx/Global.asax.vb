﻿' Note: For instructions on enabling IIS6 or IIS7 classic mode, 
' visit http://go.microsoft.com/?LinkId=9394802
Imports System.Data.Entity
Imports System.Data.Entity.Infrastructure

Public Class $globalclassname$
    Inherits System.Web.HttpApplication

    Shared Sub RegisterGlobalFilters(ByVal filters As GlobalFilterCollection)
        filters.Add(New HandleErrorAttribute())
    End Sub

    Shared Sub RegisterRoutes(ByVal routes As RouteCollection)
        routes.IgnoreRoute("{resource}.axd/{*pathInfo}")

        ' MapRoute takes the following parameters, in order:
        ' (1) Route name
        ' (2) URL with parameters
        ' (3) Parameter defaults
        routes.MapRoute( _
            "Default", _
            "{controller}/{action}/{id}", _
            New With {.controller = "Home", .action = "Index", .id = UrlParameter.Optional} _
        )

    End Sub

    Sub Application_Start()
        AreaRegistration.RegisterAllAreas()

        ' Use LocalDB for Entity Framework by default
        Database.DefaultConnectionFactory = New SqlConnectionFactory("Data Source=(localdb)\v11.0; Integrated Security=True; MultipleActiveResultSets=True")

        RegisterGlobalFilters(GlobalFilters.Filters)
        RegisterRoutes(RouteTable.Routes)
    End Sub
End Class