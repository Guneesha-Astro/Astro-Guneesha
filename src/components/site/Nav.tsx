import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

const links = [
  { to: "/about", label: "About" },
  { to: "/consultations", label: "Consultations" },
  { to: "/pujas", label: "Pujas" },
  { to: "/courses", label: "Courses" },
  { to: "/ebooks", label: "E-Books" },
  { to: "/sacred-treasures", label: "Sacred Treasures" },
  { to: "/shop", label: "Shop" },
  { to: "/articles", label: "Insights" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setSignedIn(!!session),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold" />
          <span className="font-display text-lg tracking-widest text-gradient-gold">
            ASTRO GUNEESHA
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-5 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-muted-foreground transition-colors hover:text-gold"
              activeProps={{ className: "text-gold" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to={signedIn ? "/dashboard" : "/auth"}
            className="text-sm text-muted-foreground transition-colors hover:text-gold"
          >
            {signedIn ? "Dashboard" : "Sign in"}
          </Link>
          <Button asChild size="sm">
            <a href={SITE.topmate} target="_blank" rel="noreferrer">
              Book a Session
            </a>
          </Button>
        </nav>

        <button
          aria-label="Toggle menu"
          className="ml-auto rounded-md border border-border p-2 text-gold lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                navigate({ to: signedIn ? "/dashboard" : "/auth" });
              }}
              className="rounded-md px-2 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-gold"
            >
              {signedIn ? "Dashboard" : "Sign in"}
            </button>
            <Button asChild className="mt-2">
              <a href={SITE.topmate} target="_blank" rel="noreferrer">
                Book a Session
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
