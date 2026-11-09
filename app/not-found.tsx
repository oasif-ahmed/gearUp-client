
import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          GearUp
        </p>

        <h1 className="text-8xl font-extrabold tracking-tight text-primary sm:text-9xl">
          404
        </h1>

        <h2 className="mt-6 text-2xl font-bold sm:text-3xl">
          Page Not Found
        </h2>

        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to exploring GearUp.
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
            href="/gear"
            className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition hover:bg-muted"
          >
            <Search size={18} />
            Explore Gear
          </Link>
        </div>
      </div>
    </main>
  );
}
