Namespace Common

    ''' <summary>
    ''' 从 true 转换为 false 以及进行相反转换的值转换器。
    ''' </summary>
    Public NotInheritable Class BooleanNegationConverter
        Implements IValueConverter

        Public Function Convert(value As Object, targetType As Type, parameter As Object,
                                language As String) As Object Implements IValueConverter.Convert
            Return Not (TypeOf value Is Boolean AndAlso DirectCast(value, Boolean))
        End Function

        Public Function ConvertBack(value As Object, targetType As Type, parameter As Object,
                                    language As String) As Object Implements IValueConverter.ConvertBack
            Return Not (TypeOf value Is Boolean AndAlso DirectCast(value, Boolean))
        End Function

    End Class

End Namespace
