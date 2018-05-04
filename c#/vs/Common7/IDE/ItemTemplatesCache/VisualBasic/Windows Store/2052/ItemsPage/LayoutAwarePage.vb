Namespace Common

    ''' <summary>
    ''' 提供几方面重要便利的 Page 的典型实现:
    ''' <list type="bullet">
    ''' <item>
    ''' <description>应用程序视图状态到可视状态的映射</description>
    ''' </item>
    ''' <item>
    ''' <description>GoBack、GoForward 和 GoHome 事件处理程序</description>
    ''' </item>
    ''' <item>
    ''' <description>用于导航的鼠标和键盘快捷键</description>
    ''' </item>
    ''' <item>
    ''' <description>用于导航和进程生命期管理的状态管理</description>
    ''' </item>
    ''' <item>
    ''' <description>默认视图模型</description>
    ''' </item>
    ''' </list>
    ''' </summary>
    <Windows.Foundation.Metadata.WebHostHidden>
    Public Class LayoutAwarePage
        Inherits Page

        ''' <summary>
        ''' 标识 <see cref="DefaultViewModel"/> 依赖属性。
        ''' </summary>
        Public Shared ReadOnly DefaultViewModelProperty As DependencyProperty =
            DependencyProperty.Register("DefaultViewModel", GetType(IObservableMap(Of String, Object)),
            GetType(LayoutAwarePage), Nothing)

        Private _layoutAwareControls As List(Of Control)

        ''' <summary>
        ''' 当此页是可视化树的一部分时，进行两个更改:
        ''' 1) 将应用程序视图状态映射到页的可视状态
        ''' 2) 处理键盘和鼠标导航请求
        ''' </summary>
        ''' <param name="sender">发起请求的对象。</param>
        ''' <param name="e">描述如何进行请求的事件数据。</param>
        Private Sub OnLoaded(sender As Object, e As RoutedEventArgs) Handles Me.Loaded
            Me.StartLayoutUpdates(sender, e)

            ' 仅当占用整个窗口时，键盘和鼠标导航才适用
            If Me.ActualHeight = Window.Current.Bounds.Height AndAlso
                    Me.ActualWidth = Window.Current.Bounds.Width Then

                ' 直接侦听窗口，因此无需焦点
                AddHandler Window.Current.CoreWindow.Dispatcher.AcceleratorKeyActivated,
                    AddressOf Me.CoreDispatcher_AcceleratorKeyActivated
                AddHandler Window.Current.CoreWindow.PointerPressed,
                    AddressOf Me.CoreWindow_PointerPressed
            End If
        End Sub

        ''' <summary>
        ''' 当页不再可见时，撤消在 <see cref="OnLoaded"/> 中进行的更改。
        ''' </summary>
        ''' <param name="sender">发起请求的对象。</param>
        ''' <param name="e">描述如何进行请求的事件数据。</param>
        Private Sub OnUnloaded(sender As Object, e As RoutedEventArgs) Handles Me.Unloaded
            Me.StopLayoutUpdates(sender, e)
            RemoveHandler Window.Current.CoreWindow.Dispatcher.AcceleratorKeyActivated,
                AddressOf Me.CoreDispatcher_AcceleratorKeyActivated
            RemoveHandler Window.Current.CoreWindow.PointerPressed,
                AddressOf Me.CoreWindow_PointerPressed
        End Sub

        ''' <summary>
        ''' 初始化 <see cref="LayoutAwarePage"/> 类的新实例。
        ''' </summary>
        Public Sub New()
            If Windows.ApplicationModel.DesignMode.DesignModeEnabled Then Return

            ' 创建空默认视图模型
            Me.DefaultViewModel = New ObservableDictionary(Of String, Object)
        End Sub

        ''' <summary>
        ''' <see cref="IObservableMap(Of String, Object)"/> 的实现，该实现旨在
        ''' 用作普通视图模型。
        ''' </summary>
        Protected Property DefaultViewModel As IObservableMap(Of String, Object)
            Get
                Return DirectCast(Me.GetValue(DefaultViewModelProperty), IObservableMap(Of String, Object))
            End Get
            Set(value As IObservableMap(Of String, Object))
                Me.SetValue(DefaultViewModelProperty, value)
            End Set
        End Property

