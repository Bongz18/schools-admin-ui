import type { MetadataRoute } from "next";
import { publicSupabase } from "@/lib/supabaseServer";

// Lists the public pages for Google. Only PUBLISHED schools appear (the anon key
// can't read drafts), so a school shows up here automatically once it's published.
export const revalidate = 3600;

const SITE_URL = "https://www.schoolspot.co.zw";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/schools`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/compare`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/how-it-works`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/for-schools`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const { data } = await publicSupabase()
    .from("schools")
    .select("slug,updated_at")
    .eq("status", "published")
    .not("slug", "is", null);

  for (const school of data ?? []) {
    pages.push({
      url: `${SITE_URL}/schools/${school.slug}`,
      lastModified: school.updated_at ? new Date(school.updated_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return pages;
}
