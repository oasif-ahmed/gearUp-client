"use client";

import React from "react";
import Link from "next/link";
import {
  XCircle,
  ArrowLeft,
  ShoppingCart,
  ShieldAlert,
  RefreshCcw,
} from "lucide-react";

export default function CancelURL() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FDFBF7] px-4 py-12">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-200/30 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-rose-200/30 blur-[100px]" />

      <div className="relative w-full max-w-xl">
        <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.06)]">

          {/* Top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#6C63FF] via-purple-500 to-rose-400" />

          <div className="px-6 py-12 text-center sm:px-12">

            {/* Cancel icon */}
            <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-rose-100/70" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-rose-200 bg-rose-50">
                <XCircle
                  className="h-11 w-11 text-rose-500"
                  strokeWidth={1.8}
                />
              </div>
            </div>

            <div className="mb-4 flex justify-center">
              <span className="rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600">
                Checkout Cancelled
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Payment Cancelled!
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-zinc-500">
              Your payment process was cancelled before completion.
              No worries! Your rental order is still available, and
              you can try completing the payment whenever you're ready.
            </p>

            {/* Information card */}
            <div className="mt-9 rounded-2xl border border-zinc-100 bg-[#FAFAF9] p-5 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                  <ShoppingCart className="h-5 w-5 text-[#6C63FF]" />
                </div>

                <div>
                  <p className="text-sm font-bold text-zinc-800">
                    Your Rental Order
                  </p>
                  <p className="text-xs text-zinc-400">
                    Your order details are still accessible
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-dashed border-zinc-200 pt-4">
                <p className="text-xs leading-6 text-zinc-500">
                  You can return to your orders, review your rental details,
                  and retry the payment if the order is still eligible.
                </p>
              </div>
            </div>

            {/* Notice */}
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-purple-100 bg-purple-50/60 p-4 text-left">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#6C63FF]" />

              <p className="text-xs leading-6 text-zinc-600">
                No successful payment confirmation was received on this
                checkout attempt. Check your payment status before trying
                again.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/customer-cart"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6C63FF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5 hover:bg-[#5950E8]"
              >
                <RefreshCcw className="h-4 w-4" />
                Return to My Orders
              </Link>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-bold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                <ArrowLeft className="h-4 w-4" />
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