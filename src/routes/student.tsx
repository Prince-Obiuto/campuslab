import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Download,
  FileText,
  Megaphone,
  Radio,
  ClipboardList,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";
import { WorkspaceHeader } from "@/components/workspace-chrome";
import { Btn, Dot, Meter, Panel, Tag } from "@/components/kit";
import { course, instructor, performanceSeries, student, useCampus } from "@/lib/campus";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — CampusLab Virtual Laboratory" },
      {
        name: "description",
        content:
          "Register for laboratory practicals, review instructor manuals, join live sessions and track your practical performance across the semester.",
      },
      { property: "og:title", content: "Student Dashboard — CampusLab" },
      {
        property: "og:description",
        content:
          "Upcoming practicals, published manuals, live studio access and continuous practical performance in one workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const { practicals, register, announcements } = useCampus();
  const navigate = useNavigate();

  const live = practicals.find((p) => p.status === "live");
  const upcoming = practicals.filter((p) => p.status === "scheduled");
  const completed = practicals.filter((p) => p.status === "completed");
  const registered = practicals.filter((p) => p.registered);
  const graded = completed.filter((p) => p.score !== null);
  const average = graded.length
    ? Math.round(graded.reduce((s, p) => s + (p.score ?? 0), 0) / graded.length)
    : 0;
  const resourceFeed = registered.flatMap((p) =>
    p.resources.map((r) => ({ ...r, practical: p.title })),
  );

  return (
    <div className="min-h-screen">
      <WorkspaceHeader />

      <main className="mx-auto max-w-[1320px] px-6 pb-24">
        <section className="pt-12">
          <h1 className="text-h3 font-bold tracking-[-0.015em] md:text-h2">
            Good morning, {student.name.split(" ")[0]}
          </h1>
          <p className="measure mt-3 text-bodylg text-muted-foreground">
            {registered.length} registered practicals in {course.code}. Your workstation is
            provisioned and ready for the next session.
          </p>
        </section>

        {live && (
          <section className="mt-10">
            <Panel className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="flex items-center gap-2 text-caption font-medium text-destructive">
                  <Dot tone="error" /> Session in progress · started 10:00
                </span>
                <p className="mt-3 text-h3 font-bold tracking-[-0.01em]">{live.title}</p>
                <p className="mt-2 text-[17px] text-muted-foreground">
                  {live.focus} · {live.venue} · {instructor.name}
                </p>
              </div>
              <Btn
                size="lg"
                onClick={() => navigate({ to: "/session/$practicalId", params: { practicalId: live.id } })}
              >
                Join the studio <ArrowRight className="size-4" strokeWidth={2} />
              </Btn>
            </Panel>
          </section>
        )}

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
          <Panel className="p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-bodylg font-semibold tracking-[-0.01em]">
                  Course performance over time
                </p>
                <p className="mt-1 text-caption text-muted-foreground">
                  Adjusts as the instructor grades each supervised practical
                </p>
              </div>
              <div className="text-right">
                <p className="text-h3 font-bold">{average}%</p>
                <p className="text-caption text-muted-foreground">
                  {graded.length} of {practicals.length} practicals assessed
                </p>
              </div>
            </div>
            <div className="mt-8 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceSeries} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="var(--muted)"
                    tickLine={false}
                    axisLine={false}
                    fontSize={13}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="var(--muted)"
                    tickLine={false}
                    axisLine={false}
                    fontSize={13}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                      fontSize: 14,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "var(--primary)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Attendance", value: "12 of 12 sessions" },
                { label: "Tasks completed", value: "38 of 44" },
                { label: "Practical weight earned", value: `${average ? 31 : 0} of 80 marks` },
              ].map((s) => (
                <div key={s.label} className="border-t border-border pt-3">
                  <p className="text-caption text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-[16px] font-medium">{s.value}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-8">
            <p className="text-bodylg font-semibold tracking-[-0.01em]">Profile</p>
            <dl className="mt-6 space-y-3 text-[15px]">
              {[
                ["Name", student.name],
                ["Matriculation number", student.matric],
                ["Level", student.level],
                ["Programme", student.programme],
                ["Department", student.department],
                ["Faculty", student.faculty],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-border pt-3">
                  <dt className="text-caption text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 rounded-[12px] bg-muted p-4">
              <p className="text-caption text-muted-foreground">Practical competency portfolio</p>
              <Meter value={average} className="mt-3" />
              <p className="mt-2 text-caption">{average}% demonstrated competence to date</p>
            </div>
          </Panel>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
          <div className="space-y-6">
            <Panel className="p-8">
              <div className="flex items-center justify-between">
                <p className="text-bodylg font-semibold tracking-[-0.01em]">Upcoming practicals</p>
                <Tag tone="primary">
                  <CalendarClock className="size-3.5" strokeWidth={2} /> {upcoming.length} scheduled
                </Tag>
              </div>
              <div className="mt-6 space-y-3">
                {upcoming.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col gap-4 rounded-[12px] border border-border p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-[17px] font-semibold tracking-[-0.01em]">{p.title}</p>
                      <p className="mt-1 text-caption text-muted-foreground">
                        {p.date} · {p.time} · {p.duration} · {p.venue} · {p.weight} marks
                      </p>
                      <p className="mt-2 text-[15px] text-muted-foreground">{p.focus}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {p.registered ? (
                        <Tag tone="success">
                          <CheckCircle2 className="size-3.5" strokeWidth={2} /> Registered
                        </Tag>
                      ) : (
                        <Btn
                          size="sm"
                          onClick={() => {
                            register(p.id);
                            toast.success("Registered for this practical", {
                              description: "A workstation will be provisioned for you.",
                            });
                          }}
                        >
                          Register as member
                        </Btn>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="p-8">
              <p className="text-bodylg font-semibold tracking-[-0.01em]">Assessed practicals</p>
              <div className="mt-6 overflow-hidden rounded-[12px] border border-border">
                {completed.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[16px] font-medium">{p.title}</p>
                      <p className="text-caption text-muted-foreground">
                        {p.date} · instructor observation recorded
                      </p>
                    </div>
                    <div className="flex w-[180px] shrink-0 items-center gap-3">
                      <Meter value={p.score ?? 0} />
                      <span className="w-10 text-right text-[15px] font-semibold">{p.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel className="p-8">
              <p className="text-bodylg font-semibold tracking-[-0.01em]">Instructor</p>
              <div className="mt-5 border-t border-border pt-4 text-[15px]">
                <p className="font-medium">{instructor.name}</p>
                <p className="mt-1 text-caption text-muted-foreground">{instructor.title}</p>
                <p className="mt-3 text-caption text-muted-foreground">{instructor.department}</p>
                <p className="text-caption text-muted-foreground">Office: {instructor.office}</p>
              </div>
              <div className="mt-6 space-y-3">
                {announcements.map((a) => (
                  <div key={a.id} className="rounded-[12px] bg-muted p-4">
                    <span className="flex items-center gap-2 text-caption text-muted-foreground">
                      <Megaphone className="size-3.5" strokeWidth={1.8} /> {a.at}
                    </span>
                    <p className="mt-1.5 text-[15px]">{a.body}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="p-8">
              <div className="flex items-center justify-between">
                <p className="text-bodylg font-semibold tracking-[-0.01em]">Published resources</p>
                <Tag tone="neutral">
                  <ClipboardList className="size-3.5" strokeWidth={2} /> {resourceFeed.length}
                </Tag>
              </div>
              <div className="mt-5 space-y-2">
                {resourceFeed.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => toast.success(`Opening ${r.title}`)}
                    className="flex w-full items-start gap-3 rounded-[12px] border border-border p-4 text-left transition-colors hover:bg-muted"
                  >
                    <FileText className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.8} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium">{r.title}</span>
                      <span className="block truncate text-caption text-muted-foreground">
                        {r.kind} · {r.size} · {r.uploadedAt}
                      </span>
                    </span>
                    <Download className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.8} />
                  </button>
                ))}
                {resourceFeed.length === 0 && (
                  <p className="text-[15px] text-muted-foreground">
                    Register for a practical to receive its manuals.
                  </p>
                )}
              </div>
            </Panel>

            <Panel className="p-8">
              <p className="text-bodylg font-semibold tracking-[-0.01em]">My sessions</p>
              <div className="mt-5 space-y-3">
                {registered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() =>
                      navigate({ to: "/session/$practicalId", params: { practicalId: p.id } })
                    }
                    className="flex w-full items-center justify-between rounded-[12px] border border-border px-4 py-3 text-left transition-colors hover:bg-muted"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-medium">{p.title}</span>
                      <span className="text-caption text-muted-foreground">
                        {p.date} · {p.time}
                      </span>
                    </span>
                    {p.status === "live" ? (
                      <Tag tone="error">
                        <Radio className="size-3.5" strokeWidth={2} /> Live
                      </Tag>
                    ) : (
                      <ArrowRight className="size-4 text-muted-foreground" strokeWidth={1.8} />
                    )}
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        </section>
      </main>
    </div>
  );
}
