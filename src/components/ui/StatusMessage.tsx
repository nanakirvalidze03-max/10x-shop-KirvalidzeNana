import type { ReactNode } from 'react';

interface StatusMessageProps {
  tone: 'info' | 'error' | 'empty';
  children: ReactNode;
  action?: ReactNode; // e.g. a Retry button
}

const EMOJI: Record<StatusMessageProps['tone'], string> = { info: '⏳', error: '💥', empty: '🫥' };

// One component for the Loading / Error / Empty states (children = composition).
export function StatusMessage({ tone, children, action }: StatusMessageProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-line bg-surface p-8 text-center ${
        tone === 'error' ? 'text-red-700 dark:text-red-400' : 'text-ink-muted'
      }`}
    >
      <span aria-hidden="true" className="text-4xl">{EMOJI[tone]}</span>
      <p className="font-medium">{children}</p>
      {action}
    </div>
  );
}
