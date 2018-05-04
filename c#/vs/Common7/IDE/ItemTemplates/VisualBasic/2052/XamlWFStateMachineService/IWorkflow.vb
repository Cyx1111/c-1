Imports System.ServiceModel

' 注意: 使用上下文菜单上的“重命名”命令可以同时更改代码和配置文件中的接口名“$safeitemrootname$”。
<ServiceContract()> _
Public Interface $safeitemrootname$

    <OperationContract()> _
    Function GetData(ByVal value As Integer) As String

End Interface
