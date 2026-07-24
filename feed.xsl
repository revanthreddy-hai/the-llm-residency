<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  exclude-result-prefixes="atom">
  <xsl:output method="html" encoding="utf-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="atom:feed/atom:title"/> · Feed</title>
        <style>
          :root { color-scheme: light dark; }
          body { margin:0; background:#f9f9f7; color:#0b0b0b; font-family:Georgia, "Times New Roman", serif; line-height:1.65; }
          .wrap { max-width: 40rem; margin: 0 auto; padding: 52px 20px; }
          h1 { font-weight:500; font-size:1.9rem; letter-spacing:-0.01em; margin:0 0 8px; }
          .note { color:#52514e; font-size:0.98rem; margin:0 0 18px; }
          .box { background:#fcfcfb; border:1px solid #e1e0d9; border-radius:12px; padding:14px 18px;
                 font-family:ui-monospace, Menlo, monospace; font-size:0.85rem; word-break:break-all; margin-bottom:34px; }
          a { color:#0f766e; }
          .entry { padding:18px 0; border-top:1px solid #e1e0d9; }
          .entry a { font-size:1.15rem; font-weight:500; text-decoration:none; color:#0b0b0b; }
          .entry a:hover { color:#0f766e; }
          .meta { font-family:ui-monospace, Menlo, monospace; font-size:0.72rem; letter-spacing:0.06em;
                  color:#52514e; display:block; margin-top:5px; }
          .entry p { margin:0.45rem 0 0; font-size:0.95rem; color:#52514e; }
          .back { margin-top:30px; }
          @media (prefers-color-scheme: dark) {
            body { background:#0d0d0d; color:#f2f1ee; }
            .box { background:#1a1a19; border-color:#2c2c2a; }
            .note, .meta, .entry p { color:#c3c2b7; }
            a, .entry a:hover { color:#2fb5a8; }
            .entry a { color:#f2f1ee; }
            .entry { border-top-color:#2c2c2a; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1><xsl:value-of select="atom:feed/atom:title"/></h1>
          <p class="note">Paste this address into any RSS reader to get new posts:</p>
          <div class="box"><xsl:value-of select="atom:feed/atom:link[@rel='self']/@href"/></div>
          <xsl:for-each select="atom:feed/atom:entry">
            <div class="entry">
              <a>
                <xsl:attribute name="href"><xsl:value-of select="atom:link/@href"/></xsl:attribute>
                <xsl:value-of select="atom:title"/>
              </a>
              <span class="meta"><xsl:value-of select="substring(atom:published, 1, 10)"/></span>
              <p><xsl:value-of select="atom:summary"/></p>
            </div>
          </xsl:for-each>
          <p class="note back"><a href="index.html">Back to The LLM Residency</a></p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
