//
// ItemsPage.xaml.h
// ItemsPage 类的声明
//

#pragma once

#include "Common\LayoutAwarePage.h" // 生成的页眉所必需的
#include "ItemsPage.g.h"

namespace $safeprojectname$
{
	/// <summary>
	/// 显示项预览集合的页。在“拆分布局应用程序”中，此页
	/// 用于显示及选择可用组之一。
	/// </summary>
	public ref class ItemsPage sealed
	{
	public:
		ItemsPage();

	protected:
		virtual void LoadState(Platform::Object^ navigationParameter,
			Windows::Foundation::Collections::IMap<Platform::String^, Platform::Object^>^ pageState) override;

	private:
		void ItemView_ItemClick(Platform::Object^ sender, Windows::UI::Xaml::Controls::ItemClickEventArgs^ e);
	};
}
