//
// $safeitemname$.xaml.h
// $safeitemname$ 类的声明
//

#pragma once

#include "$wizarditemsubpath$$safeitemname$.g.h"

namespace $rootnamespace$
{
	/// <summary>
	/// 可用于自身或导航至 Frame 内部的空白页。
	/// </summary>
	[Windows::Foundation::Metadata::WebHostHidden]
	public ref class $safeitemname$ sealed
	{
	public:
		$safeitemname$();

	protected:
		virtual void OnNavigatedTo(Windows::UI::Xaml::Navigation::NavigationEventArgs^ e) override;
	};
}
