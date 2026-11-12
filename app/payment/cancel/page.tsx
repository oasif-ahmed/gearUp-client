import React from "react";
import Link from "next/link";
import {
  XCircle,
  ArrowLeft,
  ShoppingCart,
  ShieldAlert,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CancelURL() {
  return (
    <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center bg-background px-4 py-16 text-foreground font-mono">
      <div className="relative w-full max-w-xl">
        
        {/* Editorial Wrapper Card */}
        <div className="bg-card border border-border shadow-xl rounded-none overflow-hidden">

          {/* Top Ledger Bar */}
          <div className="h-1.5 w-full bg-primary" />

          <div className="p-8 sm:p-12 text-center space-y-8">

            {/* Cancel Icon Badge */}
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center border border-rose-300 bg-rose-50">
              <XCircle className="h-10 w-10 text-rose-600" strokeWidth={1.7} />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-[10px] font-mono uppercase tracking-widest text-rose-700">
                <Sparkles className="h-3 w-3" />
                Transaction Aborted
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-foreground">
                Payment Cancelled
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-md mx-auto leading-relaxed">
                Your payment process was cancelled before completion. No worries—your rental order details are preserved, and you can retry settlement whenever you are ready.
              </p>
            </div>

            {/* Information Box */}
            <div className="bg-muted border border-border p-5 text-left space-y-4 rounded-none">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="h-4 w-4 text-foreground" />
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Rental Order Status
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono bg-rose-100 text-rose-800 px-2 py-0.5 font-bold">
                  Pending Payment
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                  You can return to your dashboard, review your active order cart, and securely re-initiate checkout.
                </p>
              </div>
            </div>

            {/* Notice */}
            <div className="flex items-start gap-3 border border-border bg-card p-4 text-left rounded-none">
              <ShieldAlert className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
              <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                No charges were captured during this checkout session. Verify your billing method before attempting another reservation.
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                asChild
                className="h-12 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase font-mono font-semibold tracking-wider flex items-center justify-center gap-2 shadow-xs"
              >
                <Link href="/customer-cart">
                  <RefreshCcw className="h-4 w-4" /> Return to My Orders
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 rounded-none border-border bg-card text-foreground hover:bg-accent/50 text-xs uppercase font-mono tracking-wider flex items-center justify-center"
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
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