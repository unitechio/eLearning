import React from "react"
import {
  Check,
  X,
  Info,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react"
import { useTheme } from "@/shared/hooks/useTheme"
import { Toaster as Sonner, toast as sonnerToast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton
      icons={{
        success: (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </div>
        ),
        info: (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-white">
            <span className="text-[11px] font-extrabold font-serif select-none">i</span>
          </div>
        ),
        warning: (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F59E0B] text-white">
            <span className="text-xs font-black select-none">!</span>
          </div>
        ),
        error: (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EF4444] text-white">
            <X className="h-3.5 w-3.5 stroke-[3]" />
          </div>
        ),
        loading: (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500">
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          </div>
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-zinc-950 group-[.toaster]:text-slate-900 dark:group-[.toaster]:text-slate-100 group-[.toaster]:border group-[.toaster]:border-slate-150 dark:group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-[0px_8px_30px_rgba(0,0,0,0.06)] dark:group-[.toaster]:shadow-[0px_8px_30px_rgba(0,0,0,0.25)] group-[.toaster]:rounded-[18px] group-[.toaster]:p-4 group-[.toaster]:gap-3 group-[.toaster]:items-start w-full",
          title: "group-[.toast]:font-semibold group-[.toast]:text-[13px] group-[.toast]:text-slate-900 dark:group-[.toast]:text-slate-100 group-[.toast]:leading-[20px]",
          description: "group-[.toast]:text-xs group-[.toast]:text-slate-400 dark:group-[.toast]:text-slate-500 group-[.toast]:leading-[18px] group-[.toast]:mt-0.5 group-[.toast]:font-medium",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:bg-transparent group-[.toast]:text-slate-400 hover:group-[.toast]:text-slate-650 group-[.toast]:border-none group-[.toast]:shadow-none group-[.toast]:right-4 group-[.toast]:top-4 group-[.toast]:left-auto group-[.toast]:transform-none transition-colors",
        },
      }}
      {...props}
    />
  )
}

// Interface for explicitly triggering custom layout component manually
interface CustomToastProps {
  id: string | number
  title: string
  description?: string
  type: "success" | "info" | "warning" | "error" | "loading" | "action"
  action?: {
    label: string
    onClick: () => void
  }
}

export function CustomToastComponent({ id, title, description, type, action }: CustomToastProps) {
  return (
    <div className="flex items-start gap-3 w-full max-w-sm rounded-[18px] border border-slate-150 dark:border-zinc-850 bg-white dark:bg-zinc-950 p-4 shadow-[0px_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0px_8px_30px_rgba(0,0,0,0.25)] relative text-left">
      {/* Status Icon */}
      <div className="mt-0.5 shrink-0">
        {type === "success" && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#10B981] text-white">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </div>
        )}
        {type === "info" && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6366F1] text-white">
            <span className="text-[11px] font-extrabold font-serif select-none">i</span>
          </div>
        )}
        {type === "warning" && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B] text-white">
            <span className="text-xs font-black select-none">!</span>
          </div>
        )}
        {type === "error" && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EF4444] text-white">
            <X className="h-3.5 w-3.5 stroke-[3]" />
          </div>
        )}
        {type === "loading" && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-500">
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          </div>
        )}
        {type === "action" && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3B82F6] text-white">
            <span className="text-xs font-bold select-none">A</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pr-6 text-left">
        <h4 className="font-semibold text-[13px] text-slate-900 dark:text-slate-100 leading-[20px]">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-slate-450 dark:text-slate-550 leading-[18px] font-medium mt-0.5">
            {description}
          </p>
        )}
        {action && (
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                action.onClick()
                sonnerToast.dismiss(id)
              }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline outline-none"
            >
              {action.label}
            </button>
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={() => sonnerToast.dismiss(id)}
        className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Dedicated custom toast helpers
export const customToast = {
  success: (title: string, description?: string) => {
    sonnerToast.custom((id) => (
      <CustomToastComponent id={id} title={title} description={description} type="success" />
    ))
  },
  info: (title: string, description?: string) => {
    sonnerToast.custom((id) => (
      <CustomToastComponent id={id} title={title} description={description} type="info" />
    ))
  },
  warning: (title: string, description?: string) => {
    sonnerToast.custom((id) => (
      <CustomToastComponent id={id} title={title} description={description} type="warning" />
    ))
  },
  error: (title: string, description?: string) => {
    sonnerToast.custom((id) => (
      <CustomToastComponent id={id} title={title} description={description} type="error" />
    ))
  },
  loading: (title: string, description?: string) => {
    sonnerToast.custom((id) => (
      <CustomToastComponent id={id} title={title} description={description} type="loading" />
    ))
  },
  action: (title: string, description: string, actionLabel: string, onAction: () => void) => {
    sonnerToast.custom((id) => (
      <CustomToastComponent
        id={id}
        title={title}
        description={description}
        type="action"
        action={{ label: actionLabel, onClick: onAction }}
      />
    ))
  },
}

export { Toaster }