#Region "导航支持"

        ''' <summary>
        ''' 作为事件处理程序进行调用，以向后导航页的关联
        ''' <see cref="Frame"/>，直至它达到导航堆栈顶部。
        ''' </summary>
        ''' <param name="sender">触发事件的实例。</param>
        ''' <param name="e">描述导致事件的条件的事件数据。</param>
        Protected Overridable Sub GoHome(sender As Object, e As RoutedEventArgs)

            ' 使用导航框架返回最顶层的页
            If Me.Frame IsNot Nothing Then
                While Me.Frame.CanGoBack
                    Me.Frame.GoBack()
                End While
            End If
        End Sub

        ''' <summary>
        ''' 作为事件处理程序进行调用，以向后导航与此页的 <see cref="Frame"/>
        ''' 关联的导航堆栈。
        ''' </summary>
        ''' <param name="sender">触发事件的实例。</param>
        ''' <param name="e">描述导致事件的条件的事件数据。</param>
        Protected Overridable Sub GoBack(sender As Object, e As RoutedEventArgs)

            ' 使用导航框架返回上一页
            If Me.Frame IsNot Nothing AndAlso Me.Frame.CanGoBack Then
                Me.Frame.GoBack()
            End If
        End Sub

        ''' <summary>
        ''' 作为事件处理程序进行调用，以向后导航导航堆栈
        ''' 关联的导航堆栈。
        ''' </summary>
        ''' <param name="sender">触发事件的实例。</param>
        ''' <param name="e">描述导致事件的条件的事件数据。</param>
        Protected Overridable Sub GoForward(sender As Object, e As RoutedEventArgs)

            ' 使用导航框架前进至下一页
            If Me.Frame IsNot Nothing AndAlso Me.Frame.CanGoForward Then
                Me.Frame.GoForward()
            End If
        End Sub

        ''' <summary>
        ''' 当此页处于活动状态并占用整个窗口时，在每次
        ''' 击键(包括系统键，如 Alt 组合键)时调用。用于检测页之间的键盘
        ''' 导航(即使在页本身没有焦点时)。
        ''' </summary>
        ''' <param name="sender">触发事件的实例。</param>
        ''' <param name="args">描述导致事件的条件的事件数据。</param>
        Private Sub CoreDispatcher_AcceleratorKeyActivated(sender As Windows.UI.Core.CoreDispatcher,
                                                           args As Windows.UI.Core.AcceleratorKeyEventArgs)
            Dim virtualKey As Windows.System.VirtualKey = args.VirtualKey

            ' 仅当按向左、向右或专用上一页或下一页键时才进一步
            ' 调查
            If (args.EventType = Windows.UI.Core.CoreAcceleratorKeyEventType.SystemKeyDown OrElse
                args.EventType = Windows.UI.Core.CoreAcceleratorKeyEventType.KeyDown) AndAlso
                (virtualKey = Windows.System.VirtualKey.Left OrElse
                virtualKey = Windows.System.VirtualKey.Right OrElse
                virtualKey = 166 OrElse
                virtualKey = 167) Then

                ' 确定按下了哪些修改键
                Dim coreWindow As Windows.UI.Core.CoreWindow = Window.Current.CoreWindow
                Dim downState As Windows.UI.Core.CoreVirtualKeyStates = Windows.UI.Core.CoreVirtualKeyStates.Down
                Dim menuKey As Boolean = (coreWindow.GetKeyState(Windows.System.VirtualKey.Menu) And downState) = downState
                Dim controlKey As Boolean = (coreWindow.GetKeyState(Windows.System.VirtualKey.Control) And downState) = downState
                Dim shiftKey As Boolean = (coreWindow.GetKeyState(Windows.System.VirtualKey.Shift) And downState) = downState
                Dim noModifiers As Boolean = Not menuKey AndAlso Not controlKey AndAlso Not shiftKey
                Dim onlyAlt As Boolean = menuKey AndAlso Not controlKey AndAlso Not shiftKey

                If (virtualKey = 166 AndAlso noModifiers) OrElse
                    (virtualKey = Windows.System.VirtualKey.Left AndAlso onlyAlt) Then

                    ' 在按上一页键或 Alt+向左键时向后导航
                    args.Handled = True
                    Me.GoBack(Me, New RoutedEventArgs())
                ElseIf (virtualKey = 167 AndAlso noModifiers) OrElse
                    (virtualKey = Windows.System.VirtualKey.Right AndAlso onlyAlt) Then

                    ' 在按下一页键或 Alt+向右键时向前导航
                    args.Handled = True
                    Me.GoForward(Me, New RoutedEventArgs())
                End If
            End If
        End Sub

        ''' <summary>
        ''' 当此页处于活动状态并占用整个窗口时，在每次鼠标单击、触摸屏点击
        ''' 或执行等效交互时调用。用于检测浏览器样式下一页和
        ''' 上一步鼠标按钮单击以在页之间导航。
        ''' </summary>
        ''' <param name="sender">触发事件的实例。</param>
        ''' <param name="args">描述导致事件的条件的事件数据。</param>
        Private Sub CoreWindow_PointerPressed(sender As Windows.UI.Core.CoreWindow,
                                              args As Windows.UI.Core.PointerEventArgs)
            Dim properties As Windows.UI.Input.PointerPointProperties = args.CurrentPoint.Properties

            ' 忽略与鼠标左键、右键和中键的键关联
            If properties.IsLeftButtonPressed OrElse properties.IsRightButtonPressed OrElse
                properties.IsMiddleButtonPressed Then Return

            ' 如果按下后退或前进(但不是同时)，则进行相应导航
            Dim backPressed As Boolean = properties.IsXButton1Pressed
            Dim forwardPressed As Boolean = properties.IsXButton2Pressed
            If backPressed Xor forwardPressed Then
                args.Handled = True
                If backPressed Then Me.GoBack(Me, New RoutedEventArgs())
                If forwardPressed Then Me.GoForward(Me, New RoutedEventArgs())
            End If
        End Sub

