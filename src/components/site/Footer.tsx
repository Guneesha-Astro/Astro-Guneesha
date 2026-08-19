import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-midnight/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg tracking-widest text-gradient-gold">
            ASTRO GUNEESHA
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Vedic astrology, tarot and ritual guidance with {SITE.astrologer}.
            Readings rooted in classical technique and everyday practicality.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-starlight">Explore</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/consultations" className="hover:text-gold">Consultations</Link></li>
            <li><Link to="/pujas" className="hover:text-gold">Pujas</Link></li>
            <li><Link to="/courses" className="hover:text-gold">Courses</Link></li>
            <li><Link to="/ebooks" className="hover:text-gold">E-Books</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-starlight">Shop</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-gold">All products</Link></li>
            <li><Link to="/sacred-treasures" className="hover:text-gold">Sacred Treasures</Link></li>
            <li><Link to="/articles" className="hover:text-gold">Insights</Link></li>
            <li><Link to="/about" className="hover:text-gold">About Pooja</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-starlight">Follow</p>
          <div className="flex gap-3">
            <a href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-md border border-border p-2 text-gold hover:bg-gold-soft">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={SITE.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded-md border border-border p-2 text-gold hover:bg-gold-soft">
              <Youtube className="h-4 w-4" />
            </a>
            <a href={SITE.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-md border border-border p-2 text-gold hover:bg-gold-soft">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
          <a
            href={SITE.topmate}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm text-gold hover:underline"
          >
            Book on Topmate →
          </a>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Astro Guneesha · {SITE.astrologer}
      </div>
    </footer>
  );
}
