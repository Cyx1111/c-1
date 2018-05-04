using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
$if$ ($targetframeworkversion$ >= 3.5)using System.Xml.Linq;
$endif$

namespace $safeprojectname$
{
    /// <summary>
    /// ExtenderControl1 的摘要说明
    /// </summary>
    [
        TargetControlType(typeof(Control))
    ]
    public class ExtenderControl1 : ExtenderControl
    {
	    public ExtenderControl1()
	    {
		    //
		    // TODO: 在此处添加构造函数逻辑
		    //
	    }
        protected override IEnumerable<ScriptDescriptor>
                GetScriptDescriptors(System.Web.UI.Control targetControl)
        {
            ScriptBehaviorDescriptor descriptor = new ScriptBehaviorDescriptor("$safeprojectname$.ClientBehavior1", targetControl.ClientID);
            yield return descriptor;
        }

        // 生成脚本引用
        protected override IEnumerable<ScriptReference>
                GetScriptReferences()
        {
            yield return new ScriptReference("$safeprojectname$.ClientBehavior1.js", this.GetType().Assembly.FullName);
        }
    }
}