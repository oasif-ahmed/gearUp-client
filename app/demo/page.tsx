import Navbar from "@/components/ui/navbar";

export default function NavbarDemo() {
  return (
    <div className="w-full bg-background p-8">
      <div className="mx-auto w-full max-w-xl">
        <Navbar
          brand="BIGBULL"
          items={[
            { label: "EVENTS", href: "#", active: true },
            { label: "STUBS", href: "#" },
            { label: "VENUES", href: "#" },
          ]}
        />
      </div>
    </div>
  );
}