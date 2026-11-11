import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

// Chunky "sticker" button: hard shadow, lifts on hover, presses down on click.
const BASE =
  'inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-line px-4 py-2 text-sm font-bold shadow-pop transition-all ' +
  'motion-safe:hover:-translate-y-0.5 hover:shadow-pop-lg motion-safe:active:translate-x-0.5 motion-safe:active:translate-y-0.5 active:shadow-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ' +
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-on-brand hover:bg-brand-strong',
  secondary: 'bg-surface text-ink hover:bg-pop hover:text-on-pop',
  danger: 'bg-hot text-on-pop hover:brightness-95',
};

export function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  return <button type="button" className={`${BASE} ${VARIANTS[variant]} ${className}`} {...rest} />;
}
