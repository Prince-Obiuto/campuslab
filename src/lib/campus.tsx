import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Role = "student" | "instructor";

export type Resource = {
  id: string;
  title: string;
  kind: "Manual" | "Slides" | "Dataset" | "Checklist";
  size: string;
  uploadedAt: string;
};

export type LabTask = {
  id: string;
  label: string;
  app: string;
  detail: string;
};

export type Practical = {
  id: string;
  code: string;
  title: string;
  focus: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
  status: "live" | "scheduled" | "completed";
  registered: boolean;
  score: number | null;
  weight: number;
  objectives: string[];
  procedure: string[];
  tasks: LabTask[];
  resources: Resource[];
};

export type Student = {
  id: string;
  name: string;
  matric: string;
  level: string;
  registered: boolean;
  present: boolean;
  muted: boolean;
  handRaised: boolean;
  group: string | null;
  progress: number;
  score: number | null;
  activity: string;
};

export type ChatMessage = {
  id: string;
  author: string;
  role: Role;
  body: string;
  at: string;
  channel: string;
};

export type Announcement = { id: string; body: string; at: string };

/** Performance_Log entity (Table 4.1) — one record per submitted experiment. */
export type PerformanceLog = {
  id: string;
  studentId: string;
  studentName: string;
  practicalId: string;
  practicalTitle: string;
  tasksCompleted: number;
  tasksTotal: number;
  score: number;
  completionTime: string;
  at: string;
};

/** Feedback entity (Table 4.1) — post-session rating and comment. */
export type Feedback = {
  id: string;
  practicalId: string;
  author: string;
  role: Role;
  rating: number;
  comment: string;
  at: string;
};

/** System notification (Section 4.5) — session status changes and instructor messages. */
export type Notice = {
  id: string;
  body: string;
  kind: "session" | "assessment" | "message";
  at: string;
};

export type Profile = {
  role: Role;
  name: string;
  identifier: string;
  /** Institutional email used by the login form (Section 4.4). */
  email: string;
  /** Stored locally only — this prototype authenticates on the device. */
  password: string;
  /** Level for a student, academic title for an instructor. */
  standing: string;
  unit: string;
  course: string;
};


const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

export const avatarInitials = initials;

/** Task library available to any practical an instructor schedules. */
export const labTaskLibrary: LabTask[] = [
  {
    id: "t1",
    label: "Identify the process consuming the most memory",
    app: "Task Manager",
    detail: "Open Task Manager, sort by Memory and end the runaway process.",
  },
  {
    id: "t2",
    label: "Reclaim at least 2 GB of disk space",
    app: "Disk Cleanup",
    detail: "Select temporary files, thumbnails and update cache, then clean.",
  },
  {
    id: "t3",
    label: "Locate the suspicious executable in the file system",
    app: "File Explorer",
    detail: "Trace C:\\Users\\Student\\Downloads and inspect file properties.",
  },
  {
    id: "t4",
    label: "Run a system file integrity check",
    app: "Command Prompt",
    detail: "Execute sfc /scannow and record the reported result.",
  },
  {
    id: "t5",
    label: "Quarantine the detected malware",
    app: "Antivirus",
    detail: "Run a full scan and quarantine every detection.",
  },
  {
    id: "t6",
    label: "Boot the workstation into Safe Mode",
    app: "Safe Mode",
    detail: "Use minimal drivers to isolate the faulty startup service.",
  },
  {
    id: "t7",
    label: "Roll the machine back to a healthy restore point",
    app: "System Restore",
    detail: "Select the restore point created before the infection.",
  },
];

const taskSets: Record<string, LabTask[]> = {
  "Task Manager, Disk Cleanup": [labTaskLibrary[0]!, labTaskLibrary[1]!],
  "File Explorer, Command Prompt": [labTaskLibrary[2]!, labTaskLibrary[3]!],
  "Antivirus, Safe Mode, System Restore": [
    labTaskLibrary[4]!,
    labTaskLibrary[5]!,
    labTaskLibrary[6]!,
  ],
};

export const tasksForFocus = (focus: string) => taskSets[focus] ?? labTaskLibrary.slice(0, 4);

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

const rid = () => Math.random().toString(36).slice(2, 9);

const STORE_KEY = "campuslab.profiles.v1";

type Profiles = { student: Profile | null; instructor: Profile | null };

export type Connection = "offline" | "connecting" | "live";

