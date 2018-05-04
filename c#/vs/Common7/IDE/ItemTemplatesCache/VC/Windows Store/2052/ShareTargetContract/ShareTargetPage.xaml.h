//
// $safeitemname$.xaml.h
// $safeitemname$ 类的声明。
//

#pragma once

#include "Common\LayoutAwarePage.h" // 生成的页眉所必需的
#include "Common\BooleanToVisibilityConverter.h" // 生成的页眉所必需的
#include "Common\BooleanNegationConverter.h" // 生成的页眉所必需的
#include "$wizarditemsubpath$$safeitemname$.g.h"

#include <agile.h>

namespace $rootnamespace$
{
	/// <summary>
	/// 此页允许其他应用程序共享此应用程序中的内容。
	/// </summary>
	public ref class $safeitemname$ sealed
	{
	public:
		$safeitemname$();
		void Activate(Windows::ApplicationModel::Activation::ShareTargetActivatedEventArgs^ args);

	private:
		Platform::Agile<Windows::ApplicationModel::DataTransfer::ShareTarget::ShareOperation> _shareOperation;
		void ShareButton_Click(Object^ sender, Windows::UI::Xaml::RoutedEventArgs^ e);
	};
}
