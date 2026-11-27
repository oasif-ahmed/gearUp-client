import { getAllGearItems } from "@/services/gear-item.service";
import GearItemCard from "@/components/gear/gearItemCard";
import Link from "next/link";
import { 
  ArrowRight, 
  ArrowUpRight, 
  ShieldCheck, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Hero from "@/components/shared/hero";
import SocialProof15 from "@/components/shared/socialProof";

export const dynamic = 'force-dynamic';

export default async function PublicHome() {
  let featuredGear = [];
  try {
    const response = await getAllGearItems();
    featuredGear = response?.data?.gearItems?.slice(0, 3) || [];
  } catch (err) {
    console.error("Failed to fetch featured gear", err);
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Dynamic Hero Section */}
      <Hero />

      {/* Statistics / Trust Bar */}
      <section className="border-y border-border bg-card py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 font-mono">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">100%</span>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Verified Equipment</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">24/7</span>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Secure Reservations</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">0-Risk</span>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Deposit Protection</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Fast</span>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Frictionless Checkout</p>
          </div>
        </div>
      </section>

      {/* Featured Equipment Section */}
      {featuredGear.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-2">
                Curated Selection
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">
                Featured Hardware
              </h2>
            </div>
            <Link
              href="/gear-items"
              className="text-xs font-mono uppercase tracking-wider text-foreground hover:opacity-60 transition-opacity underline underline-offset-4 flex items-center gap-1"
            >
              View All Inventory ({featuredGear.length}) &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGear.map((item: any) => (
              <Link
                href={`/gear-items/${item.id}`}
                key={item.id}
                className="group block"
              >
                <div className="bg-card border border-border p-5 transition-all duration-300 group-hover:border-primary group-hover:shadow-md h-full flex flex-col justify-between">
                  <GearItemCard {...item} />
                  
                  {/* Interactive card footer enhancement */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground group-hover:text-foreground">
                    <span>Inspect Specs & Availability</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Editorial Rule Divider */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="w-full h-px bg-border" />
      </div>

      {/* How It Works Workflow Section */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            System Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-foreground">
            Seamless Rental Architecture in 3 Steps
          </h2>
          <p className="text-sm font-mono text-muted-foreground">
            Designed for creators, professionals, and expedition teams requiring zero downtime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-none border-border bg-card p-6 shadow-xs relative">
            <CardContent className="space-y-4 pt-4">
              <div className="w-10 h-10 bg-primary text-primary-foreground font-mono flex items-center justify-center text-sm font-bold">
                01
              </div>
              <h3 className="text-lg font-medium font-serif text-foreground">
                Explore Catalog & Add to Cart
              </h3>
              <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                Browse professional hardware, review condition specifications, check day rates, and bundle your required kit into your custom cart.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-border bg-card p-6 shadow-xs relative">
            <CardContent className="space-y-4 pt-4">
              <div className="w-10 h-10 bg-primary text-primary-foreground font-mono flex items-center justify-center text-sm font-bold">
                02
              </div>
              <h3 className="text-lg font-medium font-serif text-foreground">
                Select Schedule & Checkout
              </h3>
              <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                Define your unified start and end rental dates. Submit your order securely and complete transaction processing through integrated checkout.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-border bg-card p-6 shadow-xs relative">
            <CardContent className="space-y-4 pt-4">
              <div className="w-10 h-10 bg-primary text-primary-foreground font-mono flex items-center justify-center text-sm font-bold">
                03
              </div>
              <h3 className="text-lg font-medium font-serif text-foreground">
                Deploy & Review
              </h3>
              <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                Pick up your equipment or receive delivery. Track fulfillment progress in your customer portal, manage active orders, and leave feedback.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-primary-foreground/60">
              [ Enterprise Reliability ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight">
              Engineered for Complete Peace of Mind
            </h2>
            <p className="text-sm font-mono text-primary-foreground/80 leading-relaxed max-w-lg">
              Every asset listed in our catalog undergoes rigorous diagnostic and physical inspection before deployment. Manage all your rental receipts, transactions, and live status reports directly from your dashboard.
            </p>
            <div className="pt-2">
              <Button
                asChild
                className="bg-primary-foreground text-primary hover:opacity-90 rounded-none text-xs font-mono uppercase px-6 h-11"
              >
                <Link href="/customer-cart">Access Customer Portal</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="bg-primary/90 border border-border p-5 space-y-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400 mb-1" />
              <h4 className="font-bold text-primary-foreground uppercase tracking-wider">Secure Payments</h4>
              <p className="text-primary-foreground/80">Integrated checkout gateways ensuring encrypted transaction safety.</p>
            </div>

            <div className="bg-primary/90 border border-border p-5 space-y-2">
              <Clock className="h-5 w-5 text-sky-400 mb-1" />
              <h4 className="font-bold text-primary-foreground uppercase tracking-wider">Flexible Windows</h4>
              <p className="text-primary-foreground/80">Customizable daily billing windows tailored to project scopes.</p>
            </div>

            <div className="bg-primary/90 border border-border p-5 space-y-2">
              <Truck className="h-5 w-5 text-amber-400 mb-1" />
              <h4 className="font-bold text-primary-foreground uppercase tracking-wider">Rapid Dispatch</h4>
              <p className="text-primary-foreground/80">Quick order confirmation and fulfillment status tracking.</p>
            </div>

            <div className="bg-primary/90 border border-border p-5 space-y-2">
              <CheckCircle2 className="h-5 w-5 text-violet-400 mb-1" />
              <h4 className="font-bold text-primary-foreground uppercase tracking-wider">Verified Reviews</h4>
              <p className="text-primary-foreground/80">Real customer feedback and gear condition transparency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rotating Customer Story Spotlight */}
      <SocialProof15 />

      {/* Minimalist Footer Note */}
      <footer className="max-w-6xl mx-auto px-4 py-12 border-t border-border text-xs text-muted-foreground flex flex-col sm:flex-row justify-between items-center gap-4 font-mono">
        <span>Gear Rental Operations — Est. 2026</span>
        <div className="flex items-center gap-6">
          <Link href="/gear-items" className="hover:text-foreground transition-colors">Catalog Directory</Link>
          <Link href="/customer-cart" className="hover:text-foreground transition-colors">Customer Portal</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">Terms & Info</Link>
        </div>
        <span className="text-emerald-600 font-medium">System Active</span>
      </footer>
    </div>
  );
}