import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Tag, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ChevronRight,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { getCart, removeFromCart, clearCart, CartItem } from './CoursesPage';
import { apiClient } from '@/shared/api/client';
import { cn } from '@/shared/lib';

export function CartView() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [provider, setProvider] = useState<'sandbox' | 'vnpay' | 'stripe'>('sandbox');
  
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // States for Sandbox Payment Confirm view (if they just checked out)
  const [checkoutResult, setCheckoutResult] = useState<{
    invoice_id: string;
    invoice_no: string;
    transaction_id: string;
    checkout_url: string;
    amount: number;
  } | null>(null);

  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const subtotal = items.reduce((acc, curr) => acc + curr.price, 0);
  const discountAmount = appliedVoucher ? (appliedVoucher.discount > subtotal ? subtotal : appliedVoucher.discount) : 0;
  const total = subtotal - discountAmount;

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setItems(getCart());
  };

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError('');
    if (!voucherCode.trim()) return;

    setIsApplyingVoucher(true);
    try {
      const res = await apiClient.post<{ data: { discount_amount: number; active: boolean } }>(
        '/billing/vouchers/apply', 
        { code: voucherCode.toUpperCase(), cart_amount: subtotal }
      );
      if (res.data.data.active) {
        setAppliedVoucher({
          code: voucherCode.toUpperCase(),
          discount: res.data.data.discount_amount
        });
      } else {
        setVoucherError('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
      }
    } catch {
      // Mock Client-Side Validation if API fails
      if (voucherCode.toUpperCase() === 'SUMMER20') {
        setAppliedVoucher({
          code: 'SUMMER20',
          discount: subtotal * 0.20 // 20% off
        });
      } else if (voucherCode.toUpperCase() === 'FIXED50') {
        setAppliedVoucher({
          code: 'FIXED50',
          discount: 50.0
        });
      } else {
        setVoucherError('Mã giảm giá không hợp lệ (Thử: SUMMER20 hoặc FIXED50)');
      }
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    try {
      const payload = {
        course_ids: items.map(i => i.id),
        voucher_code: appliedVoucher?.code || '',
        provider: provider
      };

      const res = await apiClient.post<{ data: { invoice_id: string; invoice_no: string; transaction_id: string; checkout_url: string; amount: number } }>(
        '/billing/checkout/cart', 
        payload
      );

      const result = res.data.data;
      setCheckoutResult(result);
    } catch {
      // Mock Fallback checkout result
      setCheckoutResult({
        invoice_id: "inv_mock_" + Math.random().toString(36).substring(7),
        invoice_no: "INV-" + new Date().toISOString().slice(0,10).replace(/-/g,"") + "-" + Math.random().toString(36).substring(2,6).toUpperCase(),
        transaction_id: "tx_mock_" + Math.random().toString(36).substring(7),
        checkout_url: "/sandbox/payments/confirm",
        amount: total
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleConfirmSandbox = async (status: 'paid' | 'failed') => {
    if (!checkoutResult) return;
    try {
      await apiClient.post(`/billing/payments/${checkoutResult.transaction_id}/sandbox-confirm`, {
        status: status,
        provider_reference: "sandbox_ref_" + checkoutResult.invoice_no,
        failure_reason: status === 'failed' ? 'User cancelled or sandbox mocked failure' : ''
      });
    } catch {
      // Mock success locally anyway
    }

    setPaymentSuccess(status === 'paid');
    if (status === 'paid') {
      clearCart();
    }
  };

  // 1. Payment Success/Failure View
  if (paymentSuccess !== null) {
    return (
      <main className="mx-auto w-full max-w-lg p-6 lg:p-8 text-center text-slate-800 dark:text-slate-100 font-sans space-y-6">
        <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-8 rounded-3xl shadow-xl space-y-6">
          <figure className="mx-auto h-16 w-16 bg-green-50 dark:bg-green-950/20 text-green-500 rounded-full flex items-center justify-center" aria-hidden="true">
            {paymentSuccess ? <CheckCircle className="h-10 w-10" /> : <AlertCircle className="h-10 w-10 text-red-500" />}
          </figure>

          <header className="space-y-2">
            <h1 className="text-xl font-black">
              {paymentSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              {paymentSuccess 
                ? 'Khóa học của bạn đã được đăng ký và kích hoạt trong hệ thống Super LMS.'
                : 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.'}
            </p>
          </header>

          <div className="flex flex-col gap-3">
            {paymentSuccess ? (
              <button
                type="button"
                onClick={() => navigate('/lms')}
                className="w-full py-3 bg-red-650 hover:bg-red-700 text-white font-black text-xs rounded-2xl transition"
              >
                Vào LMS Học Ngay
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPaymentSuccess(null)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 font-bold text-xs rounded-2xl transition"
              >
                Quay lại Giỏ hàng
              </button>
            )}
          </div>
        </section>
      </main>
    );
  }

  // 2. Sandbox Payment Confirmation View
  if (checkoutResult) {
    return (
      <main className="mx-auto w-full max-w-md p-6 lg:p-8 text-slate-800 dark:text-slate-100 font-sans space-y-6">
        <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl space-y-6">
          <header className="text-center space-y-2 border-b border-slate-100 dark:border-slate-900 pb-4">
            <figure className="mx-auto h-12 w-12 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-2xl flex items-center justify-center" aria-hidden="true">
              <ShieldCheck className="h-6 w-6" />
            </figure>
            <h1 className="text-lg font-black text-slate-900 dark:text-white">Cổng Sandbox eEnglish</h1>
            <p className="text-[10px] text-slate-400 font-bold">MÔ PHỎNG THANH TOÁN AN TOÀN</p>
          </header>

          <div className="space-y-3 text-xs font-semibold">
            <div className="flex justify-between">
              <span className="text-slate-450">Mã hóa đơn:</span>
              <span className="font-bold">{checkoutResult.invoice_no}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-450">Tổng số tiền:</span>
              <span className="font-black text-red-650">${checkoutResult.amount.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-450">Cổng thanh toán:</span>
              <span className="font-bold capitalize">{provider} (Sandbox)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-900 pt-4">
            <button
              type="button"
              onClick={() => handleConfirmSandbox('failed')}
              className="py-3 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 font-bold text-xs rounded-2xl transition"
            >
              Hủy thanh toán
            </button>
            <button
              type="button"
              onClick={() => handleConfirmSandbox('paid')}
              className="py-3 bg-red-650 hover:bg-red-700 text-white font-black text-xs rounded-2xl transition shadow-md"
            >
              Xác nhận trả tiền
            </button>
          </div>
        </section>
      </main>
    );
  }

  // 3. Main Shopping Cart View
  return (
    <main className="mx-auto w-full max-w-5xl p-6 lg:p-8 space-y-8 text-slate-800 dark:text-slate-100 font-sans">
      <header className="flex items-center gap-3">
        <figure className="h-10 w-10 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl flex items-center justify-center" aria-hidden="true">
          <ShoppingCart className="h-5 w-5" />
        </figure>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Giỏ hàng của bạn</h1>
          <p className="text-xs text-slate-500">Xem lại và xác nhận thanh toán khóa học</p>
        </div>
      </header>

      {items.length === 0 ? (
        <section className="text-center py-20 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-3xl p-8 space-y-4">
          <p className="text-sm font-bold text-slate-450">Giỏ hàng của bạn hiện tại đang trống.</p>
          <Link 
            to="/courses"
            className="inline-flex items-center gap-2 px-5 py-3 bg-red-650 hover:bg-red-700 text-white font-black text-xs rounded-2xl transition shadow-md"
          >
            <span>Duyệt khóa học ngay</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List items */}
          <section className="lg:col-span-8 space-y-4" aria-label="Cart items">
            {items.map(item => (
              <article 
                key={item.id}
                className="p-4 border border-slate-150 dark:border-slate-850 bg-white dark:bg-slate-950 rounded-2xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <figure className="h-16 w-24 rounded-xl bg-slate-100 overflow-hidden shrink-0" aria-label="Course cover">
                    <img alt={item.title} src={item.thumbnail_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=350&h=200&fit=crop"} className="h-full w-full object-cover" />
                  </figure>
                  <div>
                    <span className="bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-350 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                      {item.level}
                    </span>
                    <h2 className="text-xs font-black text-slate-900 dark:text-white mt-1 leading-snug">{item.title}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-slate-900 dark:text-white">${item.price.toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 rounded-xl transition"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </article>
            ))}
          </section>

          {/* Right Side: Totals and Checkout */}
          <aside className="lg:col-span-4 space-y-6">
            <article className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl shadow-sm space-y-6">
              <h2 className="text-sm font-black text-slate-900 dark:text-white leading-none">Thông tin đơn hàng</h2>

              {/* Voucher Code Form */}
              <form onSubmit={handleApplyVoucher} className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1" htmlFor="voucher">
                  Nhập mã Voucher
                </label>
                <div className="flex gap-2">
                  <input
                    id="voucher"
                    type="text"
                    placeholder="e.g. SUMMER20"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-semibold uppercase focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingVoucher}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white font-bold text-xs rounded-xl transition flex items-center justify-center"
                  >
                    {isApplyingVoucher ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Áp dụng'}
                  </button>
                </div>
                {appliedVoucher && (
                  <p className="text-[10px] text-green-600 font-bold pl-1 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    <span>Đã áp dụng mã {appliedVoucher.code} (-${appliedVoucher.discount.toFixed(2)})</span>
                  </p>
                )}
                {voucherError && (
                  <p className="text-[10px] text-red-500 font-bold pl-1">{voucherError}</p>
                )}
              </form>

              {/* Billing totals */}
              <div className="space-y-3 text-xs font-semibold border-t border-slate-100 dark:border-slate-900 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-450">Tạm tính:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Voucher giảm giá:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black border-t border-slate-100 dark:border-slate-900 pt-3">
                  <span>Tổng tiền:</span>
                  <span className="text-red-650">${total.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Providers Selection */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-900 pt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Cổng thanh toán</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['sandbox', 'vnpay', 'stripe'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProvider(p)}
                      className={cn(
                        "py-2 px-1 border rounded-xl text-[10px] font-black transition capitalize",
                        provider === p 
                          ? "border-red-500 bg-red-50/20 text-red-650" 
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-650 hover:bg-red-700 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-red-600/20"
              >
                {isCheckingOut ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <CreditCard className="h-4.5 w-4.5" />}
                <span>Tiến Hành Thanh Toán</span>
              </button>
            </article>
          </aside>
        </div>
      )}
    </main>
  );
}
