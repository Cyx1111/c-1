#pragma once

#include "DirectXBase.h"

// 此类呈现带有有色背景的简单文本。
ref class SimpleTextRenderer sealed : public DirectXBase
{
public:
	SimpleTextRenderer();

	// DirectXBase 方法。
	virtual void CreateDeviceIndependentResources() override;
	virtual void CreateDeviceResources() override;
	virtual void CreateWindowSizeDependentResources() override;
	virtual void Render() override;

	// 更新时间相关对象的方法。
	void Update(float timeTotal, float timeDelta);

	// 基于输入事件更改文本位置的方法。
	void UpdateTextPosition(Windows::Foundation::Point deltaTextPosition);

	// 调整窗口背景颜色的方法。
	void BackgroundColorNext();
	void BackgroundColorPrevious();

	// 为响应挂起而保存和加载状态的方法。
	void SaveInternalState(Windows::Foundation::Collections::IPropertySet^ state);
	void LoadInternalState(Windows::Foundation::Collections::IPropertySet^ state);

private:
	Microsoft::WRL::ComPtr<ID2D1SolidColorBrush> m_blackBrush;
	Microsoft::WRL::ComPtr<IDWriteTextFormat> m_textFormat;
	Microsoft::WRL::ComPtr<IDWriteTextLayout> m_textLayout;
	DWRITE_TEXT_METRICS m_textMetrics;
	Windows::Foundation::Point m_textPosition;
	bool m_renderNeeded;
	int m_backgroundColorIndex;
};
