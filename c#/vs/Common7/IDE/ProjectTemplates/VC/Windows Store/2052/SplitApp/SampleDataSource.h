//
// SampleDataSource.h
// SampleDataSource、SampleDataGroup、SampleDataItem 和 SampleDataCommon 类的声明
//

#pragma once

#include <collection.h>
#include "Common\BindableBase.h"

// 此文件定义的数据模型可充当在添加、移除或修改成员时
// 支持通知的强类型模型的代表性示例。所选
// 属性名称与标准项模板中的数据绑定一致。
//
// 应用程序可以使用此模型作为起始点并以它为基础构建，或完全放弃它并
// 替换为适合其需求的其他内容。

namespace $safeprojectname$
{
	namespace Data
	{
		ref class SampleDataGroup; // 解决 SampleDataItem 和 SampleDataGroup 之间的循环关系

		/// <summary>
		/// <see cref="SampleDataItem"/> 和 <see cref="SampleDataGroup"/> 的基类，
		/// 定义对两者通用的属性。
		/// </summary>
		[Windows::Foundation::Metadata::WebHostHidden]
		[Windows::UI::Xaml::Data::Bindable]
		public ref class SampleDataCommon : $safeprojectname$::Common::BindableBase
		{
		internal:
			SampleDataCommon(Platform::String^ uniqueId, Platform::String^ title, Platform::String^ subtitle, Platform::String^ imagePath,
				Platform::String^ description);

		public:
			void SetImage(Platform::String^ path);
			virtual Platform::String^ GetStringRepresentation() override;
			property Platform::String^ UniqueId { Platform::String^ get(); void set(Platform::String^ value); }
			property Platform::String^ Title { Platform::String^ get(); void set(Platform::String^ value); }
			property Platform::String^ Subtitle { Platform::String^ get(); void set(Platform::String^ value); }
			property Windows::UI::Xaml::Media::ImageSource^ Image { Windows::UI::Xaml::Media::ImageSource^ get(); void set(Windows::UI::Xaml::Media::ImageSource^ value); }
			property Platform::String^ Description { Platform::String^ get(); void set(Platform::String^ value); }

		private:
			Platform::String^ _uniqueId;
			Platform::String^ _title;
			Platform::String^ _subtitle;
			Windows::UI::Xaml::Media::ImageSource^ _image;
			Platform::String^ _imagePath;
			Platform::String^ _description;
		};

		/// <summary>
		/// 泛型项数据模型。
		/// </summary>
		[Windows::UI::Xaml::Data::Bindable]
		public ref class SampleDataItem sealed : SampleDataCommon
		{
		public:
			SampleDataItem(Platform::String^ uniqueId, Platform::String^ title, Platform::String^ subtitle, Platform::String^ imagePath,
				Platform::String^ description, Platform::String^ content, SampleDataGroup^ group);

			property Platform::String^ Content { Platform::String^ get(); void set(Platform::String^ value); }
			property SampleDataGroup^ Group { SampleDataGroup^ get(); void set(SampleDataGroup^ value); }

		private:
			Platform::WeakReference _group; // 用于中断引用计数循环的弱引用
			Platform::String^ _content;
		};

		/// <summary>
		/// 泛型组数据模型。
		/// </summary>
		[Windows::UI::Xaml::Data::Bindable]
		public ref class SampleDataGroup sealed : public SampleDataCommon
		{
		public:
			SampleDataGroup(Platform::String^ uniqueId, Platform::String^ title, Platform::String^ subtitle, Platform::String^ imagePath,
				Platform::String^ description);
			property Windows::Foundation::Collections::IObservableVector<SampleDataItem^>^ Items
			{
				Windows::Foundation::Collections::IObservableVector<SampleDataItem^>^ get();
			}
			property Windows::Foundation::Collections::IVector<SampleDataItem^>^ TopItems
			{
				Windows::Foundation::Collections::IVector<SampleDataItem^>^ get();
			}

		private:
			Platform::Collections::Vector<SampleDataItem^>^ _items;
			Platform::Collections::Vector<SampleDataItem^>^ _topitems;
			void ItemsCollectionChanged(Windows::Foundation::Collections::IObservableVector<SampleDataItem^>^ , Windows::Foundation::Collections::IVectorChangedEventArgs^ );
		};

		/// <summary>
		/// 创建包含硬编码内容的组和项的集合。
		/// 
		/// SampleDataSource 用占位符数据而不是实时生产数据
		/// 初始化，因此在设计时和运行时均需提供示例数据。
		/// </summary>
		[Windows::UI::Xaml::Data::Bindable]
		public ref class SampleDataSource sealed
		{
		public:			
			SampleDataSource();
			property Windows::Foundation::Collections::IObservableVector<SampleDataGroup^>^ AllGroups
			{
				Windows::Foundation::Collections::IObservableVector<SampleDataGroup^>^ get();
			}
			static Windows::Foundation::Collections::IIterable<SampleDataGroup^>^ GetGroups(Platform::String^ uniqueId);
			static SampleDataGroup^ GetGroup(Platform::String^ uniqueId);
			static SampleDataItem^ GetItem(Platform::String^ uniqueId);

		private: 
			static void Init();
			Platform::Collections::Vector<SampleDataGroup^>^ _allGroups;
		};
	}
}
