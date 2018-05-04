#include "pch.h"
#include "$projectname$.h"
#include "BasicTimer.h"

using namespace Windows::ApplicationModel;
using namespace Windows::ApplicationModel::Core;
using namespace Windows::ApplicationModel::Activation;
using namespace Windows::UI::Core;
using namespace Windows::System;
using namespace Windows::Foundation;
using namespace Windows::Graphics::Display;
using namespace concurrency;

$safeprojectname$::$safeprojectname$() :
	m_windowClosed(false),
	m_windowVisible(true)
{
}

void $safeprojectname$::Initialize(CoreApplicationView^ applicationView)
{
	applicationView->Activated +=
        ref new TypedEventHandler<CoreApplicationView^, IActivatedEventArgs^>(this, &$safeprojectname$::OnActivated);

	CoreApplication::Suspending +=
        ref new EventHandler<SuspendingEventArgs^>(this, &$safeprojectname$::OnSuspending);

	CoreApplication::Resuming +=
        ref new EventHandler<Platform::Object^>(this, &$safeprojectname$::OnResuming);

	m_renderer = ref new CubeRenderer();
}

void $safeprojectname$::SetWindow(CoreWindow^ window)
{
	window->SizeChanged += 
        ref new TypedEventHandler<CoreWindow^, WindowSizeChangedEventArgs^>(this, &$safeprojectname$::OnWindowSizeChanged);

	window->VisibilityChanged +=
		ref new TypedEventHandler<CoreWindow^, VisibilityChangedEventArgs^>(this, &$safeprojectname$::OnVisibilityChanged);

	window->Closed += 
        ref new TypedEventHandler<CoreWindow^, CoreWindowEventArgs^>(this, &$safeprojectname$::OnWindowClosed);

	window->PointerCursor = ref new CoreCursor(CoreCursorType::Arrow, 0);

	window->PointerPressed +=
		ref new TypedEventHandler<CoreWindow^, PointerEventArgs^>(this, &$safeprojectname$::OnPointerPressed);

	window->PointerMoved +=
		ref new TypedEventHandler<CoreWindow^, PointerEventArgs^>(this, &$safeprojectname$::OnPointerMoved);

	m_renderer->Initialize(CoreWindow::GetForCurrentThread());
}

void $safeprojectname$::Load(Platform::String^ entryPoint)
{
}

void $safeprojectname$::Run()
{
	BasicTimer^ timer = ref new BasicTimer();

	while (!m_windowClosed)
	{
		if (m_windowVisible)
		{
			timer->Update();
			CoreWindow::GetForCurrentThread()->Dispatcher->ProcessEvents(CoreProcessEventsOption::ProcessAllIfPresent);
			m_renderer->Update(timer->Total, timer->Delta);
			m_renderer->Render();
			m_renderer->Present(); // 此调用将同步为显示帧速率。
		}
		else
		{
			CoreWindow::GetForCurrentThread()->Dispatcher->ProcessEvents(CoreProcessEventsOption::ProcessOneAndAllPending);
		}
	}
}

void $safeprojectname$::Uninitialize()
{
}

void $safeprojectname$::OnWindowSizeChanged(CoreWindow^ sender, WindowSizeChangedEventArgs^ args)
{
	m_renderer->UpdateForWindowSizeChange();
}

void $safeprojectname$::OnVisibilityChanged(CoreWindow^ sender, VisibilityChangedEventArgs^ args)
{
	m_windowVisible = args->Visible;
}

void $safeprojectname$::OnWindowClosed(CoreWindow^ sender, CoreWindowEventArgs^ args)
{
	m_windowClosed = true;
}

void $safeprojectname$::OnPointerPressed(CoreWindow^ sender, PointerEventArgs^ args)
{
	// 在此处插入代码。
}

void $safeprojectname$::OnPointerMoved(CoreWindow^ sender, PointerEventArgs^ args)
{
	// 在此处插入代码。
}

void $safeprojectname$::OnActivated(CoreApplicationView^ applicationView, IActivatedEventArgs^ args)
{
	CoreWindow::GetForCurrentThread()->Activate();
}

void $safeprojectname$::OnSuspending(Platform::Object^ sender, SuspendingEventArgs^ args)
{
	// 在请求延期后异步保存应用程序状态。保留延期
	// 表示应用程序正忙于执行挂起操作。
	// 请注意，延期不是无限期的。在大约五秒后，
	// 将强制应用程序退出。
	SuspendingDeferral^ deferral = args->SuspendingOperation->GetDeferral();

	create_task([this, deferral]()
	{
		// 在此处插入代码。

		deferral->Complete();
	});
}
 
void $safeprojectname$::OnResuming(Platform::Object^ sender, Platform::Object^ args)
{
	// 还原在挂起时卸载的任何数据或状态。默认情况下，
	// 在从挂起中恢复时，数据和状态会持续保留。请注意，
	// 如果之前已终止应用程序，则不会发生此事件。
}

IFrameworkView^ Direct3DApplicationSource::CreateView()
{
    return ref new $safeprojectname$();
}

[Platform::MTAThread]
int main(Platform::Array<Platform::String^>^)
{
	auto direct3DApplicationSource = ref new Direct3DApplicationSource();
	CoreApplication::Run(direct3DApplicationSource);
	return 0;
}
