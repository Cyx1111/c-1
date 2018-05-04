//
// ItemDetailPage.xaml.cpp
// ItemDetailPage 类的实现
//

#include "pch.h"
#include "DataModel\SampleDataSource.h"
#include "ItemDetailPage.xaml.h"

using namespace $safeprojectname$;

using namespace Platform;
using namespace Windows::Foundation;
using namespace Windows::Foundation::Collections;
using namespace Windows::Graphics::Display;
using namespace Windows::UI::ViewManagement;
using namespace Windows::UI::Xaml;
using namespace Windows::UI::Xaml::Controls;
using namespace Windows::UI::Xaml::Controls::Primitives;
using namespace Windows::UI::Xaml::Data;
using namespace Windows::UI::Xaml::Input;
using namespace Windows::UI::Xaml::Media;
using namespace Windows::UI::Xaml::Navigation;

// “项详细信息页”项模板在 http://go.microsoft.com/fwlink/?LinkId=234232 上提供

ItemDetailPage::ItemDetailPage()
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
void ItemDetailPage::LoadState(Object^ navigationParameter, IMap<String^, Object^>^ pageState)
{
	// 允许已保存页状态重写要显示的初始项
	if (pageState != nullptr && pageState->HasKey("SelectedItem"))
	{
		navigationParameter = pageState->Lookup("SelectedItem");
	}

	// TODO: 创建适用于问题域的合适数据模型以替换示例数据
	auto item = Data::SampleDataSource::GetItem(safe_cast<String^>(navigationParameter));
	DefaultViewModel->Insert("Group", item->Group);
	DefaultViewModel->Insert("Items", item->Group->Items);
	flipView->SelectedItem = item;
}

/// <summary>
/// 保留与此页关联的状态，以防挂起应用程序或
/// 从导航缓存中放弃此页。值必须符合
/// <see cref="SuspensionManager::SessionState"/> 的序列化要求。
/// </summary>
/// <param name="pageState">要使用可序列化状态填充的空映射。</param>
void ItemDetailPage::SaveState(IMap<String^, Object^>^ pageState)
{
	auto selectedItem = safe_cast<Data::SampleDataItem^>(flipView->SelectedItem);
	pageState->Insert("SelectedItem", selectedItem->UniqueId);
}
