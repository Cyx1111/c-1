﻿Imports System
Imports System.Windows.Data

''' <summary>
''' 雙向 IValueConverter，可以讓您將可為空 string 值的可繫結物件上的屬性繫結到在該情況下應設定為 null 的相依性屬性。
''' </summary>
Public Class TargetNullValueConverter
    Implements IValueConverter

    ''' <summary>
    ''' 將 <c>null</c> 或空 strings 轉換成 <c>null</c>。
    ''' </summary>
    ''' <param name="value">要轉換的值。</param>
    ''' <param name="targetType">此結果的預期型別 (忽略)。</param>
    ''' <param name="parameter">選擇性參數 (忽略)。</param>
    ''' <param name="culture">此轉換的文化特性 (忽略)。</param>
    ''' <returns>如果 <paramref name="value"/> 為 <c>null</c> 或空白，此方法會傳回 <c>null</c>，否則它將傳回 <paramref name="value"/>。</returns>
    Public Function Convert(ByVal value As Object, ByVal targetType As Type, ByVal parameter As Object, ByVal culture As System.Globalization.CultureInfo) As Object Implements IValueConverter.Convert
        Dim strValue As String = Nothing

        If TypeOf value Is String Then
            strValue = DirectCast(value, String)
        End If

        Return If(String.IsNullOrEmpty(strValue), Nothing, value)
    End Function

    ''' <summary>
    ''' 將 <c>null</c> 轉換回 <see cref="String.Empty"/>。
    ''' </summary>
    ''' <param name="value">要轉換的值。</param>
    ''' <param name="targetType">此結果的預期 type (忽略)。</param>
    ''' <param name="parameter">選擇性參數 (忽略)。</param>
    ''' <param name="culture">此轉換的文化特性 (忽略)。</param>
    ''' <returns>如果 <paramref name="value"/> 為 <c>null</c>，它會傳回 <see cref="String.Empty"/>，否則將傳回 <paramref name="value"/>。</returns>
    Public Function ConvertBack(ByVal value As Object, ByVal targetType As Type, ByVal parameter As Object, ByVal culture As System.Globalization.CultureInfo) As Object Implements IValueConverter.ConvertBack
        Return If(value Is Nothing, String.Empty, value)
    End Function
End Class