﻿using System;
using System.Collections.Generic;
$if$ ($targetframeworkversion$ >= 3.5)using System.Linq;
$endif$using System.Web;
using System.Web.Services;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
$if$ ($targetframeworkversion$ == 3.5)// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。
// [System.Web.Script.Services.ScriptService]
$endif$$if$ ($targetframeworkversion$ >= 4.0)// 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。
// [System.Web.Script.Services.ScriptService]
$endif$
public class Service : System.Web.Services.WebService
{
    public Service () {

        //如果使用设计的组件，请取消注释以下行
        //InitializeComponent(); 
    }

    [WebMethod]
    public string HelloWorld() {
        return "Hello World";
    }
    
}