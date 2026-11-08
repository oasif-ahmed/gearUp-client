"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  RotateCcw,
  Layers,
  Cpu,
  Globe2,
  Workflow,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WorkflowDiagram from "./workFlowDiagram";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 text-zinc-900 font-mono text-xs">
      <div className="max-w-6xl mx-auto px-4 space-y-20">
        
        {/* Editorial Hero Statement */}
        <div className="border-b border-zinc-200 pb-12 space-y-6">
          <div className="flex items-center gap-2">
            <Badge className="rounded-none bg-zinc-900 text-white hover:bg-zinc-900 text-[10px] uppercase tracking-widest px-2.5 py-1 font-mono">
              [ Platform Narrative & Architecture ]
            </Badge>
            <span className="text-[10px] uppercase text-zinc-400 tracking-wider">
              • Est. 2026 / Open Logistics Protocol
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-zinc-900 font-serif max-w-4xl leading-[1.15]">
            Bridging equipment excess with demand through transparent software engineering.
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
            <p className="md:col-span-7 text-sm text-zinc-600 leading-relaxed font-sans">
              GearUp was conceived to solve a structural inefficiency in sports and outdoor production: high-grade technical gear sits idle in vendor warehouses while athletes, creators, and organizers struggle with prohibitive upfront capital costs. Our platform provides a verified, automated bridge between inventory providers and end-users.
            </p>
            <div className="md:col-span-5 border-l border-zinc-200 pl-6 space-y-2 text-[11px] text-zinc-500 font-sans">
              <p className="font-mono text-zinc-900 uppercase font-semibold text-xs">The GearUp Mandate</p>
              <p>1. Zero unverified stock listings.</p>
              <p>2. Instant deposit escrow and settlement.</p>
              <p>3. Transparent role-based platform access.</p>
            </div>
          </div>
        </div>

        {/* Live Operational Metrics Ledger */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-zinc-200 p-6 shadow-xs text-center divide-x divide-zinc-100">
          <div className="space-y-1 p-2">
            <span className="text-3xl font-light font-serif text-zinc-900 block">100%</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">Escrow Settlement</span>
          </div>
          <div className="space-y-1 p-2">
            <span className="text-3xl font-light font-serif text-zinc-900 block">3 Tier</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">RBAC Security Model</span>
          </div>
          <div className="space-y-1 p-2">
            <span className="text-3xl font-light font-serif text-zinc-900 block">Sub-s</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">State Synchronization</span>
          </div>
          <div className="space-y-1 p-2">
            <span className="text-3xl font-light font-serif text-zinc-900 block">Direct</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-mono">Vendor Fulfillment</span>
          </div>
        </div>

        {/* Core Operational Principles */}
        <div className="space-y-8">
          <div className="border-b border-zinc-200 pb-3 flex justify-between items-center">
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold flex items-center gap-2">
              <Cpu className="h-4 w-4 text-zinc-700" /> System Design & Operational Philosophy
            </h2>
            <span className="text-[10px] text-zinc-400 font-mono">[ Platform Principles ]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-zinc-200 p-8 space-y-4 shadow-xs">
              <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-base font-normal font-serif text-zinc-900">
                Predictable Logistics
              </h3>
              <p className="text-zinc-600 text-[11px] leading-relaxed font-sans">
                We eliminate scheduling uncertainty. Rental availability windows are revalidated in real time against ongoing reservations to prevent double-booking.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 p-8 space-y-4 shadow-xs">
              <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-base font-normal font-serif text-zinc-900">
                Financial Safeguards
              </h3>
              <p className="text-zinc-600 text-[11px] leading-relaxed font-sans">
                Every transaction balances equipment protection for vendors with security deposit transparency for renters through automated gateway integration.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 p-8 space-y-4 shadow-xs">
              <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-base font-normal font-serif text-zinc-900">
                High-Density UI/UX
              </h3>
              <p className="text-zinc-600 text-[11px] leading-relaxed font-sans">
                Designed with an editorial monospaced aesthetic that emphasizes data clarity, swift modal inspections, and zero-distraction navigation.
              </p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE WORKFLOW MAP */}
        <div className="space-y-4 pt-4">
          <div className="border-b border-zinc-200 pb-3 flex justify-between items-center">
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold flex items-center gap-2">
              <Workflow className="h-4 w-4 text-zinc-700" /> Interactive Platform Workflow Diagram
            </h2>
            <span className="text-[10px] text-zinc-400 font-mono">[ React Flow Graph • Pan & Zoom ]</span>
          </div>

          <div className="bg-white border border-zinc-200 p-2 shadow-xs">
            <WorkflowDiagram />
          </div>
        </div>

        {/* Tech Stack & Infrastructure Specifications */}
        <div className="bg-white border border-zinc-200 p-8 md:p-12 shadow-xs space-y-8">
          <div className="border-b border-zinc-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 block">
                [ Engineering Stack ]
              </span>
              <h3 className="text-2xl font-normal text-zinc-900 font-serif mt-0.5">
                Technical Stack & Infrastructure
              </h3>
            </div>
            <Badge variant="outline" className="rounded-none text-[10px] uppercase font-mono self-start sm:self-auto">
              Production Build v2.0
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans">
            <div className="space-y-4">
              <h4 className="font-bold text-zinc-900 uppercase font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Frontend & State Architecture
              </h4>
              <ul className="space-y-2.5 text-zinc-600 text-[11px]">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-zinc-400">•</span>
                  <span><strong>Next.js App Router:</strong> Server-side rendering and concurrent data fetching for catalog performance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-zinc-400">•</span>
                  <span><strong>URL Parameter Sync:</strong> Search query parameters drive detail modal states for link sharing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-zinc-400">•</span>
                  <span><strong>Tailwind CSS & Lucide Icons:</strong> Unified Zinc-900 cream-white visual hierarchy.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-zinc-900 uppercase font-mono text-xs flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-zinc-900" />
                Backend & Infrastructure Layer
              </h4>
              <ul className="space-y-2.5 text-zinc-600 text-[11px]">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-zinc-400">•</span>
                  <span><strong>Vercel API Infrastructure:</strong> High-availability serverless API routing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-zinc-400">•</span>
                  <span><strong>Image Storage Pipeline:</strong> Dynamic media hosting utilizing ImgBB API integrations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-zinc-400">•</span>
                  <span><strong>Payment Gateways:</strong> Integrated Stripe and SSLCommerz transaction handlers.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#18181B] text-white p-8 md:p-12 border border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
              [ Explore Equipment Directory ]
            </span>
            <h3 className="text-2xl font-serif font-light tracking-tight text-white">
              Experience the GearUp ecosystem live.
            </h3>
            <p className="text-xs text-zinc-400 font-sans max-w-md">
              Browse inventory, test cart synchronization, and inspect verified equipment specs.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-none bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-mono uppercase px-6 h-11 flex items-center gap-2"
            >
              <Link href="/gear-items">
                Browse Catalog <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}