import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Circle,
  FileText,
  Hand,
  LogOut,
  Megaphone,
  Mic,
  MicOff,
  MonitorUp,
  Pause,
  Play,
  Radio,
  Send,
  ShieldCheck,
  UserMinus,
  Users,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Layers,
  PanelsTopLeft,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar, Btn, Dot, Meter, Tag } from "@/components/kit";
import { WinSim } from "@/components/lab/win-sim";
import { RoleToggle } from "@/components/workspace-chrome";
import { useCampus, type Practical } from "@/lib/campus";

export const Route = createFileRoute("/session/$practicalId")({
  head: () => ({
    meta: [
      { title: "Live Laboratory Studio — CampusLab" },
      {
        name: "description",
        content:
          "The CampusLab virtual laboratory studio: live instruction, an interactive Windows workstation simulation, collaboration panels and in-session practical assessment.",
      },
      { property: "og:title", content: "Live Laboratory Studio — CampusLab" },
      {
        property: "og:description",
        content:
          "Run or join a live instructor-led laboratory session with interactive simulations, breakout groups and continuous assessment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SessionRoute,
});

function useTimer() {
  const [s, setS] = useState(1462);
  useEffect(() => {
    const t = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function SessionRoute() {
  const { practicalId } = Route.useParams();
  const { practicals, role } = useCampus();
  const practical = practicals.find((p) => p.id === practicalId) ?? practicals[0];
  if (!practical) return null;
  return role === "instructor" ? (
    <InstructorConsole practical={practical} />
  ) : (
    <StudentStudio practical={practical} />
  );
}

function SessionShell({
  practical,
  children,
  controls,
}: {
  practical: Practical;
  children: React.ReactNode;
  controls: React.ReactNode;
}) {
  const navigate = useNavigate();
  const timer = useTimer();
  const { students } = useCampus();
  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between gap-6 border-b border-border bg-surface px-6">
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground">
            <Circle className="size-3.5 text-primary-foreground" strokeWidth={3} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold tracking-[-0.01em]">
              {practical.title}
            </p>
            <p className="truncate text-[13px] text-muted-foreground">
              {[practical.code, practical.venue, practical.focus].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Tag tone="error">
            <Dot tone="error" /> {timer}
          </Tag>
          <Tag tone="neutral" className="hidden sm:inline-flex">
            <Users className="size-3.5" strokeWidth={2} /> {students.filter((s) => s.present).length}
          </Tag>
          <span className="hidden lg:block">
            <RoleToggle />
          </span>
          <Btn
            size="sm"
            variant="danger"
            onClick={() => navigate({ to: "/" })}
            title="Leave session"
          >
            <LogOut className="size-4" strokeWidth={2} /> Leave
          </Btn>
        </div>
      </header>

      <div className="min-h-0 flex-1">{children}</div>

      <footer className="flex h-[76px] shrink-0 items-center justify-center gap-2 border-t border-border bg-surface px-6">
        {controls}
      </footer>
    </div>
  );
}

function CtrlBtn({
  icon: Icon,
  label,
  active,
  tone = "neutral",
  onClick,
}: {
  icon: typeof Mic;
  label: string;
  active?: boolean;
  tone?: "neutral" | "danger" | "primary";
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[14px] font-medium transition-all duration-200 hover:-translate-y-0.5",
        active && tone === "danger" && "border-transparent bg-destructive text-primary-foreground",
        active && tone === "primary" && "border-transparent bg-primary text-primary-foreground",
        active && tone === "neutral" && "border-transparent bg-foreground text-primary-foreground",
        !active && "border-border bg-surface text-ink-soft hover:bg-muted",
      )}
    >
      <Icon className="size-4" strokeWidth={1.8} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string; icon: typeof Users }[];
  active: string;
  onChange: (k: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 border-b border-border px-3 py-2">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-[14px] font-medium transition-colors",
            active === t.key
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <t.icon className="size-4" strokeWidth={1.8} />
          {t.label}
        </button>
      ))}
    </div>
  );
}

function ChatPanel({ channel }: { channel: string }) {
  const { chat, sendChat, role, profiles } = useCampus();
  const [draft, setDraft] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const messages = chat.filter((m) => m.channel === channel);
  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [messages.length]);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={box} className="scrollbar-slim min-h-0 flex-1 space-y-4 overflow-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-3">
            <Avatar name={m.author} className="size-8 text-[12px]" />
            <div className="min-w-0">
              <p className="text-[13px] text-muted-foreground">
                <span className="font-semibold text-foreground">{m.author}</span>
                {m.role === "instructor" && " · instructor"} · {m.at}
              </p>
              <p className="mt-0.5 text-[14px]">{m.body}</p>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          sendChat(
            draft,
            role === "instructor" ? instructor.name : me.name,
            role ?? "student",
            channel,
          );
          setDraft("");
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message the session"
          className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-[14px] outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-secondary"
          aria-label="Send message"
        >
          <Send className="size-4" strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}

function FilesPanel({ practical }: { practical: Practical }) {
  return (
    <div className="scrollbar-slim min-h-0 flex-1 space-y-2 overflow-auto p-4">
      {practical.resources.map((r) => (
        <button
          key={r.id}
          onClick={() => toast.success(`Opening ${r.title}`)}
          className="flex w-full items-start gap-3 rounded-[12px] border border-border p-3.5 text-left transition-colors hover:bg-muted"
        >
          <FileText className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.8} />
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-medium">{r.title}</span>
            <span className="block text-[13px] text-muted-foreground">
              {r.kind} · {r.size} · {r.uploadedAt}
            </span>
          </span>
        </button>
      ))}
      {practical.resources.length === 0 && (
        <p className="p-2 text-[14px] text-muted-foreground">
          No resources published for this practical yet.
        </p>
      )}
    </div>
  );
}

