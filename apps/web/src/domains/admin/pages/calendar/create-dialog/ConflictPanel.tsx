import React from 'react';
import { type ConflictWarning } from './hooks/useConflictDetection';
import { FieldLabel, ValidationText } from '@/shared/components/ui/typography';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/shared/lib';

interface ConflictPanelProps {
  readonly conflicts: readonly ConflictWarning[];
}

export function ConflictPanel({ conflicts }: ConflictPanelProps) {
  const hasConflicts = conflicts.length > 0;

  return (
    <div className={cn(
      "p-4 rounded-xl border font-sans select-none",
      hasConflicts 
        ? "bg-destructive/[0.03] border-destructive/25 text-destructive"
        : "bg-emerald-500/[0.03] border-emerald-500/20 text-emerald-700"
    )}>
      <header className="flex items-center gap-1.5 mb-2">
        {hasConflicts ? (
          <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
        ) : (
          <CheckCircle className="h-4.5 w-4.5 shrink-0" />
        )}
        <FieldLabel className={cn(hasConflicts ? 'text-destructive' : 'text-emerald-700')}>
          {hasConflicts ? 'Validation Warnings' : 'Smart Check Pass'}
        </FieldLabel>
      </header>

      {hasConflicts ? (
        <ul className="space-y-1.5">
          {conflicts.map((warning, index) => (
            <li key={index} className="flex items-start gap-1">
              <ValidationText className="text-xs font-normal">
                • {warning.message}
              </ValidationText>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[10px] font-normal leading-relaxed">
          No scheduling overlaps, classroom double-bookings, or student count issues found.
        </p>
      )}
    </div>
  );
}
