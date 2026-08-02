import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  CalendarPlus,
  FileText,
  Hand,
  Radio,
  Upload,
  Users,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Empty, ProfileGate, WorkspaceHeader } from "@/components/workspace-chrome";
import { Avatar, Btn, Dot, Meter, Panel, Tag } from "@/components/kit";
import { useCampus, type Resource } from "@/lib/campus";


export const Route = createFileRoute("/instructor")({
  head: () => ({
    meta: [
      { title: "Instructor Console — CampusLab Virtual Laboratory" },
      {
        name: "description",
        content:
          "Schedule laboratory practicals, publish manuals, review the registered roster and supervise live student workstations from the CampusLab instructor console.",
      },
      { property: "og:title", content: "Instructor Console — CampusLab" },
      {
        property: "og:description",
        content:
          "Schedule practicals, publish resources, monitor workstations and assess practical competence in real time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ProfileGate role="instructor">
      <InstructorDashboard />
    </ProfileGate>
  ),
});

const kinds: Resource["kind"][] = ["Manual", "Slides", "Dataset", "Checklist"];

function InstructorDashboard() {
  const { practicals, students, schedulePractical, addResource, setStatus, gradeStudent, profiles } =
    useCampus();
  const navigate = useNavigate();
  const me = profiles.instructor!;

  const [form, setForm] = useState({
    title: "",
    focus: "Task Manager, Disk Cleanup",
    date: "",
    time: "10:00",
    duration: "90 min",
    venue: "Virtual Lab Studio A",
    weight: 15,
  });

  const [upload, setUpload] = useState({
    practicalId: practicals[0]?.id ?? "",
    title: "",
    kind: "Manual" as Resource["kind"],
  });

  const live = practicals.find((p) => p.status === "live");
  const roster = students.filter((s) => s.registered);
  const hands = students.filter((s) => s.handRaised && s.present);
  const distribution = [
    { band: "0-39", count: roster.filter((s) => s.progress < 40).length },
    { band: "40-59", count: roster.filter((s) => s.progress >= 40 && s.progress < 60).length },
    { band: "60-79", count: roster.filter((s) => s.progress >= 60 && s.progress < 80).length },
    { band: "80-100", count: roster.filter((s) => s.progress >= 80).length },
  ];

  return (
    <div className="min-h-screen">
      <WorkspaceHeader />

      <main className="mx-auto max-w-[1320px] px-6 pb-24">
        <section className="pt-12">
          <h1 className="text-h3 font-bold tracking-[-0.015em] md:text-h2">
            {me.name.split(" ").slice(-1)[0]}, your laboratory is ready
          </h1>
          <p className="measure mt-3 text-bodylg text-muted-foreground">
            {practicals.length === 0
              ? "Schedule your first practical below. Students see it instantly, register themselves, and a supervised workstation is provisioned for each of them."
              : `${roster.length} students registered · ${practicals.length} practicals in your plan.`}
          </p>

        </section>

        {live && (
          <section className="mt-10">
            <Panel className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="flex items-center gap-2 text-caption font-medium text-destructive">
                  <Dot tone="error" /> Live now · {students.filter((s) => s.present).length} students
                  present
                  {hands.length > 0 && ` · ${hands.length} raised hands`}
                </span>
                <p className="mt-3 text-h3 font-bold tracking-[-0.01em]">{live.title}</p>
                <p className="mt-2 text-[17px] text-muted-foreground">
                  {live.focus} · {live.venue}
                </p>
              </div>
              <Btn
                size="lg"
                onClick={() =>
                  navigate({ to: "/session/$practicalId", params: { practicalId: live.id } })
                }
              >
                Open session console <ArrowRight className="size-4" strokeWidth={2} />
              </Btn>
            </Panel>
          </section>
        )}

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)]">
          <Panel className="p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-bodylg font-semibold tracking-[-0.01em]">Registered students</p>
                <p className="mt-1 text-caption text-muted-foreground">
                  Progress reflects completed practical tasks across the semester
                </p>
              </div>
              <Tag tone="primary">
                <Users className="size-3.5" strokeWidth={2} /> {roster.length} enrolled
              </Tag>
            </div>
            <div className="mt-6 overflow-hidden rounded-[12px] border border-border">
              <div className="grid grid-cols-[minmax(0,1.6fr)_120px_minmax(0,1fr)_92px] gap-3 border-b border-border bg-muted px-5 py-3 text-caption font-semibold text-muted-foreground">
                <span>Student</span>
                <span>Matric</span>
                <span>Progress</span>
                <span className="text-right">Score</span>
              </div>
              {roster.length === 0 && (
                <div className="p-5">
                  <Empty
                    title="No students registered yet"
                    body="Publish a practical and every student who registers appears here with live progress and a grading control."
                  />
                </div>
              )}
              {roster.map((s) => (

                <div
                  key={s.id}
                  className="grid grid-cols-[minmax(0,1.6fr)_120px_minmax(0,1fr)_92px] items-center gap-3 border-b border-border px-5 py-3.5 last:border-0"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar name={s.name} />
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-medium">{s.name}</span>
                      <span className="block truncate text-caption text-muted-foreground">
                        {s.present ? s.activity : "Not in session"}
                      </span>
                    </span>
                  </span>
                  <span className="text-caption text-muted-foreground">{s.matric}</span>
                  <span className="flex items-center gap-3">
                    <Meter value={s.progress} />
                    <span className="w-9 text-caption text-muted-foreground">{s.progress}%</span>
                  </span>
                  <span className="flex items-center justify-end gap-2">
                    {s.score !== null ? (
                      <Tag tone="success">{s.score}</Tag>
                    ) : (
                      <button
                        onClick={() => {
                          gradeStudent(s.id, Math.max(50, Math.min(100, s.progress + 6)));
                          toast.success(`Recorded observation for ${s.name}`);
                        }}
                        className="rounded-full border border-border px-3 py-1 text-[13px] font-medium transition-colors hover:bg-muted"
                      >
                        Grade
                      </button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <div className="space-y-6">
            <Panel className="p-8">
              <p className="text-bodylg font-semibold tracking-[-0.01em]">Instructor profile</p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <Avatar name={me.name} className="size-12 text-[16px]" />
                <span>
                  <span className="block text-[16px] font-medium">{me.name}</span>
                  <span className="block text-caption text-muted-foreground">{me.standing}</span>
                </span>
              </div>
              <dl className="mt-5 space-y-3 text-[15px]">
                {[
                  ["Staff ID", me.identifier],
                  ["Department", me.unit],
                  ["Course", me.course],

                ].map(([k, v]) => (
                  <div key={k} className="border-t border-border pt-3">
                    <dt className="text-caption text-muted-foreground">{k}</dt>
                    <dd className="mt-0.5">{v}</dd>
                  </div>
                ))}
              </dl>
            </Panel>

            <Panel className="p-8">
              <p className="text-bodylg font-semibold tracking-[-0.01em]">Cohort progress</p>
              <div className="mt-6 h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribution} margin={{ left: -24, right: 8, top: 8 }}>
                    <CartesianGrid stroke="var(--border)" vertical={false} />
                    <XAxis
                      dataKey="band"
                      stroke="var(--muted)"
                      tickLine={false}
                      axisLine={false}
                      fontSize={13}
                    />
                    <YAxis
                      allowDecimals={false}
                      stroke="var(--muted)"
                      tickLine={false}
                      axisLine={false}
                      fontSize={13}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        fontSize: 14,
                      }}
                    />
                    <Bar dataKey="count" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {hands.length > 0 && (
                <div className="mt-4 space-y-2">
                  {hands.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-2 rounded-[12px] bg-warning/12 px-4 py-2.5 text-[14px]"
                    >
                      <Hand className="size-4 text-[color:var(--warning)]" strokeWidth={1.8} />
                      {s.name} is waiting for assistance
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel className="p-8">
            <p className="text-bodylg font-semibold tracking-[-0.01em]">Schedule a practical</p>
            <p className="mt-1 text-caption text-muted-foreground">
              Published immediately to the student dashboard for registration
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!form.title.trim()) return;
                schedulePractical(form);
                toast.success("Practical scheduled", { description: form.title });
                setForm({ ...form, title: "" });
              }}
            >
              <Field label="Title">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Practical 7 — Registers and Addressing Modes"
                  className={inputClass}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Simulation focus">
                  <select
                    value={form.focus}
                    onChange={(e) => setForm({ ...form, focus: e.target.value })}
                    className={inputClass}
                  >
                    {[
                      "Task Manager, Disk Cleanup",
                      "File Explorer, Command Prompt",
                      "Antivirus, Safe Mode, System Restore",
                      "Operating system maintenance",
                    ].map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Venue">
                  <select
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className={inputClass}
                  >
                    {["Virtual Lab Studio A", "Virtual Lab Studio B", "Virtual Lab Studio C"].map(
                      (v) => (
                        <option key={v}>{v}</option>
                      ),
                    )}
                  </select>
                </Field>
                <Field label="Date">
                  <input
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Start time">
                  <input
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Duration">
                  <select
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className={inputClass}
                  >
                    {["60 min", "90 min", "120 min"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Assessment weight">
                  <input
                    type="number"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                    className={inputClass}
                  />
                </Field>
              </div>
              <Btn type="submit">
                <CalendarPlus className="size-4" strokeWidth={2} /> Schedule practical
              </Btn>
            </form>
          </Panel>

          <div className="space-y-6">
            <Panel className="p-8">
              <p className="text-bodylg font-semibold tracking-[-0.01em]">Publish a resource</p>
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!upload.title.trim() || !upload.practicalId) return;
                  addResource(upload.practicalId, {
                    title: upload.title,
                    kind: upload.kind,
                    size: "2.1 MB",
                  });
                  toast.success("Resource published to registered students");
                  setUpload({ ...upload, title: "" });
                }}
              >
                <Field label="Practical">
                  <select
                    value={upload.practicalId}
                    onChange={(e) => setUpload({ ...upload, practicalId: e.target.value })}
                    className={inputClass}
                  >
                    {practicals.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
                  <Field label="Document title">
                    <input
                      value={upload.title}
                      onChange={(e) => setUpload({ ...upload, title: e.target.value })}
                      placeholder="IFT 212 Lab Manual — Practical 7"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Type">
                    <select
                      value={upload.kind}
                      onChange={(e) =>
                        setUpload({ ...upload, kind: e.target.value as Resource["kind"] })
                      }
                      className={inputClass}
                    >
                      {kinds.map((k) => (
                        <option key={k}>{k}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Btn type="submit" variant="dark">
                  <Upload className="size-4" strokeWidth={2} /> Upload and publish
                </Btn>
              </form>
            </Panel>

            <Panel className="p-8">
              <p className="text-bodylg font-semibold tracking-[-0.01em]">Semester plan</p>
              <div className="mt-6 space-y-3">
                {practicals.map((p) => (
                  <div key={p.id} className="rounded-[12px] border border-border p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[16px] font-medium">{p.title}</p>
                        <p className="mt-1 text-caption text-muted-foreground">
                          {p.date} · {p.time} · {p.duration} · {p.resources.length} resources
                        </p>
                      </div>
                      {p.status === "live" ? (
                        <Tag tone="error">
                          <Radio className="size-3.5" strokeWidth={2} /> Live
                        </Tag>
                      ) : p.status === "completed" ? (
                        <Tag tone="success">Assessed</Tag>
                      ) : (
                        <Tag tone="neutral">Scheduled</Tag>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {p.status === "scheduled" && (
                        <Btn
                          size="sm"
                          onClick={() => {
                            setStatus(p.id, "live");
                            navigate({
                              to: "/session/$practicalId",
                              params: { practicalId: p.id },
                            });
                          }}
                        >
                          Start session
                        </Btn>
                      )}
                      {p.status === "live" && (
                        <Btn
                          size="sm"
                          onClick={() =>
                            navigate({ to: "/session/$practicalId", params: { practicalId: p.id } })
                          }
                        >
                          Enter console
                        </Btn>
                      )}
                      <Btn
                        size="sm"
                        variant="secondary"
                        onClick={() => toast.success(`${p.resources.length} resources reviewed`)}
                      >
                        <FileText className="size-4" strokeWidth={1.8} /> Resources
                      </Btn>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </section>
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
