import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut } from "lucide-react";
import { Logo } from "@/components/site-chrome";
import { Avatar, Tag } from "@/components/kit";
import { cn } from "@/lib/utils";
import { course, instructor, student, useCampus } from "@/lib/campus";

export function RoleToggle() {
  const { role, setRole } = useCampus();
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
            navigate({ to: o.to });
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
  const { role, announcements } = useCampus();
  const person = role === "instructor" ? instructor : student;
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <Tag tone="neutral" className="hidden lg:inline-flex">
            {course.code} · {course.title}
          </Tag>
        </div>
        <div className="flex items-center gap-4">
          <RoleToggle />
          <span className="relative hidden sm:block">
            <Bell className="size-5 text-muted-foreground" strokeWidth={1.8} />
            {announcements.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary" />
            )}
          </span>
          <span className="hidden items-center gap-2.5 md:flex">
            <Avatar name={person.name} />
            <span className="text-[14px] font-medium">{person.name}</span>
          </span>
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