type State = {
  role: Role | null;
  profiles: Profiles;
  profile: Profile | null;
  hasProfile: (r: Role) => boolean;
  practicals: Practical[];
  students: Student[];
  chat: ChatMessage[];
  announcements: Announcement[];
  handRaised: boolean;
  sharing: boolean;
  paused: boolean;
  completedTasks: string[];
  myGroup: string | null;
  groups: { name: string; members: string[] }[];
  /** Real-time studio connection for the session you are currently in. */
  connection: Connection;
  joinedPracticalId: string | null;
  devices: { mic: boolean; cam: boolean };
  /** Performance_Log records produced by submitted experiments. */
  performanceLogs: PerformanceLog[];
  /** Post-session feedback from students and instructors. */
  feedback: Feedback[];
  /** System notifications raised by session status changes. */
  notices: Notice[];
  /** Set when a session has ended and feedback has not yet been given. */
  feedbackDue: string | null;
};


type Actions = {
  setRole: (r: Role | null) => void;
  createProfile: (p: Profile) => void;
  deleteProfile: (r: Role) => void;
  /** Login handler (TC-01 / TC-02): matches email or identifier plus password. */
  signIn: (r: Role, identifier: string, password: string) => boolean;
  register: (id: string) => void;
  addResource: (practicalId: string, r: Omit<Resource, "id" | "uploadedAt">) => void;
  schedulePractical: (p: {
    title: string;
    focus: string;
    date: string;
    time: string;
    duration: string;
    venue: string;
    weight: number;
  }) => void;
  setStatus: (id: string, status: Practical["status"]) => void;
  gradeStudent: (studentId: string, score: number) => void;
  gradePractical: (practicalId: string, score: number) => void;
  toggleMuteAll: (muted: boolean) => void;
  removeStudent: (studentId: string) => void;
  clearHand: (studentId: string) => void;
  announce: (body: string) => void;
  makeGroups: (count: number) => void;
  sendChat: (body: string, author: string, role: Role, channel: string) => void;
  toggleHand: () => void;
  setSharing: (v: boolean) => void;
  setPaused: (v: boolean) => void;
  toggleTask: (taskId: string) => void;
  /** Start the handshake with the live studio for a practical. */
  joinSession: (practicalId: string) => void;
  /** Disconnect from the studio and release the workstation. */
  leaveSession: () => void;
  setDevice: (device: "mic" | "cam", on: boolean) => void;
  /** Assessment Module: records a submission and returns the missing steps, if any. */
  submitPractical: (
    practicalId: string,
    elapsed: string,
  ) => { ok: boolean; missing: LabTask[]; score: number };
  /** Session Management Module: ends the session, disconnects everyone, saves results. */
  endSession: (practicalId: string) => void;
  /** Feedback Module: stores a rating and comment for a finished session. */
  submitFeedback: (practicalId: string, rating: number, comment: string) => void;
  dismissFeedback: () => void;
  notify: (body: string, kind?: Notice["kind"]) => void;
  clearNotices: () => void;
};


const Ctx = createContext<(State & Actions) | null>(null);

