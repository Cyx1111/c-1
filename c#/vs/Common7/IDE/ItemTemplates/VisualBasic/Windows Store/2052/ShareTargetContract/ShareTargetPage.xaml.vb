' “共享目标合同”项模板在 http://go.microsoft.com/fwlink/?LinkId=234241 上提供

$wizardcomment$''' <summary>
''' 此页允许其他应用程序共享此应用程序中的内容。
''' </summary>
Public NotInheritable Class $safeitemname$
    Inherits Common.LayoutAwarePage

    ''' <summary>
    ''' 提供与 Windows 就共享操作进行沟通的渠道。
    ''' </summary>
    Private _shareOperation As Windows.ApplicationModel.DataTransfer.ShareTarget.ShareOperation

    ''' <summary>
    ''' 在其他应用程序想要共享此应用程序中的内容时进行调用。
    ''' </summary>
    ''' <param name="args">用于与 Windows 协调进程的激活数据。</param>
    Public Async Sub Activate(args As ShareTargetActivatedEventArgs)
        Me._shareOperation = args.ShareOperation

        ' 通过视图模型沟通关于共享内容的元数据
        Dim shareProperties As Windows.ApplicationModel.DataTransfer.DataPackagePropertySetView = Me._shareOperation.Data.Properties
        Dim thumbnailImage As New BitmapImage()
        Me.DefaultViewModel("Title") = shareProperties.Title
        Me.DefaultViewModel("Description") = shareProperties.Description
        Me.DefaultViewModel("Image") = thumbnailImage
        Me.DefaultViewModel("Sharing") = False
        Me.DefaultViewModel("ShowImage") = False
        Me.DefaultViewModel("Comment") = String.Empty
        Me.DefaultViewModel("SupportsComment") = True
        Window.Current.Content = Me
        Window.Current.Activate()

        ' 在后台更新共享内容的缩略图
        If shareProperties.Thumbnail IsNot Nothing
            Dim stream As Windows.Storage.Streams.IRandomAccessStreamWithContentType = Await shareProperties.Thumbnail.OpenReadAsync()
            thumbnailImage.SetSource(stream)
            Me.DefaultViewModel("ShowImage") = True
        End If
    End Sub

    ''' <summary>
    ''' 在用户单击“共享”按钮时进行调用。
    ''' </summary>
    ''' <param name="sender">用于启动共享的 Button 实例。</param>
    ''' <param name="e">描述如何单击按钮的事件数据。</param>
    Private Sub ShareButton_Click(sender As Object, e As RoutedEventArgs)
        Me.DefaultViewModel("Sharing") = True
        Me._shareOperation.ReportStarted()

        ' TODO: 使用 Me._shareOperation.Data 执行适合您的共享方案的工作。
        '       通常通过添加到此页的自定义用户界面元素
        '       添加到此页的元素，例如 Me.DefaultViewModel("Comment")

        Me._shareOperation.ReportCompleted()
    End Sub

End Class
