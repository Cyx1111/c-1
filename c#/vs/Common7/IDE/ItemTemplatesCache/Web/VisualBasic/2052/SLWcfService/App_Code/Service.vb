Imports System.ServiceModel
Imports System.ServiceModel.Activation

<ServiceContract(Namespace:="")>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
<AspNetCompatibilityRequirements(RequirementsMode:=AspNetCompatibilityRequirementsMode.Allowed)>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
Public Class $safeitemrootname$

    <OperationContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
    Public Sub DoWork()
        ' 在此处添加操作实现
    End Sub

    ' 在此处添加更多操作，并为它们添加标记 <OperationContract()>

End Class
