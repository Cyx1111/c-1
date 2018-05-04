' 注意: 使用上下文菜单上的“重命名”命令可以同时更改代码和配置文件中的接口名“IFeed1”。
<ServiceContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
<ServiceKnownType(GetType(Atom10FeedFormatter))>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
<ServiceKnownType(GetType(Rss20FeedFormatter))>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
Public Interface IFeed1

    <OperationContract()>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
    <WebGet(UriTemplate:="*", BodyStyle:=WebMessageBodyStyle.Bare)>$if$ ($targetframeworkversion$ <= 3.5) _$endif$
    Function CreateFeed() As SyndicationFeedFormatter

    ' TODO: 在此添加您的服务操作

End Interface
