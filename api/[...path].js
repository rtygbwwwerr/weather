module.exports = async (req, res) => {
  const rawPath = String(req.url || "").replace(/^\/api\/?/, "");
  if (!rawPath || rawPath.includes("://") || rawPath.startsWith("//")) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Invalid API path" }));
    return;
  }

  const target = new URL(rawPath, "https://www.smca.fun/api/");
  try {
    const upstream = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 WindTrack/1.0",
        "Accept": "application/json",
        "Referer": "https://www.smca.fun/"
      }
    });
    const body = Buffer.from(await upstream.arrayBuffer());
    res.statusCode = upstream.status;
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(body);
  } catch (error) {
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: String(error.message || error) }));
  }
};
