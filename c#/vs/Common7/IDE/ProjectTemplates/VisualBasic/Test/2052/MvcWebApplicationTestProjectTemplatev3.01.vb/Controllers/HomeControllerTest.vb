Imports System
Imports System.Collections.Generic
Imports System.Text
Imports System.Web.Mvc
Imports Microsoft.VisualStudio.TestTools.UnitTesting
Imports $mvcprojectnamespace$

<TestClass()> Public Class HomeControllerTest

    <TestMethod()> Public Sub Index()
        ' 排列
        Dim controller As HomeController = New HomeController()

        ' 操作
        Dim result As ViewResult = CType(controller.Index(), ViewResult)

        ' 断言
        Dim viewData As ViewDataDictionary = result.ViewData
        Assert.AreEqual("欢迎使用 ASP.NET MVC!", viewData("Message"))
    End Sub

    <TestMethod()> Public Sub About()
        ' 排列
        Dim controller As HomeController = New HomeController()

        ' 操作
        Dim result As ViewResult = CType(controller.About(), ViewResult)

        ' 断言
        Assert.IsNotNull(result)
    End Sub
End Class
