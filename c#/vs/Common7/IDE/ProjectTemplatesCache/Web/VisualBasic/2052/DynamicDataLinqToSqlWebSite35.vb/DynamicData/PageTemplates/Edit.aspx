﻿<%@ Page Language="VB" MasterPageFile="~/Site.master" CodeFile="Edit.aspx.vb" Inherits="Edit" %>


<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <asp:DynamicDataManager ID="DynamicDataManager1" runat="server" AutoLoadForeignKeys="true" />

    <h2>编辑表 <%= table.DisplayName %> 中的项</h2>

    <asp:ScriptManagerProxy runat="server" ID="ScriptManagerProxy1" />

    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>
            <asp:ValidationSummary ID="ValidationSummary1" runat="server" EnableClientScript="true"
                HeaderText="验证错误的列表" />
            <asp:DynamicValidator runat="server" ID="DetailsViewValidator" ControlToValidate="DetailsView1" Display="None" />

            <asp:DetailsView ID="DetailsView1" runat="server" DataSourceID="DetailsDataSource" DefaultMode="Edit"
                AutoGenerateEditButton="True" OnItemCommand="DetailsView1_ItemCommand" OnItemUpdated="DetailsView1_ItemUpdated"
                CssClass="detailstable" FieldHeaderStyle-CssClass="bold">
            </asp:DetailsView>

            <asp:LinqDataSource ID="DetailsDataSource" runat="server" EnableUpdate="true">
                <WhereParameters>
                    <asp:DynamicQueryStringParameter />
                </WhereParameters>
            </asp:LinqDataSource>
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
