import { getAllGearItems } from "@/services/gear-item.service";
import GearItemCard from "@/components/gear/gearItemCard";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PublicHome() {
  let featuredGear = [];
  try {
    const response = await getAllGearItems();
    featuredGear = response?.data?.gearItems?.slice(0, 3) || [];
  } catch (err) {
    console.error("Failed to fetch featured gear", err);
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 selection:bg-zinc-900 selection:text-[#FDFBF7]">
      {/* Editorial Navigation Bar Header space / divider line */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6 border-b border-zinc-200 flex justify-between items-center text-xs tracking-widest uppercase font-mono text-zinc-500">
        <span>Est. 2026 / Rental Architecture</span>
        <span>Catalog Vol. 01</span>
      </div>

      {/* Main Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          {/* Left Hero Title Column */}
          <div className="lg:col-span-8 space-y-8">
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tighter leading-[0.9] text-zinc-900 font-serif">
              Gear <br />
              <span className="italic font-normal font-sans text-zinc-600">
                Up.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-600 max-w-xl font-normal leading-relaxed">
              Your adventure starts here. A curated, frictionless equipment
              rental platform engineered to help you find, secure, and deploy
              professional gear with total confidence.
            </p>
          </div>

          {/* Right Action Stack Column */}
          <div className="lg:col-span-4 flex flex-col gap-4 lg:pb-4">
            <Button
              asChild
              size="lg"
              className="bg-zinc-900 hover:bg-zinc-800 text-[#FDFBF7] h-14 rounded-none font-medium tracking-wide justify-between px-6"
            >
              <Link href="/gear-items">
                Browse Full Catalog <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-zinc-300 text-zinc-900 hover:bg-zinc-100 h-14 rounded-none font-medium tracking-wide justify-between px-6"
            >
              <Link href="/about">
                Our System & Terms <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Editorial Rule Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="w-full h-px bg-zinc-200" />
      </div>

      {/* Featured Equipment Section */}
      {featuredGear.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-2">
                Curated Selection
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-zinc-900">
                Featured Hardware
              </h2>
            </div>
            <Link
              href="/gear-items"
              className="text-xs font-mono uppercase tracking-wider text-zinc-900 hover:opacity-60 transition-opacity underline underline-offset-4"
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
                <div className="bg-white border border-zinc-200 p-4 transition-all duration-300 group-hover:border-zinc-400 h-full flex flex-col justify-between">
                  <GearItemCard {...item} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Minimalist Footer Note */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-200 text-xs text-zinc-500 flex justify-between font-mono">
        <span>Gear Rental Operations</span>
        <span>System Active</span>
      </footer>
    </div>
  );
}
