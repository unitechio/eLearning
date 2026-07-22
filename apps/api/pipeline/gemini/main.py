from http.server import HTTPServer
import threading
import asyncio
import time
import ssl  # Thêm thư viện cấu hình SSL
import socket  # Thêm thư viện để tự động lấy IP LAN
from browser_manager import browser_manager
from request_handler import GeminiAPIHandler

def start_asyncio_loop(loop):
    asyncio.set_event_loop(loop)
    loop.run_until_complete(browser_manager.init_browser())
    loop.run_forever()

# Hàm tự động lấy IP LAN của máy để in ra terminal trực quan
def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        lan_ip = s.getsockname()[0]
        s.close()
        return lan_ip
    except Exception:
        return "127.0.0.1"

def main():
    new_loop = asyncio.new_event_loop()
    browser_manager.loop = new_loop
    t = threading.Thread(target=start_asyncio_loop, args=(new_loop,), daemon=True)
    t.start()
    time.sleep(2)

    server_address = ('', 8000) # Lắng nghe HTTP thuần ở cổng 8000
    httpd = HTTPServer(server_address, GeminiAPIHandler)
    print("🚀 SERVER GEMINI CORE CHẠY HTTP THUẦN TẠI PORT 8000")
    
    try: httpd.serve_forever()
    except KeyboardInterrupt: httpd.server_close()

if __name__ == "__main__":
    main()
