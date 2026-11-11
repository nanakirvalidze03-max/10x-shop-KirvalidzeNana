export interface AuthUser {
  username: string;
  isLoggedIn: boolean;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface SignUpFormValues {
  fullName: string;
  email: string;
  company: string; // optional
  password: string;
  confirmPassword: string;
}

// Account saved in localStorage (shop_users).
// The password is plain text ONLY because this is a learning project without a backend.
export interface StoredUser {
  id: number;
  fullName: string;
  email: string; // always lowercase
  password: string;
  company: string;
  createdAt: string;
}
