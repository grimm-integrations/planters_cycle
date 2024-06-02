/*
 * Copyright (c) Johannes Grimm 2024.
 */
import { LoginForm } from '@/app/ui/login-form';

export default function LoginPage() {
  return (
    <div className='flex min-h-screen w-full items-center justify-center '>
      <div className='m-auto '>
        <LoginForm />
      </div>
    </div>
  );
}
