import { Link } from "@tanstack/react-router";
import { Circle } from "lucide-react";
import { BtnLink } from "@/components/kit";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="relative grid size-8 place-items-center rounded-full bg-foreground">
        <Circle className="size-3.5 text-primary-foreground" strokeWidth={3} />
      </span>
      <span
        className={`text-[21px] font-bold tracking-[-0.02em] ${light ? "text-primary-foreground" : "text-foreground"}`}
      >
        CampusLab
      </span>
    </Link>
  );
}

const links = [
  { label: "Solutions", to: "/" },
  { label: "Courses", to: "/" },
  { label: "Virtual Labs", to: "/" },
  { label: "Resources", to: "/" },
  { label: "About", to: "/" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-8 px-6">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-[15px] font-medium text-ink-soft transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/role"
            className="hidden text-[15px] font-medium text-ink-soft transition-colors hover:text-primary sm:block"
          >
            Sign in
          </Link>
          <BtnLink to="/role">Launch Lab</BtnLink>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-[1320px] px-6 pb-16">
      <div className="rounded-[32px] bg-foreground px-8 py-12 text-primary-foreground md:px-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo light />
            <p className="measure mt-5 text-[17px] text-white/70">
              An instructor-led virtual laboratory for higher institutions, built for practical
              courses that depend on supervision, collaboration and continuous assessment.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-[15px] text-white/70">
            {["Solutions", "Courses", "Virtual Labs", "Resources", "Accessibility", "Support"].map(
              (l) => (
                <span key={l} className="transition-colors hover:text-primary-foreground">
                  {l}
                </span>
              ),
            )}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/12 pt-6 text-caption text-white/50 md:flex-row md:justify-between">
          <span>© 2026 CampusLab. Faculty of Computing deployment.</span>
          <span>IFT 212 — Computer Architecture and Organization</span>
        </div>
      </div>
    </footer>
  );
}
