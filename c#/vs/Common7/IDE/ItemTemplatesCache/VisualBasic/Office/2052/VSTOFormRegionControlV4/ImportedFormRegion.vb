Public Class $safeitemrootname$

#Region "窗体区域工厂"

$formregionattributes$    Partial Public Class $safeitemrootname$Factory

    Private Sub InitializeManifest()
            Dim resources As System.Resources.ResourceManager = New System.Resources.ResourceManager(GetType($safeitemrootname$))
$manifestinitialization$
    End Sub

    ' 在初始化窗体区域之前发生。
    ' 若要阻止窗体区域出现，请将 e.Cancel 设置为 True。
    ' 使用 e.OutlookItem 获取对当前 Outlook 项的引用。
        Private Sub $safeitemrootname$Factory_FormRegionInitializing(ByVal sender As Object, ByVal e As Microsoft.Office.Tools.Outlook.FormRegionInitializingEventArgs) Handles Me.FormRegionInitializing

    End Sub

    End Class

#End Region

    ' 在显示窗体区域之前发生。
    ' 使用 Me.OutlookItem 获取对当前 Outlook 项的引用。
    ' 使用 Me.OutlookFormRegion 获取对窗体区域的引用。
    Private Sub $safeitemrootname$_FormRegionShowing(ByVal sender As Object, ByVal e As System.EventArgs) Handles MyBase.FormRegionShowing

    End Sub

    ' 在关闭窗体区域时发生。
    ' 使用 Me.OutlookItem 获取对当前 Outlook 项的引用。
    ' 使用 Me.OutlookFormRegion 获取对窗体区域的引用。
    Private Sub $safeitemrootname$_FormRegionClosed(ByVal sender As Object, ByVal e As System.EventArgs) Handles MyBase.FormRegionClosed

    End Sub

End Class
