"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  Receipt,
  ShieldCheck,
  Package,
} from "lucide-react";

export default function SuccessURL() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FDFBF7] px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-200/30 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-[100px]" />

      <div className="relative w-full max-w-xl">
        <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.06)]">

          {/* Top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#6C63FF] via-purple-500 to-indigo-500" />

          <div className="px-6 py-12 text-center sm:px-12">

            {/* Success icon */}
            <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-pulse rounded-full bg-green-100/70" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-green-200 bg-green-50">
                <CheckCircle2 className="h-11 w-11 text-green-600" strokeWidth={1.8} />
              </div>
            </div>

            <div className="mb-4 flex justify-center">
              <span className="rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">
                Payment Completed
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Payment Successful!
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-zinc-500">
              Your payment has been submitted successfully. Thank you for
              choosing GearUp. Your rental journey is one step closer!
            </p>

            {/* Payment details */}
            <div className="mt-9 rounded-2xl border border-zinc-100 bg-[#FAFAF9] p-5 text-left">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                  <Receipt className="h-5 w-5 text-[#6C63FF]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-800">
                    Payment Information
                  </p>
                  <p className="text-xs text-zinc-400">
                    Stripe Checkout
                  </p>
                </div>
              </div>

              <div className="border-t border-dashed border-zinc-200 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Checkout Session ID
                </p>
                <p className="mt-2 break-all font-mono text-xs leading-5 text-zinc-600">
                  {sessionId || "Session information unavailable"}
                </p>
              </div>
            </div>

            {/* Confirmation note */}
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-purple-100 bg-purple-50/60 p-4 text-left">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#6C63FF]" />
              <p className="text-xs leading-6 text-zinc-600">
                Your payment status will be reflected in your rental order
                after backend payment verification.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/customer-cart"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6C63FF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5 hover:bg-[#5950E8]"
              >
                <Package className="h-4 w-4" />
                View My Orders
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/"
                className="flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-bold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
          GEARUP · RENT SMART · LIVE MORE
        </p>
      </div>
    </main>
  );
}