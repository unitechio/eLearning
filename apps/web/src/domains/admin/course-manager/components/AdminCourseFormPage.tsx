import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Settings, Bell, Save, ArrowLeft, HelpCircle } from 'lucide-react';
import { AdminCourse } from '../types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  useCourseCategories,
  useCreateCourse,
  useUpdateCourse,
  useAdminCourseDetail
} from '../api/courseManagerHooks';

export const AdminCourseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  // Queries/Mutations
  const { data: categories = [] } = useCourseCategories();
  const { data: detail, isLoading: isLoadingDetail } = useAdminCourseDetail(id || '', isEdit);
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'detail' | 'notification'>('detail');

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('English');
  const [level, setLevel] = useState('beginner');
  const [status, setStatus] = useState('draft');
  const [visibility, setVisibility] = useState('public');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [toolsUsed, setToolsUsed] = useState('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [hasCertificate, setHasCertificate] = useState(false);
  const [whatYouLearn, setWhatYouLearn] = useState<string[]>([]);
  const [newLearnItem, setNewLearnItem] = useState('');

  // Notification Fields Mockup
  const [notifyOnPublish, setNotifyOnPublish] = useState(true);
  const [notifyOnEnroll, setNotifyOnEnroll] = useState(false);
  const [welcomeEmailTemplate, setWelcomeEmailTemplate] = useState('default_welcome');

  // Load course details for editing
  useEffect(() => {
    if (isEdit && detail?.course) {
      const course = detail.course;
      setTitle(course.title || '');
      setSubtitle(course.subtitle || '');
      setDescription(course.description || '');
      setDomain(course.domain || 'English');
      setLevel(course.level || 'beginner');
      setStatus(course.status || 'draft');
      setVisibility(course.visibility || 'public');
      setPrice(course.price || 0);
      setOriginalPrice(course.original_price || 0);
      setThumbnailUrl(course.thumbnail_url || '');
      setCategoryId(course.category_id || '');
      setToolsUsed(course.tools_used || '');
      setVideoPreviewUrl(course.video_preview_url || '');
      setHasCertificate(!!course.has_certificate);
      setWhatYouLearn(course.what_you_learn || []);
    }
  }, [detail, isEdit]);

  const handleAddLearnItem = () => {
    if (newLearnItem.trim()) {
      setWhatYouLearn([...whatYouLearn, newLearnItem.trim()]);
      setNewLearnItem('');
    }
  };

  const handleRemoveLearnItem = (index: number) => {
    setWhatYouLearn(whatYouLearn.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !domain.trim()) return;

    const payload: Partial<AdminCourse> = {
      title,
      subtitle,
      description,
      domain,
      level,
      status,
      visibility,
      price,
      original_price: originalPrice,
      thumbnail_url: thumbnailUrl,
      category_id: categoryId || null,
      video_preview_url: videoPreviewUrl,
      what_you_learn: whatYouLearn,
      tools_used: toolsUsed,
      has_certificate: hasCertificate
    };

    if (isEdit && id) {
      updateMutation.mutate(
        { id, payload },
        {
          onSuccess: () => navigate('/admin/courses')
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => navigate('/admin/courses')
      });
    }
  };

  if (isEdit && isLoadingDetail) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-400 font-medium">
        Loading course configuration...
      </div>
    );
  }

  return (
    <section className="p-6 space-y-6 flex flex-col max-w-5xl mx-auto">
      {/* Custom Breadcrumb Header */}
      <header className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav aria-label="breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>Courses & Programs</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-500 hover:text-slate-700 cursor-pointer" onClick={() => navigate('/admin/courses')}>
              Courses
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-slate-100">
              {isEdit ? 'Edit Course' : 'Create Course'}
            </span>
          </nav>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/courses')}
              type="button"
              className="text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400 mr-1.5"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {isEdit ? 'Edit Course Settings' : 'Create new course'}
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isEdit ? 'Update the details and content structure of this course.' : 'Establish your core curriculum and publish parameters.'}
          </p>
        </div>
      </header>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 dark:border-slate-850 gap-6">
        <button
          type="button"
          className={`flex items-center gap-2 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'detail'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          onClick={() => setActiveTab('detail')}
        >
          <Settings className="h-4 w-4" />
          <span>Course Detail</span>
        </button>
        <button
          type="button"
          className={`flex items-center gap-2 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'notification'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          onClick={() => setActiveTab('notification')}
        >
          <Bell className="h-4 w-4" />
          <span>Course Notification</span>
        </button>
      </div>

      {/* Form Details */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 space-y-6">
          {activeTab === 'detail' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label htmlFor="course-title" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Course Title
                  </label>
                  <Input
                    id="course-title"
                    placeholder="e.g. Masterclass UI/UX Design"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div className="md:col-span-2">
                  <label htmlFor="course-subtitle" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Subtitle / Brief Description
                  </label>
                  <Input
                    id="course-subtitle"
                    placeholder="e.g. Learn design systems, prototyping, wireframing, and animations."
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="course-desc" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Full Description
                  </label>
                  <Textarea
                    id="course-desc"
                    placeholder="Explain what this course is about in details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm min-h-[120px]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="course-category" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Category
                  </label>
                  <select
                    id="course-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label htmlFor="course-level" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Level
                  </label>
                  <select
                    id="course-level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Domain */}
                <div>
                  <label htmlFor="course-domain" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Domain
                  </label>
                  <Input
                    id="course-domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="course-price" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Sale Price ($)
                  </label>
                  <Input
                    id="course-price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                    min={0}
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label htmlFor="course-orig-price" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Original Price ($)
                  </label>
                  <Input
                    id="course-orig-price"
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                    min={0}
                  />
                </div>

                {/* Thumbnail URL */}
                <div>
                  <label htmlFor="course-thumbnail" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Thumbnail URL
                  </label>
                  <Input
                    id="course-thumbnail"
                    placeholder="https://..."
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                  />
                </div>

                {/* Video Preview URL */}
                <div>
                  <label htmlFor="course-video" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Video Preview URL
                  </label>
                  <Input
                    id="course-video"
                    placeholder="https://youtube.com/..."
                    value={videoPreviewUrl}
                    onChange={(e) => setVideoPreviewUrl(e.target.value)}
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                  />
                </div>

                {/* Tools Used */}
                <div>
                  <label htmlFor="course-tools" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                    Tools Used (comma separated)
                  </label>
                  <Input
                    id="course-tools"
                    placeholder="Figma, Miro, Notion"
                    value={toolsUsed}
                    onChange={(e) => setToolsUsed(e.target.value)}
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                  />
                </div>

                {/* Certificate & Status */}
                <div className="flex flex-col gap-4 border border-slate-100 rounded-lg p-3 dark:border-slate-800 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <input
                      id="cert-check"
                      type="checkbox"
                      checked={hasCertificate}
                      onChange={(e) => setHasCertificate(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="cert-check" className="text-sm font-bold text-slate-850 dark:text-slate-200 cursor-pointer">
                      Earn Certificate on Completion
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label htmlFor="status-select" className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                      <select
                        id="status-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-xs ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="visibility-select" className="block text-xs font-bold text-slate-500 mb-1">Visibility</label>
                      <select
                        id="visibility-select"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-xs ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* What you'll learn */}
                <div className="md:col-span-2 border border-slate-100 rounded-lg p-4 dark:border-slate-800 space-y-3">
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    What you'll learn in this course
                  </span>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add learning objective..."
                      value={newLearnItem}
                      onChange={(e) => setNewLearnItem(e.target.value)}
                      className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLearnItem())}
                    />
                    <Button type="button" onClick={handleAddLearnItem} className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950">
                      Add
                    </Button>
                  </div>

                  <ul className="space-y-1 max-h-48 overflow-y-auto">
                    {whatYouLearn.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded text-sm text-slate-800 dark:text-slate-200">
                        <span className="line-clamp-1">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLearnItem(idx)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            // Course Notification Tab
            <div className="space-y-6">
              <div className="rounded-lg border border-slate-100 p-4 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Notify students on publish
                    </h4>
                    <p className="text-xs text-slate-500">
                      Automatically email all school subscribers when this course goes live.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyOnPublish}
                    onChange={(e) => setNotifyOnPublish(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>

                <hr className="border-slate-100 dark:border-slate-800" aria-hidden="true" />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Enrollment notification
                    </h4>
                    <p className="text-xs text-slate-500">
                      Send notifications to course instructors when students enroll.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyOnEnroll}
                    onChange={(e) => setNotifyOnEnroll(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="welcome-template-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                  Welcome Email Template
                </label>
                <select
                  id="welcome-template-select"
                  value={welcomeEmailTemplate}
                  onChange={(e) => setWelcomeEmailTemplate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950"
                >
                  <option value="default_welcome">Standard Welcome Template</option>
                  <option value="premium_welcome">Premium Coaching Welcome Template</option>
                  <option value="no_email">Do not send email</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-6 bg-slate-50/50 dark:bg-slate-950/20 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/courses')}
            className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending || !title.trim()}
            className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
          >
            <Save className="h-4 w-4" />
            <span>{isEdit ? 'Save Changes' : 'Create Course'}</span>
          </Button>
        </div>
      </form>
    </section>
  );
};
export default AdminCourseFormPage;
