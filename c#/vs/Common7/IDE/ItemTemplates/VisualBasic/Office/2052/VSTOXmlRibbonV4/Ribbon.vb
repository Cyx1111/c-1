'TODO: 按照以下步骤启用功能区(XML)项:

'1. 将以下代码块复制到 ThisAddin、ThisWorkbook 或 ThisDocument 类中。

$VSTOXmlCodeExcerptVisualBasic$

'2. 在此类的“功能区回调”区域中创建回调方法，以处理用户
'   操作(例如单击按钮)。注意: 如果已经从功能区设计器中导出此功能区，
'   请将代码从事件处理程序移动到回调方法，并
'   修改该代码以使用功能区扩展性(RibbonX)编程模型。

'3. 向功能区 XML 文件中的控制标记分配特性，以标识代码中的相应回调方法。

'有关详细信息，请参见 Visual Studio Tools for Office 帮助中的功能区 XML 文档。

<Runtime.InteropServices.ComVisible(True)> _
    Public Class $safeitemrootname$
    Implements Office.IRibbonExtensibility

    Private ribbon As Office.IRibbonUI

    Public Sub New()
    End Sub

    Public Function GetCustomUI(ByVal ribbonID As String) As String Implements Office.IRibbonExtensibility.GetCustomUI
        Return GetResourceText("$rootnamespace$.$itemrootname$.xml")
    End Function

#Region "功能区回调"
    '在此创建回调方法。有关添加回调方法的详细信息，请在解决方案资源管理器中选择功能区 XML 项，然后按 F1。
    Public Sub Ribbon_Load(ByVal ribbonUI As Office.IRibbonUI)
        Me.ribbon = ribbonUI
    End Sub



#End Region

#Region "帮助器"

    Private Shared Function GetResourceText(ByVal resourceName As String) As String
        Dim asm As Reflection.Assembly = Reflection.Assembly.GetExecutingAssembly()
        Dim resourceNames() As String = asm.GetManifestResourceNames()
        For i As Integer = 0 To resourceNames.Length - 1
            If String.Compare(resourceName, resourceNames(i), StringComparison.OrdinalIgnoreCase) = 0 Then
                Using resourceReader As IO.StreamReader = New IO.StreamReader(asm.GetManifestResourceStream(resourceNames(i)))
                    If resourceReader IsNot Nothing Then
                        Return resourceReader.ReadToEnd()
                    End If
                End Using
            End If
        Next
        Return Nothing
    End Function

#End Region

End Class
