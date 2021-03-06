﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Office = Microsoft.Office.Core;
using Outlook = Microsoft.Office.Interop.Outlook;

namespace $rootnamespace$
{
    partial class $safeitemrootname$
    {
        #region 窗体区域工厂

        $formregionattributes$ public partial class $safeitemrootname$Factory
        {
            // 在初始化窗体区域之前发生。
            // 若要阻止窗体区域出现，请将 e.Cancel 设置为 True。
            // 使用 e.OutlookItem 获取对当前 Outlook 项的引用。
            private void $safeitemrootname$Factory_FormRegionInitializing(object sender, Microsoft.Office.Tools.Outlook.FormRegionInitializingEventArgs e)
            {
            }
        }

        #endregion

        // 在显示窗体区域之前发生。
        // 使用 this.OutlookItem 获取对当前 Outlook 项的引用。
        // 使用 this.OutlookFormRegion 获取对窗体区域的引用。
        private void $safeitemrootname$_FormRegionShowing(object sender, System.EventArgs e)
        {
        }

        // 在关闭窗体区域时发生。
        // 使用 this.OutlookItem 获取对当前 Outlook 项的引用。
        // 使用 this.OutlookFormRegion 获取对窗体区域的引用。
        private void $safeitemrootname$_FormRegionClosed(object sender, System.EventArgs e)
        {
        }
    }
}
