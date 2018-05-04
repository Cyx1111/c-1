' “文件打开选取器合同”项模板在 http://go.microsoft.com/fwlink/?LinkId=234239 上提供

$wizardcomment$''' <summary>
''' 此页显示该应用程序拥有的文件，以便用户可以授权其他应用程序
''' 访问这些文件。
''' </summary>
Public NotInheritable Class $safeitemname$
    Inherits Common.LayoutAwarePage

    ''' <summary>
    ''' 在 Windows UI 中添加或移除文件以让 Windows 知道已选定的内容。
    ''' </summary>
    Private _fileOpenPickerUI As Windows.Storage.Pickers.Provider.FileOpenPickerUI

    ''' <summary>
    ''' 在其他应用程序想要打开此应用程序中的文件时进行调用。
    ''' </summary>
    ''' <param name="args">用于与 Windows 协调进程的激活数据。</param>
    Public Sub Activate(args As FileOpenPickerActivatedEventArgs)
        Me._fileOpenPickerUI = args.FileOpenPickerUI
        AddHandler CType(Me._fileOpenPickerUI, Windows.Storage.Pickers.Provider.FileOpenPickerUI).FileRemoved, AddressOf Me.FilePickerUI_FileRemoved

        ' TODO: 设置 Me.DefaultViewModel("Files") 以显示一个项集合，
        '       其中的每个项都应有可绑定的 Image、Title 和 Description

        Me.DefaultViewModel("CanGoUp") = False
        Window.Current.Content = Me
        Window.Current.Activate()
    End Sub

    ''' <summary>
    ''' 当用户从选取器框中移除某一项目时调用
    ''' </summary>
    ''' <param name="sender">用于包含可用文件的 FileOpenPickerUI 实例。</param>
    ''' <param name="args">描述已移除文件的事件数据。</param>
    Private Sub FilePickerUI_FileRemoved(sender As Windows.Storage.Pickers.Provider.FileOpenPickerUI, args As Windows.Storage.Pickers.Provider.FileRemovedEventArgs)
        ' TODO: 响应在选取器 UI 中取消选择的项。
    End Sub

    ''' <summary>
    ''' 在选定的文件集合发生更改时进行调用。
    ''' </summary>
    ''' <param name="sender">用于显示可用文件的 GridView 实例。</param>
    ''' <param name="e">描述选择内容如何发生更改的事件数据。</param>
    Private Sub FileGridView_SelectionChanged(sender As Object, e As SelectionChangedEventArgs)

        ' TODO: 使用 Me._fileOpenPickerUI.AddFile 和 Me._fileOpenPickerUI.RemoveFile
        '       更新 Windows UI

    End Sub

    ''' <summary>
    ''' 在单击“转到上级”按钮时进行调用，并指示用户希望在文件
    ''' 的层次结构中提升一个级别。
    ''' </summary>
    ''' <param name="sender">用于表示“Go up”命令的 Button 实例。</param>
    '''  <param name="args">描述按钮点击方式的事件数据。</param>
    Private Sub GoUpButton_Click(sender As Object, args As RoutedEventArgs)

        ' TODO: 将 Me.DefaultViewModel("CanGoUp") 设置为 true 以启用对应的命令，
        '       使用 Me.DefaultViewModel("Files") 的更新以反映文件层次结构遍历

    End Sub

End Class
