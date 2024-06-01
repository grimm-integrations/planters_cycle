/*
 * Copyright (c) Johannes Grimm 2024.
 */
import { LoginForm } from '@/app/ui/login-form';

export default function LoginPage() {
  return (
    <div className='w-full min-h-screen flex items-center justify-center '>
      <div className='mx-auto my-auto '>
        <LoginForm />
      </div>
    </div>
  );
}
