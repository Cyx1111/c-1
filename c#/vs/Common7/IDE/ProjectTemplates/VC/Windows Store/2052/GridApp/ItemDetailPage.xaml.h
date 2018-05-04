//
// ItemDetailPage.xaml.h
// ItemDetailPage 类的声明
//

#pragma once

#include "Common\LayoutAwarePage.h" // 生成的页眉所必需的
#include "Common\RichTextColumns.h" // 生成的页眉所必需的
#include "ItemDetailPage.g.h"

#include <collection.h>

namespace $safeprojectname$
{
	/// <summary>
	/// 显示组内单个项的详细信息同时允许使用手势
	/// 浏览同一组的其他项的页。
	/// </summary>
	public ref class ItemDetailPage sealed
	{
	public:
		ItemDetailPage();

	protected:
		virtual void LoadState(Platform::Object^ navigationParameter,
			Windows::Foundation::Collections::IMap<Platform::String^, Platform::Object^>^ pageState) override;
		virtual void SaveState(Windows::Foundation::Collections::IMap<Platform::String^, Platform::Object^>^ pageState) override;
	};
}
