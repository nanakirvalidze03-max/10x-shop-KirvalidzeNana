interface QuantityStepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const BTN =
  'flex min-h-11 min-w-11 items-center justify-center text-lg hover:bg-surface-muted focus-visible:outline-2 ' +
  'focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40';

// − / + stepper limited to min <= value <= max (buttons are disabled at the edges).
export function QuantityStepper({ value, min, max, onChange, disabled = false }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-xl border-2 border-line bg-surface shadow-pop">
      <button type="button" className={BTN} aria-label="Decrease quantity" disabled={disabled || value <= min} onClick={() => onChange(value - 1)}>
        −
      </button>
      <span className="min-w-10 text-center font-semibold" aria-live="polite">
        {value}
      </span>
      <button type="button" className={BTN} aria-label="Increase quantity" disabled={disabled || value >= max} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}
