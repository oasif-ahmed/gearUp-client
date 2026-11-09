
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
          <ShieldAlert className="h-10 w-10 text-red-500" />
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
          Access Denied
        </p>

        <h1 className="mt-4 text-3xl font-bold">
          403 - Forbidden
        </h1>

        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          You don't have permission to access this dashboard.
          Please make sure you're using an account with the correct role.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition hover:bg-muted"
          >
            <ArrowLeft size={18} />
            Login with another account
          </Link>
        </div>
      </div>
    </main>
  );
}
