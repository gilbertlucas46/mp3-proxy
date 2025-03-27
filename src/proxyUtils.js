const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");
require("dotenv").config();

let proxyCache = []; // In-memory cache for proxies

async function getProxies() {
  if (proxyCache.length > 0) {
    console.log("Using proxies from in-memory cache");
    return proxyCache;
  }

  const proxyApiUrl = process.env.PROXY_API_URL;
  if (!proxyApiUrl) {
    throw new Error(
      "PROXY_API_URL is not defined in the environment variables",
    );
  }

  try {
    const proxyListRes = await axios.get(proxyApiUrl, {
      params: { mode: "direct", page: "1", page_size: "100" },
      headers: { Authorization: `Token ${process.env.PROXY_API_TOKEN}` },
    });

    if (proxyListRes.data.results) {
      proxyCache = proxyListRes.data.results.map((proxy) => ({
        host: proxy.proxy_address,
        port: proxy.port,
        username: proxy.username,
        password: proxy.password,
      }));

      return proxyCache;
    } else {
      console.error("No proxies found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching proxies:", error);
    return [];
  }
}

module.exports = { getProxies };
