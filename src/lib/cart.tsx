import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

type CartCtx = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "qty">) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "astro-guneesha-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore corrupt cart */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines]);

  const value = useMemo<CartCtx>(() => {
    return {
      lines,
      add: (line) =>
        setLines((prev) => {
          const hit = prev.find((l) => l.productId === line.productId);
          return hit
            ? prev.map((l) =>
                l.productId === line.productId ? { ...l, qty: l.qty + 1 } : l,
              )
            : [...prev, { ...line, qty: 1 }];
        }),
      remove: (productId) =>
        setLines((prev) => prev.filter((l) => l.productId !== productId)),
      setQty: (productId, qty) =>
        setLines((prev) =>
          prev
            .map((l) => (l.productId === productId ? { ...l, qty } : l))
            .filter((l) => l.qty > 0),
        ),
      clear: () => setLines([]),
      total: lines.reduce((s, l) => s + l.price * l.qty, 0),
      count: lines.reduce((s, l) => s + l.qty, 0),
    };
  }, [lines]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
