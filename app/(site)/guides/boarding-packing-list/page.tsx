import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "@/components/site/PrintButton";
import { formatGuideDate } from "@/lib/guides";

const UPDATED = "2026-11-22";

export const metadata: Metadata = {
  title: "Boarding school packing list for Zimbabwe | SchoolSpot Zimbabwe",
  description:
    "A printable checklist for boarders starting at a Zimbabwean school: trunks and padlocks, bedding, uniform, toiletries, groceries and tuck, and the items schools usually ban.",
};

type ChecklistGroup = { title: string; note?: string; items: string[] };

const CHECKLIST: ChecklistGroup[] = [
  {
    title: "Trunks and security",
    items: [
      "A metal trunk for clothes and belongings",
      "A separate lockable food (tuck) trunk, if the school allows tuck",
      "Padlocks for each trunk, plus a spare key kept at home",
      "Clothes hangers",
    ],
  },
  {
    title: "Bedding",
    note: "Some schools give an exact colour for sheets and bedspreads, and a few ask boarders to bring their own mattress.",
    items: [
      "At least two sets of sheets and pillowcases",
      "A bedspread in the school's colour, if it sets one",
      "Blankets or a duvet, and a pillow",
      "A mattress, only if the school asks for one (check the size it wants)",
    ],
  },
  {
    title: "Uniform and clothing",
    note: "Buy uniform from the school shop or the supplier the school names. Some schools allow only uniform, with no home clothes.",
    items: [
      "Everything on the school's uniform list, in the numbers it gives",
      "Sports kit and tracksuit",
      "School shoes, trainers and socks",
      "Sleepwear, underwear and a warm jersey for winter terms",
      "Home clothes for weekends, only if the school allows them",
    ],
  },
  {
    title: "Washing and toiletries",
    items: [
      "Towels and a facecloth",
      "Bathing slippers",
      "A bucket for washing, if the school's list includes one",
      "Soap, toothbrush, toothpaste, roll-on, lotion and a comb or brush",
      "Washing powder and pegs",
      "Sanitary pads, where needed",
      "Toilet paper, if the school asks boarders to bring their own",
    ],
  },
  {
    title: "Eating",
    items: ["Plate, bowl, cup and spoon (often enamel or plastic)", "A water bottle", "A small container for leftovers or tuck"],
  },
  {
    title: "Study",
    items: [
      "Everything on the stationery list (exercise books, counter books, maths set, calculator)",
      "A school bag",
      "A solar lantern or torch, if allowed (many schools ask for one without a radio)",
    ],
  },
  {
    title: "Groceries and tuck",
    note: "Many government and mission boarding schools send a grocery list that boarders must bring on the first day. Tuck lists often set maximum amounts, and extra items can be taken away.",
    items: [
      "Everything on the school's grocery list, in the amounts it gives",
      "Tuck, only from the school's tuck list and within its limits",
      "Labels on every container",
    ],
  },
  {
    title: "Documents, money and health",
    items: [
      "Proof that fees are paid, and the receipts for this term",
      "Any forms the school asked you to bring (medical form, birth certificate copy, photos)",
      "Pocket money, within the school's limit, and how it will be kept safe",
      "Any regular medicine, handed to the matron or school nurse with written instructions",
    ],
  },
];

const OFTEN_BANNED = [
  "Mobile phones, smartwatches, music players and other recording devices",
  "Body sprays and perfumes",
  "Energy drinks and chewing gum",
  "Food beyond what the tuck list allows",
  "Clothes that are not on the uniform list, at schools that allow uniform only",
];

const TIPS = [
  "Put your child's name on everything: clothes, shoes, bedding, trunks, containers and books. Name tapes or a laundry marker both work.",
  "Tape a copy of the packing list inside the trunk lid. It makes checking easy at the start and end of each term.",
  "Ask the school for its own lists before you shop. Uniform, boarding, grocery and stationery lists all differ from school to school, and some change every year.",
  "Find out what can be bought at school (uniform shop, tuck shop) so you don't buy things twice.",
  "Check the day and time boarders should arrive. It is often the day before lessons start.",
];

const QUESTIONS = [
  "Can you send the uniform, boarding, grocery and stationery lists for 2027?",
  "Where do we buy the uniform, and is there a second-hand uniform shop?",
  "Is tuck allowed, and what are the limits?",
  "Are phones allowed at all, and if not, how do boarders call home?",
  "How is pocket money kept, and is there a limit?",
  "When should boarders arrive on the first day of term, and when can they go home for exeats?",
];

