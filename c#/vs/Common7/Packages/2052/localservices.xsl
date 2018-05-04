<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/TR/WD-xsl">
	<xsl:template match="/">
		<h1 _locID="L_string01_Text">本地计算机上的 Web 服务</h1>
		<p _locID="L_string02_Text">下面列出了 VS.NET 开发人员计算机上可用的
			Web 服务和发现文档。单击服务链接可浏览该服务。</p>
		<table class="listpage" cellpadding="3" cellspacing="1" frame="void" bordercolor="#ffffff" rules="rows" width="100%" align="center">
    	    <xsl:choose>
				<xsl:when test="localDiscovery/contractRef">
					<tr valign="center" align="left">
						<td class="header" width="125" _locID="L_string03_Text" nowrap="true">服务</td>
						<td class="header" id="120">URL</td>
					</tr>
					<xsl:for-each select="localDiscovery/contractRef" order-by="@ref">
						<tr valign="center" align="left">
							<td class="tbltext">
								<a _locID="L_string04_Text"><xsl:attribute name="href"><xsl:value-of select="@ref"/></xsl:attribute><xsl:value-of select="@name"/></a>
							</td>
							<td class="tbltext" nowrap="true">
								<xsl:value-of select="@ref"/>
							</td>
						</tr>
					</xsl:for-each>
				</xsl:when>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="localDiscovery/discoveryRef">
					<tr valign="center" align="left">
						<td class="header" _locID="L_string05_Text">发现文档</td>
						<td class="header" _locID="L_string06_Text">URL</td>
					</tr>
					<xsl:for-each select="localDiscovery/discoveryRef" order-by="@ref">
						<tr valign="center" align="left">
							<td class="tbltext">
								<a _locID="L_string07_Text"><xsl:attribute name="href"><xsl:value-of select="@ref"/></xsl:attribute><xsl:value-of select="@name"/></a>
							</td>
							<td class="tbltext" nowrap="true">
								<xsl:value-of select="@ref"/>
							</td>
						</tr>
					</xsl:for-each>
				</xsl:when>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="discoveryError">
            		<tr valign="center" align="left">
    					<tr>
    						<td class="tbltext" colspan="2" _locID="L_string09_Text">枚举本地计算机上的服务时出错: </td>
    					</tr>
            		</tr>
					<xsl:for-each select="discoveryError">
						<tr valign="center" align="left">
							<td class="tbltext">
								<xsl:value-of select="@errorMessage"/>
							</td>
						</tr>
					</xsl:for-each>
				</xsl:when>
			</xsl:choose>

			<xsl:choose>
				<xsl:when test="localDiscovery/contractRef | localDiscovery/discoveryRef | discoveryError"></xsl:when>
				<xsl:otherwise>
					<tr>
						<td class="tbltext" colspan="2" _locID="L_string08_Text">无 - 在本地计算机上没有发现 Web 服务。</td>
					</tr>
				</xsl:otherwise>
			</xsl:choose>
		</table>
	</xsl:template>
</xsl:stylesheet>
