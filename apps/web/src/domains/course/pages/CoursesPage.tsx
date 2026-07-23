import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ShoppingCart, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { cn } from '@/shared/lib';

export interface CourseItem {
  id: string;
  title: string;
  description: string;
  domain: string;
  level: string;
  status: string;
  visibility: string;
  price: number;
  currency: string;
  thumbnail_url?: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  thumbnail_url?: string;
  level: string;
}

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('eenglish-cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToCart(item: CartItem): boolean {
  const cart = getCart();
  if (cart.some(i => i.id === item.id)) return false;
  cart.push(item);
  localStorage.setItem('eenglish-cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
  return true;
}

export function removeFromCart(id: string) {
  const cart = getCart().filter(item => item.id !== id);
  localStorage.setItem('eenglish-cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

export function clearCart() {
  localStorage.removeItem('eenglish-cart');
  window.dispatchEvent(new Event('cart-updated'));
}

export function CoursesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCart().length);
    const handleUpdate = () => setCartCount(getCart().length);
    window.addEventListener('cart-updated', handleUpdate);
    return () => window.removeEventListener('cart-updated', handleUpdate);
  }, []);

  const coursesQuery = useQuery({
    queryKey: ['courses-list'],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ data: CourseItem[] }>('/courses?page=1&page_size=100');
        return res.data.data;
      } catch {
        // Fallback Mock Data
        return [
          {
            id: "c_ielts_foundation",
            title: "IELTS Foundation — Khóa học nền tảng IELTS",
            description: "Cung cấp nền tảng từ vựng, ngữ pháp và phát âm cốt lõi để chuẩn bị bước vào lộ trình IELTS 5.0+.",
            domain: "ielts",
            level: "beginner",
            price: 199.00,
            currency: "USD",
            thumbnail_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=350&h=200&fit=crop"
          },
          {
            id: "c_ielts_intensive",
            title: "IELTS Intensive — Luyện thi IELTS chuyên sâu",
            description: "Khóa học tập trung giải đề thực tế, chia sẻ chiến thuật làm bài Reading & Listening đạt band 7.0+.",
            domain: "ielts",
            level: "intermediate",
            price: 299.00,
            currency: "USD",
            thumbnail_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=350&h=200&fit=crop"
          },
          {
            id: "c_sat_mastery",
            title: "SAT Reading & Writing Mastery",
            description: "Rèn luyện tư duy phản biện, kỹ năng đọc phân tích ngữ cảnh và làm chủ phần thi Verbal SAT.",
            domain: "sat",
            level: "advanced",
            price: 349.00,
            currency: "USD",
            thumbnail_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=350&h=200&fit=crop"
          },
          {
            id: "c_toeic_target_750",
            title: "TOEIC Target 750+ Đột Phá",
            description: "Mẹo làm bài thi TOEIC Listening & Reading hiệu quả, từ vựng thương mại thông dụng.",
            domain: "toeic",
            level: "intermediate",
            price: 149.00,
            currency: "USD",
            thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=350&h=200&fit=crop"
          }
        ] as CourseItem[];
      }
    }
  });

  const handleAddToCart = (course: CourseItem) => {
    addToCart({
      id: course.id,
      title: course.title,
      price: course.price,
      thumbnail_url: course.thumbnail_url,
      level: course.level
    });
  };

  const filteredCourses = (coursesQuery.data ?? []).filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = domainFilter === 'all' || c.domain === domainFilter;
    const matchesLevel = levelFilter === 'all' || c.level === levelFilter;
    return matchesSearch && matchesDomain && matchesLevel;
  });

  return (
    <main className="mx-auto w-full max-w-7xl p-6 lg:p-8 space-y-8 text-slate-800 dark:text-slate-100 font-sans">
      {/* Catalog Header Banner */}
      <header className="rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 p-8 text-white shadow-xl flex items-center justify-between flex-wrap gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" aria-hidden="true" />
        <section className="flex items-center gap-4 relative z-10">
          <figure className="rounded-2xl bg-white/20 p-3" aria-hidden="true">
            <GraduationCap className="h-8 w-8" />
          </figure>
          <div>
            <h1 className="text-3xl font-black tracking-tight">eEnglish Courses</h1>
            <p className="mt-1 text-red-100 max-w-md">
              Tìm kiếm khóa học tiếng Anh chuẩn quốc tế giúp bạn bứt phá điểm số IELTS, SAT, TOEIC
            </p>
          </div>
        </section>

        {/* Go to cart */}
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 bg-white text-slate-900 font-black text-xs px-5 py-3 rounded-2xl transition hover:bg-slate-50 shadow-md shrink-0 relative z-10"
        >
          <ShoppingCart className="h-4.5 w-4.5" />
          <span>Giỏ hàng</span>
          {cartCount > 0 && (
            <span className="bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-black absolute -top-1.5 -right-1.5">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Filter and Search Bar */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-950 p-5 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm" aria-label="Course filters">
        <label className="relative flex items-center w-full md:max-w-md">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm khóa học: IELTS, SAT, TOEIC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-55 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-red-500 text-slate-800 dark:text-white"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <label htmlFor="domain-select" className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              id="domain-select"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="all">Tất cả chương trình</option>
              <option value="ielts">IELTS</option>
              <option value="sat">SAT</option>
              <option value="toeic">TOEIC</option>
            </select>
          </label>

          <label htmlFor="level-select">
            <select
              id="level-select"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="all">Tất cả cấp độ</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
        </div>
      </section>

      {/* Course Grid list */}
      {coursesQuery.isLoading ? (
        <div className="py-24 text-center font-bold text-slate-400">Đang tải danh sách khóa học...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="py-24 text-center font-bold text-slate-450">Không có khóa học nào phù hợp với bộ lọc của bạn.</div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Course catalog grid">
          {filteredCourses.map(course => (
            <article 
              key={course.id}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <figure className="relative h-44 bg-slate-100 overflow-hidden" aria-label="Course cover">
                  <img 
                    alt={course.title}
                    src={course.thumbnail_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=350&h=200&fit=crop"}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-slate-950/80 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {course.domain}
                  </span>
                </figure>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-50 dark:bg-red-950/30 text-red-650 dark:text-red-400 px-2 py-0.5 rounded-md text-[9px] font-black uppercase">
                      {course.level}
                    </span>
                  </div>

                  <h2 className="text-base font-black text-slate-900 dark:text-white leading-snug line-clamp-1">
                    {course.title}
                  </h2>

                  <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-2">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Học phí</p>
                  <p className="text-base font-black text-red-600 mt-1">
                    {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/courses/${course.id}`}
                    className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 text-slate-650 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs font-bold transition hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    Chi tiết
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(course)}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition shadow-sm hover:scale-[1.01]"
                  >
                    Mua khóa học
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
