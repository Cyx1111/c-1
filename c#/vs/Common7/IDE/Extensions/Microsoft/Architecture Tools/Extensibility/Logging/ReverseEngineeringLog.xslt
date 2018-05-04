<?xml version="1.0" encoding="utf-8" ?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:log="http://schemas.microsoft.com/VisualStudio/2010/CodeGen.RE.Log">
  <xsl:output method="html" indent="yes"/>
  
  <xsl:variable name="REFileName" select="/log:Log/log:Property/@REFileName" />

  <xsl:template match="/log:Log">
    <html>
      <head>
        <style type="text/css" title="Main">
          /* <![CDATA[ */
          BODY
          {
            BACKGROUND-COLOR: white;
            FONT-FAMILY: "Verdana", sans-serif;
            FONT-SIZE: 100%;
            MARGIN-LEFT: 0px;
            MARGIN-TOP: 0px;
          }
          H1
          {
            BACKGROUND-COLOR: #003366;
            BORDER-BOTTOM: #336699 6px solid;
            COLOR: white;
            FONT-SIZE: 130%;
            FONT-WEIGHT: normal;
            MARGIN: 0em 0em 0em -20px;
            PADDING-BOTTOM: 8px;
            PADDING-LEFT: 30px;
            PADDING-TOP: 16px;
          }
          A
          {
            COLOR: white;
            TEXT-DECORATION: none;
          }
          A:hover
          {
            TEXT-DECORATION: underline;
          }
          P
          {
            FONT-FAMILY: "Verdana", sans-serif;
            FONT-SIZE: 70%;
            LINE-HEIGHT: 12pt;
            MARGIN-BOTTOM: 0px;
            MARGIN-LEFT: 10px;
            MARGIN-TOP: 10px;
          }
          .Options
          {
            BACKGROUND-COLOR: #e7e7ce;
            BORDER: 1px solid #003366;
            PADDING: 10px;
            POSITION: absolute;
            RIGHT: 0;
            TOP: 0;
          }
          .Item
          {
            FONT-SIZE: 70%;
            PADDING-LEFT: 3px;
            VERTICAL-ALIGN: top;
          }
          .High
          {
            FONT-WEIGHT: bold;
          }
          .Diagnostic
          {
            FONT-STYLE: italic;
          }
          /* ]]> */
        </style>
        <style type="text/css" title="Options">
          /* <![CDATA[ */
          .Options
          {
            DISPLAY: none;
          }
          /* ]]> */
        </style>
        <style type="text/css" title="Warning">
          /* <![CDATA[ */
          .Warning
          {
            DISPLAY: block;
          }
          /* ]]> */
        </style>
        <style type="text/css" title="Message">
          /* <![CDATA[ */
          .Message
          {
            DISPLAY: block;
          }
          /* ]]> */
        </style>
        <style type="text/css" title="Diagnostic">
          /* <![CDATA[ */
          .Diagnostic
          {
            DISPLAY: none;
          }
          /* ]]> */
        </style>
        <script type="text/javascript">
          /* <![CDATA[ */
          
          function getStylesheet(title)
          {
            for(var i=0; i<document.styleSheets.length; i++)
            {
              var stylesheet = document.styleSheets[i];
              if(stylesheet.title == title)
              {
                return stylesheet;
              }
            }
          }
          
          function replaceRule(stylesheet, selector, style, index)
          {
            stylesheet.removeRule(index);
            stylesheet.addRule(selector, style, index);
          }
          
          function toggleDisplay(id)
          {
            var stylesheet = getStylesheet(id);
            
            if (document.getElementById(id).checked)
            {
              replaceRule(stylesheet, '.' + id, 'DISPLAY: block;', 0);
            }
            else
            {
              replaceRule(stylesheet, '.' + id, 'DISPLAY: none;', 0);
            }
          }
          
          function displayOptions()
          {
            var stylesheet = getStylesheet('Options');
            replaceRule(stylesheet, '.Options', 'DISPLAY: block;', 0);
          }
          
          /* ]]> */
        </script>
      </head>
      <body onLoad="displayOptions()">
        <h1>
          Reverse Engineering Log
          <a target="_blank">
            <xsl:attribute name="href"><xsl:value-of select="$REFileName" /></xsl:attribute>
            <xsl:value-of select="$REFileName" />
          </a>
        </h1>
        <p>
          <form class="Options">
            <input type="checkbox" id="Diagnostic" onClick="toggleDisplay('Diagnostic')" />Show diagnostic messages<br/>
            <input type="checkbox" id="Message" checked="true" onClick="toggleDisplay('Message')" />Show informational messages<br/>
            <input type="checkbox" id="Warning" checked="true" onClick="toggleDisplay('Warning')" />Show warnings<br/>
          </form>
        </p>
        <p>
          <table>
            <xsl:apply-templates select="/log:Log/*" mode="items" />
          </table>
        </p>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="*[@Text]" mode="items">
    <xsl:variable name="LineInfo">
      <xsl:if test="@LineNumber != ''">
        Line <xsl:value-of select="@LineNumber"/><xsl:if test="@LinePosition != ''">, position <xsl:value-of select="@LinePosition"/></xsl:if>.
      </xsl:if>
    </xsl:variable>
    <tr>
      <xsl:attribute name="class">
        <xsl:text>Item </xsl:text>
        <xsl:value-of select="name()"/><xsl:text> </xsl:text>
        <xsl:value-of select="@Importance"/></xsl:attribute>
      <td><xsl:value-of select="name()"/></td>
      <td>:</td>
      <td><xsl:value-of select="@Text"/> <xsl:value-of select="$LineInfo"/></td>
    </tr>
  </xsl:template>

</xsl:stylesheet>