import type { ChangeEvent } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  autoComplete?: string;
  disabled?: boolean;
  placeholder?: string;
}

// Controlled input + label + error text (shown right under the field).
export function FormField({ id, label, value, onChange, type = 'text', error, autoComplete, disabled, placeholder }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`min-h-11 w-full rounded-xl border bg-surface px-3 py-2 text-ink focus:border-brand focus:outline-2 focus:outline-brand disabled:opacity-60 ${
          error ? 'border-red-600' : 'border-line'
        }`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
