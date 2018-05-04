using System;
using System.Collections.Generic;
$if$ ($targetframeworkversion$ >= 3.5)using System.Linq;
$endif$using System.Runtime.Serialization;
using System.ServiceModel;
$if$ ($targetframeworkversion$ >= 3.5)using System.ServiceModel.Web;
$endif$using System.Text;

// 注意: 使用“重构”菜单上的“重命名”命令，可以同时更改代码、服务和配置文件中的类名“Service”。
public class Service : IService
{
	public string GetData(int value)
	{
		return string.Format("You entered: {0}", value);
	}

	public CompositeType GetDataUsingDataContract(CompositeType composite)
	{
		if (composite == null)
		{
			throw new ArgumentNullException("composite");
		}
		if (composite.BoolValue)
		{
			composite.StringValue += "Suffix";
		}
		return composite;
	}
}
