Imports System
Imports System.Reflection
Imports System.Runtime.InteropServices
Imports System.Globalization
Imports System.Resources
Imports System.Windows

' 有关程序集的常规信息通过下列特性集
' 控制。更改这些特性值可修改
' 与程序集关联的信息。

' 检查程序集特性的值
<Assembly: AssemblyTitle("$projectname$")> 
<Assembly: AssemblyDescription("")> 
<Assembly: AssemblyCompany("$registeredorganization$")> 
<Assembly: AssemblyProduct("$projectname$")> 
<Assembly: AssemblyCopyright("Copyright © $registeredorganization$ $year$")> 
<Assembly: AssemblyTrademark("")> 

<Assembly: ComVisible(False)>

'若要开始生成可本地化的应用程序，请
'在 .vbproj 文件中的 <PropertyGroup> 内设置
'<UICulture>您要编码的区域性</UICulture>。例如，如果在源文件中
'使用的是简体中文，则将 <UICulture> 设置为“zh-CN”。然后取消
'下面 NeutralResourceLanguage 特性的注释。请更新以下行中的
'“en-US”，匹配您项目文件中的 UICulture 设置。

'<Assembly: NeutralResourcesLanguage("en-US", UltimateResourceFallbackLocation.Satellite)> 


'ThemeInfo 特性说明了主题专用资源字典和常规资源字典的位置。
'第一个参数: 主题专用资源字典的位置
'(当资源未在页面
'或应用程序资源字典中找到时使用)

'第二个参数: 常规资源字典的位置
'(当资源未在页面
'、应用程序和任何主题专用资源字典中找到时使用)
<Assembly: ThemeInfo(ResourceDictionaryLocation.None, ResourceDictionaryLocation.SourceAssembly)>


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
' “内部版本号”和“修订号”的默认值:
' <Assembly: AssemblyVersion("1.0.*")> 

<Assembly: AssemblyVersion("1.0.0.0")> 
<Assembly: AssemblyFileVersion("1.0.0.0")> 
