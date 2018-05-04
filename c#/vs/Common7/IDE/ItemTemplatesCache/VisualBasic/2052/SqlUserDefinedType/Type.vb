Imports System
Imports System.Data
Imports System.Data.SqlClient
Imports System.Data.SqlTypes
Imports Microsoft.SqlServer.Server

<Serializable()> _
<Microsoft.SqlServer.Server.SqlUserDefinedType(Format.Native)> _
Public Structure $safeitemname$
    Implements INullable

    Public Overrides Function ToString() As String
        ' 在此处放置代码
        Return ""
    End Function

    Public ReadOnly Property IsNull() As Boolean Implements INullable.IsNull
        Get
            ' 在此处放置代码
            Return m_Null
        End Get
    End Property

    Public Shared ReadOnly Property Null As $safeitemname$
        Get
            Dim h As $safeitemname$ = New $safeitemname$
            h.m_Null = True
            Return h
        End Get
    End Property

    Public Shared Function Parse(ByVal s As SqlString) As $safeitemname$
        If s.IsNull Then
            Return Null
        End If

        Dim u As $safeitemname$ = New $safeitemname$
        ' 在此处放置代码
        Return u
    End Function

    ' 这是占位符方法
    Public Function Method1() As String
        ' 在此处放置代码
        Return "$IT_UDT_VB_Loc_1$"
    End Function

    ' 这是占位符静态方法
    Public Shared Function Method2() As SqlString
        ' 在此处放置代码
        Return New SqlString("$IT_UDT_VB_Loc_1$")
    End Function

    ' 这是占位符字段成员
    Public m_var1 As Integer
    ' 私有成员
    Private m_Null As Boolean
End Structure

