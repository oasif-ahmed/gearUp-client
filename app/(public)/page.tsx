import { getAllGearItems } from "@/services/gear-item.service";
import GearItemCard from "@/components/gear/gearItemCard";
import Link from "next/link";
import { 
  ShieldCheck, 
  Clock, 
  Truck, 
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Hero from "@/components/shared/hero";
import SocialProof15 from "@/components/shared/socialProof";

export const dynamic = 'force-dynamic';

export default async function PublicHome() {
  let allGear: any[] = [];
  try {
    const response = await getAllGearItems();
    allGear = response?.data?.gearItems || [];
  } catch (err) {
    console.error("Failed to fetch featured gear", err);
  }

  const featuredGear = allGear.slice(0, 3);
  const brands = Array.from(
    new Set(allGear.map((item: any) => item?.brand).filter(Boolean))
  ).slice(0, 12);
  const marqueeItems = brands.length > 0
    ? brands
    : ["Outdoor", "Camping", "Cycling", "Fitness", "Travel"];

  return (
    <div className="min-h-screen w-full bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Dynamic Hero Section */}
      <Hero />

      {/* Brand Marquee */}
      <section className="relative mt-12 overflow-hidden border-y border-border bg-card py-5">
        <div className="marquee-mask relative w-full overflow-hidden">
          <div className="marquee-track flex w-max items-center">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center"
                aria-hidden={copy === 1}
              >
                {marqueeItems.map((brand, index) => (
                  <div
                    key={`${copy}-${brand}-${index}`}
                    className="flex items-center whitespace-nowrap px-7"
                  >
                    <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-foreground sm:text-base">
                      {brand}
                    </span>
                  </div>
                ))}
              </div>
            ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {featuredGear.map((item: any) => (
              <Link
                href={`/gear-items/${item.id}`}
                key={item.id}
                className="group block h-full"
              >
                <GearItemCard {...item} />
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
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-primary-foreground/60">
              [ Built for Peace of Mind ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight">
              Gear you can count on.
            </h2>
            <p className="text-sm font-mono text-primary-foreground/80 leading-relaxed max-w-lg">
              Every item is checked before it goes live. Your rentals, receipts, and order status all stay in one place — so you can book without second-guessing.
            </p>
            <div className="pt-2">
              <Button
                asChild
                className="bg-primary-foreground text-primary hover:opacity-90 rounded-none text-xs font-mono uppercase px-6 h-11"
              >
                <Link href="/customer-cart">Open customer portal</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono sm:gap-4">
            {/* Large */}
            <div className="col-span-2 flex flex-col justify-between border border-primary-foreground/20 bg-primary-foreground/10 p-6 sm:p-7">
              <ShieldCheck className="h-7 w-7 text-emerald-400" />
              <div className="mt-10">
                <h4 className="text-base font-bold uppercase tracking-wider">Secure payments</h4>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-primary-foreground/75">
                  Safe checkout with encrypted payments and a clear receipt after every booking.
                </p>
              </div>
            </div>

            {/* Medium - tall */}
            <div className="row-span-2 flex flex-col justify-between border border-primary-foreground/20 bg-primary-foreground/5 p-5">
              <Clock className="h-6 w-6 text-sky-400" />
              <div className="mt-8">
                <h4 className="text-xs font-bold uppercase tracking-wider">Flexible windows</h4>
                <p className="mt-2 text-[10px] leading-relaxed text-primary-foreground/70">
                  Daily rental periods that fit your plans.
                </p>
              </div>
            </div>

            {/* Small */}
            <div className="border border-primary-foreground/20 bg-primary-foreground/5 p-4">
              <Truck className="h-5 w-5 text-amber-400" />
              <h4 className="mt-5 text-[10px] font-bold uppercase tracking-wider">Rapid dispatch</h4>
              <p className="mt-1.5 text-[10px] leading-relaxed text-primary-foreground/70">
                Quick confirmation and order updates.
              </p>
            </div>

            {/* Small */}
            <div className="border border-primary-foreground/20 bg-primary-foreground/5 p-4">
              <CheckCircle2 className="h-5 w-5 text-violet-400" />
              <h4 className="mt-5 text-[10px] font-bold uppercase tracking-wider">Verified reviews</h4>
              <p className="mt-1.5 text-[10px] leading-relaxed text-primary-foreground/70">
                Honest feedback from real renters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rotating Customer Story Spotlight */}
      <SocialProof15 />

    </div>
  );
}