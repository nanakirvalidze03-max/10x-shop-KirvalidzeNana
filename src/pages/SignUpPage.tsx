import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { useToast } from '../context/ToastContext';
import type { SignUpFormValues } from '../types/user';
import { findUserByEmail, saveUser } from '../utils/users';
import { validateSignUp } from '../utils/validation';
import type { FormErrors } from '../utils/validation';

interface FieldConfig {
  name: keyof SignUpFormValues;
  label: string;
  type: string;
  autoComplete: string;
  placeholder?: string;
}

// Exactly these 5 fields, in this order
const FIELDS: FieldConfig[] = [
  { name: 'fullName', label: 'Full Name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'text', autoComplete: 'email' },
  { name: 'company', label: 'Company', type: 'text', autoComplete: 'organization', placeholder: 'Company (optional)' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
  { name: 'confirmPassword', label: 'Confirm Password', type: 'password', autoComplete: 'new-password' },
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [values, setValues] = useState<SignUpFormValues>({ fullName: '', email: '', company: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<FormErrors<SignUpFormValues>>({});
  const [created, setCreated] = useState(false);

  // After success: wait 1.5 s (so the toast is visible), then go to Login. The cleanup cancels the timer if we leave earlier.
  useEffect(() => {
    if (!created) return;
    const timer = setTimeout(() => navigate('/login', { replace: true }), 1500);
    return () => clearTimeout(timer);
  }, [created, navigate]);

  const handleChange = (field: keyof SignUpFormValues) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined })); // the error disappears while typing
  };

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = values.email.trim().toLowerCase();
    const found = validateSignUp(values, findUserByEmail(email) !== undefined);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // errors -> nothing is saved

    saveUser({
      id: Date.now(),
      fullName: values.fullName.trim(),
      email, // saved in lowercase
      password: values.password,
      company: values.company.trim(),
      createdAt: new Date().toISOString(),
    });
    showToast('Account created successfully! Please log in.', 'success');
    setCreated(true);
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border-2 border-line bg-surface p-6 shadow-pop">
        <h1 className="font-display text-2xl font-extrabold">Create your account</h1>
        <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-4">
          {FIELDS.map((f) => (
            <FormField
              key={f.name}
              id={f.name}
              label={f.label}
              type={f.type}
              autoComplete={f.autoComplete}
              placeholder={f.placeholder}
              value={values[f.name]}
              onChange={handleChange(f.name)}
              error={errors[f.name]}
              disabled={created}
            />
          ))}
          <Button type="submit" disabled={created}>Create Account</Button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand underline focus-visible:outline-2 focus-visible:outline-brand">Log in</Link>
        </p>
      </div>
    </div>
  );
}
