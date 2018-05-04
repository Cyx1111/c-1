//
// $safeitemname$.xaml.cpp
// $safeitemname$ 类的实现。
//

#include "pch.h"
#include <collection.h>
#include "$safeitemname$.xaml.h"

using namespace $rootnamespace$;

using namespace Platform;
using namespace Platform::Collections;
using namespace Windows::ApplicationModel::Activation;
using namespace Windows::Foundation;
using namespace Windows::Foundation::Collections;
using namespace Windows::UI::Xaml;
using namespace Windows::UI::Xaml::Controls;
using namespace Windows::UI::Xaml::Controls::Primitives;
using namespace Windows::UI::Xaml::Data;
using namespace Windows::UI::Xaml::Input;
using namespace Windows::UI::Xaml::Interop;
using namespace Windows::UI::Xaml::Media;
using namespace Windows::UI::Xaml::Navigation;

// “搜索合同”项模板在 http://go.microsoft.com/fwlink/?LinkId=234240 上提供

$wizardcomment$$safeitemname$::$safeitemname$()
{
	InitializeComponent();
}

/// <summary>
/// 使用在导航过程中传递的内容填充页。在从以前的会话
/// 重新创建页时，也会提供任何已保存状态。
/// </summary>
/// <param name="navigationParameter">最初请求此页时传递给
/// <see cref="Frame::Navigate(Type, Object)"/> 的参数值。
/// </param>
/// <param name="pageState">此页面在之前的会话期间保留的状态
/// 字典。首次访问页面时为 null。</param>
void $safeitemname$::LoadState(Object^ navigationParameter, IMap<String^, Object^>^ pageState)
{
	(void) pageState;	// 未使用的参数

	// 拆开传入到参数对象的两个值: 查询文本和以前的窗口内容
	auto queryText = safe_cast<String^>(navigationParameter);

	// TODO: 特定于应用程序的搜索逻辑。搜索进程负责
	//       创建用户可选的结果类别列表:
	//
	//       filterList->Append(ref new $safeitemname$Filter("<filter name>", <result count>), false);
	//
	//       仅第一个筛选器(通常为“全部”)应将 true 作为第三个参数传入
	//       以便以活动状态开始。活动筛选器的结果在
	//       下面的 Filter_SelectionChanged 中提供。

	auto filterList = ref new Vector<Object^>();
	filterList->Append(ref new $safeitemname$Filter("All", 0, true));

	// 通过视图模型沟通结果
	DefaultViewModel->Insert("QueryText", "\u201c" + queryText + "\u201d");
	DefaultViewModel->Insert("Filters", filterList);
	DefaultViewModel->Insert("ShowFilters", filterList->Size > 1);
}

/// <summary>
/// 在使用处于对齐视图状态的 ComboBox 选择筛选器时进行调用。
/// </summary>
/// <param name="sender">ComboBox 实例。</param>
/// <param name="e">描述如何更改选定筛选器的事件数据。</param>
void $safeitemname$::Filter_SelectionChanged(Object^ sender, SelectionChangedEventArgs^ e)
{
	(void) sender;	// 未使用的参数

	// 确定选定的筛选器
	auto selectedFilter = (e->AddedItems->Size == 0) ? nullptr :
		dynamic_cast<$safeitemname$Filter^>(e->AddedItems->GetAt(0));
	if (selectedFilter != nullptr)
	{
		// 将结果镜像到相应的筛选器对象中，以允许
		// 在未对齐以反映更改时使用的 RadioButton 表示形式
		selectedFilter->Active = true;

		// TODO: 通过调用 DefaultViewModel->Insert("Results", <value>) 对活动筛选器中的更改作出响应
		//       其中 <value> 是具有可绑定的 Image、Title、Subtitle 和 Description 属性的项的集合
		
		// 确保找到结果
		IVector<Object^>^ resultsCollection;
		if (this->DefaultViewModel->HasKey("Results") == true)
		{
			resultsCollection = dynamic_cast<IVector<Object^>^>(this->DefaultViewModel->Lookup("Results"));
			if (resultsCollection != nullptr && resultsCollection->Size != 0)
			{
				VisualStateManager::GoToState(this, "ResultsFound", true);
				return;
			}
		}
	}

	// 无搜索结果时显示信息性文本。
	VisualStateManager::GoToState(this, "NoResultsFound", true);
}

/// <summary>
/// 在未对齐的情况下使用 RadioButton 选定筛选器时进行调用。
/// </summary>
/// <param name="sender">选定的 RadioButton 实例。</param>
/// <param name="e">描述如何选定 RadioButton 的事件数据。</param>
void $safeitemname$::Filter_Checked(Object^ sender, RoutedEventArgs^ e)
{
	(void) e;	// 未使用的参数

	// 将更改镜像到对应的 ComboBox 使用的 CollectionViewSource 中
	// 以确保在对齐后反映更改
	if (filtersViewSource->View != nullptr)
	{
		auto filter = safe_cast<FrameworkElement^>(sender)->DataContext;
		filtersViewSource->View->MoveCurrentTo(filter);
	}
}

$safeitemname$Filter::$safeitemname$Filter(String^ name, int count, bool active): _count(0), _active(false)
{
	Name = name;
	Count = count;
	Active = active;
}

String^ $safeitemname$Filter::Name::get()
{
	return _name;
}

void $safeitemname$Filter::Name::set(String^ value)
{
	if (value == _name || (value != nullptr && value->Equals(_name)))
	{
		return;
	}

	_name = value;
	OnPropertyChanged("Name");
	OnPropertyChanged("Description");
}

int $safeitemname$Filter::Count::get()
{
	return _count;
}

void $safeitemname$Filter::Count::set(int value)
{
	if (value == _count)
	{
		return;
	}

	_count = value;
	OnPropertyChanged("Count");
	OnPropertyChanged("Description");
}

bool $safeitemname$Filter::Active::get()
{
	return _active;
}

void $safeitemname$Filter::Active::set(bool value)
{
	if (value == _active)
	{
		return;
	}
	_active = value; OnPropertyChanged("Active");
}

String^ $safeitemname$Filter::Description::get()
{
	return _name + " (" + _count.ToString() + ")";
}
