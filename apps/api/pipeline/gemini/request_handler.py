from http.server import BaseHTTPRequestHandler
import urllib.parse
import json
import asyncio
from browser_manager import browser_manager

class GeminiAPIHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type='application/json'):
        self.send_response(status)
        self.send_header('Content-Type', f'{content_type}; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query_params = urllib.parse.parse_qs(parsed_url.query)

        # 1. Định tuyến Giao diện HTML
        if path in ["/", "/index.html"]:
            print(f"[API] Giao diện được gọi từ: {self.client_address[0]}")
            try:
                with open('index.html', 'rb') as file:
                    self._set_headers(200, content_type='text/html')
                    self.wfile.write(file.read())
            except FileNotFoundError:
                self._set_headers(404)
                self.wfile.write(b"Khong tim thay file index.html")
            return

        # 2. Định tuyến API /send
        elif path == "/send":
            message = query_params.get('msg', ['Xin chào'])[0]
            print(f"\n[API] Nhận yêu cầu /send: '{message}'")
            
            # Đồng bộ luồng an toàn, đẩy tác vụ vào loop của Playwright ngầm
            future = asyncio.run_coroutine_threadsafe(
                browser_manager.send_message(message), browser_manager.loop
            )
            
            try:
                result = future.result(timeout=15) 
            except Exception as e:
                result = f"Gặp lỗi xử lý luồng hệ thống: {e}"

            self._set_headers()
            self.wfile.write(json.dumps({"status": "success", "detail": result}, ensure_ascii=False).encode('utf-8'))

        # 3. Định tuyến API /get
        elif path == "/get":
            print(f"\n[API] Nhận yêu cầu /get")
            
            future = asyncio.run_coroutine_threadsafe(
                browser_manager.get_response(), browser_manager.loop
            )
            
            try:
                result = future.result(timeout=10)
            except Exception as e:
                result = f"Gặp lỗi lấy dữ liệu: {e}"

            self._set_headers()
            self.wfile.write(json.dumps({"status": "success", "data": result}, ensure_ascii=False).encode('utf-8'))
            
        else:
            if path != "/favicon.ico":
                print(f"[API] ⚠️ Yêu cầu sai mục tiêu: {path}")
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint không tồn tại"}, ensure_ascii=False).encode('utf-8'))
