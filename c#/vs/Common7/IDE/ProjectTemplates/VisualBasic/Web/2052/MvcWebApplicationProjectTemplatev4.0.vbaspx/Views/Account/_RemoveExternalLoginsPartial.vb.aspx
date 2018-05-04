<%@ Page Language="VB" Inherits="System.Web.Mvc.ViewPage(Of ICollection(Of $safeprojectname$.ExternalLogin))" %>

<% If Model.Count > 0 Then %>
    <h3>已注册外部登录</h3>
    <table>
        <tbody>
        <% For Each externalLogin As $safeprojectname$.ExternalLogin In Model %>
            <tr>
                <td><%: externalLogin.ProviderDisplayName %></td>
                <td>
                    <% If ViewData("ShowRemoveButton") Then
                        Using Html.BeginForm("Disassociate", "Account") %>
                            <%: Html.AntiForgeryToken() %>
                            <fieldset>
                                <%: Html.Hidden("provider", externalLogin.Provider) %>
                                <%: Html.Hidden("providerUserId", externalLogin.ProviderUserId) %>
                                <input type="submit" value="删除" title="从你的帐户中删除此 <%: externalLogin.ProviderDisplayName %> 凭据" />
                            </fieldset>
                        <% End Using
                    Else %>
                        &nbsp;
                    <% End If %>
                </td>
            </tr>
        <% Next %>
        </tbody>
    </table>
<% End If %>
