' $safeitemname$
Imports System.EnterpriseServices
Imports System

' “Transaction”特性使类可识别事务。您的类可将对象的事务性类型设置为
' 下列类型之一: 
' 
' Required
' Required New
' Supported
' Not Supported
' Disabled

<Transaction(TransactionOption.Supported)> _
Public Class $safeitemname$
    Inherits ServicedComponent

    ' 在此处实现类的方法。
    '
    ' 事务性组件使用 ContextUtil 对象通知调用方是否
    ' 成功完成。若事务可成功完成，则方法将设置 
    ' ContextUtil.SetComplete。若事务无法成功完成，则方法将设置
    ' ContextUtil.SetAbort。
    '
    ' Public Sub MySub()
    '    Try
    '        ' 代码在此处执行事务性任务。
    '        ' 没有错误。用 SetComplete 声明此事务可完成 
    '        ContextUtil.SetComplete()
    '    Catch ex As Exception
    '        ' 处理此事务时引发异常。  
    '        ' 此事务无法完成，调用 SetAbort。
    '        contextutil.SetAbort()
    '    End Try
    ' End Sub

    ' 事务性类的方法可以不显式地设置 ContextUtil 状态，
    ' 改而使用 AutoComplete 特性。若方法成功返回，将调用 SetComplete。
    ' 若方法引发异常，将调用 SetAbort。
    ' 
    ' <AutoComplete()> Public Sub MyMethod()
    ' End Sub

End Class
