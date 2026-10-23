<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
<html>
<head>
<title>XML Sitemap - Jindal Foundation</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; margin: 40px; color: #1a1a1a; }
  h1 { font-size: 26px; margin-bottom: 4px; }
  p.desc { color: #444; margin-top: 0; }
  a { color: #1a4d8f; text-decoration: none; }
  a:hover { text-decoration: underline; }
  table { border-collapse: collapse; width: 100%; margin-top: 20px; }
  th { text-align: left; border-bottom: 2px solid #1a4d8f; padding: 8px 10px; font-size: 13px; color: #1a4d8f; }
  td { padding: 6px 10px; border-bottom: 1px solid #e5e5e5; font-size: 13px; word-break: break-all; }
  tr:nth-child(even) { background: #f7f9fc; }
  .count { color: #666; font-size: 14px; }
</style>
</head>
<body>

<xsl:choose>

  <!-- ============ SITEMAP INDEX (list of child sitemaps) ============ -->
  <xsl:when test="sitemap:sitemapindex">
    <h1>XML Sitemap Index</h1>
    <p class="desc">Sitemap indexes provide a list of URLs to sitemaps for search engines to crawl.<br/>
    This is a human-readable version of the sitemap; to see the actual sitemap, choose <strong>View Source</strong>.</p>
    <p class="count">Sitemaps (<xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> total)</p>
    <table>
      <tr><th>Sitemap</th><th>Last Modified</th></tr>
      <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
        <tr>
          <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
          <td><xsl:value-of select="sitemap:lastmod"/></td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:when>

  <!-- ============ URLSET (pages / images / pdfs) ============ -->
  <xsl:otherwise>
    <h1>XML Sitemap</h1>
    <p class="desc">This sitemap lists URLs for search engines to crawl.<br/>
    This is a human-readable version of the sitemap; to see the actual sitemap, choose <strong>View Source</strong>.</p>
    <p class="count">URLs (<xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> total)</p>
    <table>
      <tr>
        <th>URL</th>
        <th>Images</th>
        <th>Last Modified</th>
      </tr>
      <xsl:for-each select="sitemap:urlset/sitemap:url">
        <tr>
          <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
          <td><xsl:value-of select="count(image:image)"/></td>
          <td><xsl:value-of select="sitemap:lastmod"/></td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:otherwise>

</xsl:choose>

</body>
</html>
</xsl:template>
</xsl:stylesheet>
