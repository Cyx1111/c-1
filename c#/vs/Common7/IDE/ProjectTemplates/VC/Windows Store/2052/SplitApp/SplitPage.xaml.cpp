//
// SplitPage.xaml.cpp
// SplitPage 类的实现
//

#include "pch.h"
#include "DataModel\SampleDataSource.h"
#include "SplitPage.xaml.h"

using namespace $safeprojectname$;
using namespace $safeprojectname$::Common;

using namespace Platform;
using namespace Windows::Foundation;
using namespace Windows::Foundation::Collections;
using namespace Windows::UI::ViewManagement;
using namespace Windows::UI::Xaml;
using namespace Windows::UI::Xaml::Controls;
using namespace Windows::UI::Xaml::Controls::Primitives;
using namespace Windows::UI::Xaml::Data;
using namespace Windows::UI::Xaml::Input;
using namespace Windows::UI::Xaml::Media;
using namespace Windows::UI::Xaml::Navigation;

// “拆分页”项模板在 http://go.microsoft.com/fwlink/?LinkId=234234 上提供

SplitPage::SplitPage()
{
	InitializeComponent();
}

#pragma region Page state management

/// <summary>
/// 使用在导航过程中传递的内容填充页。在从以前的会话
/// 重新创建页时，也会提供任何已保存状态。
/// </summary>
/// <param name="navigationParameter">最初请求此页时传递给
/// <see cref="Frame::Navigate(Type, Object)"/> 的参数值。
/// </param>
/// <param name="pageState">此页面在之前的会话期间保留的状态
/// 字典。首次访问页面时为 null。</param>
void SplitPage::LoadState(Object^ navigationParameter, IMap<String^, Object^>^ pageState)
{
	// TODO: 创建适用于问题域的合适数据模型以替换示例数据
	auto group = Data::SampleDataSource::GetGroup(safe_cast<String^>(navigationParameter));
	DefaultViewModel->Insert("Group", group);
	DefaultViewModel->Insert("Items", group->Items);

	if (pageState == nullptr)
	{
		this->itemListView->SelectedItem = nullptr;
		// 当这是新页时，除非正在使用逻辑页导航，
		// 否则会自动选择第一项(请参见下面的逻辑页导航 #region。)
		if (!UsingLogicalPageNavigation() && itemsViewSource->View != nullptr)
		{
			itemsViewSource->View->MoveCurrentToFirst();
		}
	}
	else
	{
		// 还原与此页关联的以前保存的状态
		if (pageState->HasKey("SelectedItem") && itemsViewSource->View != nullptr)
		{
			auto selectedItem = Data::SampleDataSource::GetItem(safe_cast<String^>(pageState->Lookup("SelectedItem")));
			itemsViewSource->View->MoveCurrentTo(selectedItem);
		}
	}
}

/// <summary>
/// 保留与此页关联的状态，以防挂起应用程序或
/// 从导航缓存中放弃此页。值必须符合
/// <see cref="SuspensionManager::SessionState"/> 的序列化要求。
/// </summary>
/// <param name="pageState">要使用可序列化状态填充的空映射。</param>
void SplitPage::SaveState(IMap<String^, Object^>^ pageState)
{
	if (itemsViewSource->View != nullptr)
	{
		auto selectedItem = safe_cast<Data::SampleDataItem^>(itemsViewSource->View->CurrentItem);
		if (selectedItem != nullptr) pageState->Insert("SelectedItem", selectedItem->UniqueId);
	}
}

#pragma endregion

#pragma region Logical page navigation

// 视觉状态管理通常直接反映四种应用程序视图状态(全
// 屏横向与纵向以及对齐和填充视图。)设计拆分页的目的在于使
// 对齐和纵向视图状态均有两个不同的子状态: 显示
// 项列表或详细信息之一，但不同时显示。
//
// 这完全通过一个可表示两个逻辑页的单一物理页实现。
// 使用下面的代码可以实现此目标，且用户不会察觉到区别。

/// <summary>
/// 在确定该页是应用作一个逻辑页还是两个逻辑页时进行调用。
/// </summary>
/// <returns>当前视图状态为纵向或对齐时为 true，否则为 false
/// 。</returns>
bool SplitPage::UsingLogicalPageNavigation()
{
	return UsingLogicalPageNavigation(ApplicationView::Value);
}

