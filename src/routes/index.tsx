import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Activity,
  Terminal,
  ShieldCheck,
  Folder,
  History,
  Trash2,
  Power,
  Monitor,
  Users,
  ClipboardCheck,
  Radio,
  MessageSquare,
  LineChart,
} from "lucide-react";
import heroImage from "@/assets/hero-lab.jpg";
import { SiteFooter, SiteNav } from "@/components/site-chrome";
import { BtnLink, Panel, Tag, Dot } from "@/components/kit";
import { WinSim } from "@/components/lab/win-sim";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusLab — Instructor-Led Virtual Laboratory for Universities" },
      {
        name: "description",
        content:
          "CampusLab unites live instructor-led sessions, interactive laboratory simulations and continuous practical assessment in one virtual laboratory studio.",
      },
      { property: "og:title", content: "CampusLab — Instructor-Led Virtual Laboratory for Universities" },
      {
        property: "og:description",
        content:
          "CampusLab unites live instructor-led sessions, interactive laboratory simulations and continuous practical assessment in one virtual laboratory studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const capabilities = [
  {
    icon: Radio,
    title: "Live laboratory studios",
    body: "Instructors run practical classes with video, demonstration and shared simulations in one room.",
  },
  {
    icon: Monitor,
    title: "Interactive workstations",
    body: "Every student receives a virtual workstation and performs the procedure instead of reading it.",
  },
  {
    icon: Users,
    title: "Supervision at scale",
    body: "Progress, activity and raised hands surface live so no student works unobserved.",
  },
  {
    icon: MessageSquare,
    title: "Collaboration built in",
    body: "Breakout laboratory groups, channel chat and screen sharing stay inside the session.",
  },
  {
    icon: ClipboardCheck,
    title: "Assessment in place",
    body: "Task completion, accuracy and instructor observation are graded during the practical.",
  },
  {
    icon: LineChart,
    title: "Competency record",
    body: "Each practical contributes to a continuous record of demonstrated practical ability.",
  },
];

