exports.handler = async (event) => {
  const path = String(event.path || "").replace(/^\/api\/?/, "");
  if (!path || path.includes("://") || path.startsWith("//")) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: "Invalid API path" })
    };
  }

  const target = new URL(path + (event.rawQuery ? "?" + event.rawQuery : ""), "https://www.smca.fun/api/");
  try {
    const upstream = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 WindTrack/1.0",
        "Accept": "application/json",
        "Referer": "https://www.smca.fun/"
      }
    });
    const buffer = Buffer.from(await upstream.arrayBuffer());
    return {
      statusCode: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*"
      },
      body: buffer.toString("base64"),
      isBase64Encoded: true
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: String(error.message || error) })
    };
  }
};
