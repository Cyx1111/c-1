Imports System
Imports System.Collections.Generic
Imports System.Text
Imports System.Web.Mvc
Imports Microsoft.VisualStudio.TestTools.UnitTesting
Imports $mvcprojectnamespace$

<TestClass()> Public Class HomeControllerTest

    <TestMethod()> Public Sub Index()
        ' 排列
        Dim controller As New HomeController()

        ' 操作
        Dim result As ViewResult = DirectCast(controller.Index(), ViewResult)

        ' 断言
        Dim viewData As ViewDataDictionary = result.ViewData
        Assert.AreEqual("修改此模板以快速启动你的 ASP.NET MVC 应用程序。", viewData("Message"))
    End Sub

    <TestMethod()> Public Sub About()
        ' 排列
        Dim controller As New HomeController()

        ' 操作
        Dim result As ViewResult = DirectCast(controller.About(), ViewResult)

        ' 断言
        Assert.IsNotNull(result)
    End Sub

    <TestMethod()> Public Sub Contact()
        ' 排列
        Dim controller As New HomeController()

        ' 操作
        Dim result As ViewResult = DirectCast(controller.Contact(), ViewResult)

        ' 断言
        Assert.IsNotNull(result)
    End Sub
End Class
