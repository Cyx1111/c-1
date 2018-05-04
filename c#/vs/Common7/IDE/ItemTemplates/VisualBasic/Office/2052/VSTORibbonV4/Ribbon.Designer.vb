Partial Class $safeitemrootname$
    Inherits Microsoft.Office.Tools.Ribbon.RibbonBase

    <System.Diagnostics.DebuggerNonUserCode()> _
   Public Sub New(ByVal container As System.ComponentModel.IContainer)
        MyClass.New()

        'Windows.Forms 类撰写设计器支持所必需的
        If (container IsNot Nothing) Then
            container.Add(Me)
        End If

    End Sub

    <System.Diagnostics.DebuggerNonUserCode()> _
    Public Sub New()
        MyBase.New(Globals.Factory.GetRibbonFactory())

        '组件设计器需要此调用。
        InitializeComponent()

    End Sub

    '组件重写释放以清理组件列表。
    <System.Diagnostics.DebuggerNonUserCode()> _
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        Try
            If disposing AndAlso components IsNot Nothing Then
                components.Dispose()
            End If
        Finally
            MyBase.Dispose(disposing)
        End Try
    End Sub

    '组件设计器所必需的
    Private components As System.ComponentModel.IContainer

    '注意: 以下过程是组件设计器所必需的
    '可使用组件设计器修改它。
    '不要使用代码编辑器修改它。
    <System.Diagnostics.DebuggerStepThrough()> _
    Private Sub InitializeComponent()
        Me.Tab1 = Factory.CreateRibbonTab()
        Me.Group1 = Factory.CreateRibbonGroup()
        Me.Tab1.SuspendLayout()
        Me.Group1.SuspendLayout()
        Me.SuspendLayout()
        '
        'Tab1
        '
        Me.Tab1.Name = "Tab1"
        Me.tab1.ControlId.ControlIdType = Microsoft.Office.Tools.Ribbon.RibbonControlIdType.Office
        Me.tab1.ControlId.OfficeId = "TabAddIns"
        Me.Tab1.Groups.Add(Me.Group1)
        '
        'Group1
        '
        Me.Group1.Label = "Group1"
        Me.Group1.Name = "Group1"
        '
        '$safeitemrootname$
        '
        Me.Name = "$safeitemrootname$"
        Me.RibbonType = "$VSTORibbonType$"
        Me.Tabs.Add(Me.Tab1)
        Me.Tab1.ResumeLayout(False)
        Me.Tab1.PerformLayout()
        Me.Group1.ResumeLayout(False)
        Me.Group1.PerformLayout()
        Me.ResumeLayout(False)

    End Sub

    Friend WithEvents Tab1 As Microsoft.Office.Tools.Ribbon.RibbonTab
    Friend WithEvents Group1 As Microsoft.Office.Tools.Ribbon.RibbonGroup
End Class

Partial Class ThisRibbonCollection

    <System.Diagnostics.DebuggerNonUserCode()> _
    Friend ReadOnly Property $safeitemrootname$() As $safeitemrootname$
        Get
            Return Me.GetRibbon(Of $safeitemrootname$)()
        End Get
    End Property
End Class
