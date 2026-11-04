// app/(public)/register/page.tsx

import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 dark:bg-gray-950">
      <div className="w-full max-w-4xl mx-auto">
        <RegisterForm></RegisterForm>
      </div>
    </main>
  );
}