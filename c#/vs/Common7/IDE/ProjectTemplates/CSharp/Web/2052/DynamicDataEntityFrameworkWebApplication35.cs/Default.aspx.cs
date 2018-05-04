using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Xml.Linq;
using System.Web.DynamicData;

namespace $safeprojectname$
{
    public partial class _Default : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
        System.Collections.IList visibleTables = MetaModel.Default.VisibleTables;
        if (visibleTables.Count == 0) {
            throw new InvalidOperationException("没有可访问的表。请确保至少在 Global.asax 中注册了一个数据模型并启用了支架，或者实现自定义页。");
        }
        Menu1.DataSource = visibleTables;
        Menu1.DataBind();
    }

    }
}
