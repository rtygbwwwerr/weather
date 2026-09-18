from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import json

HOST, PORT = "127.0.0.1", 8877
ROOT = Path(__file__).resolve().parent
TARGET = "https://www.smca.fun/api"

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt, *args):
        print("[wind-track]", fmt % args)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.end_headers()

    def do_GET(self):
        if self.path == "/":
            self.send_response(302)
            self.send_header("Location", "/tropical-system-tracker.html")
            self.end_headers()
            return
        if self.path.startswith("/api/"):
            return self.proxy_api()
        return super().do_GET()

    def proxy_api(self):
        parsed = urlsplit(self.path)
        target = TARGET + parsed.path[4:] + (("?" + parsed.query) if parsed.query else "")
        request = Request(target, headers={
            "User-Agent": "Mozilla/5.0 WindTrack/1.0",
            "Accept": "application/json",
            "Referer": "https://www.smca.fun/",
        })
        try:
            with urlopen(request, timeout=100) as response:
                body = response.read()
                self.send_response(response.status)
                self.send_header("Content-Type", response.headers.get("Content-Type", "application/json"))
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
        except HTTPError as error:
            body = error.read() or json.dumps({"error": str(error)}).encode()
            self.send_response(error.code)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except Exception as error:
            body = json.dumps({"error": str(error)}, ensure_ascii=False).encode("utf-8")
            self.send_response(502)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

if __name__ == "__main__":
    print(f"WindTrack running: http://{HOST}:{PORT}/tropical-system-tracker.html")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
