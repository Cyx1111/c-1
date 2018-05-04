//
// $safeitemname$.xaml.cpp
// $safeitemname$ 类的实现
//

#include "pch.h"
#include "$safeitemname$.xaml.h"

using namespace $rootnamespace$;

using namespace Platform;
using namespace Platform::Collections;
using namespace Windows::Foundation;
using namespace Windows::Foundation::Collections;
using namespace Windows::UI::Xaml;
using namespace Windows::UI::Xaml::Controls;
using namespace Windows::UI::Xaml::Controls::Primitives;
using namespace Windows::UI::Xaml::Data;
using namespace Windows::UI::Xaml::Input;
using namespace Windows::UI::Xaml::Media;
using namespace Windows::UI::Xaml::Navigation;

// “组详细信息页”项模板在 http://go.microsoft.com/fwlink/?LinkId=234229 上提供

$safeitemname$::$safeitemname$()
{
	InitializeComponent();
}

/// <summary>
/// 使用在导航过程中传递的内容填充页。在从以前的会话
/// 重新创建页时，也会提供任何已保存状态。
/// </summary>
/// <param name="navigationParameter">最初请求此页时传递给
/// <see cref="Frame::Navigate(Type, Object)"/> 的参数值。
/// </param>
/// <param name="pageState">此页面在之前的会话期间保留的状态
/// 字典。首次访问页面时为 null。</param>
void $safeitemname$::LoadState(Object^ navigationParameter, IMap<String^, Object^>^ pageState)
{
	(void) navigationParameter;	// 未使用的参数
	(void) pageState;	// 未使用的参数

	// TODO: 使用 DefaultViewModel->Insert("Group", <value>) 设置可绑定组
	// TODO: 使用 DefaultViewModel->Insert("Items", <value>) 设置可绑定项集合
}
