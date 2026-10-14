import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, GraduationCap, Presentation, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/site-chrome";
import { Avatar, Btn, Panel, Tag } from "@/components/kit";
import { cn } from "@/lib/utils";
import { useCampus, type Profile, type Role } from "@/lib/campus";

export const Route = createFileRoute("/role")({
  head: () => ({
    meta: [
      { title: "Create your profile — CampusLab Virtual Laboratory" },
      {
        name: "description",
        content:
          "Create a student profile to join live laboratory sessions, or an instructor profile to schedule, supervise and assess practicals in CampusLab.",
      },
      { property: "og:title", content: "Create your profile — CampusLab" },
      {
        property: "og:description",
        content:
          "Start with an empty laboratory. Create a student or instructor profile and the workspace builds itself around your own data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoleSelect,
});

const copy: Record<
  Role,
  {
    icon: typeof GraduationCap;
    title: string;
    tagline: string;
    detail: string;
    bullets: string[];
    idLabel: string;
    idHint: string;
    standingLabel: string;
    standingHint: string;
    unitLabel: string;
    unitHint: string;
    to: "/student" | "/instructor";
  }
> = {
  student: {
    icon: GraduationCap,
    title: "Student",
    tagline: "Practise the procedure, not the page",
    detail:
      "Register for practicals as they are published, open the manuals, join the live studio and work through every step on your own virtual workstation.",
    bullets: [
      "Register for published practicals",
      "Read manuals and demonstration material",
      "Build a record of demonstrated competence",
    ],
    idLabel: "Matriculation number",
    idHint: "e.g. CSC/23/0148",
    standingLabel: "Level",
    standingHint: "e.g. 300 Level",
    unitLabel: "Department",
    unitHint: "e.g. Department of Computer Science",
    to: "/student",
  },
  instructor: {
    icon: Presentation,
    title: "Instructor",
    tagline: "Run the laboratory from one console",
    detail:
      "Schedule laboratory sessions, publish manuals, watch every workstation in real time, step into a student's environment and assess performance as it happens.",
    bullets: [
      "Schedule practicals and publish resources",
      "Supervise workstations live",
      "Grade competence during the session",
    ],
    idLabel: "Staff ID",
    idHint: "e.g. STF/CS/0455",
    standingLabel: "Academic title",
    standingHint: "e.g. Senior Lecturer",
    unitLabel: "Department",
    unitHint: "e.g. Department of Computer Science",
    to: "/instructor",
  },
};

function RoleSelect() {
  const { setRole, profiles, createProfile, deleteProfile } = useCampus();
  const navigate = useNavigate();
  const [active, setActive] = useState<Role>("student");
  const c = copy[active];
  const existing = profiles[active];

  const [form, setForm] = useState({ name: "", identifier: "", standing: "", unit: "", course: "" });

  const enter = (r: Role) => {
    setRole(r);
    navigate({ to: copy[r].to });
  };

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-6">
        <Logo />
        <Tag tone="primary">No account needed — profiles live on this device</Tag>
      </header>

      <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-24">
        <h1 className="text-h3 font-bold tracking-[-0.015em] md:text-h2">
          Who is walking into the laboratory?
        </h1>
        <p className="measure mt-4 text-bodylg text-muted-foreground">
          CampusLab starts completely empty. Create a profile and the workspace assembles around it —
          nothing is pre-filled, everything you see later is something you or your instructor made.
        </p>

        <div className="mt-10 flex w-fit items-center gap-1 rounded-full border border-border bg-muted p-1">
          {(["student", "instructor"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setActive(r)}
              className={cn(
                "h-10 rounded-full px-6 text-[15px] font-medium transition-all duration-200",
                active === r
                  ? "bg-surface text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {copy[r].title}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Panel className="flex flex-col p-8">
            <span className="grid size-12 place-items-center rounded-[16px] bg-primary/10">
              <c.icon className="size-5 text-primary" strokeWidth={1.8} />
            </span>
            <p className="mt-6 text-h3 font-bold tracking-[-0.01em]">{c.title}</p>
            <p className="mt-1 text-caption text-muted-foreground">{c.tagline}</p>
            <p className="mt-5 text-[17px] text-muted-foreground">{c.detail}</p>
            <ul className="mt-6 space-y-2 text-[15px]">
              {c.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 border-t border-border pt-2.5">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {b}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="p-8">
            {existing ? (
              <div>
                <p className="text-bodylg font-semibold tracking-[-0.01em]">Profile ready</p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <Avatar name={existing.name} className="size-12 text-[16px]" />
                  <span>
                    <span className="block text-[16px] font-medium">{existing.name}</span>
                    <span className="block text-caption text-muted-foreground">
                      {existing.identifier} · {existing.standing}
                    </span>
                  </span>
                </div>
                <dl className="mt-5 space-y-3 text-[15px]">
                  {[
                    [c.unitLabel, existing.unit],
                    ["Course", existing.course],
                  ].map(([k, v]) => (
                    <div key={k} className="border-t border-border pt-3">
                      <dt className="text-caption text-muted-foreground">{k}</dt>
                      <dd className="mt-0.5">{v || "—"}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Btn size="lg" onClick={() => enter(active)}>
                    Enter workspace <ArrowRight className="size-4" strokeWidth={2} />
                  </Btn>
                  <Btn
                    size="lg"
                    variant="secondary"
                    onClick={() => {
                      deleteProfile(active);
                      toast.success(`${c.title} profile removed`);
                    }}
                  >
                    <Trash2 className="size-4" strokeWidth={1.8} /> Remove profile
                  </Btn>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.name.trim() || !form.identifier.trim()) return;
                  const profile: Profile = {
                    role: active,
                    name: form.name.trim(),
                    identifier: form.identifier.trim(),
                    standing: form.standing.trim(),
                    unit: form.unit.trim(),
                    course: form.course.trim(),
                  };
                  createProfile(profile);
                  toast.success(`${c.title} profile created`, { description: profile.name });
                  setForm({ name: "", identifier: "", standing: "", unit: "", course: "" });
                  enter(active);
                }}
              >
                <p className="text-bodylg font-semibold tracking-[-0.01em]">
                  Create your {c.title.toLowerCase()} profile
                </p>
                <p className="mt-1 text-caption text-muted-foreground">
                  Only a name and an identifier are required — the rest sharpens your workspace.
                </p>
                <div className="mt-6 space-y-4">
                  <Field label="Full name">
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label={c.idLabel}>
                      <input
                        required
                        value={form.identifier}
                        onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                        placeholder={c.idHint}
                        className={inputClass}
                      />
                    </Field>
                    <Field label={c.standingLabel}>
                      <input
                        value={form.standing}
                        onChange={(e) => setForm({ ...form, standing: e.target.value })}
                        placeholder={c.standingHint}
                        className={inputClass}
                      />
                    </Field>
                    <Field label={c.unitLabel}>
                      <input
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                        placeholder={c.unitHint}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Course">
                      <input
                        value={form.course}
                        onChange={(e) => setForm({ ...form, course: e.target.value })}
                        placeholder="e.g. Operating Systems"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>
                <Btn type="submit" size="lg" className="mt-8">
                  Create profile and continue <ArrowRight className="size-4" strokeWidth={2} />
                </Btn>
              </form>
            )}
          </Panel>
        </div>
      </main>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-[12px] border border-border bg-surface px-4 text-[15px] outline-none transition-colors focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-caption text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
