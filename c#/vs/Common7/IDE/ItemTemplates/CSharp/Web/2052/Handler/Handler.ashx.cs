﻿using System;
using System.Collections.Generic;
$if$ ($targetframeworkversion$ >= 3.5)using System.Linq;
$endif$using System.Web;

namespace $rootnamespace$
{
    /// <summary>
    /// $classname$ 的摘要说明
    /// </summary>
    public class $classname$ : IHttpHandler {

        public void ProcessRequest (HttpContext context) {
            context.Response.ContentType = "text/plain";
            context.Response.Write("Hello World");
        }
     
        public bool IsReusable {
            get {
                return false;
            }
        }
    }
}