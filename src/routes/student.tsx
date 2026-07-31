import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
import { Avatar, Btn, Dot, Meter, Panel, Tag } from "@/components/kit";
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
  component: StudentDashboard;
});

function StudentDashboard() {
  return null;
}