const simulators = [
  { icon: Monitor, label: "Virtual Windows desktop" },
  { icon: Activity, label: "Task Manager simulator" },
  { icon: Trash2, label: "Disk Cleanup simulator" },
  { icon: Folder, label: "File Explorer" },
  { icon: Terminal, label: "Command Prompt" },
  { icon: Power, label: "Safe Mode" },
  { icon: History, label: "System Restore" },
  { icon: ShieldCheck, label: "Antivirus and malware troubleshooting" },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      <main>
        <section className="mx-auto max-w-[1320px] px-6 pt-8">
          <div className="relative overflow-hidden rounded-[32px] bg-[#eceff3]">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-24 -left-24 size-[420px] rounded-full bg-primary/10 blur-3xl motion-safe:animate-[pulse_9s_cubic-bezier(0.4,0,0.6,1)_infinite]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-32 left-1/3 size-[360px] rounded-full bg-secondary/10 blur-3xl motion-safe:animate-[pulse_12s_cubic-bezier(0.4,0,0.6,1)_infinite]"
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <div className="px-8 py-14 md:px-14 md:py-20">
                <span className="grid size-12 place-items-center rounded-[16px] bg-foreground motion-safe:animate-scale-in">
                  <span className="block size-5 rounded-full border-[3px] border-primary-foreground" />
                </span>
                <h1 className="mt-8 text-[40px] leading-[1.05] font-bold tracking-[-0.02em] text-foreground motion-safe:animate-fade-in md:text-h1 lg:text-display">
                  The virtual laboratory where practical classes actually happen
                </h1>
                <p
                  className="measure mt-6 text-bodylg text-muted-foreground motion-safe:animate-fade-in"
                  style={{ animationDelay: "120ms", animationFillMode: "backwards" }}
                >
                  Teach live, demonstrate on screen, hand every student a working workstation and
                  assess what they did — in one platform instead of four. Think of a meeting tool
                  designed for laboratories rather than boardrooms.
                </p>
                <div
                  className="mt-10 flex flex-wrap items-center gap-3 motion-safe:animate-fade-in"
                  style={{ animationDelay: "220ms", animationFillMode: "backwards" }}
                >
                  <StartCta />

                </div>
              </div>
              <div className="relative h-full motion-safe:animate-fade-in">
                <img
                  src={heroImage}
                  alt="Virtual laboratory workstation, live session grid and progress dashboard shown on three floating screens"
                  width={1600}
                  height={1104}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-6 max-w-[1320px] px-6">
          <div className="flex flex-col gap-6 rounded-[24px] bg-foreground px-8 py-7 text-primary-foreground md:flex-row md:items-center md:justify-between md:px-12">
            <p className="measure text-[17px]">
              <span className="font-semibold">Built for departments that share equipment</span>
              <span className="text-white/60">
                {" "}
                — laboratory capacity stops being the limit on how much students practise
              </span>
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[15px] font-medium text-white/55">
              {[
                "Computing",
                "Engineering",
                "Physical Sciences",
                "Education",
                "Health Sciences",
              ].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </section>


        <section className="mx-auto mt-28 max-w-[1320px] px-6">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-h3 font-bold tracking-[-0.015em] md:text-h2">
                The procedure is performed, not printed
              </h2>
              <p className="measure mt-5 text-body text-muted-foreground">
                Each session provisions a virtual workstation for every student. They open the same
                utilities they would meet in a physical laboratory, follow the instructor
                demonstration, and their actions are recorded as evidence of competence.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {simulators.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-[12px] border border-border bg-surface px-4 py-3"
                  >
                    <Icon className="size-4 shrink-0 text-primary" strokeWidth={1.8} />
                    <span className="text-[15px]">{label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <BtnLink to="/role" variant="dark">
                  Open a workstation <ArrowRight className="size-4" strokeWidth={2} />
                </BtnLink>
              </div>
            </div>
            <Panel className="overflow-hidden p-3">
              <div className="mb-3 flex items-center justify-between px-3 pt-2">
                <span className="flex items-center gap-2 text-caption text-muted-foreground">
                  <Dot /> Virtual workstation · live preview
                </span>
                <Tag tone="primary">Interactive preview</Tag>
              </div>
              <WinSim compact />
            </Panel>
          </div>
        </section>

        <section className="mx-auto mt-28 max-w-[1320px] px-6">
          <h2 className="max-w-[820px] text-h3 font-bold tracking-[-0.015em] md:text-h2">
            Communication, practice and assessment stop being separate systems
          </h2>
          <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, body }) => (
              <div key={title} className="border-t border-border pt-6">
                <Icon className="size-5 text-primary" strokeWidth={1.8} />
                <p className="mt-4 text-bodylg font-semibold tracking-[-0.01em]">{title}</p>
                <p className="mt-2 text-[17px] text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-28 max-w-[1320px] px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                role: "For students",
                text: "Join the studio, follow the demonstration, work through the procedure on your own workstation, raise your hand, join your breakout group and submit for assessment.",
                to: "/role",
                cta: "Enter the student studio",
              },
              {
                role: "For instructors",
                text: "Schedule practicals, publish manuals, watch every workstation, enter a student's environment, run breakout groups, broadcast announcements and grade performance live.",
                to: "/role",
                cta: "Open the instructor console",
              },
            ].map((c) => (
              <Panel key={c.role} className="lift flex flex-col justify-between p-8 md:p-10">
                <div>
                  <p className="text-h3 font-bold tracking-[-0.01em]">{c.role}</p>
                  <p className="measure mt-4 text-[17px] text-muted-foreground">{c.text}</p>
                </div>
                <div className="mt-8">
                  <Link
                    to={c.to}
                    className="inline-flex items-center gap-2 text-[16px] font-medium text-primary transition-transform duration-200 hover:translate-x-0.5"
                  >
                    {c.cta} <ArrowRight className="size-4" strokeWidth={2} />
                  </Link>
                </div>
              </Panel>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-28 max-w-[1320px] px-6 pb-24">
          <div className="rounded-[32px] bg-[#eceff3] px-8 py-16 text-center md:px-14 md:py-20">
            <h2 className="mx-auto max-w-[760px] text-h3 font-bold tracking-[-0.015em] md:text-h2">
              Laboratory access no longer ends at the campus gate
            </h2>
            <p className="mx-auto mt-5 max-w-[620px] text-bodylg text-muted-foreground">
              Create your profile in a minute, then schedule or join your first practical. The
              platform starts empty and fills with your own courses, sessions and results.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <StartCta />
            </div>

          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/** Resolves the next step of the journey from whatever state the visitor is in. */
function StartCta() {
  const navigate = useNavigate();
  const { profiles, role, practicals } = useCampus();
  const active = role && profiles[role] ? role : profiles.student ? "student" : profiles.instructor ? "instructor" : null;
  const live = practicals.find((p) => p.status === "live");

  if (!active) {
    return (
      <>
        <BtnLink to="/role" size="lg">
          Launch Lab <ArrowRight className="size-4" strokeWidth={2} />
        </BtnLink>
        <BtnLink to="/role" size="lg" variant="secondary">
          Enter as instructor
        </BtnLink>
      </>
    );
  }

  const profile = profiles[active]!;
  return (
    <>
      {live ? (
        <Btn
          size="lg"
          onClick={() => navigate({ to: "/session/$practicalId", params: { practicalId: live.id } })}
        >
          <Dot tone="error" /> Join the live studio <ArrowRight className="size-4" strokeWidth={2} />
        </Btn>
      ) : (
        <BtnLink to={active === "instructor" ? "/instructor" : "/student"} size="lg">
          Continue as {profile.name.split(" ")[0]}{" "}
          <ArrowRight className="size-4" strokeWidth={2} />
        </BtnLink>
      )}
      <BtnLink to="/role" size="lg" variant="secondary">
        Switch profile
      </BtnLink>
    </>
  );
}
