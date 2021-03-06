﻿namespace $safeprojectname$
{
    using System;
    using System.Windows.Data;

    /// <summary>
    /// 双向 IValueConverter，使您可以将可绑定对象的属性(可以为空 string 值)绑定到依赖属性(在该情况下应设置为 null)。
    /// </summary>
    public class TargetNullValueConverter : IValueConverter
    {
        /// <summary>
        /// 将 <c>null</c> 或空 strings 转换为 <c>null</c>。
        /// </summary>
        /// <param name="value">要转换的值。</param>
        /// <param name="targetType">预期结果 type (已忽略)。</param>
        /// <param name="parameter">可选参数(已忽略)。</param>
        /// <param name="culture">转换的区域性(已忽略)。</param>
        /// <returns>如果 <paramref name="value"/> 为 <c>null</c> 或为空，则此方法返回 <c>null</c>，否则返回 <paramref name="value"/>。</returns>
        public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            string strValue = value as string;

            return string.IsNullOrEmpty(strValue) ? null : value;
        }

        /// <summary>
        /// 将 <c>null</c> 转换回 <see cref="String.Empty"/>。
        /// </summary>
        /// <param name="value">要转换的值。</param>
        /// <param name="targetType">预期结果类型(已忽略)。</param>
        /// <param name="parameter">可选参数(已忽略)。</param>
        /// <param name="culture">转换的区域性(已忽略)。</param>
        /// <returns>如果 <paramref name="value"/> 为 <c>null</c>，则它返回 <see cref="String.Empty"/>，否则返回 <paramref name="value"/>。</returns>
        public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            return value ?? string.Empty;
        }
    }
}
