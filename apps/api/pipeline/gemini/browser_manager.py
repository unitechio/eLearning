import asyncio
from playwright.async_api import async_playwright

class BrowserManager:
    def __init__(self):
        self.browser = None
        self.loop = None
        self.playwright_context = None

    async def init_browser(self):
        print("[DEBUG] Đang cố gắng kết nối tới Chrome qua cổng 9222...")
        self.playwright_context = await async_playwright().start()
        try:
            self.browser = await self.playwright_context.chromium.connect_over_cdp("http://localhost:9222")
            print("-> [OK] Playwright đã liên kết thành công với Chrome!")
            return True
        except Exception as e:
            print(f"-> [LỖI]: Không kết nối được Chrome Port 9222: {e}")
            return False

    async def get_active_page(self):
        """Luôn lấy tab mới nhất đang hiển thị để chống crash hệ thống"""
        if not self.browser or not self.browser.contexts:
            return None
        context = self.browser.contexts[0]
        pages = context.pages
        
        if len(pages) > 0:
            page = pages[-1]
            try:
                # Gỡ bộ lắng nghe cũ nếu có để tránh lặp log rác
                page.remove_listener("console", lambda msg: None)
                
                # Bộ lọc log rác từ hệ thống quảng cáo/analytics của Google
                def filtered_logger(msg):
                    text = msg.text
                    ignore_keywords = ["preloaded using link preload", "Content Security Policy", "doubleclick.net", "google-audiences"]
                    if not any(kw in text for kw in ignore_keywords):
                        print(f"   └─> [BROWSER LOG] {text}")

                page.on("console", filtered_logger)
            except Exception:
                pass
            return page
        else:
            print("💡 Không tìm thấy tab nào mở sẵn, đang tạo tab mới...")
            page = await context.new_page()
            await page.goto("https://gemini.google.com/app")
            return page

    async def send_message(self, message):
        page = await self.get_active_page()
        if not page: return "Lỗi: Trình duyệt chưa sẵn sàng"
        
        if "gemini.google.com" not in page.url:
            print("🔄 Trình duyệt đang ở trang khác, chuyển hướng về Gemini...")
            await page.goto("https://gemini.google.com/app")
            await asyncio.sleep(2)

        print(f"[DEBUG] Đang thực thi gửi tin (Safe Mode)...")
        
        script = """
        async (msg) => {
            try {
                const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                console.log("Bắt đầu quy trình điền dữ liệu...");
                
                // 1. Tìm ô nhập liệu dựa trên các Selector của Gemini
                const textbox = document.querySelector('[role="textbox"]') || 
                                document.querySelector('div[contenteditable="true"]') ||
                                document.querySelector('.textarea');
                                
                if (!textbox) {
                    console.error("Lỗi: Không tìm thấy ô nhập liệu.");
                    return "Lỗi: Không tìm thấy ô nhập liệu.";
                }
                
                // 2. Focus và làm sạch ô nhập liệu
                textbox.focus();
                await wait(200);
                document.execCommand('selectAll', false, null);
                document.execCommand('delete', false, null);
                await wait(100);
                
                // 3. Thực hiện chèn text an toàn từ biến msg
                document.execCommand('insertText', false, msg);
                
                // Kích hoạt sự kiện để Gemini nhận diện ký tự mới
                textbox.dispatchEvent(new Event('input', { bubbles: true }));
                textbox.dispatchEvent(new Event('change', { bubbles: true }));
                console.log("Đã điền text câu hỏi.");
                await wait(600); // Đợi 0.6 giây để nút gửi chuyển sang trạng thái sẵn sàng (Enabled)
                
                // 4. SỬA ĐỔI TẠI ĐÂY: Chỉ định chính xác thẻ BUTTON có aria-label cụ thể để không bị click trượt
                const sendButton = document.querySelector('button[aria-label="Send message"]') || 
                                   document.querySelector('button[aria-label*="gửi"]') || 
                                   document.querySelector('button[aria-label*="Send"]') ||
                                   document.querySelector('.send-button-container button');
                                   
                if (sendButton && !sendButton.disabled) {
                    sendButton.click();
                    console.log("Hoàn tất: Đã click chính xác nút BUTTON gửi!");
                    return "Đã click gửi thành công!";
                } else {
                    console.log("Nút gửi bị ẩn/disabled hoặc trượt, kích hoạt phím Enter để gửi trực tiếp...");
                    // Giải pháp giả lập phím Enter chuẩn để gửi bài ngay lập tức từ Textbox
                    textbox.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Enter', 'code': 'Enter', 'keyCode': 13, 'bubbles': true }));
                    return "Đã gửi bằng sự kiện phím Enter.";
                }
            } catch (js_err) {
                console.error("[JS-CRASH] Lỗi trong script gửi tin:", js_err.message);
                return "Lỗi nội bộ JS: " + js_err.message;
            }
        }
        """
        try:
            return await page.evaluate(script, message)
        except Exception as e:
            print(f"[PYTHON-CRASH] Lỗi nghiêm trọng khi thực thi lệnh gửi: {e}")
            return f"Lỗi hệ thống: {e}"

    async def get_response(self):
        page = await self.get_active_page()
        if not page: return "Lỗi: Trình duyệt chưa sẵn sàng"
        print("[DEBUG] Đang cào dữ liệu từ Gemini...")
        
        # 🎯 CHUẨN HÓA THEO CẤU TRÚC GETLATESTMESSAGECONTENT CỦA BẠN
        script = """
        () => {
            try {
                console.log("Tìm kiếm nút Regenerate...");
                // 1. Tìm nút Regenerate
                const regenerateBtn = document.querySelector('[data-test-id="regenerate-button"]') ||
                                      document.querySelector('button[aria-label*="Chia sẻ"]'); // Dự phòng nếu nút bị ẩn
                
                if (!regenerateBtn) {
                    console.log("Không tìm thấy nút Regenerate.");
                    return "Đang chờ phản hồi (Chưa xuất hiện nút câu trả lời)...";
                }
                
                // 2. Đi lên thẻ cha chung (model-response)
                const parent = regenerateBtn.closest('model-response');
                
                if (parent) {
                    console.log("Tìm thấy khối model-response. Đang gom văn bản...");
                    // 3. Tìm các khối nội dung trong thẻ cha đó
                    const elements = Array.from(parent.querySelectorAll('p, li, pre, code'));
                    
                    if (elements.length === 0) {
                        return "Tìm thấy khối phản hồi nhưng chưa có text hiển thị.";
                    }
                    
                    // Lọc bỏ các phần tử con lặp lại do lồng nhau
                    const filteredElements = elements.filter(el => {
                        let ancestor = el.parentElement;
                        while (ancestor && ancestor !== parent) {
                            if (elements.includes(ancestor)) {
                                return false;
                            }
                            ancestor = ancestor.parentElement;
                        }
                        return true;
                    });
                    
                    const content = filteredElements.map(el => el.innerText).join('\\n');
                    return content;
                }
                
                return "Không tìm thấy khối nội dung cùng cấp (model-response).";
            } catch (js_err) {
                console.error("[JS-CRASH] Lỗi trong script cào dữ liệu:", js_err.message);
                return "Lỗi nội bộ JS: " + js_err.message;
            }
        }
        """
        try:
            return await asyncio.wait_for(page.evaluate(script), timeout=6.0)
        except asyncio.TimeoutError:
            return "Lỗi: Trình duyệt không phản hồi lệnh cào dữ liệu (Timeout)."
        except Exception as e:
            print(f"[PYTHON-CRASH] Lỗi hệ thống khi cào dữ liệu: {e}")
            return f"Lỗi hệ thống: {e}"

browser_manager = BrowserManager()
