Public Class HomeController
    Inherits System.Web.Mvc.Controller

    Function Index() As ActionResult
        ViewData("Message") = "修改此模板以快速启动你的 ASP.NET MVC 应用程序。"

        Return View()
    End Function

    Function About() As ActionResult
        ViewData("Message") = "你的应用程序说明页。"

        Return View()
    End Function

    Function Contact() As ActionResult
        ViewData("Message") = "你的联系方式页。"

        Return View()
    End Function
End Class
