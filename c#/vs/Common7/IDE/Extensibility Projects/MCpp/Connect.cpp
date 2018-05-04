// This is the main DLL file.

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

        //Place the command on the tools menu.
        //Find the MenuBar command bar, which is the top-level command bar holding all the main menu items:
        _CommandBars ^commandBars = dynamic_cast<CommandBars^>(_applicationObject->CommandBars);
        CommandBar ^menuBarCommandBar = dynamic_cast<CommandBar^>(commandBars["MenuBar"]);

        //Find the Tools command bar on the MenuBar command bar:
        CommandBarControl ^toolsControl = menuBarCommandBar->Controls[toolsMenuName];
        CommandBarPopup ^toolsPopup = dynamic_cast<CommandBarPopup^>(toolsControl);

        //This try/catch block can be duplicated if you wish to add multiple commands to be handled by your Add-in,
        //  just make sure you also update the QueryStatus/Exec method to include the new command names.
        try
        {	
            //Add a command to the Commands collection:
            Command ^command = commands->AddNamedCommand2(_addInInstance, "<%=SAFECOMMANDNAME%>", "<%=SAFEOBJNAME%>", "Executes the command for <%=SAFEOBJNAME%>", true, 59, contextGUIDs, (int)vsCommandStatus::vsCommandStatusSupported+(int)vsCommandStatus::vsCommandStatusEnabled, (int)vsCommandStyle::vsCommandStylePictAndText, vsCommandControlType::vsCommandControlTypeButton);

            //Add a control for the command to the tools menu:
            if((command) && (toolsPopup))
            {
                command->AddControl(toolsPopup->CommandBar, 1);
            }
        }
        catch(System::ArgumentException ^)
        {
            //If we are here, then the exception is probably because a command with that name
            //  already exists. If so there is no need to recreate the command and we can 
            //  safely ignore the exception.
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