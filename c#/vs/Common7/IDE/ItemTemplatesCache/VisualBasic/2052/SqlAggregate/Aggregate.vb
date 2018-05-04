Imports System
Imports System.Data
Imports System.Data.SqlClient
Imports System.Data.SqlTypes
Imports Microsoft.SqlServer.Server


<Serializable()> _
<Microsoft.SqlServer.Server.SqlUserDefinedAggregate(Format.Native)> _
Public Structure $safeitemname$

    Public Sub Init()
        ' 在此处放置代码
    End Sub

    Public Sub Accumulate(ByVal value As SqlString)
        ' 在此处放置代码
    End Sub

    Public Sub Merge(ByVal value as $safeitemname$)
        ' 在此处放置代码
    End Sub

    Public Function Terminate() As SqlString
        ' 在此处放置代码
        Return New SqlString("")
    End Function

    ' 这是占位符字段成员
    Private var1 As Integer

End Structure

