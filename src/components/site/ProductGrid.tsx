import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE, inr } from "@/lib/site";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  price_inr: number;
  external_url: string | null;
};

export function useProducts(categories?: string[]) {
  return useQuery({
    queryKey: ["products", categories ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("products")
        .select("id, slug, name, category, description, price_inr, external_url")
        .eq("is_active", true)
        .order("price_inr", { ascending: true });
      if (categories?.length) q = q.in("category", categories);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="panel group flex flex-col p-6 transition-colors hover:border-gold/50">
      <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80">
        {product.category.replace("_", " ")}
      </span>
      <h3 className="mt-2 font-display text-lg text-starlight">{product.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {product.description}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="font-display text-lg text-gold">{inr(product.price_inr)}</span>
        <Button asChild size="sm" variant="secondary">
          <a
            href={product.external_url ?? SITE.topmate}
            target="_blank"
            rel="noreferrer"
          >
            Purchase
          </a>
        </Button>
      </div>
    </article>
  );
}

export function ProductGrid({ categories }: { categories?: string[] }) {
  const { data, isLoading, error } = useProducts(categories);

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        We couldn't load the collection right now. Please refresh in a moment.
      </p>
    );
  }

  if (!data?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        New offerings are being prepared. Check back shortly.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
