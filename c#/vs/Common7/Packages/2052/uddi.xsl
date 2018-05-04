<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/TR/WD-xsl">
	<xsl:template match="/">
		<h1 _locID="L_string01_Text">UDDI 服务器</h1>
		<p _locID="L_string02_Text">下面列出了局域网上可用的 UDDI 服务器。单击服务器链接可以浏览该服务器。</p>
        <table class="listpage" cellpadding="3" cellspacing="1" frame="void" bordercolor="#ffffff" rules="rows" width="100%" align="center">
    	    <xsl:choose>
				<xsl:when test="uddiservers/serverRef">
					<tr valign="center" align="left">
						<td class="header" width="125" _locID="L_string03_Text" nowrap="true">说明</td>
						<td class="header" _locID="L_string04_Text">服务器地址</td>
					</tr>
					<xsl:for-each select="uddiservers/serverRef" order-by="@ref">
						<tr valign="center" align="left">
							<td class="tbltext">
								<a _locID="L_string05_Text"><xsl:attribute name="href"><xsl:value-of select="@ref"/></xsl:attribute><xsl:value-of select="@name"/></a>
							</td>
							<td class="tbltext" nowrap="true">
								<xsl:value-of select="@ref"/>
							</td>
						</tr>
					</xsl:for-each>
				</xsl:when>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="uddiservers/serverRef"></xsl:when>
				<xsl:otherwise>
					<tr>
						<td class="tbltext" colspan="2" _locID="L_string06_Text">在本地网络上没有发现 UDDI 服务器。</td>
					</tr>
				</xsl:otherwise>
			</xsl:choose>
		</table>
	</xsl:template>
</xsl:stylesheet>
