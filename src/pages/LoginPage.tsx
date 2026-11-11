import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { useAuth } from '../context/AuthContext';
import type { LoginFormValues } from '../types/user';
import { getStateString } from '../utils/nav';
import { findUserByEmail } from '../utils/users';
import { validateLogin } from '../utils/validation';
import type { FormErrors } from '../utils/validation';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState<LoginFormValues>({ username: '', password: '' });
  const [errors, setErrors] = useState<FormErrors<LoginFormValues>>({});

  // Returns an onChange handler for one field: updates the value and clears that field's error.
  const handleChange = (field: keyof LoginFormValues) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // no page reload
    const found = validateLogin(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // invalid -> nothing happens

    // A registered account (Sign Up) must match its password. Any other username works as a demo login.
    const registered = findUserByEmail(values.username);
    if (registered && registered.password !== values.password) {
      setErrors({ password: 'Invalid username or password' });
      return;
    }
    login(registered ? registered.fullName : values.username.trim());
    // If the user came from /checkout, go back there; otherwise to the catalog.
    navigate(getStateString(location.state, 'from') ?? '/', { replace: true });
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-2xl border-2 border-line bg-surface shadow-pop p-6">
        <h1 className="font-display text-2xl font-extrabold">Log in</h1>
        <p className="mt-1 text-sm text-ink-muted">Demo login: any username and a password of 6+ characters, or the email you signed up with.</p>
        <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-4">
          <FormField id="username" label="Username" value={values.username} onChange={handleChange('username')} error={errors.username} autoComplete="username" />
          <FormField id="password" label="Password" type="password" value={values.password} onChange={handleChange('password')} error={errors.password} autoComplete="current-password" />
          <Button type="submit">Log In</Button>
        </form>
      </div>
      <p className="mt-4 text-sm">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-bold text-brand underline focus-visible:outline-2 focus-visible:outline-brand">Sign up</Link>
      </p>
      <Link to="/" className="mt-2 inline-block text-sm text-brand hover:underline focus-visible:outline-2 focus-visible:outline-brand">
        ← Back to catalog
      </Link>
    </div>
  );
}
