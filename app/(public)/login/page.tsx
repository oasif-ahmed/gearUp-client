import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Column: Login Form */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-zinc-200">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

      {/* Right Column: Editorial Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 lg:p-16 bg-zinc-900 text-[#FDFBF7]">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            [ Editorial Architecture ]
          </span>
          <p className="text-xs font-mono text-zinc-500">Gear Up Rental Platform</p>
        </div>

        <div className="space-y-6 max-w-lg">
          <h1 className="text-4xl font-light tracking-tight leading-tight">
            Precision equipment <br />
            <span className="font-normal italic">for uncompromising creators.</span>
          </h1>
          <p className="text-sm font-light text-zinc-400 leading-relaxed">
            Access professional-grade cinematography, audio, and studio production assets on-demand. Curated for performance, engineered for reliability.
          </p>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-8 border-t border-zinc-800">
          <span>EST. 2026</span>
          <span>SECURE AUTHENTICATION</span>
        </div>
      </div>
    </main>
  );
}