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
    <main className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#FDFBF7] px-4 py-16 text-zinc-900 font-mono">
      <div className="relative w-full max-w-xl">
        
        {/* Editorial Wrapper Card */}
        <div className="bg-white border border-zinc-300 shadow-xl rounded-none overflow-hidden">

          {/* Top Ledger Bar */}
          <div className="h-1.5 w-full bg-zinc-900" />

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
              <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-zinc-900">
                Payment Cancelled
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 font-sans max-w-md mx-auto leading-relaxed">
                Your payment process was cancelled before completion. No worries—your rental order details are preserved, and you can retry settlement whenever you are ready.
              </p>
            </div>

            {/* Information Box */}
            <div className="bg-[#FDFBF7] border border-zinc-200 p-5 text-left space-y-4 rounded-none">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className="h-4 w-4 text-zinc-900" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Rental Order Status
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono bg-rose-100 text-rose-800 px-2 py-0.5 font-bold">
                  Pending Payment
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-mono text-[11px] text-zinc-600 leading-relaxed">
                  You can return to your dashboard, review your active order cart, and securely re-initiate checkout.
                </p>
              </div>
            </div>

            {/* Notice */}
            <div className="flex items-start gap-3 border border-zinc-200 bg-white p-4 text-left rounded-none">
              <ShieldAlert className="h-4 w-4 text-zinc-900 shrink-0 mt-0.5" />
              <p className="text-[11px] font-mono text-zinc-600 leading-relaxed">
                No charges were captured during this checkout session. Verify your billing method before attempting another reservation.
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                asChild
                className="h-12 rounded-none bg-zinc-900 hover:bg-zinc-800 text-white text-xs uppercase font-mono font-semibold tracking-wider flex items-center justify-center gap-2 shadow-xs"
              >
                <Link href="/customer-cart">
                  <RefreshCcw className="h-4 w-4" /> Return to My Orders
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 rounded-none border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2"
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
              </Button>
            </div>

          </div>
        </div>

        {/* Minimal Footer Note */}
        <p className="mt-6 text-center text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400">
          GearUp Operations · Rental Architecture · Est. 2026
        </p>

      </div>
    </main>
  );
}