#End Region

#Region "可视状态切换"

        ''' <summary>
        ''' 作为事件处理程序调用，通常是在页中发生 <see cref="Control"/> 的
        ''' <see cref="Loaded"/> 事件时，以指示发送方应开始接收
        ''' 与应用程序视图状态更改对应的可视状态管理更改。
        ''' </summary>
        ''' <param name="sender">支持与视图状态对应的可视状态
        ''' 管理的 <see cref="Control"/> 实例。</param>
        ''' <param name="e">描述如何进行请求的事件数据。</param>
        ''' <remarks>在请求布局更新时，会立即使用当前视图
        ''' 状态设置对应可视状态。强烈建议使用连接到 <see cref="StopLayoutUpdates"/>
        ''' 强烈建议使用连接到 <see cref="StopLayoutUpdates"/> 的 <see cref="Unloaded"/> 事件
        ''' 处理程序。<see cref="LayoutAwarePage"/> 的实例会自动在
        ''' 其 Loaded 和 Unloaded 事件中调用这些处理程序。</remarks>
        ''' <seealso cref="DetermineVisualState"/>
        ''' <seealso cref="InvalidateVisualState"/>
        Public Sub StartLayoutUpdates(sender As Object, e As RoutedEventArgs)
            If Windows.ApplicationModel.DesignMode.DesignModeEnabled Then Return

            Dim control As Control = TryCast(sender, Control)
            If control Is Nothing Then Return

            If Me._layoutAwareControls Is Nothing Then

                ' 当更新中存在相关控件时，开始侦听视图状态
                ' 更改
                AddHandler Window.Current.SizeChanged, AddressOf Me.WindowSizeChanged
                Me._layoutAwareControls = New List(Of Control)
            End If
            Me._layoutAwareControls.Add(control)

            ' 设置控件的初始可视状态
            VisualStateManager.GoToState(control, DetermineVisualState(ApplicationView.Value), False)
        End Sub

        Private Sub WindowSizeChanged(sender As Object, e As Windows.UI.Core.WindowSizeChangedEventArgs)
            Me.InvalidateVisualState()
        End Sub

        ''' <summary>
        ''' 作为事件处理程序调用，通常是发生 <see cref="Control"/> 的
        ''' <see cref="Unloaded"/> 事件时，以指示发送方应开始接收
        ''' 与应用程序视图状态更改对应的可视状态管理更改。
        ''' </summary>
        ''' <param name="sender">支持与视图状态对应的可视状态
        ''' 管理的 <see cref="Control"/> 实例。</param>
        ''' <param name="e">描述如何进行请求的事件数据。</param>
        ''' <remarks>在请求布局更新时，会立即使用当前视图
        ''' 状态设置对应可视状态。</remarks>
        ''' <seealso cref="StartLayoutUpdates"/>
        Public Sub StopLayoutUpdates(sender As Object, e As RoutedEventArgs)
            If Windows.ApplicationModel.DesignMode.DesignModeEnabled Then Return

            Dim control As Control = TryCast(sender, Control)
            If control Is Nothing OrElse Me._layoutAwareControls Is Nothing Then Return

            Me._layoutAwareControls.Remove(control)
            If Me._layoutAwareControls.Count = 0 Then

                ' 当更新中没有相关控件时，停止侦听视图状态更改
                Me._layoutAwareControls = Nothing
                RemoveHandler Window.Current.SizeChanged, AddressOf Me.WindowSizeChanged
            End If
        End Sub

        ''' <summary>
        ''' 针对页中的可视状态管理将 <see cref="ApplicationViewState"/> 值
        ''' 转换为字符串。默认实现使用枚举值的名称。
        ''' 子类可以重写此方法以控制使用的映射方案。
        ''' </summary>
        ''' <param name="viewState">需要可视状态的视图状态。</param>
        ''' <returns>用于驱动 <see cref="VisualStateManager"/> 的可视状态名称</returns>
        ''' <seealso cref="InvalidateVisualState"/>
        Protected Overridable Function DetermineVisualState(viewState As ApplicationViewState) As String
            Return viewState.ToString()
        End Function

        ''' <summary>
        ''' 使用正确的可视状态更新侦听可视状态更改的
        ''' 所有控件。
        ''' </summary>
        ''' <remarks>
        ''' 通常与重写 <see cref="DetermineVisualState"/> 结合使用以
        '''  通知可能返回了不同值，即使未更改视图状态也是
        ''' 如此。
        ''' </remarks>
        Public Sub InvalidateVisualState()
            If Me._layoutAwareControls IsNot Nothing Then
                Dim visualState As String = DetermineVisualState(ApplicationView.Value)
                For Each layoutAwareControl As Control In Me._layoutAwareControls
                    VisualStateManager.GoToState(layoutAwareControl, visualState, False)
                Next
            End If
        End Sub

#End Region

#Region "进程生命期管理"

        Private _pageKey As String

        ''' <summary>
        ''' 在此页将要在 Frame 中显示时进行调用。
        ''' </summary>
        ''' <param name="e">描述如何访问此页的事件数据。Parameter
        ''' 属性提供要显示的组。</param>
        Protected Overrides Sub OnNavigatedTo(e As Navigation.NavigationEventArgs)

            ' 通过导航返回缓存页不应触发状态加载
            If Me._pageKey IsNot Nothing Then Return

            Dim frameState As Dictionary(Of String, Object) = SuspensionManager.SessionStateForFrame(Me.Frame)
            Me._pageKey = "Page-" & Me.Frame.BackStackDepth

            If e.NavigationMode = Navigation.NavigationMode.New Then

                ' 在向导航堆栈添加新页时清除向前导航的
                ' 现有状态
                Dim nextPageKey As String = Me._pageKey
                Dim nextPageIndex As Integer = Me.Frame.BackStackDepth
                While (frameState.Remove(nextPageKey))
                    nextPageIndex += 1
                    nextPageKey = "Page-" & nextPageIndex
                End While


                ' 将导航参数传递给新页
                Me.LoadState(e.Parameter, Nothing)
            Else

                ' 通过将相同策略用于加载挂起状态并从缓存重新创建
                ' 放弃的页，将导航参数和保留页状态传递
                ' 给页
                Me.LoadState(e.Parameter, DirectCast(frameState(Me._pageKey), Dictionary(Of String, Object)))
            End If
        End Sub

        ''' <summary>
        ''' 当此页不再在 Frame 中显示时调用。
        ''' </summary>
        ''' <param name="e">描述如何访问此页的事件数据。Parameter
        ''' 属性提供要显示的组。</param>
        Protected Overrides Sub OnNavigatedFrom(e As Navigation.NavigationEventArgs)
            Dim frameState As Dictionary(Of String, Object) = SuspensionManager.SessionStateForFrame(Me.Frame)
            Dim pageState As New Dictionary(Of String, Object)()
            Me.SaveState(pageState)
            frameState(_pageKey) = pageState
        End Sub

        ''' <summary>
        ''' 使用在导航过程中传递的内容填充页。在从以前的会话
        ''' 重新创建页时，也会提供任何已保存状态。
        ''' </summary>
        ''' <param name="navigationParameter">最初请求此页时传递给
        ''' <see cref="Frame.Navigate"/> 的参数值。
        ''' </param>
        ''' <param name="pageState">此页在以前会话期间保留的状态
        ''' 字典。首次访问页面时为 null。</param>
        Protected Overridable Sub LoadState(navigationParameter As Object, pageState As Dictionary(Of String, Object))

        End Sub

        ''' <summary>
        ''' 保留与此页关联的状态，以防挂起应用程序或
        ''' 从导航缓存中放弃此页。值必须符合
        ''' <see cref="SuspensionManager.SessionState"/> 的序列化要求。
        ''' </summary>
        ''' <param name="pageState">要使用可序列化状态填充的空字典。</param>
        Protected Overridable Sub SaveState(pageState As Dictionary(Of String, Object))

        End Sub