const SOURCES = [
  {
    href: "https://www.watershed.ac.zw/sites/default/files/2026-02/Guide%20to%20New%20Parents%20and%20Students.pdf",
    label: "Watershed College: Guide to New Parents and Students (tuck and boarding rules)",
  },
];

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 font-display text-[1.75rem] leading-tight text-ink print:mt-6 print:text-xl">{children}</h2>;
}

function Tick() {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.3rem] inline-block h-4 w-4 shrink-0 rounded-[4px] border border-brass/70 bg-white"
    />
  );
}

export default function BoardingPackingListGuide() {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20 print:max-w-none print:px-0 print:pb-0 print:pt-0">
      <Link
        href="/guides"
        className="text-sm font-semibold text-leaf underline decoration-leaf/30 underline-offset-4 print:hidden"
      >
        ← All guides
      </Link>
      <h1 className="mt-6 font-display text-[2.3rem] leading-[1.08] tracking-tight text-ink sm:text-[3rem] print:mt-0 print:text-3xl">
        Boarding school packing list for Zimbabwe
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <p className="text-sm text-granite">Last checked {formatGuideDate(UPDATED)}</p>
        <PrintButton />
      </div>

      <div className="mt-8 rounded-2xl border border-brass/40 bg-brass/10 p-6 leading-relaxed text-ink/85 print:hidden">
        <p className="font-semibold text-ink">In short</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Start with your school&apos;s own lists. This checklist helps you make sure nothing is missed.</li>
          <li>Most boarders need a metal trunk, a lockable food trunk and padlocks.</li>
          <li>Many schools send a grocery list for the first day, and limit tuck. Extra items can be taken away.</li>
          <li>Phones and body sprays are banned at many boarding schools.</li>
        </ul>
      </div>

      <div className="text-[1.05rem] leading-relaxed text-ink/85">
        <H2>The checklist</H2>
        <p className="mt-4 print:hidden">
          Every school publishes its own requirements, and the numbers and colours differ. Use your school&apos;s lists for the
          exact items, and this checklist to cover everything else.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 print:grid-cols-2 print:gap-3">
          {CHECKLIST.map((group) => (
            <section
              key={group.title}
              className="break-inside-avoid rounded-2xl border border-line bg-white p-5 print:rounded-none print:border-0 print:p-0"
            >
              <h3 className="font-display text-xl text-ink print:text-base">{group.title}</h3>
              <ul className="mt-3 space-y-2 text-[0.98rem] print:text-sm">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Tick />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {group.note ? <p className="mt-3 text-sm text-granite print:text-xs">{group.note}</p> : null}
            </section>
          ))}
        </div>

        <H2>Items schools often don&apos;t allow</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {OFTEN_BANNED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4">Rules differ, so check your school&apos;s list of prohibited items before you pack.</p>

        <div className="print:hidden">
          <H2>Tips from the lists we read</H2>
          <ul className="mt-4 space-y-3">
            {TIPS.map((tip) => (
              <li key={tip} className="rounded-xl border border-line bg-white px-5 py-3">
                {tip}
              </li>
            ))}
          </ul>
          <p className="mt-4">
            For the 2027 term dates, see our{" "}
            <Link href="/guides/school-calendar-2027" className="text-leaf underline decoration-leaf/30 underline-offset-4">
              2027 school calendar
            </Link>
            .
          </p>

          <H2>What to ask your school</H2>
          <ul className="mt-4 space-y-3">
            {QUESTIONS.map((question) => (
              <li key={question} className="rounded-xl border border-line bg-white px-5 py-3">
                {question}
              </li>
            ))}
          </ul>
          <p className="mt-4">Each school&apos;s page on SchoolSpot has its email and phone so you can ask directly.</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/schools" className="rounded-full bg-leaf px-7 py-3 font-semibold text-white hover:bg-leaf-dark">
              Find a school
            </Link>
            <Link href="/compare" className="font-semibold text-leaf underline decoration-leaf/30 underline-offset-4">
              Compare schools
            </Link>
          </div>

          <H2>Where this information comes from</H2>
          <p className="mt-4">
            We based this checklist on the boarding, uniform, grocery and tuck lists that Zimbabwean schools publish for new
            boarders, including:
          </p>
          <ul className="mt-3 space-y-2 text-[0.98rem]">
            {SOURCES.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-leaf underline decoration-leaf/30 underline-offset-4"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 rounded-xl bg-paper p-5 text-sm text-granite ring-1 ring-line print:mt-4 print:p-0 print:text-xs print:ring-0">
          SchoolSpot Zimbabwe is an independent directory. This is a general checklist, not any school&apos;s official list.
          Always follow the requirements your child&apos;s school gives you. www.schoolspot.co.zw
        </p>
      </div>
    </article>
  );
}
