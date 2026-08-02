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
import { Empty, ProfileGate, WorkspaceHeader } from "@/components/workspace-chrome";
import { Btn, Dot, Meter, Panel, Tag } from "@/components/kit";
import { performanceSeries, useCampus } from "@/lib/campus";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Workspace — CampusLab Virtual Laboratory" },
      {
        name: "description",
        content:
          "Register for laboratory practicals, open published manuals, join live sessions and watch your practical competence build up session after session.",
      },
      { property: "og:title", content: "Student Workspace — CampusLab" },
      {
        property: "og:description",
        content:
          "Your practicals, your manuals, your live studio access and your competency record — all in one workspace that starts empty and grows with you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ProfileGate role="student">
      <StudentDashboard />
    </ProfileGate>
  ),
});

function StudentDashboard() {
  const { practicals, register, announcements, profiles } = useCampus();
  const navigate = useNavigate();
  const me = profiles.student!;
  const teacher = profiles.instructor;

  const live = practicals.find((p) => p.status === "live");
  const upcoming = practicals.filter((p) => p.status === "scheduled");
  const completed = practicals.filter((p) => p.status === "completed");
  const registered = practicals.filter((p) => p.registered);
  const graded = completed.filter((p) => p.score !== null);
  const average = graded.length
    ? Math.round(graded.reduce((s, p) => s + (p.score ?? 0), 0) / graded.length)
    : 0;
  const series = performanceSeries(practicals);
  const resourceFeed = registered.flatMap((p) =>
    p.resources.map((r) => ({ ...r, practical: p.title })),
  );
  const totalTasks = registered.reduce((n, p) => n + p.tasks.length, 0);

  return (
    <div className="min-h-screen">
      <WorkspaceHeader />

      <main className="mx-auto max-w-[1320px] px-6 pb-24">
        <section className="pt-12">
          <h1 className="text-h3 font-bold tracking-[-0.015em] md:text-h2">
            Welcome in, {me.name.split(" ")[0]}
          </h1>
          <p className="measure mt-3 text-bodylg text-muted-foreground">
            {practicals.length === 0
              ? "Nothing is scheduled yet. The moment your instructor publishes a practical, it appears here with its manual and a workstation reserved for you."
              : `${registered.length} of ${practicals.length} published practicals registered. Your workstation is provisioned the moment a session opens.`}
          </p>
        </section>

        {live && (
          <section className="mt-10">
            <Panel className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="flex items-center gap-2 text-caption font-medium text-destructive">
                  <Dot tone="error" /> Session in progress
                </span>
                <p className="mt-3 text-h3 font-bold tracking-[-0.01em]">{live.title}</p>
                <p className="mt-2 text-[17px] text-muted-foreground">
                  {live.focus} · {live.venue}
                  {teacher ? ` · ${teacher.name}` : ""}
                </p>
              </div>
              <Btn
                size="lg"
                onClick={() =>
                  navigate({ to: "/session/$practicalId", params: { practicalId: live.id } })
                }
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
                  Performance over time
                </p>
                <p className="mt-1 text-caption text-muted-foreground">
                  Every point is a practical your instructor supervised and graded
                </p>
              </div>
              <div className="text-right">
                <p className="text-h3 font-bold">{average}%</p>
                <p className="text-caption text-muted-foreground">
                  {graded.length} of {practicals.length} practicals assessed
                </p>
              </div>
            </div>
            {series.length === 0 ? (
              <div className="mt-8">
                <Empty
                  title="No results to plot yet"
                  body="Your performance line is drawn from graded practicals. Complete a supervised session and the first point appears here."
                />
              </div>
            ) : (
              <div className="mt-8 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series} margin={{ left: -20, right: 8, top: 8 }}>
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
            )}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Sessions attended", value: `${completed.length}` },
                { label: "Tasks in your plan", value: `${totalTasks}` },
                {
                  label: "Assessment weight earned",
                  value: `${graded.reduce((n, p) => n + p.weight, 0)} marks`,
                },
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
                ["Name", me.name],
                ["Matriculation number", me.identifier],
                ["Level", me.standing],
                ["Department", me.unit],
                ["Course", me.course],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-border pt-3">
                  <dt className="text-caption text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5">{v || "—"}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 rounded-[12px] bg-muted p-4">
              <p className="text-caption text-muted-foreground">Competency portfolio</p>
              <Meter value={average} className="mt-3" />
              <p className="mt-2 text-caption">{average}% demonstrated competence to date</p>
            </div>
          </Panel>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
          <div className="space-y-6">
            <Panel className="p-8">
              <div className="flex items-center justify-between">
                <p className="text-bodylg font-semibold tracking-[-0.01em]">Open for registration</p>
                <Tag tone="primary">
                  <CalendarClock className="size-3.5" strokeWidth={2} /> {upcoming.length} scheduled
                </Tag>
              </div>
              <div className="mt-6 space-y-3">
                {upcoming.length === 0 && (
                  <Empty
                    title="No practicals published yet"
                    body="Scheduled sessions land here automatically, with the date, duration and marks attached."
                  />
                )}
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
              <div className="mt-6 space-y-3">
                {completed.length === 0 ? (
                  <Empty
                    title="Nothing assessed so far"
                    body="Once a supervised session is graded, the result and the instructor's observation appear here."
                  />
                ) : (
                  <div className="overflow-hidden rounded-[12px] border border-border">
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
                          <span className="w-10 text-right text-[15px] font-semibold">
                            {p.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel className="p-8">
              <p className="text-bodylg font-semibold tracking-[-0.01em]">Instructor</p>
              {teacher ? (
                <div className="mt-5 border-t border-border pt-4 text-[15px]">
                  <p className="font-medium">{teacher.name}</p>
                  <p className="mt-1 text-caption text-muted-foreground">{teacher.standing}</p>
                  <p className="mt-3 text-caption text-muted-foreground">{teacher.unit}</p>
                  <p className="text-caption text-muted-foreground">{teacher.identifier}</p>
                </div>
              ) : (
                <div className="mt-5">
                  <Empty
                    title="No instructor has claimed this laboratory"
                    body="When an instructor profile is created, their details and announcements appear here."
                  />
                </div>
              )}
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
                    <Download
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      strokeWidth={1.8}
                    />
                  </button>
                ))}
                {resourceFeed.length === 0 && (
                  <Empty
                    title="No manuals yet"
                    body="Register for a practical and its manuals, slides and checklists collect here."
                  />
                )}
              </div>
            </Panel>

            <Panel className="p-8">
              <p className="text-bodylg font-semibold tracking-[-0.01em]">My sessions</p>
              <div className="mt-5 space-y-3">
                {registered.length === 0 && (
                  <Empty
                    title="You have not registered yet"
                    body="Registered practicals become one-tap entry points into the studio."
                  />
                )}
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
