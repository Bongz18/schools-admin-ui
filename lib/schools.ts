// Shared types and display helpers for SchoolSpot school profiles.
import type { FeeGroup } from "@/lib/fees";

/** An extra email for a department, e.g. { label: "Admissions (Registrar)", email: "registrar@school.co.zw" }. */
export type SchoolContact = { label: string; email: string };

export type School = {
  id: string;
  slug: string | null;
  name: string;
  school_type: string | null;
  city: string | null;
  suburb: string | null;
  address: string | null;
  contacts: SchoolContact[] | null;
  highlights: string[] | null;
  fee_groups: FeeGroup[] | null;
  fee_currency: string | null;
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
  verified_at: string | null;
  status: string;
  updated_at: string | null;
};

// Columns safe to show the public. Kept in one place so every query asks for the same thing.
export const SCHOOL_COLUMNS =
  "id,slug,name,school_type,city,suburb,address,contacts,highlights,province,levels,gender,gender_note,boarding,curriculum,religion,founded,fees_text,fee_groups,fee_currency,fee_term_min_usd,fee_term_max_usd,fees_source,website,phone,email,description,verified,verified_at,status,updated_at";

/** One exam result for one year, as supplied by the school. */
export type ExamResult = {
  year: number;
  exam: string;
  subject: string | null;
  pass_rate: number | null;
  top_grade_rate: number | null;
  top_grade_label: string | null;
  sort_order: number;
  source: string | null;
};

export const EXAM_RESULT_COLUMNS = "year,exam,subject,pass_rate,top_grade_rate,top_grade_label,sort_order,source";

export type ExamResultRow = {
  key: string;
  label: string;
  topGradeLabel: string | null;
  byYear: Map<number, ExamResult>;
};

/** Groups results into one row per exam (or exam subject), with the years newest first. */
export function groupExamResults(results: ExamResult[]) {
  const years = [...new Set(results.map((r) => r.year))].sort((a, b) => b - a);
  const rows = new Map<string, ExamResultRow & { order: number }>();
  for (const result of results) {
    const key = `${result.exam}|${result.subject ?? ""}`;
    let row = rows.get(key);
    if (!row) {
      row = {
        key,
        label: result.subject ? `${result.exam} ${result.subject}` : result.exam,
        topGradeLabel: result.top_grade_label,
        byYear: new Map(),
        order: result.sort_order,
      };
      rows.set(key, row);
    }
    row.topGradeLabel ??= result.top_grade_label;
    row.byYear.set(result.year, result);
  }
  const sorted = [...rows.values()].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
  return { years, rows: sorted as ExamResultRow[] };
}

/** "98.7%", "100%" (no trailing ".0"). */
export function formatPercent(value: number | string | null) {
  if (value == null) return null;
  const n = Number(value);
  if (Number.isNaN(n)) return null;
  return `${Number(n.toFixed(1))}%`;
}

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

/** Broad groups parents filter by. Each group covers one or more school_type values. */
export const SECTOR_OPTIONS: { value: string; label: string; types: string[] }[] = [
  { value: "private", label: "Private / independent", types: ["private", "trust", "international"] },
  { value: "government", label: "Government", types: ["government"] },
  { value: "mission", label: "Mission / church", types: ["mission"] },
];

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
  sector?: string;
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
    sector: pick("sector"),
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
      const haystack = [school.name, school.suburb, school.address, school.city, school.religion, school.description]
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
    if (filters.sector) {
      const group = SECTOR_OPTIONS.find((option) => option.value === filters.sector);
      if (group && !(school.school_type && group.types.includes(school.school_type))) return false;
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
