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
	/// 基本页，提供大多数应用程序通用的特性。
	/// </summary>
	public ref class $safeitemname$ sealed
	{
	public:
		$safeitemname$();

	protected:
		virtual void LoadState(Platform::Object^ navigationParameter,
			Windows::Foundation::Collections::IMap<Platform::String^, Platform::Object^>^ pageState) override;
		virtual void SaveState(Windows::Foundation::Collections::IMap<Platform::String^, Platform::Object^>^ pageState) override;
	};
}
