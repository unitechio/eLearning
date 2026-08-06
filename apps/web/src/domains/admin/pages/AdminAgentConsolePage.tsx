import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  ShieldAlert,
  Terminal,
} from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminCardContent } from '@/shared/components/admin';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';

export interface AgentStep {
  id: string;
  title: string;
  toolBadge?: string;
  executionTime?: string;
  status: 'completed' | 'approval_needed' | 'queued';
  subSteps?: string[];
  approvalContent?: {
    text: string;
    pill: string;
  };
}

export function AdminAgentConsolePage() {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({
    '1': true,
    '6': true,
  });
  const [userPrompt, setUserPrompt] = useState('');
  const [approvedStep6, setApprovedStep6] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const steps: AgentStep[] = [
    {
      id: '1',
      title: 'Broke the goal into a 5-step plan',
      executionTime: '2.1s',
      status: 'completed',
      subSteps: [
        'Gather competitor pricing & packaging changes from Q3',
        'Pull Atlas positioning claims from the workspace',
        'Build a side by side pricing comparison',
        'Check trial → paid conversion by segment',
        'Draft the brief and share with the launch channel',
      ],
    },
    {
      id: '2',
      title: 'Searched the web for Q3 competitor pricing',
      toolBadge: 'web.search',
      executionTime: '8.4s',
      status: 'completed',
    },
    {
      id: '3',
      title: 'Read "Atlas positioning v2" from the workspace',
      toolBadge: 'docs.read',
      executionTime: '3.7s',
      status: 'completed',
    },
    {
      id: '4',
      title: 'Building the pricing comparison table',
      toolBadge: 'reasoning',
      executionTime: '6.9s',
      status: 'completed',
    },
    {
      id: '5',
      title: 'Query conversion rates by segment',
      toolBadge: 'analytics.query',
      executionTime: '2.2s',
      status: 'completed',
    },
    {
      id: '6',
      title: 'Approval needed before sharing the brief',
      status: approvedStep6 ? 'completed' : 'approval_needed',
      approvalContent: {
        text: 'The brief is ready. The agent wants to post it to #product-launch and notify 2 owners.',
        pill: 'Q3 Competitive Brief - Atlas • 4 competitors • 1 pricing table',
      },
    },
    {
      id: '7',
      title: 'Post the brief to #product-launch and notify owners',
      toolBadge: 'slack.post',
      status: approvedStep6 ? 'completed' : 'queued',
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="Prepare the Q3 competitive brief for the Atlas launch"
        description="Autonomous • Model Claude Opus 4.8 • 4 tools connected"
        icon={Terminal}
      />

      {/* Step Timeline */}
      <section aria-label="Agent execution timeline" className="relative space-y-4 mb-8">
        {/* Vertical Connecting Line */}
        <div className="absolute left-3.5 top-3 bottom-3 w-px bg-border" aria-hidden="true" />

        {steps.map((step) => {
          const isExpanded = expandedSteps[step.id];
          const isCompleted = step.status === 'completed';
          const isApproval = step.status === 'approval_needed';
          const isQueued = step.status === 'queued';

          return (
            <article key={step.id} className="relative flex items-start gap-4">
              {/* Step Status Icon */}
              <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background border border-border">
                {isCompleted && (
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 fill-emerald-500/10" />
                )}
                {isApproval && (
                  <ShieldAlert className="h-4.5 w-4.5 text-amber-500 fill-amber-500/10" />
                )}
                {isQueued && (
                  <span className="h-3 w-3 rounded-full border border-dashed border-muted-foreground/60 animate-spin" />
                )}
              </div>

              {/* Step Content */}
              <div className="min-w-0 flex-1 pt-0.5">
                <AdminCard>
                  <AdminCardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3
                        className={cn(
                          "text-xs sm:text-sm font-semibold truncate",
                          isQueued ? "text-muted-foreground" : "text-foreground"
                        )}
                      >
                        {step.title}
                      </h3>

                      {/* Right Tool Badge & Execution Time */}
                      <div className="flex items-center gap-2 shrink-0">
                        {step.toolBadge && (
                          <span className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
                            {step.toolBadge}
                          </span>
                        )}
                        {step.executionTime && (
                          <span className="font-mono text-xs text-muted-foreground">{step.executionTime}</span>
                        )}
                        {(step.subSteps || step.approvalContent) && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleExpand(step.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg"
                            aria-label={isExpanded ? "Collapse step details" : "Expand step details"}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Sub-Steps List */}
                    {step.subSteps && isExpanded && (
                      <ol className="mt-3 space-y-2 rounded-xl bg-muted/40 p-3.5 text-xs text-muted-foreground border border-border/40 font-medium">
                        {step.subSteps.map((sub, idx) => (
                          <li key={sub} className="flex items-start gap-2.5">
                            <span className="font-mono text-[10px] font-bold text-muted-foreground/60">{idx + 1}</span>
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ol>
                    )}

                    {/* Expanded Approval Box */}
                    {step.approvalContent && isApproval && isExpanded && (
                      <div className="mt-3 rounded-xl border border-amber-200/50 bg-amber-50/10 dark:border-amber-900/30 p-4">
                        <p className="text-xs text-foreground/80 mb-3">
                          {step.approvalContent.text}
                        </p>

                        <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span>{step.approvalContent.pill}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg text-xs"
                          >
                            Adjust first
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setApprovedStep6(true)}
                            className="h-8 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs"
                          >
                            Approve & continue
                          </Button>
                        </div>
                      </div>
                    )}
                  </AdminCardContent>
                </AdminCard>
              </div>
            </article>
          );
        })}
      </section>

      {/* Interactive Steering Prompt Input */}
      <section aria-label="Agent input console" className="space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setUserPrompt('');
          }}
          className="relative flex items-center rounded-xl border border-input bg-card shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary overflow-hidden"
        >
          <Input
            type="text"
            placeholder="Steer the agent, add context, redirect or ask a question..."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="w-full bg-transparent border-0 px-4 py-6 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-2 text-muted-foreground hover:text-foreground h-9 w-9 rounded-lg"
            aria-label="Send steering command to agent"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
          <span>The agent reads your message on its next step.</span>
          <div className="flex items-center gap-1 font-mono">
            <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[9px] font-bold">
              enter
            </kbd>
            <span>to send</span>
          </div>
        </div>
      </section>
    </div>
  );
}
