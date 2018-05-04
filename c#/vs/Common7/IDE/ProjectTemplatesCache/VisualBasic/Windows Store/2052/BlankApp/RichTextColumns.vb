Namespace Common

    ''' <summary>
    ''' 按适合可用内容所需数量创建附加溢出列的
    ''' <see cref="RichTextBlock"/> 的包装。
    ''' </summary>
    ''' <example>
    ''' 下面创建间距 50 像素、宽 400 像素的列的集合
    ''' 以包含任意数据绑定内容:
    ''' <code>
    ''' <RichTextColumns>
    '''     <RichTextColumns.ColumnTemplate>
    '''         <DataTemplate>
    '''             <RichTextBlockOverflow Width="400" Margin="50,0,0,0"/>
    '''         </DataTemplate>
    '''     </RichTextColumns.ColumnTemplate>
    '''     
    '''     <RichTextBlock Width="400">
    '''         <Paragraph>
    '''             <Run Text="{Binding Content}"/>
    '''         </Paragraph>
    '''     </RichTextBlock>
    ''' </RichTextColumns>
    ''' </code>
    ''' </example>
    ''' <remarks>通常用于水平滚动区域，其中未限定的
    ''' 空间量允许创建所需全部列。当用于垂直滚动
    ''' 空间时，不会存在任何附加列。</remarks>
    <Windows.UI.Xaml.Markup.ContentProperty(Name:="RichTextContent")>
    Public NotInheritable Class RichTextColumns
        Inherits Panel

        ''' <summary>
        ''' 标识 <see cref="RichTextContent"/> 依赖属性。
        ''' </summary>
        Public Shared ReadOnly RichTextContentProperty As DependencyProperty =
            DependencyProperty.Register("RichTextContent", GetType(RichTextBlock),
            GetType(RichTextColumns), New PropertyMetadata(Nothing, AddressOf ResetOverflowLayout))

        ''' <summary>
        ''' 标识 <see cref="ColumnTemplate"/> 依赖属性。
        ''' </summary>
        Public Shared ReadOnly ColumnTemplateProperty As DependencyProperty =
            DependencyProperty.Register("ColumnTemplate", GetType(DataTemplate),
            GetType(RichTextColumns), New PropertyMetadata(Nothing, AddressOf ResetOverflowLayout))

        ''' <summary>
        ''' 初始化 <see cref="RichTextColumns"/> 类的新实例。
        ''' </summary>
        Public Sub New()
            Me.HorizontalAlignment = HorizontalAlignment.Left
        End Sub

        ''' <summary>
        ''' 获取或设置要用作第一列的初始 RTF 内容。
        ''' </summary>
        Public Property RichTextContent As RichTextBlock
            Get
                Return DirectCast(Me.GetValue(RichTextContentProperty), RichTextBlock)
            End Get
            Set(value As RichTextBlock)
                Me.SetValue(RichTextContentProperty, value)
            End Set
        End Property

        ''' <summary>
        ''' 获取或设置用于创建附加
        ''' <see cref="RichTextBlockOverflow"/> 实例的模板。
        ''' </summary>
        Public Property ColumnTemplate As DataTemplate
            Get
                Return DirectCast(Me.GetValue(ColumnTemplateProperty), DataTemplate)
            End Get
            Set(value As DataTemplate)
                Me.SetValue(ColumnTemplateProperty, value)
            End Set
        End Property

        ''' <summary>
        ''' 当更改内容或溢出模板以重新创建列布局时调用。
        ''' </summary>
        ''' <param name="d">发生更改的 <see cref="RichTextColumns"/> 的
        ''' 实例。</param>
        ''' <param name="e">描述特定更改的事件数据。</param>
        Public Shared Sub ResetOverflowLayout(d As DependencyObject, e As DependencyPropertyChangedEventArgs)
            Dim target As RichTextColumns = TryCast(d, RichTextColumns)
            If target IsNot Nothing Then
                ' 当发生重大更改时，从头开始重新生成布局
                target._overflowColumns = Nothing
                target.Children.Clear()
                target.InvalidateMeasure()
            End If
        End Sub

        ''' <summary>
        ''' 列出已创建的溢出列。必须与初始 RichTextBlock
        ''' 子级后跟的 <see cref="Panel.Children"/> 集合中的实例
        ''' 保持 1:1 关系。
        ''' </summary>
        Private _overflowColumns As List(Of RichTextBlockOverflow) = Nothing

        ''' <summary>
        ''' 确定是否需要附加溢出列以及是否可以移除
        ''' 现有列。
        ''' </summary>
        ''' <param name="availableSize">可用空间的大小，用于约束
        ''' 可以创建的附加列数。</param>
        ''' <returns>原始内容加上所有附加列的最终大小。</returns>
        Protected Overrides Function MeasureOverride(availableSize As Size) As Size
            If Me.RichTextContent Is Nothing Then Return New Size(0, 0)

            ' 通过附加列列表的缺失指示此操作尚未
            ' 进行，确保 RichTextBlock 是
            ' 子级
            If Me._overflowColumns Is Nothing Then
                Me.Children.Add(Me.RichTextContent)
                Me._overflowColumns = New List(Of RichTextBlockOverflow)()
            End If

            ' 首先度量原始 RichTextBlock 内容
            Me.RichTextContent.Measure(availableSize)
            Dim maxWidth As Double = Me.RichTextContent.DesiredSize.Width
            Dim maxHeight As Double = Me.RichTextContent.DesiredSize.Height
            Dim hasOverflow As Boolean = Me.RichTextContent.HasOverflowContent

            ' 确保存在足够的溢出列
            Dim overflowIndex As Integer = 0
            While hasOverflow AndAlso maxWidth < availableSize.Width AndAlso Me.ColumnTemplate IsNot Nothing

                ' 在耗尽前使用现有溢出列，然后从
                ' 提供的模板创建更多列
                Dim overflow As RichTextBlockOverflow
                If Me._overflowColumns.Count > overflowIndex Then
                    overflow = Me._overflowColumns(overflowIndex)
                Else
                    overflow = DirectCast(Me.ColumnTemplate.LoadContent(), RichTextBlockOverflow)
                    Me._overflowColumns.Add(overflow)
                    Me.Children.Add(overflow)
                    If overflowIndex = 0 Then
                        Me.RichTextContent.OverflowContentTarget = overflow
                    Else
                        Me._overflowColumns(overflowIndex - 1).OverflowContentTarget = overflow
                    End If
                End If

                ' 度量新列并准备根据需要进行重复
                overflow.Measure(New Size(availableSize.Width - maxWidth, availableSize.Height))
                maxWidth += overflow.DesiredSize.Width
                maxHeight = Math.Max(maxHeight, overflow.DesiredSize.Height)
                hasOverflow = overflow.HasOverflowContent
                overflowIndex += 1
            End While

            ' 断开附加列与溢出链的连接，从我们的专用列列表中移除它们，
            ' 然后将它们作为子级移除
            If Me._overflowColumns.Count > overflowIndex Then
                If overflowIndex = 0 Then
                    Me.RichTextContent.OverflowContentTarget = Nothing
                Else
                    Me._overflowColumns(overflowIndex - 1).OverflowContentTarget = Nothing
                End If

                While Me._overflowColumns.Count > overflowIndex
                    Me._overflowColumns.RemoveAt(overflowIndex)
                    Me.Children.RemoveAt(overflowIndex + 1)
                End While
            End If

            ' 报告最终确定大小
            Return New Size(maxWidth, maxHeight)
        End Function

        ''' <summary>
        ''' 排列原始内容和所有附加列。
        ''' </summary>
        ''' <param name="finalSize">定义必须在其中排列子级的区域的
        ''' 大小。</param>
        ''' <returns>子级实际需要的区域的大小。</returns>
        Protected Overrides Function ArrangeOverride(finalSize As Size) As Size
            Dim maxWidth As Double = 0
            Dim maxHeight As Double = 0
            For Each child As UIElement In Children
                child.Arrange(New Rect(maxWidth, 0, child.DesiredSize.Width, finalSize.Height))
                maxWidth += child.DesiredSize.Width
                maxHeight = Math.Max(maxHeight, child.DesiredSize.Height)
            Next
            Return New Size(maxWidth, maxHeight)
        End Function

    End Class

End Namespace
