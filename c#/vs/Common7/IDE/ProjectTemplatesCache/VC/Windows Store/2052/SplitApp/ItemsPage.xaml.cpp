﻿//
// ItemsPage.xaml.cpp
// ItemsPage 类的实现
//

#include "pch.h"
#include "DataModel/SampleDataSource.h"
#include "ItemsPage.xaml.h"
#include "SplitPage.xaml.h"

using namespace $safeprojectname$;

using namespace Platform;
using namespace Windows::Foundation;
using namespace Windows::Foundation::Collections;
using namespace Windows::UI::Xaml;
using namespace Windows::UI::Xaml::Controls;
using namespace Windows::UI::Xaml::Controls::Primitives;
using namespace Windows::UI::Xaml::Data;
using namespace Windows::UI::Xaml::Input;
using namespace Windows::UI::Xaml::Interop;
using namespace Windows::UI::Xaml::Media;
using namespace Windows::UI::Xaml::Navigation;

// “项目页”项模板在 http://go.microsoft.com/fwlink/?LinkId=234233 上提供

ItemsPage::ItemsPage()
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
void ItemsPage::LoadState(Object^ navigationParameter, IMap<String^, Object^>^ pageState)
{
	(void) pageState;	// 未使用的参数

	// TODO: 创建适用于问题域的合适数据模型以替换示例数据
	auto sampleDataGroups = Data::SampleDataSource::GetGroups(safe_cast<String^>(navigationParameter));
	DefaultViewModel->Insert("Items", sampleDataGroups);
}

/// <summary>
/// 在单击某个项时进行调用。
/// </summary>
/// <param name="sender">显示所单击项的 GridView (在应用程序处于对齐状态时
/// 为 ListView)。</param>
/// <param name="e">描述所单击项的事件数据。</param>
void ItemsPage::ItemView_ItemClick(Object^ sender, ItemClickEventArgs^ e)
{
	(void) sender;	// 未使用的参数

	// 导航至相应的目标页，并
	// 通过将所需信息作为导航参数传入来配置新页
	auto groupId = safe_cast<Data::SampleDataGroup^>(e->ClickedItem)->UniqueId;
	Frame->Navigate(TypeName(SplitPage::typeid), groupId);
}
