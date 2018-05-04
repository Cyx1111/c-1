using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;

namespace $safeprojectname$
{
	// 注意: 使用“重构”菜单上的“重命名”命令，可以同时更改代码和配置文件中的接口名“IWorkflow1”。
	[ServiceContract]
	public interface IWorkflow1
	{

		[OperationContract]
		string GetData(int value);

		// TODO: 在此添加您的服务操作
	}
}
