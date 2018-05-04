//
// $safeitemname$.xaml.cpp
// $safeitemname$ 类的实现。
//

#include "pch.h"
#include <ppltasks.h>
#include "$safeitemname$.xaml.h"

using namespace $rootnamespace$;

using namespace Concurrency;
using namespace Platform;
using namespace Windows::ApplicationModel::Activation;
using namespace Windows::Foundation;
using namespace Windows::Foundation::Collections;
using namespace Windows::Storage::Streams;
using namespace Windows::UI::Xaml;
using namespace Windows::UI::Xaml::Controls;
using namespace Windows::UI::Xaml::Controls::Primitives;
using namespace Windows::UI::Xaml::Data;
using namespace Windows::UI::Xaml::Input;
using namespace Windows::UI::Xaml::Media;
using namespace Windows::UI::Xaml::Media::Imaging;
using namespace Windows::UI::Xaml::Navigation;

// “共享目标合同”项模板在 http://go.microsoft.com/fwlink/?LinkId=234241 上提供

$wizardcomment$$safeitemname$::$safeitemname$()
{
	InitializeComponent();
}

/// <summary>
/// 在其他应用程序想要共享此应用程序中的内容时进行调用。
/// </summary>
/// <param name="args">用于与 Windows 协调进程的激活数据。</param>
void $safeitemname$::Activate(ShareTargetActivatedEventArgs^ args)
{
	_shareOperation = args->ShareOperation;

	// 通过视图模型沟通关于共享内容的元数据
	auto shareProperties = _shareOperation->Data->Properties;
	auto thumbnailImage = ref new BitmapImage();
	DefaultViewModel->Insert("Title", shareProperties->Title);
	DefaultViewModel->Insert("Description", shareProperties->Description);
	DefaultViewModel->Insert("Image", thumbnailImage);
	DefaultViewModel->Insert("Sharing", false);
	DefaultViewModel->Insert("ShowImage", false);
	DefaultViewModel->Insert("Comment", "");
	DefaultViewModel->Insert("SupportsComment", true);
	Window::Current->Content = this;
	Window::Current->Activate();

	// 在后台更新共享内容的缩略图
	if (shareProperties->Thumbnail != nullptr)
	{
		// 创建 PPL 任务以处理异步读操作
		Concurrency::task<IRandomAccessStreamWithContentType^>
			readStreamTask(shareProperties->Thumbnail->OpenReadAsync());
		readStreamTask.then([this, thumbnailImage](IRandomAccessStreamWithContentType^ stream)
		{
			// 读取图像后立即显示
			thumbnailImage->SetSource(stream);
			DefaultViewModel->Insert("ShowImage", true);
		}, task_continuation_context::use_current());
	}
}

/// <summary>
/// 在用户单击“共享”按钮时进行调用。
/// </summary>
/// <param name="sender">用于启动共享的 Button 实例。</param>
/// <param name="e">描述如何单击按钮的事件数据。</param>
void $safeitemname$::ShareButton_Click(Object^ sender, RoutedEventArgs^ e)
{
	(void) sender;	// 未使用的参数
	(void) e;	// 未使用的参数

	DefaultViewModel->Insert("Sharing", true);
	_shareOperation->ReportStarted();

	// TODO: 使用 _shareOperation->Data 执行适合您的共享方案的工作，
	//       通常通过添加到此页的自定义用户界面元素
	//       添加到此页的元素，例如 DefaultViewModel->Lookup("Comment")

	_shareOperation->ReportCompleted();
}
