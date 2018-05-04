using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace $safeprojectname$
{
    public partial class App : Application
    {
        public App()
        {
            this.Startup += this.Application_Startup;
            this.UnhandledException += this.Application_UnhandledException;

            InitializeComponent();
        }

        private void Application_Startup(object sender, StartupEventArgs e)
        {
            this.RootVisual = new MainPage();
        }

        private void Application_UnhandledException(object sender, ApplicationUnhandledExceptionEventArgs e)
        {
            // 如果应用程序是在调试器外运行的，则使用浏览器的
            // 一个 ChildWindow 控件。
            if (!System.Diagnostics.Debugger.IsAttached)
            {
                // 注意: 这使应用程序可以在已引发异常但尚未处理该异常的情况下
                // 继续运行。 
                // 对于生产应用程序，此错误处理应替换为向网站报告错误
                // 并停止应用程序。
                e.Handled = true;
                ChildWindow errorWin = new ErrorWindow(e.ExceptionObject);
                errorWin.Show();
            }
        }
    }
}