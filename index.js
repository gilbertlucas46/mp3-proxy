const express = require("express");
const { HttpsProxyAgent } = require("https-proxy-agent");
const { getProxies } = require("./src/proxyUtils");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  if (
    allowedOrigins.includes(origin) ||
    allowedOrigins.some(
      (allowedOrigin) => referer && referer.startsWith(allowedOrigin),
    )
  ) {
    next();
  } else {
    res.status(403).json({ error: "Access forbidden" });
  }
});

app.get("/proxy", async (req, res) => {
  const fileUrl = req.query.url;
  const customReferer = req.query.referer || process.env.DEFAULT_REFERER;
  const customOrigin = req.query.origin || process.env.DEFAULT_ORIGIN;
  const allowedUrls = process.env.ALLOWED_URLS ? process.env.ALLOWED_URLS.split(',') : [];

  if (
    !fileUrl ||
    !allowedUrls.some(url => fileUrl.startsWith(url))
  ) {
    return res.status(400).json({ error: "Invalid or missing URL" });
  }

  try {
    const proxies = await getProxies();

    if (proxies.length === 0) {
      return res
        .status(500)
        .json({ error: "No proxies available for request" });
    }

    const proxy = proxies[Math.floor(Math.random() * proxies.length)];
    const proxyUrl = `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`;
    const agent = new HttpsProxyAgent(proxyUrl);

    console.log(`Using proxy: ${proxy.host}:${proxy.port}`);

    const response = await axios.get(fileUrl, {
      httpsAgent: agent,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        Referer: customReferer,
        Origin: customOrigin,
        Accept: "*/*",
        "Accept-Encoding": "identity;q=1, *;q=0",
        Range: req.headers.range || "bytes=0-",
        Cookie: req.headers.cookie || "",
        "X-Forwarded-For": proxy.host,
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        DNT: "1",
        "sec-ch-ua":
          '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
      },
      responseType: "stream",
    });

    res.set(response.headers);
    response.data.pipe(res);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
