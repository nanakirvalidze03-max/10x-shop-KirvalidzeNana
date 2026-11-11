import type { LoginFormValues, SignUpFormValues } from '../types/user';
import type { ShippingInfo } from '../types/order';

// Only fields with a problem are present in the result.
export type FormErrors<T> = Partial<Record<keyof T, string>>;

export function validateLogin(values: LoginFormValues): FormErrors<LoginFormValues> {
  const errors: FormErrors<LoginFormValues> = {};
  if (values.username.trim() === '') errors.username = 'Username is required';
  if (values.password === '') errors.password = 'Password is required';
  else if (values.password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCheckout(values: ShippingInfo): FormErrors<ShippingInfo> {
  const errors: FormErrors<ShippingInfo> = {};
  if (values.fullName.trim().length < 3) errors.fullName = 'Full name must be at least 3 characters';
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Please enter a valid email address';
  if (values.address.trim().length < 5) errors.address = 'Address must be at least 5 characters';
  if (values.city.trim() === '') errors.city = 'City is required';
  return errors;
}

const PASSWORD_MESSAGE = 'Password must be at least 8 characters and contain a letter and a number';

// emailTaken = an account with this email (lowercase) already exists in shop_users.
// ALL fields are checked in one pass, so every error is visible at once. Company is optional.
export function validateSignUp(values: SignUpFormValues, emailTaken: boolean): FormErrors<SignUpFormValues> {
  const errors: FormErrors<SignUpFormValues> = {};
  if (values.fullName.trim().length < 3) errors.fullName = 'Full name must be at least 3 characters';

  const email = values.email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email address';
  else if (emailTaken) errors.email = 'An account with this email already exists';

  const strong = values.password.length >= 8 && /[a-zA-Z]/.test(values.password) && /[0-9]/.test(values.password);
  if (!strong) errors.password = PASSWORD_MESSAGE;

  if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match';
  return errors;
}
