//
// SplitPage.xaml.h
// SplitPage 类的声明
//

#pragma once

#include "Common\LayoutAwarePage.h" // 生成的页眉所必需的
#include "SplitPage.g.h"

namespace $safeprojectname$
{
	/// <summary>
	/// 显示组标题、组内各项的列表以及当前选定项的
	/// 详细信息的页。
	/// </summary>
	public ref class SplitPage sealed
	{
	public:
		SplitPage();

	protected:
		virtual void LoadState(Platform::Object^ navigationParameter,
			Windows::Foundation::Collections::IMap<Platform::String^, Platform::Object^>^ pageState) override;
		virtual void SaveState(Windows::Foundation::Collections::IMap<Platform::String^, Platform::Object^>^ pageState) override;
		virtual void GoBack(Platform::Object^ sender, Windows::UI::Xaml::RoutedEventArgs^ e) override;
		virtual Platform::String^ DetermineVisualState(Windows::UI::ViewManagement::ApplicationViewState viewState) override;

	private:
		void ItemListView_SelectionChanged(Platform::Object^ sender, Windows::UI::Xaml::Controls::SelectionChangedEventArgs^ e);
		bool UsingLogicalPageNavigation();
		bool UsingLogicalPageNavigation(Windows::UI::ViewManagement::ApplicationViewState viewState);
	};
}
