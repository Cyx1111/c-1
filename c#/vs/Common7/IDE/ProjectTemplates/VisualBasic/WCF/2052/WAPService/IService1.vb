' 注意: 使用上下文菜单上的“重命名”命令可以同时更改代码和配置文件中的接口名“IService1”。
<ServiceContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
Public Interface IService1

    <OperationContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
    Function GetData(ByVal value As Integer) As String

    <OperationContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
    Function GetDataUsingDataContract(ByVal composite As CompositeType) As CompositeType

    ' TODO: 在此添加您的服务操作

End Interface

' 使用下面示例中说明的数据约定将复合类型添加到服务操作。
$if$ ($targetframeworkversion$ <= 3.5)
<DataContract()> _
Public Class CompositeType

    Private boolValueField As Boolean
    Private stringValueField As String

    <DataMember()> _
    Public Property BoolValue() As Boolean
        Get
            Return Me.boolValueField
        End Get
        Set(ByVal value As Boolean)
            Me.boolValueField = value
        End Set
    End Property

    <DataMember()> _
    Public Property StringValue() As String
        Get
            Return Me.stringValueField
        End Get
        Set(ByVal value As String)
            Me.stringValueField = value
        End Set
    End Property
$else$
<DataContract()>
Public Class CompositeType

    <DataMember()>
    Public Property BoolValue() As Boolean

    <DataMember()>
    Public Property StringValue() As String
$endif$
End Class
