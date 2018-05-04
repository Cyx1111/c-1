// 这是主 DLL 文件。

#include "stdafx.h"
#include "Connect.h"

void <%=SAFEOBJNAME%>::Connect::OnAddInsUpdate(System::Array ^%custom)
{
}

void <%=SAFEOBJNAME%>::Connect::OnBeginShutdown(System::Array ^%custom)
{
}

void <%=SAFEOBJNAME%>::Connect::OnConnection(System::Object ^Application, ext_ConnectMode ConnectMode, System::Object ^AddInInst, System::Array ^%custom)
{
    _applicationObject = dynamic_cast<DTE2^>(Application);
    _addInInstance = dynamic_cast<AddIn^>(AddInInst);
    <%BEGIN VSCommand%>if(ConnectMode == ext_ConnectMode::ext_cm_UISetup)
    {
        array<System::Object^>^ contextGUIDs = gcnew array<System::Object^>(0);
        Commands2 ^commands = dynamic_cast<Commands2^>(_applicationObject->Commands);
        String ^toolsMenuName = "Tools";

        //将此命令置于“工具”菜单上。
        //查找 MenuBar 命令栏，该命令栏是容纳所有主菜单项的顶级命令栏:
        _CommandBars ^commandBars = dynamic_cast<CommandBars^>(_applicationObject->CommandBars);
        CommandBar ^menuBarCommandBar = dynamic_cast<CommandBar^>(commandBars["MenuBar"]);

        //在 MenuBar 命令栏上查找“工具”命令栏:
        CommandBarControl ^toolsControl = menuBarCommandBar->Controls[toolsMenuName];
        CommandBarPopup ^toolsPopup = dynamic_cast<CommandBarPopup^>(toolsControl);

        //如果希望添加多个由您的外接程序处理的命令，可以重复此 try/catch 块，
        //  只需确保更新 QueryStatus/Exec 方法，使其包含新的命令名。
        try
        {	
            //将一个命令添加到 Commands 集合:
            Command ^command = commands->AddNamedCommand2(_addInInstance, "<%=SAFECOMMANDNAME%>", "<%=SAFEOBJNAME%>", "Executes the command for <%=SAFEOBJNAME%>", true, 59, contextGUIDs, (int)vsCommandStatus::vsCommandStatusSupported+(int)vsCommandStatus::vsCommandStatusEnabled, (int)vsCommandStyle::vsCommandStylePictAndText, vsCommandControlType::vsCommandControlTypeButton);

            //将对应于该命令的控件添加到“工具”菜单:
            if((command) && (toolsPopup))
            {
                command->AddControl(toolsPopup->CommandBar, 1);
            }
        }
        catch(System::ArgumentException ^)
        {
            //如果出现此异常，原因很可能是由于具有该名称的命令
            //  已存在。如果确实如此，则无需重新创建此命令，并且
            //  可以放心忽略此异常。
        }
    }<%END VSCommand%>
}

void <%=SAFEOBJNAME%>::Connect::OnStartupComplete(System::Array ^%custom)
{
}

void <%=SAFEOBJNAME%>::Connect::OnDisconnection(ext_DisconnectMode removeMode, System::Array ^%custom)
{
}

<%BEGIN VSCommand%>
void <%=SAFEOBJNAME%>::Connect::Exec(String ^CmdName, vsCommandExecOption ExecuteOption, Object ^%VariantIn, Object ^%VariantOut, bool %handled)
{
    handled = false;
    if(ExecuteOption == vsCommandExecOption::vsCommandExecOptionDoDefault)
    {
        if(!CmdName->CompareTo("<%=SAFEOBJNAME%>.Connect.<%=SAFECOMMANDNAME%>"))
        {
            handled = true;
            return;
        }
    }
}

void <%=SAFEOBJNAME%>::Connect::QueryStatus(String ^CmdName, vsCommandStatusTextWanted NeededText, vsCommandStatus %StatusOption, Object ^%CommandText)
{
    if(NeededText == vsCommandStatusTextWanted::vsCommandStatusTextWantedNone)
    {
        if(!CmdName->CompareTo("<%=SAFEOBJNAME%>.Connect.<%=SAFECOMMANDNAME%>"))
        {
            StatusOption = (vsCommandStatus)(vsCommandStatus::vsCommandStatusSupported+vsCommandStatus::vsCommandStatusEnabled);
            return;
        }
    }
}<%END VSCommand%>