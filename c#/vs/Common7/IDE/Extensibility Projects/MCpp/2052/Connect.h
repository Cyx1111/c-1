#pragma once

using namespace System;
using namespace Extensibility;
using namespace EnvDTE;
using namespace EnvDTE80;<%BEGIN VSCommand%>
using namespace Microsoft::VisualStudio::CommandBars;
using namespace System::Resources;
using namespace System::Reflection;
using namespace System::Globalization;<%END VSCommand%>

namespace <%=SAFEOBJNAME%>
{
	/// <summary>用于实现外接程序的对象。</summary>
	/// <seealso class='IDTExtensibility2' />
	public ref class Connect : public IDTExtensibility2<%BEGIN VSCommand%>, public IDTCommandTarget<%END VSCommand%>
	{

	public:
		/// <summary>实现外接程序对象的构造函数。请将您的初始化代码置于此方法内。</summary>
		Connect()
		{
		}

		/// <summary>实现 IDTExtensibility2 接口的 OnAddInsUpdate 方法。当外接程序集合已发生更改时接收通知。</summary>
		/// <param term='custom'>特定于宿主应用程序的参数数组。</param>
		/// <seealso class='IDTExtensibility2' />	
		virtual void OnAddInsUpdate(System::Array ^%custom);

		/// <summary>实现 IDTExtensibility2 接口的 OnBeginShutdown 方法。接收正在卸载宿主应用程序的通知。</summary>
		/// <param term='custom'>特定于宿主应用程序的参数数组。</param>
		/// <seealso class='IDTExtensibility2' />
		virtual void OnBeginShutdown(System::Array ^%custom);

		/// <summary>实现 IDTExtensibility2 接口的 OnConnection 方法。接收正在加载外接程序的通知。</summary>
		/// <param term='application'>宿主应用程序的根对象。</param>
		/// <param term='connectMode'>描述外接程序的加载方式。</param>
		/// <param term='addInInst'>表示此外接程序的对象。</param>
		/// <seealso class='IDTExtensibility2' />
		virtual void OnConnection(System::Object ^Application, ext_ConnectMode ConnectMode, System::Object ^AddInInst, System::Array ^%custom);

		/// <summary>实现 IDTExtensibility2 接口的 OnStartupComplete 方法。接收宿主应用程序已完成加载的通知。</summary>
		/// <param term='custom'>特定于宿主应用程序的参数数组。</param>
		/// <seealso class='IDTExtensibility2' />
		virtual void OnStartupComplete(System::Array ^%custom);

		/// <summary>实现 IDTExtensibility2 接口的 OnDisconnection 方法。接收正在卸载外接程序的通知。</summary>
		/// <param term='disconnectMode'>描述外接程序的卸载方式。</param>
		/// <param term='custom'>特定于宿主应用程序的参数数组。</param>
		/// <seealso class='IDTExtensibility2' />
		virtual void OnDisconnection(ext_DisconnectMode removeMode, System::Array ^%custom);

		<%BEGIN VSCommand%>/// <summary>实现 IDTCommandTarget 接口的 Exec 方法。此方法在调用该命令时调用。</summary>
		/// <param term='commandName'>要执行的命令的名称。</param>
		/// <param term='executeOption'>描述该命令应如何运行。</param>
		/// <param term='varIn'>从调用方传递到命令处理程序的参数。</param>
		/// <param term='varOut'>从命令处理程序传递到调用方的参数。</param>
		/// <param term='handled'>通知调用方此命令是否已被处理。</param>
		/// <seealso class='Exec' />
		virtual void Exec(String ^CmdName, vsCommandExecOption ExecuteOption, Object ^%VariantIn, Object ^%VariantOut, bool %handled);

		/// <summary>实现 IDTCommandTarget 接口的 QueryStatus 方法。此方法在更新该命令的可用性时调用</summary>
		/// <param term='commandName'>要确定其状态的命令的名称。</param>
		/// <param term='neededText'>该命令所需的文本。</param>
		/// <param term='status'>该命令在用户界面中的状态。</param>
		/// <param term='commandText'>neededText 参数所要求的文本。</param>
		/// <seealso class='Exec' />
		virtual void QueryStatus(String ^CmdName, vsCommandStatusTextWanted NeededText, vsCommandStatus %StatusOption, Object ^%CommandText);<%END VSCommand%>

	private:
		DTE2 ^_applicationObject;
		AddIn ^_addInInstance;
	};
}
