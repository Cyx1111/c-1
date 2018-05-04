Public Class CustomControl1
    Inherits Control

    Shared Sub New()
        '此 OverrideMetadata 调用通知系统该元素希望提供不同于其基类的样式。
        '此样式在 Themes\Generic.xaml 中定义
        DefaultStyleKeyProperty.OverrideMetadata(GetType(CustomControl1), New FrameworkPropertyMetadata(GetType(CustomControl1)))
    End Sub

End Class
