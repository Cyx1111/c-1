Namespace Common

    ''' <summary>
    ''' SuspensionManager 捕获全局会话状态以简化应用程序的
    ''' 进程生命期管理。请注意会话状态在许多条件下将自动清除，
    ''' 因此应该只用于存储方便
    ''' 在会话之间传递，但在应用程序崩溃时应放弃
    ''' 已升级。
    ''' </summary>
    Friend NotInheritable Class SuspensionManager

        Private Shared _sessionState As New Dictionary(Of String, Object)()
        Private Shared _knownTypes As New List(Of Type)()
        Private Const sessionStateFilename As String  = "_sessionState.xml"

        ''' <summary>
        ''' 提供对当前会话的全局会话状态的访问。此状态
        ''' 由 <see cref="SaveAsync"/> 序列化并由
        ''' <see cref="RestoreAsync"/> 还原，因此这些值必须可由
        ''' <see cref="Runtime.Serialization.DataContractSerializer"/>且应尽可能紧凑。
        ''' 强烈建议使用字符串和其他自包含数据类型。
        ''' </summary>
        Public Shared ReadOnly Property SessionState As Dictionary(Of String, Object)
            Get
                Return _sessionState
            End Get
        End Property

        ''' <summary>
        ''' 读取和写入会话状态时向 <see cref="Runtime.Serialization.DataContractSerializer"/>
        ''' 提供的自定义类型列表。最初为空，可能为添加其他类型
        ''' 添加其他类型以自定义序列化进程。
        ''' </summary>
        Public Shared ReadOnly Property KnownTypes As List(Of Type)
            Get
                Return _knownTypes
            End Get
        End Property

        ''' <summary>
        ''' 保存当前 <see cref="SessionState"/>。任何 <see cref="Frame"/> 实例
        ''' (已向 <see cref="RegisterFrame"/> 注册)都还将保留其当前的
        ''' 导航堆栈，从而使其活动 <see cref="Page"/> 可以
        ''' 保存其状态。
        ''' </summary>
        ''' <returns>反映会话状态保存时间的异步任务。</returns>
        Public Shared Async Function SaveAsync() As Task
            Try

                ' 保存所有已注册框架的导航状态
                For Each weakFrameReference As WeakReference(Of Frame) In _registeredFrames
                    Dim frame As Frame = Nothing
                    If weakFrameReference.TryGetTarget(frame) Then
                        SaveFrameNavigationState(frame)
                    End If
                Next

                ' 以同步方式序列化会话状态以避免对共享
                ' 状态
                Dim sessionData As New MemoryStream()
                Dim serializer As New Runtime.Serialization.DataContractSerializer(GetType(Dictionary(Of String, Object)), _knownTypes)
                serializer.WriteObject(sessionData, _sessionState)

                ' 获取 SessionState 文件的输出流并以异步方式写入状态
                Dim file As Windows.Storage.StorageFile = Await Windows.Storage.ApplicationData.Current.LocalFolder.CreateFileAsync(
                    sessionStateFilename, Windows.Storage.CreationCollisionOption.ReplaceExisting)
                Using fileStream As Stream = Await file.OpenStreamForWriteAsync()
                    sessionData.Seek(0, SeekOrigin.Begin)
                    Await sessionData.CopyToAsync(fileStream)
                    Await fileStream.FlushAsync()
                End Using
            Catch ex As Exception
                Throw New SuspensionManagerException(ex)
            End Try
        End Function

        ''' <summary>
        ''' 还原之前保存的 <see cref="SessionState"/>。任何 <see cref="Frame"/> 实例
        ''' (已向 <see cref="RegisterFrame"/> 注册)都还将还原其先前的导航
        ''' 状态，从而使其活动 <see cref="Page"/> 可以还原其
        ''' 状态。
        ''' </summary>
        ''' <returns>反映何时读取会话状态的异步任务。
        ''' 在此任务完成之前，不应依赖 <see cref="SessionState"/>
        ''' 完成。</returns>
        Public Shared Async Function RestoreAsync() As Task
            _sessionState = New Dictionary(Of String, Object)()

            Try

                ' 获取 SessionState 文件的输入流
                Dim file As Windows.Storage.StorageFile = Await Windows.Storage.ApplicationData.Current.LocalFolder.GetFileAsync(sessionStateFilename)
                If file Is Nothing Then Return

                Using inStream As Windows.Storage.Streams.IInputStream = Await file.OpenSequentialReadAsync()

                    ' 反序列化会话状态
                    Dim serializer As New Runtime.Serialization.DataContractSerializer(GetType(Dictionary(Of String, Object)), _knownTypes)
                    _sessionState = DirectCast(serializer.ReadObject(inStream.AsStreamForRead()), Dictionary(Of String, Object))
                End Using

                ' 将任何已注册框架还原为其已保存状态
                For Each weakFrameReference As WeakReference(Of Frame) In _registeredFrames
                    Dim frame As Frame = Nothing
                    If weakFrameReference.TryGetTarget(frame) Then
                        frame.ClearValue(FrameSessionStateProperty)
                        RestoreFrameNavigationState(frame)
                    End If
                Next
            Catch ex As Exception
                Throw New SuspensionManagerException(ex)
            End Try
        End Function

        Private Shared FrameSessionStateKeyProperty As DependencyProperty =
            DependencyProperty.RegisterAttached("_FrameSessionStateKey", GetType(String), GetType(SuspensionManager), Nothing)
        Private Shared FrameSessionStateProperty As DependencyProperty =
            DependencyProperty.RegisterAttached("_FrameSessionState", GetType(Dictionary(Of String, Object)), GetType(SuspensionManager), Nothing)
        Private Shared _registeredFrames As New List(Of WeakReference(Of Frame))()

        ''' <summary>
        ''' 注册 <see cref="Frame"/> 实例以允许将其导航历史记录保存到
        ''' <see cref="SessionState"/> 并从中还原。如果框架将参与会话状态管理，
        ''' 则应在创建框架后立即注册。在
        ''' 注册时，如果已还原指定键的状态，
        ''' 则将立即还原导航历史记录。
        ''' <see cref="RestoreAsync"/> 还将还原导航历史记录。
        ''' </summary>
        ''' <param name="frame">其导航历史记录应由
        ''' <see cref="SuspensionManager"/></param>
        ''' <param name="sessionStateKey"><see cref="SessionState"/> 的唯一键，用于
        ''' 存储与导航相关的信息。</param>
        Public Shared Sub RegisterFrame(frame As Frame, sessionStateKey As String)
            If frame.GetValue(FrameSessionStateKeyProperty) IsNot Nothing Then
                Throw New InvalidOperationException("Frames can only be registered to one session state key")
            End If

            If frame.GetValue(FrameSessionStateProperty) IsNot Nothing Then
                Throw New InvalidOperationException("Frames must be either be registered before accessing frame session state, or not registered at all")
            End If

            ' 使用依赖项属性可会话键与框架相关联，并记录其
            ' 导航状态应托管的框架
            frame.SetValue(FrameSessionStateKeyProperty, sessionStateKey)
            _registeredFrames.Add(New WeakReference(Of Frame)(frame))

            ' 查看导航状态是否可还原
            RestoreFrameNavigationState(frame)
        End Sub

        ''' <summary>
        ''' 解除之前由 <see cref="RegisterFrame"/> 注册的 <see cref="Frame"/>
        ''' 与 <see cref="SessionState"/> 的关联。之前捕获的任何导航状态都将
        ''' 已移除。
        ''' </summary>
        ''' <param name="frame">其导航历史记录不应再
        ''' 托管。</param>
        Public Shared Sub UnregisterFrame(frame As Frame)

            ' 移除会话状态并移除框架列表中其导航
            ' 状态将被保存的框架(以及无法再访问的任何弱引用)
            SessionState.Remove(DirectCast(frame.GetValue(FrameSessionStateKeyProperty), String))
            _registeredFrames.RemoveAll(Function(weakFrameReference)
                                            Dim testFrame As Frame = Nothing
                                            Return Not weakFrameReference.TryGetTarget(testFrame) OrElse testFrame Is frame
                                        End Function)
        End Sub

        ''' <summary>
        ''' 为与指定的 <see cref="Frame"/> 相关联的会话状态提供存储。
        ''' 之前已向 <see cref="RegisterFrame"/> 注册的框架已自动
        ''' 保存其会话状态且还原为全局
        ''' <see cref="SessionState"/> 的一部分。未注册的框架具有
        ''' 在还原已从导航缓存中丢弃的页面时仍然有用的
        ''' 导航缓存。
        ''' </summary>
        ''' <remarks>应用程序可能会选择依赖 <see cref="LayoutAwarePage"/> 管理
        ''' 特定于页面的状态，而非直接使用框架会话状态。</remarks>
        ''' <param name="frame">需要会话状态的实例。</param>
        ''' <returns>状态集合受限于与
        ''' <see cref="SessionState"/>。</returns>
        Public Shared Function SessionStateForFrame(frame As Frame) As Dictionary(Of String, Object)
            Dim frameState As Dictionary(Of String, Object) = DirectCast(frame.GetValue(FrameSessionStateProperty), Dictionary(Of String, Object))

            If frameState Is Nothing Then
                Dim frameSessionKey As String = DirectCast(frame.GetValue(FrameSessionStateKeyProperty), String)
                If frameSessionKey IsNot Nothing Then
                    If Not _sessionState.ContainsKey(frameSessionKey) Then

                        ' 已注册框架反映相应的会话状态
                        _sessionState(frameSessionKey) = New Dictionary(Of String, Object)()
                    End If
                    frameState = DirectCast(_sessionState(frameSessionKey), Dictionary(Of String, Object))
                Else

                    ' 未注册框架具有瞬时状态
                    frameState = New Dictionary(Of String, Object)()
                End If
                frame.SetValue(FrameSessionStateProperty, frameState)
            End If
            Return frameState
        End Function

        Private Shared Sub RestoreFrameNavigationState(frame As Frame)
            Dim frameState As Dictionary(Of String, Object) = SessionStateForFrame(frame)
            If frameState.ContainsKey("Navigation") Then
                frame.SetNavigationState(DirectCast(frameState("Navigation"), String))
            End If
        End Sub

        Private Shared Sub SaveFrameNavigationState(frame As Frame)
            Dim frameState As Dictionary(Of String, Object) = SessionStateForFrame(frame)
            frameState("Navigation") = frame.GetNavigationState()
        End Sub

    End Class
    Public Class SuspensionManagerException
        Inherits Exception
        Public Sub New()
        End Sub

        Public Sub New(ByRef e As Exception)
            MyBase.New("SuspensionManager failed", e)
        End Sub
    End Class
End Namespace
