import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/site-chrome";
import { Avatar, Btn, Panel, Tag } from "@/components/kit";
import { cn } from "@/lib/utils";
import { useCampus, type Role } from "@/lib/campus";

export function RoleToggle() {
  const { role, setRole, profiles } = useCampus();
  const navigate = useNavigate();
  const options = [
    { key: "student" as const, label: "Student", to: "/student" as const },
    { key: "instructor" as const, label: "Instructor", to: "/instructor" as const },
  ];
  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-muted p-1">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => {
            setRole(o.key);
            navigate({ to: profiles[o.key] ? o.to : "/role" });
          }}
          className={cn(
            "h-8 rounded-full px-4 text-[14px] font-medium transition-all duration-200",
            role === o.key
              ? "bg-surface text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function WorkspaceHeader() {
  const { profile, announcements } = useCampus();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-6">
          <Logo />
          {profile?.course && (
            <Tag tone="neutral" className="hidden lg:inline-flex">
              {profile.course}
            </Tag>
          )}
        </div>
        <div className="flex items-center gap-4">
          <RoleToggle />
          <span className="relative hidden sm:block">
            <Bell className="size-5 text-muted-foreground" strokeWidth={1.8} />
            {announcements.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary" />
            )}
          </span>
          {profile && (
            <span className="hidden items-center gap-2.5 md:flex">
              <Avatar name={profile.name} />
              <span className="text-[14px] font-medium">{profile.name}</span>
            </span>
          )}
          <Link
            to="/"
            aria-label="Leave workspace"
            className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="size-4" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Blocks a workspace until a profile for that role has been created. */
export function ProfileGate({ role, children }: { role: Role; children: ReactNode }) {
  const { profiles } = useCampus();
  const navigate = useNavigate();
  if (profiles[role]) return <>{children}</>;
  return (
    <div className="min-h-screen">
      <WorkspaceHeader />
      <main className="mx-auto max-w-[720px] px-6 pt-24 pb-24">
        <Panel className="p-10 text-center">
          <h1 className="text-h3 font-bold tracking-[-0.015em]">
            There is no {role} profile yet
          </h1>
          <p className="measure mx-auto mt-4 text-[17px] text-muted-foreground">
            This workspace is intentionally empty until someone claims it. Create a {role} profile and
            everything here fills with your own sessions, resources and results.
          </p>
          <Btn size="lg" className="mt-8" onClick={() => navigate({ to: "/role" })}>
            Create a {role} profile
          </Btn>
        </Panel>
      </main>
    </div>
  );
}

/** Consistent empty state for panels that have nothing in them yet. */
export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[12px] border border-dashed border-border px-5 py-8 text-center">
      <p className="text-[15px] font-medium">{title}</p>
      <p className="measure mx-auto mt-1.5 text-caption text-muted-foreground">{body}</p>
    </div>
  );
}
