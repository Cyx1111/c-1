//
// $safeitemname$.xaml.cpp
// $safeitemname$ 类的实现
//

#include "pch.h"
#include "$safeitemname$.xaml.h"

using namespace $rootnamespace$;

using namespace Platform;
using namespace Windows::Foundation;
using namespace Windows::Foundation::Collections;
using namespace Windows::UI::Xaml;
using namespace Windows::UI::Xaml::Controls;
using namespace Windows::UI::Xaml::Controls::Primitives;
using namespace Windows::UI::Xaml::Data;
using namespace Windows::UI::Xaml::Input;
using namespace Windows::UI::Xaml::Media;
using namespace Windows::UI::Xaml::Navigation;

// “空白页”项模板在 http://go.microsoft.com/fwlink/?LinkId=234238 上提供

$safeitemname$::$safeitemname$()
{
	InitializeComponent();
}

/// <summary>
/// 在此页将要在 Frame 中显示时进行调用。
/// </summary>
/// <param name="e">描述如何访问此页的事件数据。Parameter
/// 属性通常用于配置页。</param>
void $safeitemname$::OnNavigatedTo(NavigationEventArgs^ e)
{
	(void) e;	// 未使用的参数
}
