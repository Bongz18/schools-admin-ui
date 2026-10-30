// Shared types and display helpers for SchoolSpot school profiles.

export type School = {
  id: string;
  slug: string | null;
  name: string;
  school_type: string | null;
  city: string | null;
  suburb: string | null;
  province: string | null;
  levels: string | null;
  gender: string | null;
  gender_note: string | null;
  boarding: string | null;
  curriculum: string[] | null;
  religion: string | null;
  founded: string | null;
  fees_text: string | null;
  fee_term_min_usd: number | null;
  fee_term_max_usd: number | null;
  fees_source: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
  verified: boolean;
  status: string;
  updated_at: string | null;
};

// Columns safe to show the public. Kept in one place so every query asks for the same thing.
export const SCHOOL_COLUMNS =
  "id,slug,name,school_type,city,suburb,province,levels,gender,gender_note,boarding,curriculum,religion,founded,fees_text,fee_term_min_usd,fee_term_max_usd,fees_source,website,phone,email,description,verified,status,updated_at";

export const GENDER_LABELS: Record<string, string> = {
  girls: "Girls",
  boys: "Boys",
  coed: "Co-ed",
};

export const BOARDING_LABELS: Record<string, string> = {
  day: "Day only",
  day_boarding: "Day and boarding",
  boarding: "Boarding only",
};

export const TYPE_LABELS: Record<string, string> = {
  private: "Private",
  trust: "Independent trust",
  mission: "Mission / church",
  government: "Government",
  international: "International",
};

export const CURRICULUM_OPTIONS = ["Cambridge", "ZIMSEC", "IB", "British"];

export const FEE_OPTIONS = [500, 1000, 1500, 2000, 3000, 4000, 6000];

export function formatUsd(amount: number) {
  return `US$${Math.round(amount).toLocaleString("en-US")}`;
}

/** Short fee line for lists, e.g. "About US$3,800 a term". */
export function feeSummary(school: Pick<School, "fee_term_min_usd" | "fee_term_max_usd" | "fees_text">) {
  const min = school.fee_term_min_usd;
  const max = school.fee_term_max_usd;
  if (min != null && max != null && max > min) return `${formatUsd(min)}–${formatUsd(max)} a term`;
  if (min != null) return `About ${formatUsd(min)} a term`;
  if (school.fees_text) return "Fees: see profile";
  return "Fees not listed yet";
}

export function locationLine(school: Pick<School, "suburb" | "city">) {
  return [school.suburb, school.city].filter(Boolean).join(", ") || "Location not listed yet";
}

export function schoolHref(school: Pick<School, "slug" | "id">) {
  return `/schools/${school.slug ?? school.id}`;
}

export type SchoolFilters = {
  q?: string;
  city?: string;
  gender?: string;
  boarding?: string;
  curriculum?: string;
  maxfee?: string;
  sort?: string;
};

export function readFilters(params: Record<string, string | string[] | undefined>): SchoolFilters {
  const pick = (key: string) => {
    const value = params[key];
    const first = Array.isArray(value) ? value[0] : value;
    return first && first.trim() ? first.trim().slice(0, 80) : undefined;
  };
  return {
    q: pick("q"),
    city: pick("city"),
    gender: pick("gender"),
    boarding: pick("boarding"),
    curriculum: pick("curriculum"),
    maxfee: pick("maxfee"),
    sort: pick("sort"),
  };
}

export function applyFilters(schools: School[], filters: SchoolFilters) {
  const q = filters.q?.toLowerCase();
  const maxFee = filters.maxfee ? Number(filters.maxfee) : undefined;

  const result = schools.filter((school) => {
    if (q) {
      const haystack = [school.name, school.suburb, school.city, school.religion, school.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.city && school.city !== filters.city) return false;
    if (filters.gender && school.gender !== filters.gender) return false;
    if (filters.boarding === "boarding" && !(school.boarding === "boarding" || school.boarding === "day_boarding")) {
      return false;
    }
    if (filters.boarding === "day" && !(school.boarding === "day" || school.boarding === "day_boarding")) {
      return false;
    }
    if (filters.curriculum && !(school.curriculum ?? []).includes(filters.curriculum)) return false;
    if (maxFee && !Number.isNaN(maxFee)) {
      if (school.fee_term_min_usd == null || school.fee_term_min_usd > maxFee) return false;
    }
    return true;
  });

  if (filters.sort === "fee") {
    result.sort((a, b) => (a.fee_term_min_usd ?? Infinity) - (b.fee_term_min_usd ?? Infinity));
  } else {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }
  return result;
}
