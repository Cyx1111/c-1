' 注意: 使用上下文菜单上的“重命名”命令可以同时更改代码和配置文件中的接口名“IWorkflow1”。
<ServiceContract()> _
Public Interface IWorkflow1

    <OperationContract()> _
    Function GetData(ByVal value As Integer) As String

    ' TODO: 在此添加您的服务操作

End Interface
