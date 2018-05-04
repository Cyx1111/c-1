#include "stdafx.h"

using namespace System::Reflection;
using namespace System::Runtime::CompilerServices;
using namespace System::Runtime::InteropServices;

//
// 有关程序集的常规信息通过下列特性集
// 控制。更改这些特性值可修改
// 与程序集关联的信息。
//
[assembly:AssemblyTitleAttribute("")];
[assembly:AssemblyDescriptionAttribute("")];
[assembly:AssemblyConfigurationAttribute("")];
[assembly:AssemblyCompanyAttribute("")];
[assembly:AssemblyProductAttribute("")];
[assembly:AssemblyCopyrightAttribute("")];
[assembly:AssemblyTrademarkAttribute("")];
[assembly:AssemblyCultureAttribute("")];		

//
// 程序集的版本信息由下面四个值组成:
//
//      主版本
//      次版本 
//      生成号
//      修订号
//
// 可以指定所有这些值，也可以使用“修订号”和“生成号”的默认值，
// 方法是按如下所示使用“*”:

[assembly:AssemblyVersionAttribute("1.0.*")];

//
// 要对程序集进行签名，必须指定要使用的密钥。有关程序集签名的更多信息，请参考
// Microsoft .NET Framework 文档。
//
// 使用下面的特性控制用于签名的密钥。
//
// 注意:
//   (*) 如果未指定任何密钥，则不对程序集签名。
//   (*) KeyName 是指计算机上的加密服务
//       提供程序(CSP)中已经安装的密钥。KeyFile 是指包含密钥的
//       文件。
//   (*) 如果 KeyFile 和 KeyName 值都已指定，则
//       按如下方式进行处理:
//       (1) 如果可在 CSP 中找到 KeyName，则使用该密钥。
//       (2) 如果 KeyName 不存在而 KeyFile 存在，
//           则在 CSP 中安装和使用 KeyFile 中的密钥。
//   (*) 为了创建 KeyFile，您可以使用 sn.exe (强名称)实用工具。
//        指定 KeyFile 时，KeyFile 的位置应该
//        是相对于项目目录的相对路径。
//   (*) “延迟签名”是一个高级选项 - 有关它的详细信息，
//       请参阅 Microsoft .NET Framework 文档。
//
[assembly:AssemblyDelaySignAttribute(false)];
[assembly:AssemblyKeyFileAttribute("")];
[assembly:AssemblyKeyNameAttribute("")];

[assembly:ComVisible(true)];