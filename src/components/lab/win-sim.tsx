import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ChevronRight,
  Folder,
  FileWarning,
  HardDrive,
  History,
  Monitor,
  Search,
  ShieldCheck,
  ShieldAlert,
  Square,
  Terminal,
  Trash2,
  Wifi,
  Volume2,
  BatteryFull,
  Power,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Btn, Meter, Tag } from "@/components/kit";

type AppKey =
  | "taskmgr"
  | "cleanup"
  | "explorer"
  | "cmd"
  | "antivirus"
  | "safemode"
  | "restore"
  | null;

const appMeta: { key: Exclude<AppKey, null>; label: string; icon: typeof Activity }[] = [
  { key: "taskmgr", label: "Task Manager", icon: Activity },
  { key: "cleanup", label: "Disk Cleanup", icon: Trash2 },
  { key: "explorer", label: "File Explorer", icon: Folder },
  { key: "cmd", label: "Command Prompt", icon: Terminal },
  { key: "antivirus", label: "Antivirus", icon: ShieldCheck },
  { key: "safemode", label: "Safe Mode", icon: Power },
  { key: "restore", label: "System Restore", icon: History },
];

type Process = { name: string; pid: number; cpu: number; mem: number; kind: string };

const initialProcesses: Process[] = [
  { name: "svhost32.exe", pid: 4412, cpu: 41, mem: 2180, kind: "Background process" },
  { name: "chrome.exe", pid: 2288, cpu: 12, mem: 1420, kind: "App" },
  { name: "explorer.exe", pid: 1044, cpu: 3, mem: 320, kind: "Windows process" },
  { name: "MsMpEng.exe", pid: 3120, cpu: 8, mem: 410, kind: "Windows process" },
  { name: "Code.exe", pid: 5580, cpu: 6, mem: 880, kind: "App" },
  { name: "spoolsv.exe", pid: 1560, cpu: 1, mem: 96, kind: "Windows process" },
  { name: "SearchIndexer.exe", pid: 2740, cpu: 4, mem: 240, kind: "Windows process" },
];

const cleanupItems = [
  { id: "temp", label: "Temporary files", gb: 1.4 },
  { id: "thumbs", label: "Thumbnail cache", gb: 0.3 },
  { id: "update", label: "Windows Update cache", gb: 2.1 },
  { id: "recycle", label: "Recycle Bin", gb: 0.8 },
  { id: "logs", label: "System error memory dumps", gb: 0.6 },
];

const tree: Record<string, { name: string; size: string; flagged?: boolean }[]> = {
  "C:\\Users\\Student\\Downloads": [
    { name: "driver_update_x86.exe", size: "8.2 MB", flagged: true },
    { name: "IFT212_manual.pdf", size: "2.4 MB" },
    { name: "lab_log.docx", size: "180 KB" },
  ],
  "C:\\Users\\Student\\Documents": [
    { name: "maintenance_log.docx", size: "142 KB" },
    { name: "architecture_notes.txt", size: "12 KB" },
  ],
  "C:\\Windows\\System32": [
    { name: "cmd.exe", size: "289 KB" },
    { name: "taskmgr.exe", size: "1.1 MB" },
    { name: "sfc.exe", size: "84 KB" },
  ],
  "C:\\Program Files": [
    { name: "Windows Defender", size: "—" },
    { name: "Google", size: "—" },
  ],
};

const restorePoints = [
  { id: "rp1", label: "Before driver_update_x86.exe install", date: "30 Jul, 08:14", healthy: true },
  { id: "rp2", label: "Windows Update KB5039211", date: "27 Jul, 21:02", healthy: true },
  { id: "rp3", label: "Lab image baseline", date: "12 Jul, 09:00", healthy: true },
];

