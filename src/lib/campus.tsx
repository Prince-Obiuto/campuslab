import {
  createContext,
  useCallback,
  useContext,
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

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

export const avatarInitials = initials;

const winTasks: LabTask[] = [
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

const manual = (id: string, title: string, at: string): Resource => ({
  id,
  title,
  kind: "Manual",
  size: "2.4 MB",
  uploadedAt: at,
});

const basePracticals: Practical[] = [
  {
    id: "p1",
    code: "IFT 212",
    title: "Practical 4 — Operating System Maintenance",
    focus: "Task Manager, Disk Cleanup, File Explorer",
    date: "Today",
    time: "10:00",
    duration: "90 min",
    venue: "Virtual Lab Studio A",
    status: "live",
    registered: true,
    score: null,
    weight: 15,
    objectives: [
      "Interpret live process and resource utilisation on a workstation",
      "Recover storage capacity using system maintenance utilities",
      "Document maintenance actions in a technical log",
    ],
    procedure: [
      "Join the studio and confirm your workstation is provisioned",
      "Follow the instructor demonstration on the shared simulation",
      "Complete each task inside your own virtual Windows desktop",
      "Submit the maintenance log for assessment before the session ends",
    ],
    tasks: winTasks.slice(0, 4),
    resources: [
      manual("r1", "IFT 212 Lab Manual — OS Maintenance", "2 days ago"),
      {
        id: "r2",
        title: "Maintenance Log Template",
        kind: "Checklist",
        size: "180 KB",
        uploadedAt: "2 days ago",
      },
      {
        id: "r3",
        title: "Demonstration Slides — Resource Monitoring",
        kind: "Slides",
        size: "5.1 MB",
        uploadedAt: "Yesterday",
      },
    ],
  },
  {
    id: "p2",
    code: "IFT 212",
    title: "Practical 5 — Malware Troubleshooting",
    focus: "Antivirus, Safe Mode, System Restore",
    date: "Fri, 7 Aug",
    time: "14:00",
    duration: "120 min",
    venue: "Virtual Lab Studio B",
    status: "scheduled",
    registered: true,
    score: null,
    weight: 20,
    objectives: [
      "Recognise indicators of compromise on a Windows workstation",
      "Isolate a faulty startup service using Safe Mode",
      "Restore a system to a verified healthy state",
    ],
    procedure: [
      "Review the pre-lab manual before the session",
      "Reproduce the infection scenario in your workstation",
      "Quarantine detections and record the remediation path",
      "Roll back using System Restore and verify system health",
    ],
    tasks: winTasks.slice(3),
    resources: [
      manual("r4", "IFT 212 Lab Manual — Malware Remediation", "Yesterday"),
      {
        id: "r5",
        title: "Sample Infection Indicators",
        kind: "Dataset",
        size: "740 KB",
        uploadedAt: "Yesterday",
      },
    ],
  },
  {
    id: "p3",
    code: "IFT 212",
    title: "Practical 3 — Command Line Diagnostics",
    focus: "Command Prompt, system utilities",
    date: "24 Jul",
    time: "10:00",
    duration: "90 min",
    venue: "Virtual Lab Studio A",
    status: "completed",
    registered: true,
    score: 82,
    weight: 15,
    objectives: [
      "Query system configuration from the command line",
      "Validate file system integrity",
    ],
    procedure: ["Run diagnostics", "Interpret output", "Submit findings"],
    tasks: winTasks.slice(3, 5),
    resources: [manual("r6", "IFT 212 Lab Manual — CLI Diagnostics", "2 weeks ago")],
  },
  {
    id: "p4",
    code: "IFT 212",
    title: "Practical 2 — Memory Hierarchy Observation",
    focus: "Task Manager, resource monitor",
    date: "10 Jul",
    time: "10:00",
    duration: "90 min",
    venue: "Virtual Lab Studio A",
    status: "completed",
    registered: true,
    score: 74,
    weight: 10,
    objectives: ["Observe cache and memory behaviour under load"],
    procedure: ["Load workstation", "Record utilisation"],
    tasks: winTasks.slice(0, 2),
    resources: [manual("r7", "IFT 212 Lab Manual — Memory Hierarchy", "1 month ago")],
  },
  {
    id: "p5",
    code: "IFT 212",
    title: "Practical 6 — Disk Recovery Clinic",
    focus: "Disk Cleanup, File Explorer, restore points",
    date: "Fri, 14 Aug",
    time: "10:00",
    duration: "90 min",
    venue: "Virtual Lab Studio A",
    status: "scheduled",
    registered: false,
    score: null,
    weight: 20,
    objectives: [
      "Plan a storage recovery procedure for a constrained workstation",
      "Verify recovery outcomes against a maintenance checklist",
    ],
    procedure: [
      "Register for the practical to receive a workstation",
      "Review the manual once published",
      "Complete the clinic tasks during the session",
    ],
    tasks: winTasks.slice(1, 4),
    resources: [],
  },
];

const baseStudents: Student[] = [
  ["Adaeze Okonkwo", "IFT/19/0421", 92, "Task Manager — sorting by memory"],
  ["Tunde Balogun", "IFT/19/0398", 78, "Disk Cleanup — selecting categories"],
  ["Fatima Yusuf", "IFT/19/0455", 64, "File Explorer — inspecting Downloads"],
  ["Chidi Nwosu", "IFT/19/0410", 41, "Idle for 3 minutes"],
  ["Grace Ilori", "IFT/19/0433", 88, "Command Prompt — sfc /scannow"],
  ["Samuel Ekpo", "IFT/19/0407", 55, "Antivirus — full scan running"],
  ["Halima Bello", "IFT/19/0462", 70, "Task Manager — reviewing services"],
  ["Peter Adeyemi", "IFT/19/0389", 33, "Awaiting instructor assistance"],
  ["Ngozi Eze", "IFT/19/0448", 81, "Maintenance log — drafting"],
  ["Ibrahim Sani", "IFT/19/0417", 47, "Disk Cleanup — cleaning system files"],
].map(([name, matric, progress, activity], i) => ({
  id: `s${i + 1}`,
  name: name as string,
  matric: matric as string,
  level: "300 Level",
  registered: true,
  present: i < 8,
  muted: false,
  handRaised: i === 3 || i === 7,
  group: null,
  progress: progress as number,
  score: i % 3 === 0 ? 76 + i : null,
  activity: activity as string,
}));

const baseChat: ChatMessage[] = [
  {
    id: "c1",
    author: "Dr. Amina Lawal",
    role: "instructor",
    body: "Welcome in. Provision your workstation and open Task Manager before we begin.",
    at: "10:02",
    channel: "main",
  },
  {
    id: "c2",
    author: "Adaeze Okonkwo",
    role: "student",
    body: "Workstation provisioned. Memory sits at 84% on idle.",
    at: "10:05",
    channel: "main",
  },
  {
    id: "c3",
    author: "Grace Ilori",
    role: "student",
    body: "Should we record the PID alongside the process name in the log?",
    at: "10:07",
    channel: "main",
  },
  {
    id: "c4",
    author: "Dr. Amina Lawal",
    role: "instructor",
    body: "Yes — PID, memory footprint and the action you took.",
    at: "10:08",
    channel: "main",
  },
];

export const student = {
  name: "Ifeoluwa Adekunle",
  matric: "IFT/19/0402",
  level: "300 Level",
  programme: "B.Sc. Information Technology",
  department: "Department of Information Technology",
  faculty: "Faculty of Computing",
};

export const instructor = {
  name: "Dr. Amina Lawal",
  title: "Senior Lecturer, Computer Architecture",
  staffId: "STF/IT/0912",
  department: "Department of Information Technology",
  courses: ["IFT 212 — Computer Architecture and Organization"],
  office: "Block C, Room 214",
};

export const course = {
  code: "IFT 212",
  title: "Computer Architecture and Organization",
  units: "3 Units",
  session: "2025/2026 First Semester",
};

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

type State = {
  role: Role | null;
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
};

type Actions = {
  setRole: (r: Role | null) => void;
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
};

const Ctx = createContext<(State & Actions) | null>(null);

export function CampusProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [practicals, setPracticals] = useState<Practical[]>(basePracticals);
  const [students, setStudents] = useState<Student[]>(baseStudents);
  const [chat, setChat] = useState<ChatMessage[]>(baseChat);
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: "a1", body: "Submit the maintenance log before the session ends.", at: "10:10" },
  ]);
  const [handRaised, setHandRaised] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [groups, setGroups] = useState<{ name: string; members: string[] }[]>([]);
  const [myGroup, setMyGroup] = useState<string | null>(null);

  const patch = useCallback(
    (id: string, fn: (p: Practical) => Practical) =>
      setPracticals((list) => list.map((p) => (p.id === id ? fn(p) : p))),
    [],
  );

  const value = useMemo<State & Actions>(
    () => ({
      role,
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
      setRole,
      setSharing,
      setPaused,
      register: (id) => patch(id, (p) => ({ ...p, registered: true })),
      addResource: (practicalId, r) =>
        patch(practicalId, (p) => ({
          ...p,
          resources: [
            { ...r, id: `r${Math.random().toString(36).slice(2, 8)}`, uploadedAt: "Just now" },
            ...p.resources,
          ],
        })),
      schedulePractical: (p) =>
        setPracticals((list) => [
          {
            id: `p${Math.random().toString(36).slice(2, 8)}`,
            code: course.code,
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
            procedure: ["Procedure will be published with the lab manual"],
            tasks: winTasks.slice(0, 3),
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
        setAnnouncements((list) => [
          { id: Math.random().toString(36).slice(2, 8), body, at: now() },
          ...list,
        ]),
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
        setMyGroup(made[0] ? made[0].name : null);
      },
      sendChat: (body, author, r, channel) =>
        setChat((list) => [
          ...list,
          { id: Math.random().toString(36).slice(2, 8), author, role: r, body, at: now(), channel },
        ]),
      toggleHand: () => setHandRaised((v) => !v),
      toggleTask: (taskId) =>
        setCompletedTasks((list) =>
          list.includes(taskId) ? list.filter((t) => t !== taskId) : [...list, taskId],
        ),
    }),
    [
      role,
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
      patch,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCampus() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCampus must be used inside CampusProvider");
  return ctx;
}

export const performanceSeries = [
  { label: "Wk 1", score: 0 },
  { label: "Wk 2", score: 0 },
  { label: "Wk 3", score: 74 },
  { label: "Wk 4", score: 78 },
  { label: "Wk 5", score: 82 },
];