export function CampusProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [profiles, setProfiles] = useState<Profiles>({ student: null, instructor: null });
  const [practicals, setPracticals] = useState<Practical[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [handRaised, setHandRaised] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [groups, setGroups] = useState<{ name: string; members: string[] }[]>([]);
  const [myGroup, setMyGroup] = useState<string | null>(null);
  const [connection, setConnection] = useState<Connection>("offline");
  const [joinedPracticalId, setJoinedPracticalId] = useState<string | null>(null);
  const [devices, setDevices] = useState({ mic: false, cam: true });
  const [performanceLogs, setPerformanceLogs] = useState<PerformanceLog[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [feedbackDue, setFeedbackDue] = useState<string | null>(null);


  // The studio handshake: negotiating media and workstation, then live.
  useEffect(() => {
    if (connection !== "connecting") return;
    const t = setTimeout(() => {
      setConnection("live");
      setStudents((list) =>
        list.map((s) => (s.id === "me" ? { ...s, present: true, activity: "In session" } : s)),
      );
    }, 1600);
    return () => clearTimeout(t);
  }, [connection]);


  // Profiles survive a refresh so the workspace keeps the identity you created.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (raw) setProfiles(JSON.parse(raw) as Profiles);
    } catch {
      /* ignore unreadable storage */
    }
  }, []);

  const persist = useCallback((next: Profiles) => {
    setProfiles(next);
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      /* ignore unwritable storage */
    }
  }, []);

  const patch = useCallback(
    (id: string, fn: (p: Practical) => Practical) =>
      setPracticals((list) => list.map((p) => (p.id === id ? fn(p) : p))),
    [],
  );

  const value = useMemo<State & Actions>(
    () => ({
      role,
      profiles,
      profile: role ? profiles[role] : null,
      hasProfile: (r) => Boolean(profiles[r]),
      practicals,
      students,
      chat,
      announcements,
      handRaised,
      sharing,
      paused,
      completedTasks,
      groups,
      myGroup,
      connection,
      joinedPracticalId,
      devices,
      performanceLogs,
      feedback,
      notices,
      feedbackDue,
      notify: (body, kind = "session") =>
        setNotices((list) => [{ id: rid(), body, kind, at: now() }, ...list].slice(0, 30)),
      clearNotices: () => setNotices([]),
      signIn: (r, identifier, password) => {
        const p = profiles[r];
        if (!p) return false;
        const id = identifier.trim().toLowerCase();
        const matches = id === p.email.toLowerCase() || id === p.identifier.toLowerCase();
        if (!matches || password !== p.password) return false;
        setRole(r);
        return true;
      },
      submitPractical: (practicalId, elapsed) => {
        const p = practicals.find((x) => x.id === practicalId);
        const tasks = p?.tasks ?? [];
        const missing = tasks.filter((t) => !completedTasks.includes(t.id));
        const score = Math.round((completedTasks.length / Math.max(1, tasks.length)) * 100);
        if (missing.length > 0) return { ok: false, missing, score };
        const me = profiles.student;
        setPerformanceLogs((list) => [
          {
            id: rid(),
            studentId: "me",
            studentName: me?.name ?? "Student",
            practicalId,
            practicalTitle: p?.title ?? "Practical",
            tasksCompleted: tasks.length,
            tasksTotal: tasks.length,
            score,
            completionTime: elapsed,
            at: now(),
          },
          ...list,
        ]);
        setStudents((list) =>
          list.map((s) => (s.id === "me" ? { ...s, score, progress: score } : s)),
        );
        setNotices((list) => [
          { id: rid(), body: `Practical submitted for assessment · ${score}%`, kind: "assessment" as const, at: now() },
          ...list,
        ]);
        return { ok: true, missing: [], score };
      },
      endSession: (practicalId) => {
        const p = practicals.find((x) => x.id === practicalId);
        const present = students.filter((s) => s.present);
        // Save a result row for every connected student who has no log yet.
        setPerformanceLogs((list) => [
          ...present
            .filter((s) => !list.some((l) => l.studentId === s.id && l.practicalId === practicalId))
            .map((s) => ({
              id: rid(),
              studentId: s.id,
              studentName: s.name,
              practicalId,
              practicalTitle: p?.title ?? "Practical",
              tasksCompleted: Math.round(((p?.tasks.length ?? 0) * s.progress) / 100),
              tasksTotal: p?.tasks.length ?? 0,
              score: s.score ?? s.progress,
              completionTime: p?.duration ?? "—",
              at: now(),
            })),
          ...list,
        ]);
        patch(practicalId, (x) => ({ ...x, status: "completed" }));
        setStudents((list) =>
          list.map((s) => ({ ...s, present: false, handRaised: false, activity: "Session ended" })),
        );
        setSharing(false);
        setPaused(false);
        setGroups([]);
        setMyGroup(null);
        setHandRaised(false);
        setConnection("offline");
        setJoinedPracticalId(null);
        setFeedbackDue(practicalId);
        setNotices((list) => [
          { id: rid(), body: "Session ended — all workstations released and results saved", kind: "session" as const, at: now() },
          ...list,
        ]);
      },
      submitFeedback: (practicalId, rating, comment) => {
        const author = (role === "instructor" ? profiles.instructor?.name : profiles.student?.name) ?? "Anonymous";
        setFeedback((list) => [
          { id: rid(), practicalId, author, role: role ?? "student", rating, comment, at: now() },
          ...list,
        ]);
        setFeedbackDue(null);
      },
      dismissFeedback: () => setFeedbackDue(null),

      setRole,
      setSharing,
      setPaused,
      setDevice: (device, on) => setDevices((d) => ({ ...d, [device]: on })),
      joinSession: (practicalId) => {
        setJoinedPracticalId(practicalId);
        setConnection("connecting");
      },
      leaveSession: () => {
        setConnection("offline");
        setJoinedPracticalId(null);
        setHandRaised(false);
        setStudents((list) =>
          list.map((s) =>
            s.id === "me"
              ? { ...s, present: false, handRaised: false, activity: "Not in session" }
              : s,
          ),
        );
      },

      createProfile: (p) => {
        persist({ ...profiles, [p.role]: p });
        if (p.role === "student") {
          setStudents((list) =>
            list.some((s) => s.id === "me")
              ? list
              : [
                  {
                    id: "me",
                    name: p.name,
                    matric: p.identifier,
                    level: p.standing,
                    registered: false,
                    present: false,
                    muted: false,
                    handRaised: false,
                    group: null,
                    progress: 0,
                    score: null,
                    activity: "Not in session",
                  },
                  ...list,
                ],
          );
        }
      },
      deleteProfile: (r) => {
        persist({ ...profiles, [r]: null });
        if (r === "student") setStudents((list) => list.filter((s) => s.id !== "me"));
      },
      register: (id) => {
        patch(id, (p) => ({ ...p, registered: true }));
        setStudents((list) => list.map((s) => (s.id === "me" ? { ...s, registered: true } : s)));
      },
      addResource: (practicalId, r) =>
        patch(practicalId, (p) => ({
          ...p,
          resources: [{ ...r, id: rid(), uploadedAt: "Just now" }, ...p.resources],
        })),
      schedulePractical: (p) =>
        setPracticals((list) => [
          {
            id: rid(),
            code: profiles.instructor?.course ?? "",
            title: p.title,
            focus: p.focus,
            date: p.date,
            time: p.time,
            duration: p.duration,
            venue: p.venue,
            status: "scheduled",
            registered: false,
            score: null,
            weight: p.weight,
            objectives: ["Objectives will be published with the lab manual"],
            procedure: [
              "Register for the practical to receive a workstation",
              "Follow the instructor demonstration in the studio",
              "Complete each task on your own virtual workstation",
              "Submit your work for assessment before the session ends",
            ],
            tasks: tasksForFocus(p.focus),
            resources: [],
          },
          ...list,
        ]),
      setStatus: (id, status) => patch(id, (p) => ({ ...p, status })),
      gradeStudent: (studentId, score) =>
        setStudents((list) =>
          list.map((s) =>
            s.id === studentId
              ? { ...s, score, progress: Math.max(s.progress, Math.min(100, score)) }
              : s,
          ),
        ),
      gradePractical: (practicalId, score) =>
        patch(practicalId, (p) => ({ ...p, score, status: "completed" })),
      toggleMuteAll: (muted) => setStudents((list) => list.map((s) => ({ ...s, muted }))),
      removeStudent: (studentId) =>
        setStudents((list) =>
          list.map((s) => (s.id === studentId ? { ...s, present: false, handRaised: false } : s)),
        ),
      clearHand: (studentId) =>
        setStudents((list) =>
          list.map((s) => (s.id === studentId ? { ...s, handRaised: false } : s)),
        ),
      announce: (body) =>
        setAnnouncements((list) => [{ id: rid(), body, at: now() }, ...list]),
      makeGroups: (count) => {
        const present = students.filter((s) => s.present);
        const made = Array.from({ length: count }, (_, i) => ({
          name: `Group ${String.fromCharCode(65 + i)}`,
          members: present.filter((_, idx) => idx % count === i).map((s) => s.name),
        }));
        setGroups(made);
        setStudents((list) =>
          list.map((s) => {
            const g = made.find((grp) => grp.members.includes(s.name));
            return { ...s, group: g ? g.name : null };
          }),
        );
        const mine = made.find((g) => g.members.includes(profiles.student?.name ?? ""));
        setMyGroup(mine ? mine.name : (made[0]?.name ?? null));
      },
      sendChat: (body, author, r, channel) =>
        setChat((list) => [...list, { id: rid(), author, role: r, body, at: now(), channel }]),
      toggleHand: () => {
        setHandRaised((v) => !v);
        setStudents((list) =>
          list.map((s) => (s.id === "me" ? { ...s, handRaised: !handRaised } : s)),
        );
      },
      toggleTask: (taskId) =>
        setCompletedTasks((list) =>
          list.includes(taskId) ? list.filter((t) => t !== taskId) : [...list, taskId],
        ),
    }),
    [
      role,
      profiles,
      persist,
      practicals,
      students,
      chat,
      announcements,
      handRaised,
      sharing,
      paused,
      completedTasks,
      groups,
      myGroup,
      connection,
      joinedPracticalId,
      devices,
      patch,
      performanceLogs,
      feedback,
      notices,
      feedbackDue,


    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCampus() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCampus must be used inside CampusProvider");
  return ctx;
}

/** Performance line derived from the practicals that have actually been assessed. */
export function performanceSeries(practicals: Practical[]) {
  const assessed = practicals.filter((p) => p.status === "completed" && p.score !== null);
  if (assessed.length === 0) return [];
  return assessed.map((p, i) => ({ label: `Lab ${i + 1}`, score: p.score ?? 0 }));
}
