export interface AdminCourse {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  domain: string;
  level?: string;
  status?: string;
  visibility?: string;
  price: number;
  original_price: number;
  currency?: string;
  thumbnail_url?: string;
  category_id?: string | null;
  category_name?: string;
  category_color?: string;
  instructor_id?: string | null;
  instructor_name?: string;
  video_preview_url?: string;
  what_you_learn?: string[];
  tools_used?: string;
  has_certificate?: boolean;
  rating?: number;
  review_count?: number;
  enrollment_count?: number;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface CourseCategoryPayload {
  name: string;
  slug?: string;
  color?: string;
}

export interface CourseResource {
  id: string;
  course_id: string;
  name: string;
  storage_key: string;
  mime_type?: string;
  size_bytes?: number;
  uploaded_by?: string;
  created_at?: string;
}

export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string;
  user_name?: string;
  rating: number;
  comment?: string;
  created_at?: string;
}

export interface AdminCourseDetail {
  course: AdminCourse;
  modules: Array<{
    id: string;
    course_id: string;
    title: string;
    order: number;
  }>;
  resources: CourseResource[];
  reviews: CourseReview[];
}

export interface CourseListQuery {
  page?: number;
  page_size?: number;
  q?: string;
  domain?: string;
  level?: string;
  status?: string;
  category_id?: string;
  author_id?: string;
}
