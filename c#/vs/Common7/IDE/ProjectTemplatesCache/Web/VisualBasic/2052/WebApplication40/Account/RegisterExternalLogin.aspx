<%@ Page Language="VB" MasterPageFile="~/Site.master" AutoEventWireup="false" CodeFile="RegisterExternalLogin.aspx.vb" Inherits="Account_RegisterExternalLogin" %>
<asp:Content ContentPlaceHolderID="MainContent" Runat="Server">
    <hgroup class="title">
        <h1>使用你的 <%: ProviderDisplayName %> 帐户注册</h1>
        <h2><%: ProviderUserName %>.</h2>
    </hgroup>

    $if$ ($targetframeworkversion$ >= 4.5)
    <asp:ModelErrorMessage runat="server" ModelStateKey="Provider" CssClass="field-validation-error" />
    $else$
    <asp:Label runat="server" ID="providerMessage" CssClass="field-validation-error" />
    $endif$

    <asp:PlaceHolder runat="server" ID="userNameForm">
        <fieldset>
            <legend>关联表单</legend>
            <p>
                你已作为 <strong><%: ProviderUserName %></strong>，使用名称 <strong><%: ProviderDisplayName %></strong>
                进行身份验证。请在下面输入当前站点的用户名，
                然后单击“登录”按钮。
            </p>
            <ol>
                <li class="email">
                    <asp:Label runat="server" AssociatedControlID="userName">用户名</asp:Label>
                    <asp:TextBox runat="server" ID="userName" />
                    <asp:RequiredFieldValidator runat="server" ControlToValidate="userName"
                        Display="Dynamic" ErrorMessage="必须填写用户名" ValidationGroup="NewUser" />
                    $if$ ($targetframeworkversion$ >= 4.5)
                    <asp:ModelErrorMessage runat="server" ModelStateKey="UserName" CssClass="field-validation-error" />
                    $else$
                    <asp:Label runat="server" ID="userNameMessage" CssClass="field-validation-error" />
                    $endif$
                </li>
            </ol>
            <asp:Button runat="server" Text="登录" ValidationGroup="NewUser" OnClick="logIn_Click" />
            <asp:Button runat="server" Text="取消" CausesValidation="false" OnClick="cancel_Click" />
        </fieldset>
    </asp:PlaceHolder>
</asp:Content>
