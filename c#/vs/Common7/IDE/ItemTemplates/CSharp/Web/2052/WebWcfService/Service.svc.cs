using System;
using System.Collections.Generic;
$if$ ($targetframeworkversion$ >= 3.5)using System.Linq;
$endif$using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;

namespace $rootnamespace$
{
	// 注意: 使用“重构”菜单上的“重命名”命令，可以同时更改代码、svc 和配置文件中的类名“$safeitemrootname$”。
	// 注意: 为了启动 WCF 测试客户端以测试此服务，请在解决方案资源管理器中选择 $itemrootname$.svc 或 $itemrootname$.svc.cs，然后开始调试。
	public class $safeitemrootname$ : $contractName$
	{
		public void DoWork()
		{
		}
	}
}
