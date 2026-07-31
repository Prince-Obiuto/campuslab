import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, Presentation } from "lucide-react";
import { Logo } from "@/components/site-chrome";
import { Panel, Tag } from "@/components/kit";
import { course, instructor, student, useCampus, type Role } from "@/lib/campus";

export const Route = createFileRoute("/role")({
  head: () => ({
    meta: [
      { title: "Select your role — CampusLab Virtual Laboratory" },
      {
        name: "description",
        content:
          "Continue into CampusLab as a student to join laboratory sessions, or as an instructor to schedule, supervise and assess practicals.",
      },
      { property: "og:title", content: "Select your role — CampusLab" },
      {
        property: "og:description",
        content: "Choose the student studio or the instructor console to enter CampusLab.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoleSelect,
});

const options: {
  role: Role;
  icon: typeof GraduationCap;
  title: string;
  who: string;
  detail: string;
  bullets: string[];
  to: "/student" | "/instructor";
}[] = [
  {
    role: "student",
    icon: GraduationCap,
    title: "Student",
    who: `${student.name} · ${student.matric}`,
    detail:
      "Register for practicals, review published manuals, join the live studio and work through the procedure on your own virtual workstation.",
    bullets: [
      "Upcoming and registered practicals",
      "Instructor resources and manuals",
      "Course performance over the semester",
    ],
    to: "/student",
  },
  {
    role: "instructor",
    icon: Presentation,
    title: "Instructor",
    who: `${instructor.name} · ${instructor.staffId}`,
    detail:
      "Schedule laboratory sessions, publish manuals, supervise every workstation in real time and assess practical performance as it happens.",
    bullets: [
      "Registered student roster",
      "Session control and live monitoring",
      "Grading and progress reports",
    ],
    to: "/instructor",
  },
];

function RoleSelect() {
  const { setRole } = useCampus();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-6">
        <Logo />
        <Tag tone="primary">
          {course.code} · {course.session}
        </Tag>
      </header>

      <main className="mx-auto max-w-[1000px] px-6 pt-16 pb-24">
        <h1 className="text-h3 font-bold tracking-[-0.015em] md:text-h2">
          How are you entering the laboratory today?
        </h1>
        <p className="measure mt-4 text-bodylg text-muted-foreground">
          Your selection determines the workspace you receive. You can switch roles at any time from
          the workspace header.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {options.map(({ role, icon: Icon, title, who, detail, bullets, to }) => (
            <Panel key={role} className="lift flex flex-col p-8">
              <span className="grid size-12 place-items-center rounded-[16px] bg-primary/10">
                <Icon className="size-5 text-primary" strokeWidth={1.8} />
              </span>
              <p className="mt-6 text-h3 font-bold tracking-[-0.01em]">{title}</p>
              <p className="mt-1 text-caption text-muted-foreground">{who}</p>
              <p className="mt-5 text-[17px] text-muted-foreground">{detail}</p>
              <ul className="mt-6 space-y-2 text-[15px]">
                {bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 border-t border-border pt-2.5">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  setRole(role);
                  navigate({ to });
                }}
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[16px] font-medium text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary"
              >
                Continue as {title.toLowerCase()} <ArrowRight className="size-4" strokeWidth={2} />
              </button>
            </Panel>
          ))}
        </div>
      </main>
    </div>
  );
}
