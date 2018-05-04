Namespace Common

    ''' <summary>
    ''' 用于简化模型的 <see cref="INotifyPropertyChanged"/> 实现。
    ''' </summary>
    <Windows.Foundation.Metadata.WebHostHidden>
    Public MustInherit Class BindableBase
        Implements INotifyPropertyChanged

        ''' <summary>
        ''' 针对属性更改通知的多播事件。
        ''' </summary>
        Public Event PropertyChanged As PropertyChangedEventHandler Implements INotifyPropertyChanged.PropertyChanged

        ''' <summary>
        ''' 检查属性是否已与所需值匹配。仅当需要时才设置
        ''' 该属性并通知侦听器。
        ''' </summary>
        ''' <typeparam name="T">属性的类型。</typeparam>
        ''' <param name="storage">对具有 getter 和 setter 的属性的引用。</param>
        ''' <param name="value">属性的所需值。</param>
        ''' <param name="propertyName">用于通知侦听器的属性的名称。此值
        ''' 是可选的，可以在从支持 CallerMemberName 的编译器调用时
        ''' 自动提供。</param>
        ''' <returns>如果更改了值，则为 true，如果现有值与所需值匹配，
        ''' 则为 false。</returns>
        Protected Function SetProperty(Of T)(ByRef storage As T, value As T,
                                        <CallerMemberName> Optional propertyName As String = Nothing) As Boolean

            If Object.Equals(storage, value) Then Return False

            storage = value
            Me.OnPropertyChanged(propertyName)
            Return True
        End Function

        ''' <summary>
        ''' 向侦听器通知已更改了某个属性值。
        ''' </summary>
        ''' <param name="propertyName">用于通知侦听器的属性的名称。此值
        ''' 是可选的，可以在从支持 CallerMemberName 的编译器调用时
        ''' <see cref="CallerMemberNameAttribute"/>。</param>
        Protected Sub OnPropertyChanged(<CallerMemberName> Optional propertyName As String = Nothing)
            RaiseEvent PropertyChanged(Me, New PropertyChangedEventArgs(propertyName))
        End Sub

    End Class

End Namespace
