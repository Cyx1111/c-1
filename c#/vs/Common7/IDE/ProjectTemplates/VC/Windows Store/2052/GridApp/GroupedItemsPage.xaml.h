//
// GroupedItemsPage.xaml.h
// GroupedItemsPage 类的声明
//

#pragma once

#include "Common\LayoutAwarePage.h" // 生成的页眉所必需的
#include "GroupedItemsPage.g.h"

namespace $safeprojectname$
{
	/// <summary>
	/// 显示分组的项集合的页。
	/// </summary>
	public ref class GroupedItemsPage sealed
	{
	public:
		GroupedItemsPage();

	protected:
		virtual void LoadState(Platform::Object^ navigationParameter,
			Windows::Foundation::Collections::IMap<Platform::String^, Platform::Object^>^ pageState) override;

	private:
		void Header_Click(Platform::Object^ sender, Windows::UI::Xaml::RoutedEventArgs^ e);
		void ItemView_ItemClick(Platform::Object^ sender, Windows::UI::Xaml::Controls::ItemClickEventArgs^ e);
	};
}
