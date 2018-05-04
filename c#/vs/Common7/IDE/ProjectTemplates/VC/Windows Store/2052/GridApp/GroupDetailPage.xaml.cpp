//
// GroupDetailPage.xaml.cpp
// GroupDetailPage 类的实现
//

#include "pch.h"
#include "GroupDetailPage.xaml.h"
#include "ItemDetailPage.xaml.h"
#include "DataModel\SampleDataSource.h"

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

// “组详细信息页”项模板在 http://go.microsoft.com/fwlink/?LinkId=234229 上提供

GroupDetailPage::GroupDetailPage()
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
void GroupDetailPage::LoadState(Object^ navigationParameter, IMap<String^, Object^>^ pageState)
{
	// TODO: 创建适用于问题域的合适数据模型以替换示例数据
	auto group = Data::SampleDataSource::GetGroup(safe_cast<String^>(navigationParameter));
	DefaultViewModel->Insert("Group", group);
	DefaultViewModel->Insert("Items", group->Items);
}

/// <summary>
/// 在单击某个项时进行调用。
/// </summary>
/// <param name="sender">显示所单击项的 GridView (在应用程序处于对齐状态时
/// 为 ListView)。</param>
/// <param name="e">描述所单击项的事件数据。</param>
void GroupDetailPage::ItemView_ItemClick(Object^ sender, ItemClickEventArgs^ e)
{
	(void) sender;	// 未使用的参数

	// 导航至相应的目标页，并
	// 通过将所需信息作为导航参数传入来配置新页
	auto itemId = safe_cast<Data::SampleDataItem^>(e->ClickedItem)->UniqueId;
	Frame->Navigate(TypeName(ItemDetailPage::typeid), itemId);
}
