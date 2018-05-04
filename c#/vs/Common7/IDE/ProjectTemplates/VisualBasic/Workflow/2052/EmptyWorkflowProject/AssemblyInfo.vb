Imports System
Imports System.Reflection
Imports System.Runtime.InteropServices

' 有关程序集的常规信息通过下列属性集
' 控制。更改这些属性值可修改
' 与程序集关联的信息。

' 检查程序集的属性值

<Assembly: AssemblyTitle("$safeprojectname$")> 
<Assembly: AssemblyDescription("")> 
<Assembly: AssemblyCompany("$registeredorganization$")> 
<Assembly: AssemblyProduct("$safeprojectname$")> 
<Assembly: AssemblyCopyright("Copyright © $registeredorganization$ $year$")> 
<Assembly: AssemblyTrademark("")> 

<Assembly: ComVisible(False)>

'如果此项目向 COM 公开，则下列 GUID 用于类型库的 ID
<Assembly: Guid("$guid1$")> 

' 程序集的版本信息由下列四个值组成:
'
'      主版本
'      次版本
'      内部版本号
'      修订号
'
' 您可以指定所有值，也可以按照如下所示通过使用“*”来使用
' “内部版本号”和“修订号”的默认值。

<Assembly: AssemblyVersion("1.0.0.0")> 
<Assembly: AssemblyFileVersion("1.0.0.0")> 

'注意: 更新项目中的命名空间时，请添加新的或更新现有的 XmlnsDefinitionAttribute
'可以添加其他属性来映射您在项目中拥有的所有其他命名空间
'<Assembly: System.Workflow.ComponentModel.Serialization.XmlnsDefinition("http://schemas.com/$safeprojectname$", "$safeprojectname$")> 
