import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Receipt,
  ShieldCheck,
  Package,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const sessionId = typeof params.session_id === "string" ? params.session_id : null;

  return (
    <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center bg-background px-4 py-16 text-foreground font-mono">
      <div className="relative w-full max-w-xl">
        
        {/* Editorial Wrapper Card */}
        <div className="bg-card border border-border shadow-xl rounded-none overflow-hidden">

          {/* Top Ledger Bar */}
          <div className="h-1.5 w-full bg-primary" />

          <div className="p-8 sm:p-12 text-center space-y-8">

            {/* Success Icon Badge */}
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center border border-emerald-300 bg-emerald-50">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" strokeWidth={1.7} />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-[10px] font-mono uppercase tracking-widest text-emerald-700">
                <Sparkles className="h-3 w-3" />
                Verified Settlement
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-foreground">
                Payment Successful
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-md mx-auto leading-relaxed">
                Your transaction has been securely processed via Stripe. Your equipment rental reservation is now active and queued for dispatch.
              </p>
            </div>

            {/* Payment Details Box */}
            <div className="bg-muted border border-border p-5 text-left space-y-4 rounded-none">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <Receipt className="h-4 w-4 text-foreground" />
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Stripe Checkout Ledger
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold">
                  Paid & Settled
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Checkout Session ID
                </span>
                <p className="break-all font-mono text-[11px] text-muted-foreground bg-card border border-border p-2.5">
                  {sessionId || "Session information unavailable"}
                </p>
              </div>
            </div>

            {/* Security Guarantee Note */}
            <div className="flex items-start gap-3 border border-border bg-card p-4 text-left rounded-none">
              <ShieldCheck className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
              <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                All transaction receipts and deposit protection certificates are logged in your customer portal.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                asChild
                className="h-12 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase font-mono font-semibold tracking-wider flex items-center justify-center gap-2 shadow-xs"
              >
                <Link href="/customer-cart">
                  <Package className="h-4 w-4" /> View My Orders <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 rounded-none border-border bg-card text-foreground hover:bg-accent/50 text-xs uppercase font-mono tracking-wider flex items-center justify-center"
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>

          </div>
        </div>

        {/* Minimal Footer Note */}
        <p className="mt-6 text-center text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
          GearUp Operations · Rental Architecture · Est. 2026
        </p>

      </div>
    </main>
  );
}