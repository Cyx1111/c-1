//
// $safeitemname$.xaml.h
// $safeitemname$ 类的声明
//

#pragma once

#include "Common\LayoutAwarePage.h" // 生成的页眉所必需的
#include "$wizarditemsubpath$$safeitemname$.g.h"

namespace $rootnamespace$
{
	/// <summary>
	/// 显示单个组的概述的页，包括组内各项
	/// 的预览。
	/// </summary>
	public ref class $safeitemname$ sealed
	{
	public:
		$safeitemname$();

	protected:
		virtual void LoadState(Platform::Object^ navigationParameter,
			Windows::Foundation::Collections::IMap<Platform::String^, Platform::Object^>^ pageState) override;
	};
}