/// <summary>
/// 在确定该页是应用作一个逻辑页还是两个逻辑页时进行调用。
/// </summary>
/// <param name="viewState">提出的问题所针对的视图状态。</param>
/// <returns>当相关视图状态为纵向或对齐时为 true，否则为 false
/// 。</returns>
bool SplitPage::UsingLogicalPageNavigation(ApplicationViewState viewState)
{
	return viewState == ApplicationViewState::FullScreenPortrait ||
		viewState == ApplicationViewState::Snapped;
}

/// <summary>
/// 在选定列表中的项时进行调用。
/// </summary>
/// <param name="sender">显示所单击项的 GridView (在应用程序处于对齐状态时
/// 的 ListView)。</param>
/// <param name="e">描述如何更改选择内容的事件数据。</param>
void SplitPage::ItemListView_SelectionChanged(Object^ sender, SelectionChangedEventArgs^ e)
{
	(void) sender;	// 未使用的参数
	(void) e;	// 未使用的参数

	// 使视图状态在逻辑页导航起作用时无效，因为
	// 选择内容方面的更改可能会导致当前逻辑页发生相应的更改。
	// 选定某项后，这将会导致从显示项列表更改为显示选定项的详细信息。
	// 清除选择后，这将产生相反的效果。
	if (UsingLogicalPageNavigation()) InvalidateVisualState();
}

/// <summary>
/// 在按页上的后退按钮时进行调用。
/// </summary>
/// <param name="sender">后退按钮实例。</param>
/// <param name="e">描述如何单击后退按钮的事件数据。</param>
void SplitPage::GoBack(Object^ sender, RoutedEventArgs^ e)
{
	if (UsingLogicalPageNavigation() && itemListView->SelectedItem != nullptr)
	{
		// 如果逻辑页导航起作用且存在选定项，则当前将显示
		// 选定项的详细信息。清除选择后将返回到项列表。
		// 从用户的角度来看，这是一个逻辑后向导航。
		itemListView->SelectedItem = nullptr;
	}
	else
	{
		// 如果逻辑页导航不起作用或者不存在选定项，
		// 则使用默认的后退按钮行为。
		LayoutAwarePage::GoBack(sender, e);
	}
}

/// <summary>
/// 在确定对应于应用程序视图状态的视觉状态的名称时进行
/// 调用。
/// </summary>
/// <param name="viewState">提出的问题所针对的视图状态。</param>
/// <returns>所需的视觉状态的名称。此名称与视图状态的名称相同，
/// 但在纵向和对齐视图中存在选定项时例外，在纵向和对齐视图中，此附加
/// 此附加逻辑页通过添加 _Detail 后缀表示。</returns>
String^ SplitPage::DetermineVisualState(ApplicationViewState viewState)
{
	// 在视图状态更改时更新后退按钮的启用状态
	auto logicalPageBack = UsingLogicalPageNavigation(viewState) && itemListView->SelectedItem != nullptr;
	auto physicalPageBack = Frame != nullptr && Frame->CanGoBack;
	DefaultViewModel->Insert("CanGoBack", logicalPageBack || physicalPageBack);

	// 基于窗口的宽度(而非视图状态)来确定横向布局的
	// 可视状态。此页面具有一个适用于
	// 1366 个虚拟像素或更宽的显示屏的布局，还具有一个适用于较窄的显示屏(或对齐的
	// 应用程序将可用水平空间减小为小于 1366 个像素的情况)的布局。
	if (viewState == ApplicationViewState::Filled ||
		viewState == ApplicationViewState::FullScreenLandscape)
	{
		auto windowWidth = Window::Current->Bounds.Width;
		if (windowWidth >= 1366) return "FullScreenLandscapeOrWide";
		return "FilledOrNarrow";
	}

	// 在纵向或对齐视图中最开始显示默认可视状态名称，然后在查看详细信息(而不是列表)
	// 时添加后缀
	String^ defaultStateName = LayoutAwarePage::DetermineVisualState(viewState);
	return logicalPageBack ? defaultStateName + "_Detail" : defaultStateName;
}

#pragma endregion
