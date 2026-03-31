import { RecordingWorkspace } from "@/features/speaking/components/recording-workspace";
import { FeedbackPanel } from "@/features/speaking/components/feedback-panel";

export default function SpeakingPage() {
  return (
    <div className="flex-1 p-8 lg:p-10 hide-scrollbar h-full overflow-y-auto w-full">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Practice Context (Left Side) - 7 cols */}
        <div className="lg:col-span-7">
          <RecordingWorkspace />
        </div>

        {/* AI Feedback Panel (Right Side) - 5 cols */}
        <div className="lg:col-span-5 h-full">
          <FeedbackPanel />
        </div>
      </div>
    </div>
  );
}
