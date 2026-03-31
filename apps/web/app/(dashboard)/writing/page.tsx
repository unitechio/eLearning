import { NotionEditor } from "@/features/writing/components/notion-editor";
import { AiWritingFeedback } from "@/features/writing/components/ai-writing-feedback";
import { FloatingToolbar } from "@/features/writing/components/floating-toolbar";

export default function WritingPage() {
  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      {/* Main Content Area (Central Focus Editor) */}
      <main className="flex-1 overflow-y-auto flex flex-col items-center shadow-inner relative z-10 hide-scrollbar pt-6 pb-24">
        <NotionEditor />
      </main>

      {/* AI Feedback Sidebar (Real-time Feedback) */}
      <AiWritingFeedback />

      {/* Floating AI Toolbar (Selection-based) */}
      <FloatingToolbar />
    </div>
  );
}
