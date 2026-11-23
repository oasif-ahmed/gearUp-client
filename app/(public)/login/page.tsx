import LoginForm from "@/components/login-form";
import AuthHeroPanel from "@/components/shared/authHeroPanel";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-border">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

      <AuthHeroPanel />
    </main>
  );
}