#End Region

        ''' <summary>
        ''' 支持重新进入以用作默认视图模型的 IObservableMap 的
        ''' 实现。
        ''' </summary>
        Private Class ObservableDictionary(Of K, V)
            Implements IObservableMap(Of K, V)

            Private Class ObservableDictionaryChangedEventArgs
                Implements IMapChangedEventArgs(Of K)

                Private _change As CollectionChange
                Private _key As K

                Public Sub New(change As CollectionChange, key As K)
                    Me._change = change
                    Me._key = key
                End Sub

                ReadOnly Property CollectionChange As CollectionChange Implements IMapChangedEventArgs(Of K).CollectionChange
                    Get
                        Return _change
                    End Get
                End Property

                ReadOnly Property Key As K Implements IMapChangedEventArgs(Of K).Key
                    Get
                        Return _key
                    End Get
                End Property

            End Class

            Public Event MapChanged(sender As IObservableMap(Of K, V), [event] As IMapChangedEventArgs(Of K)) Implements IObservableMap(Of K, V).MapChanged
            Private _dictionary As New Dictionary(Of K, V)()

            Private Sub InvokeMapChanged(change As CollectionChange, key As K)
                RaiseEvent MapChanged(Me, New ObservableDictionaryChangedEventArgs(change, key))
            End Sub

            Public Sub Add(key As K, value As V) Implements IDictionary(Of K, V).Add
                Me._dictionary.Add(key, value)
                Me.InvokeMapChanged(CollectionChange.ItemInserted, key)
            End Sub

            Public Sub AddKeyValuePair(item As KeyValuePair(Of K, V)) Implements ICollection(Of KeyValuePair(Of K, V)).Add
                Me.Add(item.Key, item.Value)
            End Sub

            Public Function Remove(key As K) As Boolean Implements IDictionary(Of K, V).Remove
                If Me._dictionary.Remove(key) Then
                    Me.InvokeMapChanged(CollectionChange.ItemRemoved, key)
                    Return True
                End If
                Return False
            End Function

            Public Function RemoveKeyValuePair(item As KeyValuePair(Of K, V)) As Boolean Implements ICollection(Of KeyValuePair(Of K, V)).Remove
                Dim currentValue As V
                If Me._dictionary.TryGetValue(item.Key, currentValue) AndAlso
                    Object.Equals(item.Value, currentValue) AndAlso Me._dictionary.Remove(item.Key) Then

                    Me.InvokeMapChanged(CollectionChange.ItemRemoved, item.Key)
                    Return True
                End If
                Return False
            End Function

            Default Public Property Item(key As K) As V Implements IDictionary(Of K, V).Item
                Get
                    Return Me._dictionary(key)
                End Get
                Set(value As V)
                    Me._dictionary(key) = value
                    Me.InvokeMapChanged(CollectionChange.ItemChanged, key)
                End Set
            End Property

            Public Sub Clear() Implements ICollection(Of KeyValuePair(Of K, V)).Clear
                Dim priorKeys As K() = Me._dictionary.Keys.ToArray()
                Me._dictionary.Clear()
                For Each key As K In priorKeys
                    Me.InvokeMapChanged(CollectionChange.ItemRemoved, key)
                Next
            End Sub

            Public Function Contains(item As KeyValuePair(Of K, V)) As Boolean Implements ICollection(Of KeyValuePair(Of K, V)).Contains
                Return Me._dictionary.Contains(item)
            End Function

            Public ReadOnly Property Count As Integer Implements ICollection(Of KeyValuePair(Of K, V)).Count
                Get
                    Return Me._dictionary.Count
                End Get
            End Property

            Public ReadOnly Property IsReadOnly As Boolean Implements ICollection(Of KeyValuePair(Of K, V)).IsReadOnly
                Get
                    Return False
                End Get
            End Property

            Public Function ContainsKey(key As K) As Boolean Implements IDictionary(Of K, V).ContainsKey
                Return Me._dictionary.ContainsKey(key)
            End Function

            Public ReadOnly Property Keys As ICollection(Of K) Implements IDictionary(Of K, V).Keys
                Get
                    Return Me._dictionary.Keys
                End Get
            End Property

            Public Function TryGetValue(key As K, ByRef value As V) As Boolean Implements IDictionary(Of K, V).TryGetValue
                Return Me._dictionary.TryGetValue(key, value)
            End Function

            Public ReadOnly Property Values As ICollection(Of V) Implements IDictionary(Of K, V).Values
                Get
                    Return Me._dictionary.Values
                End Get
            End Property

            Public Function GetGenericEnumerator() As IEnumerator(Of KeyValuePair(Of K, V)) Implements IEnumerable(Of KeyValuePair(Of K, V)).GetEnumerator
                Return Me._dictionary.GetEnumerator()
            End Function

            Public Function GetEnumerator() As IEnumerator Implements IEnumerable.GetEnumerator
                Return Me._dictionary.GetEnumerator()
            End Function

            Public Sub CopyTo(array() As KeyValuePair(Of K, V), arrayIndex As Integer) Implements ICollection(Of KeyValuePair(Of K, V)).CopyTo
                Dim arraySize As Integer = array.Length
                For Each pair As KeyValuePair(Of K, V) In Me._dictionary
                    If arrayIndex >= arraySize Then Exit For
                    array(arrayIndex) = pair
                    arrayIndex += 1
                Next
            End Sub

        End Class

    End Class

End Namespace
