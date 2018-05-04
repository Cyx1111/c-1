<ComClass($safeitemname$.ClassId, $safeitemname$.InterfaceId, $safeitemname$.EventsId)> _
Public Class $safeitemname$

#Region "COM GUID"
    ' 这些 GUID 提供此类的 COM 标识 
    ' 及其 COM 接口。若更改它们，则现有的
    ' 客户端将不再能访问此类。
    Public Const ClassId As String = "$guid1$"
    Public Const InterfaceId As String = "$guid2$"
    Public Const EventsId As String = "$guid3$"
#End Region

    ' 可创建的 COM 类必须具有一个不带参数的 Public Sub New() 
    ' 否则， 将不会在 
    ' COM 注册表中注册此类，且无法通过
    ' CreateObject 创建此类。
    Public Sub New()
        MyBase.New()
    End Sub

End Class


