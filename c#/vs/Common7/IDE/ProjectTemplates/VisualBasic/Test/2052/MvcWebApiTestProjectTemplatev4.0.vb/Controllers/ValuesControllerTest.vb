Imports System
Imports System.Collections.Generic
Imports System.Net.Http
Imports System.Text
Imports System.Web.Http
Imports Microsoft.VisualStudio.TestTools.UnitTesting
Imports $mvcprojectnamespace$

<TestClass()> Public Class ValuesControllerTest
    <TestMethod()> Public Sub GetValues()
        '排列
        Dim controller As New ValuesController()

        '操作
        Dim result As IEnumerable(Of String) = controller.GetValues()

        '断言
        Assert.IsNotNull(result)
        Assert.AreEqual(2, result.Count())
        Assert.AreEqual("value1", result.ElementAt(0))
        Assert.AreEqual("value2", result.ElementAt(1))
    End Sub

    <TestMethod()> Public Sub GetValueById()
        '排列
        Dim controller As New ValuesController()

        '操作
        Dim result As String = controller.GetValue(5)

        '断言
        Assert.AreEqual("value", result)
    End Sub

    <TestMethod()> Public Sub PostValue()
        '排列
        Dim controller As New ValuesController()

        '操作
        controller.PostValue("value")

        '断言
    End Sub

    <TestMethod()> Public Sub PutValue()
        '排列
        Dim controller As New ValuesController()

        '操作
        controller.PutValue(5, "value")

        '断言
    End Sub

    <TestMethod()> Public Sub DeleteValue()
        '排列
        Dim controller As New ValuesController()

        '操作
        controller.DeleteValue(5)

        '断言
    End Sub
End Class
