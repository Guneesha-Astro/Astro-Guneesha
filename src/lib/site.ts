export const SITE = {
  name: "Astro Guneesha",
  astrologer: "Pooja M Kaushik",
  topmate: "https://topmate.io/guneesha_kaushik/",
  youtube: "https://youtube.com/@guneeshakaushik",
  instagram: "https://www.instagram.com/guneesha_kaushik",
  facebook: "https://www.facebook.com/share/18BPUxneEo/",
} as const;

export const CATEGORY_LABEL: Record<string, string> = {
  gemstone: "Gemstones",
  rudraksha: "Rudraksha",
  yantra: "Yantras",
  ebook: "E-Books",
  course: "Courses",
  sacred_treasure: "Sacred Treasures",
  puja: "Pujas",
  consultation: "Consultations",
};

export function inr(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise);
}
