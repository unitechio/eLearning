import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { 
  BookOpen, 
  ArrowLeft, 
  ShoppingCart, 
  Check, 
  Award, 
  HelpCircle,
  FileText,
  Bookmark,
  Calendar,
  Lock
} from 'lucide-react';
import { addToCart, getCart, CourseItem } from './CoursesPage';

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Query Course by ID
  const courseQuery = useQuery({
    queryKey: ['course-detail', id],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ data: CourseItem }>(`/courses/${id}`);
        return res.data.data;
      } catch {
        // Fallback Mock Data matching the ID
        const mockCourses: Record<string, CourseItem> = {
          "c_ielts_foundation": {
            id: "c_ielts_foundation",
            title: "IELTS Foundation — Khóa học nền tảng IELTS",
            description: "Cung cấp nền tảng từ vựng, ngữ pháp và phát âm cốt lõi để chuẩn bị bước vào lộ trình IELTS 5.0+.",
            domain: "ielts",
            level: "beginner",
            price: 199.00,
            currency: "USD",
            thumbnail_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=700&h=350&fit=crop",
            status: "active",
            visibility: "public"
          },
          "c_ielts_intensive": {
            id: "c_ielts_intensive",
            title: "IELTS Intensive — Luyện thi IELTS chuyên sâu",
            description: "Khóa học tập trung giải đề thực tế, chia sẻ chiến thuật làm bài Reading & Listening đạt band 7.0+.",
            domain: "ielts",
            level: "intermediate",
            price: 299.00,
            currency: "USD",
            thumbnail_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=700&h=350&fit=crop",
            status: "active",
            visibility: "public"
          },
          "c_sat_mastery": {
            id: "c_sat_mastery",
            title: "SAT Reading & Writing Mastery",
            description: "Rèn luyện tư duy phản biện, kỹ năng đọc phân tích ngữ cảnh và làm chủ phần thi Verbal SAT.",
            domain: "sat",
            level: "advanced",
            price: 349.00,
            currency: "USD",
            thumbnail_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=700&h=350&fit=crop",
            status: "active",
            visibility: "public"
          },
          "c_toeic_target_750": {
            id: "c_toeic_target_750",
            title: "TOEIC Target 750+ Đột Phá",
            description: "Mẹo làm bài thi TOEIC Listening & Reading hiệu quả, từ vựng thương mại thông dụng.",
            domain: "toeic",
            level: "intermediate",
            price: 149.00,
            currency: "USD",
            thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=700&h=350&fit=crop",
            status: "active",
            visibility: "public"
          }
        };
        return mockCourses[id || ""] || mockCourses["c_ielts_foundation"];
      }
    }
  });

  const handleBuy = () => {
    if (courseQuery.data) {
      addToCart({
        id: courseQuery.data.id,
        title: courseQuery.data.title,
        price: courseQuery.data.price,
        thumbnail_url: courseQuery.data.thumbnail_url,
        level: courseQuery.data.level
      });
      navigate('/cart');
    }
  };

  if (courseQuery.isLoading) {
    return <div className="py-32 text-center text-slate-400 font-bold">Đang tải thông tin khóa học...</div>;
  }

  const course = courseQuery.data;
  if (!course) {
    return <div className="py-32 text-center text-slate-450 font-bold">Không tìm thấy khóa học</div>;
  }

  // Course syllabus structure
  const syllabus = [
    { title: "Module 1: Ngữ pháp cốt lõi và từ vựng cơ bản", duration: "4 tuần", lessons: 12 },
    { title: "Module 2: Rèn luyện kỹ năng nghe và đọc phân tích", duration: "4 tuần", lessons: 14 },
    { title: "Module 3: Chiến thuật viết luận ngắn và lập luận", duration: "3 tuần", lessons: 10 },
    { title: "Module 4: Mô phỏng bài thi thử và chỉnh sửa chi tiết", duration: "3 tuần", lessons: 8 },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl p-6 lg:p-8 space-y-8 text-slate-800 dark:text-slate-100 font-sans">
      {/* Back navigation */}
      <nav aria-label="Breadcrumb">
        <Link 
          to="/courses"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách khóa học</span>
        </Link>
      </nav>

      {/* Main Grid Content */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8" aria-label="Course details">
        {/* Left Side: Overview and curriculum details */}
        <article className="lg:col-span-8 space-y-6">
          <figure className="rounded-3xl overflow-hidden h-72 bg-slate-100 shadow-sm border border-slate-200 dark:border-slate-850" aria-label="Course cover image">
            <img 
              alt={course.title}
              src={course.thumbnail_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=700&h=350&fit=crop"}
              className="w-full h-full object-cover"
            />
          </figure>

          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-red-50 dark:bg-red-950/40 text-red-650 dark:text-red-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                {course.domain}
              </span>
              <span className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                Cấp độ: {course.level}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug">
              {course.title}
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              {course.description}
            </p>
          </header>

          <hr className="border-slate-200 dark:border-slate-800" aria-hidden="true" />

          {/* Curriculum */}
          <section className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Chương trình học thử</h2>
            <div className="space-y-3">
              {syllabus.map((item, idx) => (
                <article 
                  key={idx}
                  className="p-4 border border-slate-150 dark:border-slate-850 bg-white dark:bg-slate-950 rounded-2xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <figure className="h-9 w-9 bg-slate-50 dark:bg-slate-900 text-slate-500 rounded-xl flex items-center justify-center shrink-0" aria-hidden="true">
                      <BookOpen className="h-4.5 w-4.5" />
                    </figure>
                    <div>
                      <h3 className="text-xs font-black text-slate-850 dark:text-slate-200">{item.title}</h3>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">Thời lượng: {item.duration} • {item.lessons} bài giảng</p>
                    </div>
                  </div>
                  <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                </article>
              ))}
            </div>
          </section>
        </article>

        {/* Right Side: Price Banner Checkout Card */}
        <aside className="lg:col-span-4 space-y-6">
          <article className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl shadow-sm space-y-5 sticky top-24">
            <header className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Học phí trọn gói</span>
              <p className="text-3xl font-black text-red-650 mt-1">
                {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Miễn phí'}
              </p>
            </header>

            <ul className="space-y-3 text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-900 pt-4">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span>Quyền lợi sở hữu tài liệu vĩnh viễn</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span>Hỗ trợ trao đổi trực tiếp với giảng viên</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span>Cam kết đầu ra chuẩn IELTS / SAT</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={handleBuy}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-650 hover:bg-red-700 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-red-600/20"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              <span>Đăng Ký Khóa Học</span>
            </button>
          </article>
        </aside>
      </section>
    </main>
  );
}