function WindowFrame({
  title,
  icon: Icon,
  onClose,
  children,
}: {
  title: string;
  icon: typeof Activity;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-3 flex flex-col overflow-hidden rounded-[16px] border border-white/15 bg-[#f4f6f9] shadow-[0_15px_40px_rgba(0,0,0,0.35)] md:inset-6">
      <div className="flex h-11 items-center justify-between border-b border-border bg-white px-4">
        <span className="flex items-center gap-2 text-caption font-semibold text-foreground">
          <Icon className="size-4 text-primary" strokeWidth={2} />
          {title}
        </span>
        <button
          onClick={onClose}
          aria-label="Close window"
          className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive hover:text-primary-foreground"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      </div>
      <div className="scrollbar-slim flex-1 overflow-auto p-5 text-[15px] text-foreground">
        {children}
      </div>
    </div>
  );
}

export function WinSim({
  onTaskDone,
  readOnly = false,
  compact = false,
}: {
  onTaskDone?: (app: string) => void;
  readOnly?: boolean;
  compact?: boolean;
}) {
  const [open, setOpen] = useState<AppKey>(null);
  const [processes, setProcesses] = useState(initialProcesses);
  const [sortByMem, setSortByMem] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [freed, setFreed] = useState(0);
  const [path, setPath] = useState("C:\\Users\\Student\\Downloads");
  const [inspected, setInspected] = useState<string | null>(null);
  const [lines, setLines] = useState<string[]>([
    "Microsoft Windows [Version 10.0.19045.4046]",
    "(c) CampusLab virtual workstation. Type help for available commands.",
  ]);
  const [cmd, setCmd] = useState("");
  const [scan, setScan] = useState<"idle" | "running" | "done" | "clean">("idle");
  const [scanPct, setScanPct] = useState(0);
  const [safeMode, setSafeMode] = useState(false);
  const [restored, setRestored] = useState<string | null>(null);

  const done = (app: string) => onTaskDone?.(app);

  useEffect(() => {
    if (scan !== "running") return;
    const t = setInterval(() => {
      setScanPct((p) => {
        if (p >= 100) {
          clearInterval(t);
          setScan("done");
          return 100;
        }
        return p + 8;
      });
    }, 160);
    return () => clearInterval(t);
  }, [scan]);

  const sorted = useMemo(
    () => (sortByMem ? [...processes].sort((a, b) => b.mem - a.mem) : processes),
    [processes, sortByMem],
  );

  const files = tree[path] ?? [];

  const reclaimable = cleanupItems
    .filter((i) => selected.includes(i.id))
    .reduce((s, i) => s + i.gb, 0);

  const runCmd = (raw: string) => {
    const input = raw.trim();
    const out: string[] = [`C:\\Users\\Student> ${input}`];
    const lower = input.toLowerCase();
    if (lower === "sfc /scannow") {
      out.push(
        "Beginning system scan. This process will take some time.",
        "Verification 100% complete.",
        "Windows Resource Protection found corrupt files and successfully repaired them.",
      );
      done("Command Prompt");
    } else if (lower === "dir") {
      out.push(
        " Directory of C:\\Users\\Student",
        " 30/07/2026  08:12    <DIR>   Downloads",
        " 28/07/2026  16:40    <DIR>   Documents",
        " 30/07/2026  09:55         142,336 maintenance_log.docx",
      );
    } else if (lower === "ipconfig") {
      out.push(
        "Windows IP Configuration",
        "   IPv4 Address. . . . . . . . . . . : 10.24.8.117",
        "   Subnet Mask . . . . . . . . . . . : 255.255.255.0",
        "   Default Gateway . . . . . . . . . : 10.24.8.1",
      );
    } else if (lower === "systeminfo") {
      out.push(
        "OS Name:                   Microsoft Windows 10 Education",
        "System Type:               x64-based PC",
        "Processor(s):              Intel64 Family 6 Model 158, 2.80 GHz",
        "Total Physical Memory:     8,192 MB",
        "Available Physical Memory: 1,284 MB",
      );
    } else if (lower === "tasklist") {
      out.push(...processes.map((p) => `${p.name.padEnd(24)} ${p.pid}   ${p.mem} K`));
    } else if (lower === "cls") {
      setLines([]);
      setCmd("");
      return;
    } else if (lower === "help") {
      out.push("Available: sfc /scannow, dir, ipconfig, systeminfo, tasklist, cls");
    } else if (input.length) {
      out.push(`'${input}' is not recognized as an internal or external command.`);
    }
    setLines((l) => [...l, ...out]);
    setCmd("");
  };

  const wallpaper = safeMode
    ? "bg-[#0b0f14]"
    : "bg-[radial-gradient(120%_120%_at_20%_0%,#1e3a8a_0%,#0b1220_55%,#050810_100%)]";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-border",
        wallpaper,
        compact ? "aspect-[16/10]" : "h-full min-h-[420px]",
      )}
    >
      {readOnly && (
        <div className="absolute inset-0 z-40 cursor-not-allowed bg-transparent" title="View only" />
      )}
      {safeMode && (
        <>
          <span className="absolute top-3 left-4 text-[13px] text-white/70">Safe Mode</span>
          <span className="absolute top-3 right-4 text-[13px] text-white/70">
            Windows 10 Education — Build 19045
          </span>
        </>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,84px)] gap-2 p-5">
        {appMeta.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onDoubleClick={() => setOpen(key)}
            onClick={() => setOpen(key)}
            className="group flex flex-col items-center gap-2 rounded-[12px] p-2 text-center transition-colors hover:bg-white/10"
          >
            <span className="grid size-11 place-items-center rounded-[12px] bg-white/12 ring-1 ring-white/15 ring-inset">
              <Icon className="size-5 text-white" strokeWidth={1.8} />
            </span>
            <span className="text-[12px] leading-tight text-white/85">{label}</span>
          </button>
        ))}
      </div>

      {restored && (
        <div className="absolute bottom-16 left-5 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[13px] text-white/85 ring-1 ring-white/15 ring-inset">
          <ShieldCheck className="size-4" strokeWidth={1.8} /> System restored to {restored}
        </div>
      )}

      {open === "taskmgr" && (
        <WindowFrame title="Task Manager" icon={Activity} onClose={() => setOpen(null)}>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Btn size="sm" variant="secondary" onClick={() => setSortByMem((v) => !v)}>
              {sortByMem ? "Sorted by memory" : "Sort by memory"}
            </Btn>
            <span className="text-caption text-muted-foreground">
              {processes.length} processes · CPU {processes.reduce((s, p) => s + p.cpu, 0)}% · Memory{" "}
              {(processes.reduce((s, p) => s + p.mem, 0) / 1024).toFixed(1)} GB
            </span>
          </div>
          <div className="overflow-hidden rounded-[12px] border border-border bg-white">
            <div className="grid grid-cols-[2fr_repeat(3,80px)_100px] gap-2 border-b border-border bg-muted px-4 py-2 text-[13px] font-semibold text-muted-foreground">
              <span>Name</span>
              <span>PID</span>
              <span>CPU</span>
              <span>Memory</span>
              <span />
            </div>
            {sorted.map((p) => (
              <div
                key={p.pid}
                className="grid grid-cols-[2fr_repeat(3,80px)_100px] items-center gap-2 border-b border-border px-4 py-2.5 text-[14px] last:border-0"
              >
                <span className="truncate">
                  {p.name}
                  <span className="ml-2 text-[12px] text-muted-foreground">{p.kind}</span>
                </span>
                <span className="text-muted-foreground">{p.pid}</span>
                <span className={cn(p.cpu > 30 && "font-semibold text-destructive")}>{p.cpu}%</span>
                <span className={cn(p.mem > 2000 && "font-semibold text-destructive")}>
                  {p.mem} MB
                </span>
                <button
                  onClick={() => {
                    setProcesses((list) => list.filter((x) => x.pid !== p.pid));
                    if (p.mem > 2000) done("Task Manager");
                  }}
                  className="justify-self-end rounded-full border border-border px-3 py-1 text-[12px] font-medium transition-colors hover:bg-destructive hover:text-primary-foreground"
                >
                  End task
                </button>
              </div>
            ))}
          </div>
        </WindowFrame>
      )}

      {open === "cleanup" && (
        <WindowFrame title="Disk Cleanup (C:)" icon={Trash2} onClose={() => setOpen(null)}>
          <div className="mb-5 flex items-center gap-4">
            <HardDrive className="size-8 text-primary" strokeWidth={1.6} />
            <div className="flex-1">
              <Meter value={92 - freed * 5} />
              <p className="mt-2 text-caption text-muted-foreground">
                {(24.6 + freed).toFixed(1)} GB free of 256 GB
                {freed > 0 && ` · ${freed.toFixed(1)} GB reclaimed`}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {cleanupItems.map((i) => (
              <label
                key={i.id}
                className="flex cursor-pointer items-center justify-between rounded-[12px] border border-border bg-white px-4 py-3"
              >
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(i.id)}
                    onChange={() =>
                      setSelected((s) =>
                        s.includes(i.id) ? s.filter((x) => x !== i.id) : [...s, i.id],
                      )
                    }
                    className="size-4 accent-[color:var(--primary)]"
                  />
                  {i.label}
                </span>
                <span className="text-caption text-muted-foreground">{i.gb} GB</span>
              </label>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-caption text-muted-foreground">
              Total selected: {reclaimable.toFixed(1)} GB
            </span>
            <Btn
              size="sm"
              disabled={!selected.length}
              onClick={() => {
                setFreed((f) => f + reclaimable);
                if (reclaimable >= 2) done("Disk Cleanup");
                setSelected([]);
              }}
            >
              Clean up system files
            </Btn>
          </div>
        </WindowFrame>
      )}

      {open === "explorer" && (
        <WindowFrame title="File Explorer" icon={Folder} onClose={() => setOpen(null)}>
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <div className="space-y-1">
              {Object.keys(tree).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPath(p);
                    setInspected(null);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-[12px] px-3 py-2 text-left text-[13px] transition-colors",
                    p === path ? "bg-primary/10 text-primary" : "hover:bg-muted",
                  )}
                >
                  <Folder className="size-4" strokeWidth={1.8} />
                  <span className="truncate">{p.split("\\").slice(-1)[0]}</span>
                </button>
              ))}
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-[13px] text-muted-foreground">
                <Search className="size-4" strokeWidth={1.8} />
                {path}
              </div>
              <div className="overflow-hidden rounded-[12px] border border-border bg-white">
                {files.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => {
                      setInspected(f.name);
                      if (f.flagged) done("File Explorer");
                    }}
                    className="flex w-full items-center justify-between border-b border-border px-4 py-3 text-left text-[14px] transition-colors last:border-0 hover:bg-muted"
                  >
                    <span className="flex items-center gap-2">
                      {f.flagged ? (
                        <FileWarning className="size-4 text-destructive" strokeWidth={1.8} />
                      ) : (
                        <Square className="size-4 text-muted-foreground" strokeWidth={1.8} />
                      )}
                      {f.name}
                    </span>
                    <span className="text-caption text-muted-foreground">{f.size}</span>
                  </button>
                ))}
              </div>
              {inspected && (
                <div className="mt-3 rounded-[12px] border border-border bg-white p-4 text-[14px]">
                  <p className="font-semibold">{inspected} — Properties</p>
                  <dl className="mt-2 grid grid-cols-2 gap-y-1 text-caption text-muted-foreground">
                    <dt>Location</dt>
                    <dd className="text-foreground">{path}</dd>
                    <dt>Publisher</dt>
                    <dd className="text-foreground">
                      {files.find((f) => f.name === inspected)?.flagged
                        ? "Unknown — unsigned binary"
                        : "Verified"}
                    </dd>
                    <dt>Digital signature</dt>
                    <dd className="text-foreground">
                      {files.find((f) => f.name === inspected)?.flagged ? "Absent" : "Present"}
                    </dd>
                  </dl>
                  {files.find((f) => f.name === inspected)?.flagged && (
                    <Tag tone="error" className="mt-3">
                      <ShieldAlert className="size-3.5" strokeWidth={2} /> Flagged for antivirus
                      review
                    </Tag>
                  )}
                </div>
              )}
            </div>
          </div>
        </WindowFrame>
      )}

      {open === "cmd" && (
        <WindowFrame title="Command Prompt" icon={Terminal} onClose={() => setOpen(null)}>
          <div className="flex h-full min-h-[280px] flex-col rounded-[12px] bg-[#0b1220] p-4 font-mono text-[13px] text-[#d7e3f4]">
            <div className="scrollbar-slim flex-1 space-y-1 overflow-auto">
              {lines.map((l, i) => (
                <p key={i} className="whitespace-pre-wrap">
                  {l}
                </p>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runCmd(cmd);
              }}
              className="mt-3 flex items-center gap-2"
            >
              <span className="text-[#7dd3fc]">C:\Users\Student&gt;</span>
              <input
                value={cmd}
                onChange={(e) => setCmd(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent font-mono text-[13px] outline-none"
                placeholder="type a command"
              />
            </form>
          </div>
        </WindowFrame>
      )}

      {open === "antivirus" && (
        <WindowFrame title="Windows Security" icon={ShieldCheck} onClose={() => setOpen(null)}>
          <div className="flex items-center gap-4 rounded-[12px] border border-border bg-white p-5">
            {scan === "clean" ? (
              <ShieldCheck className="size-10 text-[color:var(--success)]" strokeWidth={1.6} />
            ) : (
              <ShieldAlert className="size-10 text-[color:var(--warning)]" strokeWidth={1.6} />
            )}
            <div className="flex-1">
              <p className="font-semibold">
                {scan === "clean"
                  ? "No threats found. Workstation protected."
                  : "Threat protection requires attention"}
              </p>
              <p className="text-caption text-muted-foreground">
                Last full scan: {scan === "idle" ? "never on this image" : "just now"}
              </p>
            </div>
            {scan === "idle" && (
              <Btn size="sm" onClick={() => setScan("running")}>
                Run full scan
              </Btn>
            )}
          </div>
          {scan === "running" && (
            <div className="mt-4 rounded-[12px] border border-border bg-white p-5">
              <Meter value={scanPct} />
              <p className="mt-2 text-caption text-muted-foreground">
                Scanning C:\Users\Student … {scanPct}%
              </p>
            </div>
          )}
          {scan === "done" && (
            <div className="mt-4 space-y-2">
              {[
                { n: "Trojan:Win32/Wacatac.B!ml", p: "C:\\Users\\Student\\Downloads" },
                { n: "PUA:Win32/Presenoker", p: "C:\\ProgramData\\Temp" },
              ].map((d) => (
                <div
                  key={d.n}
                  className="flex items-center justify-between rounded-[12px] border border-border bg-white px-4 py-3"
                >
                  <span>
                    <span className="block text-[14px] font-medium">{d.n}</span>
                    <span className="text-caption text-muted-foreground">{d.p}</span>
                  </span>
                  <Tag tone="error">Severe</Tag>
                </div>
              ))}
              <Btn
                size="sm"
                onClick={() => {
                  setScan("clean");
                  done("Antivirus");
                }}
              >
                Quarantine all detections
              </Btn>
            </div>
          )}
        </WindowFrame>
      )}

      {open === "safemode" && (
        <WindowFrame title="Advanced startup" icon={Power} onClose={() => setOpen(null)}>
          <div className="max-w-[650px] space-y-4">
            <p className="text-muted-foreground">
              Safe Mode starts Windows with a minimal set of drivers and services so a faulty
              startup component can be isolated.
            </p>
            <div className="space-y-2">
              {["Enable Safe Mode", "Enable Safe Mode with Networking", "Disable driver signature enforcement"].map(
                (o, i) => (
                  <button
                    key={o}
                    onClick={() => {
                      if (i === 0 || i === 1) {
                        setSafeMode(true);
                        done("Safe Mode");
                        setOpen(null);
                      }
                    }}
                    className="flex w-full items-center justify-between rounded-[12px] border border-border bg-white px-4 py-3 text-left transition-colors hover:bg-muted"
                  >
                    <span className="text-[15px]">
                      {i + 1}. {o}
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground" strokeWidth={1.8} />
                  </button>
                ),
              )}
            </div>
            {safeMode && (
              <Tag tone="success">Workstation is running in Safe Mode with minimal drivers</Tag>
            )}
          </div>
        </WindowFrame>
      )}

      {open === "restore" && (
        <WindowFrame title="System Restore" icon={History} onClose={() => setOpen(null)}>
          <p className="mb-4 max-w-[650px] text-muted-foreground">
            Select a restore point recorded before the workstation became unstable. Documents are not
            affected.
          </p>
          <div className="space-y-2">
            {restorePoints.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-[12px] border border-border bg-white px-4 py-3"
              >
                <span>
                  <span className="block text-[14px] font-medium">{r.label}</span>
                  <span className="text-caption text-muted-foreground">{r.date}</span>
                </span>
                <Btn
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setRestored(r.date);
                    setSafeMode(false);
                    done("System Restore");
                    setOpen(null);
                  }}
                >
                  Restore
                </Btn>
              </div>
            ))}
          </div>
        </WindowFrame>
      )}

      <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-between border-t border-white/10 bg-black/35 px-4 backdrop-blur">
        <div className="flex items-center gap-1.5">
          <span className="grid size-8 place-items-center rounded-[10px] bg-white/12">
            <Monitor className="size-4 text-white" strokeWidth={1.8} />
          </span>
          {appMeta.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setOpen(key)}
              title={label}
              className={cn(
                "grid size-8 place-items-center rounded-[10px] transition-colors",
                open === key ? "bg-primary" : "hover:bg-white/12",
              )}
            >
              <Icon className="size-4 text-white" strokeWidth={1.8} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-white/75">
          <Wifi className="size-4" strokeWidth={1.8} />
          <Volume2 className="size-4" strokeWidth={1.8} />
          <BatteryFull className="size-4" strokeWidth={1.8} />
          <span className="text-[12px]">10:24 · Workstation-14</span>
        </div>
      </div>
    </div>
  );
}
