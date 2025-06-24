import { LoginForm } from '../../components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Boat Mech',
  description: 'Log in to your Boat Mech account.',
};

export default function LoginPage() {
  return <LoginForm />;
}
