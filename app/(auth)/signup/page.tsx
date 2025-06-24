import { SignupForm } from '../../components/auth/SignupForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Boat Mech',
  description: 'Create an account with Boat Mech.',
};

export default function SignupPage() {
  return <SignupForm />;
}
