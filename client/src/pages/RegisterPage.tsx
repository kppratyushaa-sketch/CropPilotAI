import React from 'react';
import { AuthForm } from '../components/AuthForm';

export const RegisterPage: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-140px)] flex flex-col justify-center bg-gradient-to-b from-slate-50 via-brand-50/20 to-slate-50">
      <div className="max-w-md w-full mx-auto">
        <AuthForm mode="register" />
      </div>
    </div>
  );
};
