<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="OpenAuthProviders.ascx.vb" Inherits="$safeprojectname$.OpenAuthProviders" %>
$if$ ($targetframeworkversion$ == 4.0)<%@ Import Namespace="Microsoft.AspNet.Membership.OpenAuth" %>$endif$

<fieldset class="open-auth-providers">
    <legend>使用其他服务登录</legend>
    $if$ ($targetframeworkversion$ >= 4.5)
    <asp:ListView runat="server" ID="providerDetails" ItemType="Microsoft.AspNet.Membership.OpenAuth.ProviderDetails"
        SelectMethod="GetProviderNames" ViewStateMode="Disabled">
        <ItemTemplate>
            <button type="submit" name="provider" value="<%#: Item.ProviderName %>"
                title="使用你的 <%#: Item.ProviderDisplayName %> 帐户登录。">
                <%#: Item.ProviderDisplayName %>
            </button>
        </ItemTemplate>
    $else$
    <asp:ListView runat="server" ID="providersList" ViewStateMode="Disabled">
        <ItemTemplate>
            <button type="submit" name="provider" value="<%# HttpUtility.HtmlAttributeEncode(Item(Of ProviderDetails)().ProviderName) %>"
                title="使用你的 <%# HttpUtility.HtmlAttributeEncode(Item(Of ProviderDetails)().ProviderDisplayName) %> 帐户登录。">
                <%# HttpUtility.HtmlEncode(Item(Of ProviderDetails)().ProviderDisplayName) %>
            </button>
        </ItemTemplate>
    $endif$
        <EmptyDataTemplate>
            <div class="message-info">
                <p>未配置外部身份验证服务。请参见<a href="http://go.microsoft.com/fwlink/?LinkId=252803">此文章</a>，以详细了解如何将此 ASP.NET 应用程序设置为支持通过外部服务登录。</p>
            </div>
        </EmptyDataTemplate>
    </asp:ListView>
</fieldset>