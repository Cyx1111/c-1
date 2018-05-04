Imports System
Imports System.Data
Imports System.Data.SqlClient
Imports System.Data.SqlTypes
Imports Microsoft.SqlServer.Server


Partial Public Class Triggers
    ' 为目标输入现有表或视图并取消对特性行的注释
    ' <Microsoft.SqlServer.Server.SqlTrigger(Name:="$safeitemname$", Target:="Table1", Event:="FOR UPDATE")> _
    Public Shared Sub  $safeitemname$ ()
        ' 用您的代码替换
        SqlContext.Pipe.Send("Trigger FIRED")
    End Sub
End Class
