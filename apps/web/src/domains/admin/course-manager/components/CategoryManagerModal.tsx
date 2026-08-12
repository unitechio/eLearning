import React, { useState } from 'react';
import { Trash2, Plus, X } from 'lucide-react';
import { CourseCategory } from '../types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import {
  useCourseCategories,
  useCreateCategory,
  useDeleteCategory
} from '../api/courseManagerHooks';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose
}) => {
  const { data: categories = [], isLoading } = useCourseCategories();
  const createMutation = useCreateCategory();
  const deleteMutation = useDeleteCategory();

  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3B82F6');

  const presetColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#6366F1'  // Indigo
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    createMutation.mutate(
      {
        name: newCatName,
        color: newCatColor
      },
      {
        onSuccess: () => {
          setNewCatName('');
        }
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category? Courses under it will lose their category association.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-950 dark:text-white">
            Manage Course Categories
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Category List */}
          <div className="max-h-60 overflow-y-auto border border-slate-100 rounded-lg p-2 dark:border-slate-800 space-y-1.5">
            {isLoading ? (
              <div className="text-center py-4 text-sm text-slate-400">Loading...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-4 text-sm text-slate-400">No categories found</div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {cat.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => handleDelete(cat.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              ))
            )}
          </div>

          <hr className="border-slate-100 dark:border-slate-800" aria-hidden="true" />

          {/* Add Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cat-name-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                Category Name
              </label>
              <Input
                id="cat-name-input"
                placeholder="e.g. Artificial Intelligence"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                required
              />
            </div>

            <div>
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Category Color
              </span>
              <div className="flex flex-wrap gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-7 w-7 rounded-full transition-all duration-200 border-2 ${
                      newCatColor === color
                        ? 'border-slate-900 scale-110 dark:border-white shadow-md'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCatColor(color)}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={createMutation.isPending || !newCatName.trim()}
              className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
