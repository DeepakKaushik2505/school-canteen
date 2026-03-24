import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero - full viewport, background doesn't scroll */}
      <section className="relative min-h-screen flex items-center" style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/assets/home-pic.webp)",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-0 bg-cornsilk/50" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-8 md:px-12 lg:px-16 py-16 pl-[5vw] md:pl-[6vw] lg:pl-[8vw]">
          <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-black-forest tracking-tight mb-12 text-left max-w-2xl drop-shadow-sm">
            School Canteen
          </h1>
          <p className="text-xl md:text-2xl text-black-forest/100 mb-3 text-left  drop-shadow-sm">
            Fresh snacks, quick orders.
          </p>
          <p className="text-lg md:text-xl text-black-forest/100 mb-2 text-left drop-shadow-sm">
            Order your favourite treats in a few clicks.
          </p>
          <p className="text-base md:text-lg text-black-forest/100 mb-10 text-left drop-shadow-sm">
            Simple, fast, and delicious.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/snacks"
              className="gradient-button text-cornsilk px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-lg"
            >
              Browse Snacks
            </Link>
            <Link
              href="/students"
              className="border-2 border-black-forest text-black-forest px-8 py-4 rounded-xl font-semibold hover:bg-black-forest/10 transition-all text-lg"
            >
              View Students
            </Link>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-olive-leaf mb-8">About Us</h2>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4 text-black-forest/90 leading-relaxed">
            <p>
              Our School Canteen has been serving students and staff since 2015. What started as a small kiosk has grown into a beloved part of our campus, offering a variety of snacks, meals, and beverages.
            </p>
            <p>
              We believe in fresh ingredients, friendly service, and affordable prices. From morning chai to after-school treats, our canteen is here to keep everyone energised throughout the day.
            </p>
            <p>
              With our new online ordering system, you can browse the menu, place orders, and pick up your food without the wait. We continue to add new items and improve our service based on your feedback.
            </p>
          </div>
          <div className="w-full lg:w-96 shrink-0">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-olive-leaf/20 shadow-lg">
              <Image
                src="/assets/home-canteen.avif"
                alt="School Canteen"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 384px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-olive-leaf/20 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-black-forest/70 text-sm">
          © {new Date().getFullYear()} School Canteen. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
