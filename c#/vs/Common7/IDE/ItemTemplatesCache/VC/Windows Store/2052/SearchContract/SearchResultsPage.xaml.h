//
// $safeitemname$.xaml.h
// $safeitemname$ 类的声明。
//

#pragma once

#include "Common\LayoutAwarePage.h" // 生成的页眉所必需的
#include "Common\BooleanToVisibilityConverter.h" // 生成的页眉所必需的
#include "Common\BindableBase.h" // Filter 声明所必需的
#include "Common\SuspensionManager.h" //对激活是必需的
#include "$wizarditemsubpath$$safeitemname$.g.h"

namespace $rootnamespace$
{
	/// <summary>
	/// 此页显示全局搜索定向到此应用程序时的搜索结果。
	/// </summary>
	[Windows::Foundation::Metadata::WebHostHidden]
	public ref class $safeitemname$ sealed
	{
	public:
		$safeitemname$();

	protected:
		virtual void LoadState(Platform::Object^ navigationParameter,
			Windows::Foundation::Collections::IMap<Platform::String^, Platform::Object^>^ pageState) override;

	private:
		void Filter_Checked(Object^ sender, Windows::UI::Xaml::RoutedEventArgs^ e);
		void Filter_SelectionChanged(Object^ sender, Windows::UI::Xaml::Controls::SelectionChangedEventArgs^ e);
	};

	/// <summary>
	/// 描述可用于查看搜索结果的筛选器之一的视图模型。
	/// </summary>
	[Windows::UI::Xaml::Data::Bindable]
	public ref class $safeitemname$Filter sealed : $safeprojectname$::Common::BindableBase
	{
	private:
		Platform::String^ _name;
		int _count;
		bool _active;

	public:
		$safeitemname$Filter(Platform::String^ name, int count, bool active);

		property Platform::String^ Name
		{
			Platform::String^ get();
			void set(Platform::String^ value);
		};

		property int Count
		{
			int get();
			void set(int value);
		};

		property bool Active
		{
			bool get();
			void set(bool value);
		};

		property Platform::String^ Description
		{
			Platform::String^ get();
		};
	};
}
