Imports System
Imports Microsoft.VisualStudio.CommandBars
Imports Extensibility
Imports EnvDTE
Imports EnvDTE80

Public Class Connect
	
    Implements IDTExtensibility2
	<%BEGIN VSCommand%>Implements IDTCommandTarget<%END VSCommand%>

    Private _applicationObject As DTE2
    Private _addInInstance As AddIn

    '''<summary>实现外接程序对象的构造函数。请将您的初始化代码置于此方法内。</summary>
    Public Sub New()

    End Sub

    '''<summary>实现 IDTExtensibility2 接口的 OnConnection 方法。接收正在加载外接程序的通知。</summary>
    '''<param name='application'>宿主应用程序的根对象。</param>
    '''<param name='connectMode'>描述外接程序的加载方式。</param>
    '''<param name='addInInst'>表示此外接程序的对象。</param>
    '''<remarks></remarks>
    Public Sub OnConnection(ByVal application As Object, ByVal connectMode As ext_ConnectMode, ByVal addInInst As Object, ByRef custom As Array) Implements IDTExtensibility2.OnConnection
        _applicationObject = CType(application, DTE2)
        _addInInstance = CType(addInInst, AddIn)
		<%BEGIN VSCommand%>If connectMode = ext_ConnectMode.ext_cm_UISetup Then

        Dim commands As Commands2 = CType(_applicationObject.Commands, Commands2)
        Dim toolsMenuName As String = "Tools"

        '将此命令置于“工具”菜单上。
        '查找 MenuBar 命令栏，该命令栏是容纳所有主菜单项的顶级命令栏:
        Dim commandBars As CommandBars = CType(_applicationObject.CommandBars, CommandBars)
        Dim menuBarCommandBar As CommandBar = commandBars.Item("MenuBar")

        '在 MenuBar 命令栏上查找“工具”命令栏:
        Dim toolsControl As CommandBarControl = menuBarCommandBar.Controls.Item(toolsMenuName)
        Dim toolsPopup As CommandBarPopup = CType(toolsControl, CommandBarPopup)

        Try
            '将一个命令添加到 Commands 集合:
            Dim command As Command = commands.AddNamedCommand2(_addInInstance, "<%=SAFECOMMANDNAME%>", "<%=SAFEOBJNAME%>", "Executes the command for <%=SAFEOBJNAME%>", True, 59, Nothing, CType(vsCommandStatus.vsCommandStatusSupported, Integer) + CType(vsCommandStatus.vsCommandStatusEnabled, Integer), vsCommandStyle.vsCommandStylePictAndText, vsCommandControlType.vsCommandControlTypeButton)

            '在 MenuBar 命令栏上查找相应的命令栏:
            command.AddControl(toolsPopup.CommandBar, 1)
        Catch argumentException As System.ArgumentException
            '如果出现此异常，原因很可能是由于具有该名称的命令
            '  已存在。如果确实如此，则无需重新创建此命令，并且
            '  可以放心忽略此异常。
        End Try

		End If<%END VSCommand%>
	End Sub

    '''<summary>实现 IDTExtensibility2 接口的 OnDisconnection 方法。接收正在卸载外接程序的通知。</summary>
    '''<param name='disconnectMode'>描述外接程序的卸载方式。</param>
    '''<param name='custom'>特定于宿主应用程序的参数数组。</param>
    '''<remarks></remarks>
    Public Sub OnDisconnection(ByVal disconnectMode As ext_DisconnectMode, ByRef custom As Array) Implements IDTExtensibility2.OnDisconnection
    End Sub

    '''<summary>实现 IDTExtensibility2 接口的 OnAddInsUpdate 方法。接收外接程序集合已更改的通知。</summary>
    '''<param name='custom'>特定于宿主应用程序的参数数组。</param>
    '''<remarks></remarks>
    Public Sub OnAddInsUpdate(ByRef custom As Array) Implements IDTExtensibility2.OnAddInsUpdate
    End Sub

    '''<summary>实现 IDTExtensibility2 接口的 OnStartupComplete 方法。接收宿主应用程序已完成加载的通知。</summary>
    '''<param name='custom'>特定于宿主应用程序的参数数组。</param>
    '''<remarks></remarks>
    Public Sub OnStartupComplete(ByRef custom As Array) Implements IDTExtensibility2.OnStartupComplete
    End Sub

    '''<summary>实现 IDTExtensibility2 接口的 OnBeginShutdown 方法。接收正在卸载宿主应用程序的通知。</summary>
    '''<param name='custom'>特定于宿主应用程序的参数数组。</param>
    '''<remarks></remarks>
    Public Sub OnBeginShutdown(ByRef custom As Array) Implements IDTExtensibility2.OnBeginShutdown
    End Sub
	<%BEGIN VSCommand%>
    '''<summary>实现 IDTCommandTarget 接口的 QueryStatus 方法。此方法在更新该命令的可用性时调用。</summary>
    '''<param name='commandName'>要确定其状态的命令的名称。</param>
    '''<param name='neededText'>该命令所需的文本。</param>
    '''<param name='status'>该命令在用户界面中的状态。</param>
    '''<param name='commandText'>neededText  参数所请求的文本。</param>
    '''<remarks></remarks>
    Public Sub QueryStatus(ByVal commandName As String, ByVal neededText As vsCommandStatusTextWanted, ByRef status As vsCommandStatus, ByRef commandText As Object) Implements IDTCommandTarget.QueryStatus
        If neededText = vsCommandStatusTextWanted.vsCommandStatusTextWantedNone Then
            If commandName = "<%=SAFEOBJNAME%>.Connect.<%=SAFECOMMANDNAME%>" Then
                status = CType(vsCommandStatus.vsCommandStatusEnabled + vsCommandStatus.vsCommandStatusSupported, vsCommandStatus)
            Else
                status = vsCommandStatus.vsCommandStatusUnsupported
            End If
        End If
    End Sub

    '''<summary>实现 IDTCommandTarget 接口的 Exec 方法。此方法在调用该命令时调用。</summary>
    '''<param name='commandName'>要执行的命令的名称。</param>
    '''<param name='executeOption'>描述该命令应如何运行。</param>
    '''<param name='varIn'>从调用方传递到命令处理程序的参数。</param>
    '''<param name='varOut'>从命令处理程序传递到调用方的参数。</param>
    '''<param name='handled'>通知调用方此命令是否已被处理。</param>
    '''<remarks></remarks>
    Public Sub Exec(ByVal commandName As String, ByVal executeOption As vsCommandExecOption, ByRef varIn As Object, ByRef varOut As Object, ByRef handled As Boolean) Implements IDTCommandTarget.Exec
        handled = False
        If executeOption = vsCommandExecOption.vsCommandExecOptionDoDefault Then
            If commandName = "<%=SAFEOBJNAME%>.Connect.<%=SAFECOMMANDNAME%>" Then
                handled = True
                Exit Sub
            End If
        End If
	End Sub<%END VSCommand%>
End Class