function RightRail({
  practical,
  children,
}: {
  practical: Practical;
  children?: React.ReactNode;
}) {
  return (
    <aside className="scrollbar-slim hidden w-[320px] shrink-0 overflow-auto border-l border-border bg-surface xl:block">
      <div className="space-y-6 p-5">
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.01em]">Objectives</p>
          <ul className="mt-3 space-y-2">
            {practical.objectives.map((o) => (
              <li key={o} className="flex gap-2.5 border-t border-border pt-2.5 text-[14px]">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {o}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.01em]">Procedure</p>
          <ol className="mt-3 space-y-2">
            {practical.procedure.map((s, i) => (
              <li key={s} className="flex gap-3 border-t border-border pt-2.5 text-[14px]">
                <span className="text-muted-foreground">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        {children}
      </div>
    </aside>
  );
}

/* ------------------------------- student ------------------------------- */

function StudentStudio({ practical }: { practical: Practical }) {
  const {
    practicals,
    students,
    handRaised,
    toggleHand,
    completedTasks,
    toggleTask,
    myGroup,
    groups,
    sharing,
  } = useCampus();
  const [tab, setTab] = useState("participants");
  const [view, setView] = useState<"mine" | "shared">("mine");
  const [mic, setMic] = useState(false);
  const [cam, setCam] = useState(true);
  const [screen, setScreen] = useState(false);
  const [channel, setChannel] = useState("main");

  const tasks = practical.tasks;
  const progress = Math.round((completedTasks.length / Math.max(1, tasks.length)) * 100);
  const registered = practicals.find((p) => p.id === practical.id)?.registered;

  const onTaskDone = (app: string) => {
    const t = tasks.find((x) => x.app === app);
    if (t && !completedTasks.includes(t.id)) {
      toggleTask(t.id);
      toast.success("Task recorded", { description: t.label });
    }
  };

  return (
    <SessionShell
      practical={practical}
      controls={
        <>
          <CtrlBtn
            icon={mic ? Mic : MicOff}
            label={mic ? "Microphone on" : "Microphone off"}
            active={!mic}
            tone="danger"
            onClick={() => setMic((v) => !v)}
          />
          <CtrlBtn
            icon={cam ? Video : VideoOff}
            label={cam ? "Camera on" : "Camera off"}
            active={!cam}
            tone="danger"
            onClick={() => setCam((v) => !v)}
          />
          <CtrlBtn
            icon={Hand}
            label={handRaised ? "Hand raised" : "Raise hand"}
            active={handRaised}
            tone="primary"
            onClick={() => {
              toggleHand();
              toast.success(handRaised ? "Hand lowered" : "Hand raised — instructor notified");
            }}
          />
          <CtrlBtn
            icon={MonitorUp}
            label={screen ? "Sharing screen" : "Share screen"}
            active={screen}
            tone="primary"
            onClick={() => {
              setScreen((v) => !v);
              toast.success(screen ? "Screen sharing stopped" : "Your screen is shared");
            }}
          />
          <CtrlBtn
            icon={Layers}
            label={myGroup ? `Breakout: ${myGroup}` : "No breakout group"}
            active={!!myGroup}
            onClick={() => {
              if (!myGroup) {
                toast.info("Your instructor has not created breakout groups yet");
                return;
              }
              setChannel(channel === "main" ? myGroup : "main");
              toast.success(
                channel === "main" ? `Joined ${myGroup} channel` : "Returned to main session",
              );
            }}
          />
        </>
      }
    >
      <div className="flex h-full min-h-0">
        <aside className="hidden w-[300px] shrink-0 flex-col border-r border-border bg-surface lg:flex">
          <Tabs
            tabs={[
              { key: "participants", label: "People", icon: Users },
              { key: "chat", label: "Chat", icon: Send },
              { key: "files", label: "Files", icon: FileText },
            ]}
            active={tab}
            onChange={setTab}
          />
          {tab === "participants" && (
            <div className="scrollbar-slim min-h-0 flex-1 overflow-auto p-4">
              <div className="mb-4 overflow-hidden rounded-[12px] bg-foreground">
                <div className="flex aspect-video items-end justify-between bg-[radial-gradient(120%_120%_at_20%_0%,#1e3a8a_0%,#0b1220_100%)] p-3">
                  <span className="rounded-full bg-black/40 px-2.5 py-1 text-[12px] text-white/85">
                    {instructor.name} · presenting
                  </span>
                  <Mic className="size-4 text-white/85" strokeWidth={1.8} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {students
                  .filter((s) => s.present)
                  .slice(0, 6)
                  .map((s) => (
                    <div
                      key={s.id}
                      className="flex aspect-video flex-col justify-between rounded-[12px] bg-muted p-2"
                    >
                      <span className="flex items-center justify-between">
                        <Avatar name={s.name} className="size-7 text-[11px]" />
                        {s.handRaised && (
                          <Hand className="size-3.5 text-[color:var(--warning)]" strokeWidth={2} />
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        {s.muted ? (
                          <MicOff className="size-3" strokeWidth={2} />
                        ) : (
                          <Mic className="size-3" strokeWidth={2} />
                        )}
                        {s.name.split(" ")[0]}
                      </span>
                    </div>
                  ))}
              </div>
              {groups.length > 0 && (
                <div className="mt-5">
                  <p className="text-[13px] text-muted-foreground">Breakout groups</p>
                  <div className="mt-2 space-y-2">
                    {groups.map((g) => (
                      <div
                        key={g.name}
                        className={cn(
                          "rounded-[12px] border border-border p-3 text-[13px]",
                          g.name === myGroup && "border-primary bg-primary/5",
                        )}
                      >
                        <p className="font-medium">
                          {g.name}
                          {g.name === myGroup && " · you"}
                        </p>
                        <p className="mt-1 text-muted-foreground">{g.members.length} members</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {tab === "chat" && <ChatPanel channel={channel} />}
          {tab === "files" && <FilesPanel practical={practical} />}
        </aside>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 rounded-full border border-border bg-muted p-1">
              {[
                { key: "mine" as const, label: "My workstation", icon: PanelsTopLeft },
                { key: "shared" as const, label: "Instructor screen", icon: Eye },
              ].map((v) => (
                <button
                  key={v.key}
                  onClick={() => setView(v.key)}
                  className={cn(
                    "inline-flex h-8 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium transition-all",
                    view === v.key
                      ? "bg-surface text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                      : "text-muted-foreground",
                  )}
                >
                  <v.icon className="size-3.5" strokeWidth={1.8} />
                  {v.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {registered ? (
                <Tag tone="success">Workstation-14 provisioned</Tag>
              ) : (
                <Tag tone="warning">Observer access</Tag>
              )}
              {view === "shared" && sharing && <Tag tone="primary">Instructor is sharing</Tag>}
            </div>
          </div>
          <div className="min-h-0 flex-1">
            {view === "mine" ? (
              <WinSim onTaskDone={onTaskDone} />
            ) : sharing ? (
              <WinSim readOnly />
            ) : (
              <div className="grid h-full place-items-center rounded-[20px] border border-border bg-muted text-[15px] text-muted-foreground">
                The instructor is not sharing a simulation environment right now.
              </div>
            )}
          </div>
        </main>

        <RightRail practical={practical}>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-semibold tracking-[-0.01em]">Assessment</p>
              <span className="text-[13px] text-muted-foreground">{progress}%</span>
            </div>
            <Meter value={progress} className="mt-3" />
            <div className="mt-3 space-y-2">
              {tasks.map((t) => {
                const done = completedTasks.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className={cn(
                      "flex w-full gap-2.5 rounded-[12px] border p-3 text-left text-[13px] transition-colors",
                      done ? "border-transparent bg-success/10" : "border-border hover:bg-muted",
                    )}
                  >
                    {done ? (
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-[color:var(--success)]"
                        strokeWidth={2}
                      />
                    ) : (
                      <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={2} />
                    )}
                    <span>
                      <span className="block font-medium text-foreground">{t.label}</span>
                      <span className="block text-muted-foreground">
                        {t.app} · {t.detail}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <Btn
              className="mt-4 w-full"
              onClick={() =>
                toast.success("Practical submitted for assessment", {
                  description: `${completedTasks.length} of ${tasks.length} tasks recorded with your maintenance log.`,
                })
              }
            >
              <ShieldCheck className="size-4" strokeWidth={2} /> Submit practical
            </Btn>
          </div>
        </RightRail>
      </div>
    </SessionShell>
  );
}

/* ------------------------------ instructor ------------------------------ */

function InstructorConsole({ practical }: { practical: Practical }) {
  const {
    students,
    toggleMuteAll,
    removeStudent,
    clearHand,
    announce,
    announcements,
    makeGroups,
    groups,
    sharing,
    setSharing,
    paused,
    setPaused,
    gradeStudent,
    gradePractical,
  } = useCampus();
  const [tab, setTab] = useState("participants");
  const [watching, setWatching] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [allMuted, setAllMuted] = useState(false);

  const present = students.filter((s) => s.present);
  const watched = useMemo(() => present.find((s) => s.id === watching), [present, watching]);
  const cohort = Math.round(present.reduce((s, x) => s + x.progress, 0) / Math.max(1, present.length));

  return (
    <SessionShell
      practical={practical}
      controls={
        <>
          <CtrlBtn icon={Mic} label="Microphone on" onClick={() => toast.info("Microphone active")} />
          <CtrlBtn icon={Video} label="Camera on" onClick={() => toast.info("Camera active")} />
          <CtrlBtn
            icon={MonitorUp}
            label={sharing ? "Sharing simulation" : "Share simulation"}
            active={sharing}
            tone="primary"
            onClick={() => {
              setSharing(!sharing);
              toast.success(
                sharing
                  ? "Stopped sharing the simulation environment"
                  : `Simulation shared with ${present.length} students`,
              );
            }}
          />
          <CtrlBtn
            icon={allMuted ? VolumeX : Volume2}
            label={allMuted ? "All muted" : "Mute all"}
            active={allMuted}
            tone="danger"
            onClick={() => {
              const next = !allMuted;
              setAllMuted(next);
              toggleMuteAll(next);
              toast.success(next ? "All students muted" : "All students unmuted");
            }}
          />
          <CtrlBtn
            icon={paused ? Play : Pause}
            label={paused ? "Resume exercise" : "Pause exercise"}
            active={paused}
            onClick={() => {
              setPaused(!paused);
              toast.success(paused ? "Exercise resumed" : "Exercise paused for all workstations");
            }}
          />
          <CtrlBtn
            icon={Layers}
            label="Create breakout groups"
            active={groups.length > 0}
            tone="primary"
            onClick={() => {
              makeGroups(3);
              toast.success("Three breakout laboratory groups created");
            }}
          />
        </>
      }
    >
      <div className="flex h-full min-h-0">
        <aside className="hidden w-[330px] shrink-0 flex-col border-r border-border bg-surface lg:flex">
          <Tabs
            tabs={[
              { key: "participants", label: "Monitor", icon: Users },
              { key: "chat", label: "Chat", icon: Send },
              { key: "files", label: "Files", icon: FileText },
            ]}
            active={tab}
            onChange={setTab}
          />
          {tab === "participants" && (
            <div className="scrollbar-slim min-h-0 flex-1 overflow-auto p-4">
              <div className="mb-4 rounded-[12px] bg-muted p-4">
                <p className="text-[13px] text-muted-foreground">Cohort task completion</p>
                <Meter value={cohort} className="mt-2.5" />
                <p className="mt-2 text-[13px]">
                  {cohort}% average · {present.length} workstations active
                </p>
              </div>
              <div className="space-y-2">
                {students.map((s) => (
                  <div
                    key={s.id}
                    className={cn(
                      "rounded-[12px] border p-3",
                      watching === s.id ? "border-primary bg-primary/5" : "border-border",
                      !s.present && "opacity-55",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar name={s.name} className="size-8 text-[12px]" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium">{s.name}</span>
                        <span className="block truncate text-[12px] text-muted-foreground">
                          {s.present ? s.activity : "Removed from session"}
                        </span>
                      </span>
                      {s.handRaised && (
                        <Hand className="size-4 text-[color:var(--warning)]" strokeWidth={2} />
                      )}
                      {s.muted && <MicOff className="size-4 text-muted-foreground" strokeWidth={2} />}
                    </div>
                    <div className="mt-2.5 flex items-center gap-2">
                      <Meter value={s.progress} />
                      <span className="w-9 text-[12px] text-muted-foreground">{s.progress}%</span>
                    </div>
                    {s.present && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        <MiniBtn onClick={() => setWatching(s.id)}>Enter workspace</MiniBtn>
                        {s.handRaised && (
                          <MiniBtn
                            onClick={() => {
                              clearHand(s.id);
                              toast.success(`Acknowledged ${s.name}`);
                            }}
                          >
                            Acknowledge
                          </MiniBtn>
                        )}
                        <MiniBtn
                          danger
                          onClick={() => {
                            removeStudent(s.id);
                            toast.success(`${s.name} removed from the session`);
                          }}
                        >
                          <UserMinus className="size-3.5" strokeWidth={2} /> Remove
                        </MiniBtn>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "chat" && <ChatPanel channel="main" />}
          {tab === "files" && <FilesPanel practical={practical} />}
        </aside>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Tag tone={watched ? "primary" : "neutral"}>
                {watched ? `Observing ${watched.name}` : "Demonstration workstation"}
              </Tag>
              {sharing && (
                <Tag tone="error">
                  <Radio className="size-3.5" strokeWidth={2} /> Sharing with {present.length}
                </Tag>
              )}
              {paused && <Tag tone="warning">Exercise paused</Tag>}
            </div>
            {watched && (
              <Btn size="sm" variant="secondary" onClick={() => setWatching(null)}>
                Return to my demonstration
              </Btn>
            )}
          </div>
          <div className="min-h-0 flex-1">
            <WinSim readOnly={!!watched} />
          </div>
        </main>

        <RightRail practical={practical}>
          <div>
            <p className="text-[15px] font-semibold tracking-[-0.01em]">Broadcast announcement</p>
            <form
              className="mt-3 space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!note.trim()) return;
                announce(note);
                toast.success("Announcement broadcast to all students");
                setNote("");
              }}
            >
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Complete task three before the next demonstration."
                className="w-full rounded-[12px] border border-border bg-background p-3 text-[14px] outline-none focus:border-primary"
              />
              <Btn size="sm" type="submit" className="w-full">
                <Megaphone className="size-4" strokeWidth={2} /> Broadcast
              </Btn>
            </form>
            <div className="mt-3 space-y-2">
              {announcements.slice(0, 3).map((a) => (
                <div key={a.id} className="rounded-[12px] bg-muted p-3 text-[13px]">
                  <span className="text-muted-foreground">{a.at}</span>
                  <p className="mt-0.5">{a.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[15px] font-semibold tracking-[-0.01em]">Grade performance</p>
            {watched ? (
              <div className="mt-3 rounded-[12px] border border-border p-3">
                <p className="text-[14px] font-medium">{watched.name}</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">{watched.activity}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {[60, 70, 80, 90, 100].map((v) => (
                    <MiniBtn
                      key={v}
                      onClick={() => {
                        gradeStudent(watched.id, v);
                        toast.success(`${watched.name} scored ${v}`);
                      }}
                    >
                      {v}
                    </MiniBtn>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-[13px] text-muted-foreground">
                Enter a student workspace to record an observation, or close the practical below.
              </p>
            )}
            <Btn
              size="sm"
              variant="dark"
              className="mt-3 w-full"
              onClick={() => {
                gradePractical(practical.id, Math.max(cohort, 60));
                toast.success("Practical closed and results published");
              }}
            >
              Close and publish results
            </Btn>
          </div>

          {groups.length > 0 && (
            <div>
              <p className="text-[15px] font-semibold tracking-[-0.01em]">Breakout groups</p>
              <div className="mt-3 space-y-2">
                {groups.map((g) => (
                  <div key={g.name} className="rounded-[12px] border border-border p-3 text-[13px]">
                    <p className="font-medium">{g.name}</p>
                    <p className="mt-1 text-muted-foreground">{g.members.join(", ")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </RightRail>
      </div>
    </SessionShell>
  );
}

function MiniBtn({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[12px] font-medium transition-colors",
        danger ? "hover:bg-destructive hover:text-primary-foreground" : "hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
