import React from 'react';
import { WritingPrompt } from './WritingPrompt';
import { EssayEditor } from './EssayEditor';
import { AiWritingPanel } from './AiWritingPanel';

export function IeltsWritingCoach() {
  return (
    <div className="flex flex-1 h-[calc(100vh-5rem)] overflow-hidden animate-in fade-in duration-700">
      <WritingPrompt />
      <EssayEditor />
      <AiWritingPanel />
    </div>
  );
}
