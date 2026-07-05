import React, { useState } from "react";
import { WritingSampleDetailPage } from "./pages/WritingSampleDetailPage";
import { WritingSampleListPage } from "./pages/WritingSampleListPage";
import { IELTSOnlineTestPage } from "./pages/IELTSOnlineTestPage";
import { DictationListPage } from "./pages/DictationListPage";
import { DictationPracticePage } from "./pages/DictationPracticePage";
import { ShadowingPage } from "./pages/ShadowingPage";

const pages = [
  { id: "writing-detail", label: "✍️ Writing Detail", component: WritingSampleDetailPage },
  { id: "writing-list", label: "📋 Writing List", component: WritingSampleListPage },
  { id: "ielts-tests", label: "📝 IELTS Online Test", component: IELTSOnlineTestPage },
  { id: "dictation-list", label: "🎧 Chép Chính Tả", component: DictationListPage },
  { id: "dictation-practice", label: "✏️ Dictation Practice", component: DictationPracticePage },
  { id: "shadowing", label: "🎤 Shadowing", component: ShadowingPage },
];

export default function LightIeltsPrototypeApp() {
  const [active, setActive] = useState("writing-detail");
  const Page = pages.find((p) => p.id === active).component;

  return (
    <div className="font-sans">
      <div className="fixed top-0 left-0 right-0 z-[100] bg-gray-950 border-b border-gray-800 flex gap-1 px-3 py-2 overflow-x-auto">
        {pages.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${active === p.id ? "bg-red-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="pt-10">
        <Page />
      </div>
    </div>
  );
}
