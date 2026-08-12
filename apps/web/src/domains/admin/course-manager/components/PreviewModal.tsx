import React, { useState } from 'react';
import {
  X, Eye, BookOpen, Star, Award, Calendar, CheckCircle2,
  Lock, ArrowUpRight, Play, FileText, Check, ShieldCheck, Download, Trash2, Heart
} from 'lucide-react';
import { AdminCourse, CourseCategory } from '../types';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  useAdminCourseDetail,
  useCreateResource,
  useDeleteResource,
  useCreateReview
} from '../api/courseManagerHooks';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: AdminCourse;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  course
}) => {
  // Query full admin course details
  const { data: detail, isLoading } = useAdminCourseDetail(course.id, isOpen);
  const createResourceMutation = useCreateResource(course.id);
  const deleteResourceMutation = useDeleteResource(course.id);
  const createReviewMutation = useCreateReview(course.id);

  // Tab State
  const [activeTab, setActiveTab] = useState<'info' | 'outline' | 'resources' | 'reviews'>('info');
  const [showFullDesc, setShowFullDesc] = useState(false);

  // New review state
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Mock Upload resource states (decoupled uploading)
  const [resourceName, setResourceName] = useState('');
  const [resourceKey, setResourceKey] = useState('');
  const [resourceMime, setResourceMime] = useState('application/pdf');
  const [resourceSize, setResourceSize] = useState(1024 * 100); // 100KB

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceName.trim() || !resourceKey.trim()) return;

    createResourceMutation.mutate(
      {
        name: resourceName,
        storage_key: resourceKey,
        mime_type: resourceMime,
        size_bytes: resourceSize
      },
      {
        onSuccess: () => {
          setResourceName('');
          setResourceKey('');
        }
      }
    );
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    createReviewMutation.mutate(
      {
        rating: newReviewRating,
        comment: newReviewComment
      },
      {
        onSuccess: () => {
          setNewReviewComment('');
        }
      }
    );
  };

  const getFileIcon = (mime?: string) => {
    if (mime?.includes('pdf')) return 'PDF';
    if (mime?.includes('excel') || mime?.includes('sheet')) return 'EXL';
    if (mime?.includes('word') || mime?.includes('document')) return 'DEC';
    if (mime?.includes('image')) return 'IMG';
    return 'DOC';
  };

  const getFileBadgeColor = (mime?: string) => {
    if (mime?.includes('pdf')) return 'bg-red-500 text-white';
    if (mime?.includes('excel') || mime?.includes('sheet')) return 'bg-green-600 text-white';
    if (mime?.includes('word') || mime?.includes('document')) return 'bg-blue-500 text-white';
    return 'bg-slate-400 text-white';
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] bg-slate-50 dark:bg-slate-950 p-0 overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col rounded-2xl shadow-2xl">
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/60">
          <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Preview Course
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-medium">
            Loading course details...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
            {/* Left Sidebar Section */}
            <aside className="w-full lg:w-[320px] bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60 p-6 space-y-6 flex flex-col shrink-0">
              {/* Media Preview Box */}
              <div className="relative rounded-xl overflow-hidden aspect-video w-full bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center group">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookOpen className="h-10 w-10 text-slate-400" />
                )}
                <div className="absolute inset-0 bg-slate-950/45 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="icon" className="h-11 w-11 rounded-full bg-white/95 text-indigo-600 shadow-lg hover:scale-105 transition-all">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </Button>
                </div>
                <span className="absolute bottom-2 text-[10px] font-bold text-white px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm">
                  Preview Course
                </span>
              </div>

              {/* Price & Cart Area */}
              <div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-black text-slate-950 dark:text-white">
                    ${course.price}
                  </span>
                  {course.original_price > course.price && (
                    <span className="text-base text-slate-400 line-through">
                      ${course.original_price}
                    </span>
                  )}
                  <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50/50 dark:border-green-900/50 dark:text-green-400 font-bold ml-auto text-xs">
                    Apply Coupon
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold gap-1.5 shadow-md shadow-indigo-600/10">
                    <span>Enrol Now</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 border-slate-200 text-slate-400 hover:text-red-500">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Instructor info card */}
              <div className="border border-slate-100 rounded-xl p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                    DS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Daniel Scott</h4>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Top Instructor</span>
                  </div>
                </div>
                <p className="text-xs leading-normal text-slate-500 dark:text-slate-400">
                  Dr. Daniel Scott is a passionate educator and advocate for integrating digital product designs into SaaS.
                </p>
                <button type="button" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-2 block hover:underline">
                  View Profile
                </button>
              </div>

              {/* Course details bullet info */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Course Detail</h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span>{course.rating || '4.9'} ({course.review_count || 120} Reviews)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    <span>{detail?.modules.length || 0} Modules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span>10 Assignments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                    <span>Certificate on completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>Last Update: 27 May 2026</span>
                  </li>
                </ul>
              </div>

              {/* Tools list */}
              {course.tools_used && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Tools will you use</h4>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {course.tools_used}
                  </p>
                </div>
              )}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 space-y-6">
              {/* Heading */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-black text-slate-950 dark:text-white leading-tight mb-2">
                  {course.title}
                </h2>
                <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-4">
                  {course.subtitle || 'Learn from basics to professional level'}
                </h3>
                
                {/* Collapsible description */}
                <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <p className={showFullDesc ? '' : 'line-clamp-3'}>
                    {course.description || 'This course is carefully crafted to take you on a complete learning journey. You\'ll start from fundamental principles and build actual industry products step-by-step.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline mt-2 block"
                  >
                    {showFullDesc ? 'See Less' : 'See More'}
                  </button>
                </div>
              </div>

              {/* Tabs Switcher */}
              <nav aria-label="Tabs" className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
                {(['info', 'outline', 'resources', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`py-3 text-sm font-bold border-b-2 transition-all capitalize ${
                      activeTab === tab
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'info' ? 'Course Info' : tab === 'outline' ? 'Course Outline' : tab}
                  </button>
                ))}
              </nav>

              {/* Tab Contents */}
              <div className="py-2">
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    {/* What you'll learn */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 p-6 rounded-2xl dark:border-slate-800">
                      <h4 className="text-base font-bold text-slate-950 dark:text-white mb-4">
                        What'll you learn
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-400">
                        {course.what_you_learn && course.what_you_learn.length > 0 ? (
                          course.what_you_learn.map((learn, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>{learn}</span>
                            </li>
                          ))
                        ) : (
                          <>
                            <li className="flex items-start gap-2.5">
                              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Fundamentals and principles</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span>Real-world project implementations</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>

                    {/* Certificate box */}
                    {course.has_certificate && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-slate-200/50 dark:border-slate-800 rounded-2xl p-6 dark:bg-slate-900">
                        <div className="md:col-span-2 space-y-2">
                          <h4 className="text-base font-bold text-slate-950 dark:text-white">Earn your certificate</h4>
                          <p className="text-xs leading-relaxed text-slate-500">
                            Complete your course, submit all assignments and earn your certificate. Add this credential to your LinkedIn profile, resume, or CV.
                          </p>
                        </div>
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-950/20">
                          <Award className="h-8 w-8 text-indigo-600 mb-2" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">Certificate on completion</span>
                          <span className="text-[10px] text-slate-400 font-semibold mt-1">Verified Credential</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'outline' && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl p-6 dark:border-slate-800 space-y-4">
                    <h4 className="text-base font-bold text-slate-950 dark:text-white mb-2">
                      Course Curriculum
                    </h4>
                    {detail?.modules.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-sm">
                        No modules created yet. Add modules and lessons in the course manager.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {detail?.modules.map((mod, idx) => (
                          <div key={mod.id} className="border border-slate-100 rounded-xl dark:border-slate-800 overflow-hidden">
                            <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/30">
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {((idx + 1).toString().padStart(2, '0'))} {mod.title}
                              </span>
                              <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-semibold border-none">
                                Module
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-6">
                    {/* Add Resource Form */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl p-6 dark:border-slate-800">
                      <h4 className="text-base font-bold text-slate-950 dark:text-white mb-4">
                        Add New Resource Attachment
                      </h4>
                      <form onSubmit={handleAddResource} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="res-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                            Resource Name
                          </label>
                          <Input
                            id="res-name"
                            placeholder="e.g. Course Slide Deck"
                            value={resourceName}
                            onChange={(e) => setResourceName(e.target.value)}
                            className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="res-key" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                            Storage Key / File Link
                          </label>
                          <Input
                            id="res-key"
                            placeholder="e.g. uploads/slides.pdf"
                            value={resourceKey}
                            onChange={(e) => setResourceKey(e.target.value)}
                            className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="res-mime" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                            File Type
                          </label>
                          <select
                            id="res-mime"
                            value={resourceMime}
                            onChange={(e) => setResourceMime(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950"
                          >
                            <option value="application/pdf">PDF Document</option>
                            <option value="application/vnd.ms-excel">Excel Spreadsheet</option>
                            <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">Word Document</option>
                            <option value="image/png">PNG Image</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="res-size" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                            Size (Bytes)
                          </label>
                          <Input
                            id="res-size"
                            type="number"
                            value={resourceSize}
                            onChange={(e) => setResourceSize(Number(e.target.value))}
                            className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                            required
                          />
                        </div>

                        <div className="sm:col-span-2 flex justify-end">
                          <Button
                            type="submit"
                            disabled={createResourceMutation.isPending || !resourceName.trim() || !resourceKey.trim()}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold"
                          >
                            Add Resource
                          </Button>
                        </div>
                      </form>
                    </div>

                    {/* Resources List */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl p-6 dark:border-slate-800">
                      <h4 className="text-base font-bold text-slate-950 dark:text-white mb-4">
                        Download Resources
                      </h4>
                      {detail?.resources.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 text-sm">
                          No downloadable resources added to this course.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {detail?.resources.map((res) => (
                            <div
                              key={res.id}
                              className="flex items-center justify-between p-3 border border-slate-100 rounded-xl dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <span className={`flex h-10 w-10 items-center justify-center rounded-lg font-black text-xs ${getFileBadgeColor(res.mime_type)}`}>
                                  {getFileIcon(res.mime_type)}
                                </span>
                                <div>
                                  <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                    {res.name}
                                  </h5>
                                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                    {formatBytes(res.size_bytes)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                  onClick={() => deleteResourceMutation.mutate(res.id)}
                                  disabled={deleteResourceMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Add Review Form */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl p-6 dark:border-slate-800">
                      <h4 className="text-base font-bold text-slate-950 dark:text-white mb-4">
                        Submit Student Feedback
                      </h4>
                      <form onSubmit={handleAddReview} className="space-y-4">
                        <div>
                          <label htmlFor="review-rating-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                            Rating Stars
                          </label>
                          <select
                            id="review-rating-select"
                            value={newReviewRating}
                            onChange={(e) => setNewReviewRating(Number(e.target.value))}
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 max-w-xs"
                          >
                            <option value="5">5 Stars (Excellent)</option>
                            <option value="4">4 Stars (Good)</option>
                            <option value="3">3 Stars (Average)</option>
                            <option value="2">2 Stars (Poor)</option>
                            <option value="1">1 Star (Terrible)</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="review-comment" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                            Review Comments
                          </label>
                          <Textarea
                            id="review-comment"
                            placeholder="Write constructive course feedback..."
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                            className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                            required
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={createReviewMutation.isPending || !newReviewComment.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                          >
                            Submit Review
                          </Button>
                        </div>
                      </form>
                    </div>

                    {/* Reviews List */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl p-6 dark:border-slate-800">
                      <h4 className="text-base font-bold text-slate-950 dark:text-white mb-4">
                        Student Reviews
                      </h4>
                      {detail?.reviews.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 text-sm">
                          No student feedback submitted yet.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {detail?.reviews.map((rev) => (
                            <div key={rev.id} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-b-0 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-extrabold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                    {(rev.user_name || 'S').charAt(0).toUpperCase()}
                                  </div>
                                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {rev.user_name}
                                  </h5>
                                </div>
                                <div className="flex items-center text-amber-500">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3.5 w-3.5 ${
                                        i < rev.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-800'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                {rev.comment}
                              </p>
                              <span className="text-[10px] text-slate-400 font-semibold block">
                                {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
