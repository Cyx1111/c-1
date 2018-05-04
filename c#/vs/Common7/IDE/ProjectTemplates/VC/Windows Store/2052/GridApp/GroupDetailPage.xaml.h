//
// GroupDetailPage.xaml.h
// GroupDetailPage 类的声明
//

#pragma once

#include "Common\LayoutAwarePage.h" // 生成的页眉所必需的
#include "GroupDetailPage.g.h"

namespace $safeprojectname$
{
	/// <summary>
	/// 显示单个组的概述的页，包括组内各项
	/// 的预览。
	/// </summary>
	public ref class GroupDetailPage sealed
	{
	public:
		GroupDetailPage();

	protected:
		virtual void LoadState(Platform::Object^ navigationParameter,
			Windows::Foundation::Collections::IMap<Platform::String^, Platform::Object^>^ pageState) override;

	private:
		void ItemView_ItemClick(Platform::Object^ sender, Windows::UI::Xaml::Controls::ItemClickEventArgs^ e);
	};
}
