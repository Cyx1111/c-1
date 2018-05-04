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
	/// 此页显示该应用程序拥有的文件，以便用户可以授权其他应用程序
	/// 访问这些文件。
	/// </summary>
	public ref class $safeitemname$ sealed
	{
	public:
		$safeitemname$();
		void Activate(Windows::ApplicationModel::Activation::FileOpenPickerActivatedEventArgs^ args);

	private:
		Windows::Storage::Pickers::Provider::FileOpenPickerUI^ _fileOpenPickerUI;
		void FileGridView_SelectionChanged(Platform::Object^ sender, Windows::UI::Xaml::Controls::SelectionChangedEventArgs^ e);
		void GoUpButton_Click(Platform::Object^ sender, Windows::UI::Xaml::RoutedEventArgs^ args);
		void FilePickerUI_FileRemoved(Windows::Storage::Pickers::Provider::FileOpenPickerUI^, Windows::Storage::Pickers::Provider::FileRemovedEventArgs^);
	};
}
