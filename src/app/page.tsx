"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  Gauge,
  History,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserRoundCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const metrics = [
  { label: "Open tickets", value: "42", change: "+8 today", icon: Inbox },
  { label: "SLA compliance", value: "94%", change: "Last 30 days", icon: Gauge },
  { label: "Avg. response", value: "28m", change: "High priority: 11m", icon: Clock3 },
  { label: "Branches covered", value: "7", change: "Centralized ICT", icon: Building2 },
];

type TicketRecord = {
  id: string;
  title: string;
  requester: string;
  branch: string;
  priority: string;
  status: string;
  assignee: string;
  due: string;
};

type TicketDraft = {
  title: string;
  requester: string;
  branch: string;
  priority: string;
  category: IssueCategory;
  description: string;
};

const initialTickets: TicketRecord[] = [
  {
    id: "NW-ICT-2026-000128",
    title: "Lagos warehouse scanners cannot sync shipment data",
    requester: "Amina Yusuf",
    branch: "Lagos Hub",
    priority: "High",
    status: "In Progress",
    assignee: "Victor Okafor",
    due: "42m",
  },
  {
    id: "NW-ICT-2026-000127",
    title: "Microsoft 365 password reset for dispatch supervisor",
    requester: "Chinedu Obi",
    branch: "Abuja Office",
    priority: "Medium",
    status: "Open",
    assignee: "Unassigned",
    due: "2h 15m",
  },
  {
    id: "NW-ICT-2026-000126",
    title: "Printer queue stuck at Port Harcourt branch",
    requester: "Grace Daniel",
    branch: "PH Branch",
    priority: "Low",
    status: "Resolved",
    assignee: "Mariam Bello",
    due: "Met",
  },
];

const branches = [
  { name: "Lagos Hub", open: 16, sla: "91%", load: "High" },
  { name: "Abuja Office", open: 9, sla: "96%", load: "Normal" },
  { name: "Kano Depot", open: 6, sla: "98%", load: "Normal" },
  { name: "PH Branch", open: 4, sla: "100%", load: "Low" },
];

const issueCatalog = {
  Printer: [
    "Cannot print",
    "Printer offline",
    "Paper jam",
    "Poor print quality",
  ],
  Network: [
    "No internet access",
    "VPN not working",
    "Slow connection",
    "WiFi issues",
  ],
  Software: [
    "App will not open",
    "Software crash",
    "License expired",
    "Need software installed",
  ],
  "Microsoft 365": [
    "Password reset",
    "Email not syncing",
    "Outlook not opening",
    "Teams meeting issue",
  ],
  Hardware: [
    "Laptop not powering on",
    "Keyboard or mouse issue",
    "Scanner not working",
    "Monitor display issue",
  ],
} as const;

type IssueCategory = keyof typeof issueCatalog;
const issueCategories = Object.keys(issueCatalog) as IssueCategory[];

const activities = [
  "NW-ICT-2026-000128 assigned to Victor Okafor",
  "SLA warning sent for Lagos Hub scanner issue",
  "Grace Daniel confirmed printer ticket resolution",
  "Microsoft 365 user sync completed successfully",
];

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Tickets", icon: LifeBuoy },
  { label: "Branches", icon: MapPin },
  { label: "Users", icon: Users },
  { label: "Reports", icon: FileText },
  { label: "Audit logs", icon: History },
];

const priorityStyles: Record<string, string> = {
  High: "bg-rose-50 text-rose-700 ring-rose-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const statusStyles: Record<string, string> = {
  Open: "bg-sky-50 text-sky-700 ring-sky-200",
  "In Progress": "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

type NavigationLabel = (typeof navigation)[number]["label"];
type CreateMode = Exclude<NavigationLabel, "Dashboard">;
type UserRole = "Staff Requester" | "ICT Admin";

const staffProfile = {
  name: "Amina Yusuf",
  branch: "Lagos Hub",
  department: "Operations",
};

const adminProfile = {
  name: "ICT Administrator",
  branch: "Central ICT",
  department: "ICT Operations",
};

const singularLabels: Record<CreateMode, string> = {
  Tickets: "ticket",
  Branches: "branch",
  Users: "user",
  Reports: "report",
  "Audit logs": "audit log",
};

const getModuleContent = (
  ticketRecords: TicketRecord[],
  userRole: UserRole,
): Record<
  Exclude<NavigationLabel, "Dashboard">,
  {
    title: string;
    description: string;
    recordTitle: string;
    recordDescription: string;
    icon: typeof LifeBuoy;
    stats: { label: string; value: string; detail: string }[];
    rows: { primary: string; secondary: string; meta: string }[];
  }
> => ({
  Tickets: {
    title:
      userRole === "Staff Requester"
        ? "My ticket environment"
        : "Ticket workspace",
    description:
      userRole === "Staff Requester"
        ? "Submit ICT requests, track progress, and view responses from the support team."
        : "Review every ICT request, assign ownership, update status, and monitor SLA commitments.",
    recordTitle:
      userRole === "Staff Requester" ? "My submitted tickets" : "Central ticket queue",
    recordDescription:
      userRole === "Staff Requester"
        ? "Status, priority, assigned ICT staff, and SLA timing for my requests."
        : "All branch requests with priority, ownership, status, and SLA visibility.",
    icon: LifeBuoy,
    stats:
      userRole === "Staff Requester"
        ? [
            {
              label: "My open tickets",
              value: String(
                ticketRecords.filter((ticket) => ticket.status !== "Closed")
                  .length,
              ),
              detail: "Submitted by me",
            },
            {
              label: "Waiting ICT",
              value: String(
                ticketRecords.filter((ticket) => ticket.status === "Open")
                  .length,
              ),
              detail: "Not yet resolved",
            },
            {
              label: "Resolved",
              value: String(
                ticketRecords.filter((ticket) => ticket.status === "Resolved")
                  .length,
              ),
              detail: "Ready for closure",
            },
          ]
        : [
            {
              label: "Open",
              value: String(
                ticketRecords.filter((ticket) => ticket.status !== "Closed")
                  .length,
              ),
              detail: "Across all branches",
            },
            {
              label: "High priority",
              value: String(
                ticketRecords.filter((ticket) => ticket.priority === "High")
                  .length,
              ),
              detail: "Needs close follow-up",
            },
            {
              label: "Unassigned",
              value: String(
                ticketRecords.filter(
                  (ticket) => ticket.assignee === "Unassigned",
                ).length,
              ),
              detail: "Awaiting triage",
            },
          ],
    rows: ticketRecords.map((ticket) => ({
      primary: `${ticket.id} - ${ticket.title}`,
      secondary: `${ticket.requester} - ${ticket.branch}`,
      meta: `${ticket.status} - ${ticket.priority} - ${ticket.assignee}`,
    })),
  },
  Branches: {
    title: "Branch support coverage",
    description:
      "Track ICT demand, SLA health, and operational pressure by company location.",
    recordTitle: "Branch records",
    recordDescription: "Configured operating locations and current support load.",
    icon: MapPin,
    stats: [
      { label: "Locations", value: "7", detail: "Configured branches" },
      { label: "Busiest branch", value: "Lagos", detail: "16 open tickets" },
      { label: "Best SLA", value: "PH", detail: "100% compliance" },
    ],
    rows: branches.map((branch) => ({
      primary: branch.name,
      secondary: `${branch.open} open tickets - ${branch.sla} SLA`,
      meta: branch.load,
    })),
  },
  Users: {
    title: "Users and access",
    description:
      "Manage employee profiles, branch assignment, ICT roles, and Microsoft 365-linked identities.",
    recordTitle: "User records",
    recordDescription: "Employees, support roles, branches, and access context.",
    icon: Users,
    stats: [
      { label: "Active users", value: "184", detail: "Synced from M365" },
      { label: "ICT agents", value: "8", detail: "Support team members" },
      { label: "Branch managers", value: "7", detail: "Scoped visibility" },
    ],
    rows: [
      {
        primary: "Amina Yusuf",
        secondary: "Operations - Lagos Hub",
        meta: "Employee",
      },
      {
        primary: "Victor Okafor",
        secondary: "ICT Support - Central ICT",
        meta: "ICT Agent",
      },
      {
        primary: "Mariam Bello",
        secondary: "ICT Support - Central ICT",
        meta: "ICT Agent",
      },
    ],
  },
  Reports: {
    title: "Reports and analytics",
    description:
      "Monitor trends, resolution performance, branch demand, and SLA compliance for management reporting.",
    recordTitle: "Report library",
    recordDescription: "Operational reports for ICT performance and management review.",
    icon: FileText,
    stats: [
      { label: "SLA compliance", value: "94%", detail: "Last 30 days" },
      { label: "Avg. resolution", value: "6h", detail: "All priorities" },
      { label: "Resolved", value: "128", detail: "This month" },
    ],
    rows: [
      {
        primary: "Monthly ICT workload report",
        secondary: "Tickets by branch, category, priority, and assignee",
        meta: "Ready",
      },
      {
        primary: "SLA compliance report",
        secondary: "First response and resolution performance",
        meta: "94%",
      },
      {
        primary: "Recurring issues report",
        secondary: "Top categories and repeated branch issues",
        meta: "Draft",
      },
    ],
  },
  "Audit logs": {
    title: "Audit logs",
    description:
      "View status changes, assignments, login events, comments, and administrative activity.",
    recordTitle: "Audit events",
    recordDescription: "Tracked system and ticket activity for accountability.",
    icon: History,
    stats: [
      { label: "Events today", value: "31", detail: "Tracked actions" },
      { label: "Ticket changes", value: "22", detail: "Status and assignment" },
      { label: "Admin changes", value: "3", detail: "Settings and roles" },
    ],
    rows: activities.map((activity) => ({
      primary: activity,
      secondary: "Captured in the ICT audit trail",
      meta: "Today",
    })),
  },
});

export function HelpdeskApp({
  initialAuthenticated = false,
  initialRole = "Staff Requester",
  initialActiveView,
  initialCreateMode = null,
}: {
  initialAuthenticated?: boolean;
  initialRole?: UserRole;
  initialActiveView?: NavigationLabel;
  initialCreateMode?: CreateMode | null;
}) {
  const [isAuthenticated] = useState(initialAuthenticated);
  const [userRole] = useState<UserRole>(initialRole);
  const [activeView, setActiveView] = useState<NavigationLabel>(
    initialActiveView ??
      (initialRole === "Staff Requester" ? "Tickets" : "Dashboard"),
  );
  const [createMode, setCreateMode] =
    useState<CreateMode | null>(initialCreateMode);
  const [ticketRecords, setTicketRecords] =
    useState<TicketRecord[]>(initialTickets);
  const visibleTicketRecords =
    userRole === "Staff Requester"
      ? ticketRecords.filter((ticket) => ticket.requester === staffProfile.name)
      : ticketRecords;
  const contentByView = getModuleContent(visibleTicketRecords, userRole);
  const availableNavigation =
    userRole === "Staff Requester"
      ? navigation.filter((item) => item.label === "Tickets")
      : navigation;
  const dashboardMetrics = metrics.map((metric) =>
    metric.label === "Open tickets"
      ? {
          ...metric,
          value: String(
            ticketRecords.filter((ticket) => ticket.status !== "Closed").length,
          ),
          change: "Live ticket queue",
        }
      : metric,
  );

  const handleCreateTicket = (draft: TicketDraft) => {
    setTicketRecords((currentTickets) => {
      const highestTicketNumber = currentTickets.reduce((highest, ticket) => {
        const numericId = Number(ticket.id.split("-").at(-1));
        return Number.isFinite(numericId) && numericId > highest
          ? numericId
          : highest;
      }, 0);

      const nextTicketNumber = String(highestTicketNumber + 1).padStart(6, "0");
      const due =
        draft.priority === "High"
          ? "30m"
          : draft.priority === "Medium"
            ? "2h"
            : "1d";

      return [
        {
          id: `NW-ICT-2026-${nextTicketNumber}`,
          title: draft.title,
          requester: draft.requester,
          branch: draft.branch,
          priority: draft.priority,
          status: "Open",
          assignee: "Unassigned",
          due,
        },
        ...currentTickets,
      ];
    });
    setActiveView("Tickets");
    setCreateMode(null);
  };

  const pageTitle =
    createMode === "Tickets"
      ? "New ticket request"
      : createMode
        ? `Add ${singularLabels[createMode]} record`
        : activeView === "Dashboard"
      ? "Ticketing command center"
      : contentByView[activeView].title;

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1f2933]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-stone-200 bg-[#102820] px-5 py-5 text-white lg:border-b-0">
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5">
              <Image
                src="/nowtravels-logo.jpg"
                alt="Nowtravels Travel and Tours logo"
                width={96}
                height={96}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f7c948]">
                Nowtravels
              </p>
              <h1 className="text-lg font-semibold">ICT Helpdesk</h1>
            </div>
          </div>

          <nav className="mt-8 grid gap-1">
            {availableNavigation.map((item) => (
              <button
                key={item.label}
                className={`flex h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-medium transition ${
                  activeView === item.label
                    ? "bg-white text-[#102820]"
                    : "text-stone-200 hover:bg-white/10"
                }`}
                onClick={() => {
                  setActiveView(item.label);
                  setCreateMode(null);
                }}
                type="button"
                title={item.label}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-6 rounded-lg border border-white/10 bg-white/8 p-4">
            <p className="text-sm font-semibold text-white">Signed in as</p>
            <div className="mt-3 text-sm leading-6 text-stone-200">
              <p className="font-semibold text-white">
                {userRole === "Staff Requester"
                  ? staffProfile.name
                  : adminProfile.name}
              </p>
              <p>
                {userRole === "Staff Requester"
                  ? `${staffProfile.department} - ${staffProfile.branch}`
                  : `${adminProfile.department} - ${adminProfile.branch}`}
              </p>
              <span className="mt-2 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold">
                {userRole}
              </span>
            </div>
            <Link
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-white/15 text-sm font-semibold text-white hover:bg-white/10"
              href="/"
            >
              <LogOut size={16} />
              Sign out
            </Link>
          </div>

          {userRole === "ICT Admin" ? (
          <div className="mt-8 rounded-lg border border-white/10 bg-white/8 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck size={18} className="text-[#f7c948]" />
              Microsoft 365 SSO
            </div>
            <p className="mt-2 text-sm leading-6 text-stone-200">
              Entra ID roles, Graph email alerts, and branch-aware access are
              planned into the core system.
            </p>
          </div>
          ) : null}
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Central ICT Operations
                </p>
                <div className="mt-1 flex items-center gap-3">
                  <div className="hidden size-11 items-center justify-center overflow-hidden rounded-md border border-stone-200 bg-white p-1.5 sm:flex">
                    <Image
                      src="/nowtravels-logo.jpg"
                      alt="Nowtravels logo"
                      width={72}
                      height={72}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-semibold text-[#102820] md:text-3xl">
                    {pageTitle}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex h-11 min-w-0 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-sm shadow-sm sm:w-80">
                  <Search size={17} className="text-stone-500" />
                  <input
                    className="min-w-0 flex-1 bg-transparent outline-none"
                    placeholder={
                      userRole === "Staff Requester"
                        ? "Search my tickets"
                        : "Search tickets, users, branches"
                    }
                  />
                </label>
                {userRole === "Staff Requester" ? (
                  <Link
                    className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#102820] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183b31]"
                    href="/staff/request"
                  >
                    <Plus size={18} />
                    Submit request
                  </Link>
                ) : (
                  <button
                    className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#102820] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183b31]"
                    onClick={() => {
                      setActiveView("Tickets");
                      setCreateMode("Tickets");
                    }}
                    type="button"
                  >
                    <Plus size={18} />
                    New ticket
                  </button>
                )}
              </div>
            </div>
          </header>

          {createMode ? (
            <CreateRecordView
              mode={createMode}
              onCancel={() => setCreateMode(null)}
              onCreateTicket={handleCreateTicket}
              userRole={userRole}
            />
          ) : activeView === "Dashboard" ? (
          <div className="grid gap-6 px-4 py-6 md:px-8 xl:grid-cols-[1fr_360px]">
            <div className="grid gap-6">
              <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                {dashboardMetrics.map((metric) => (
                  <article
                    key={metric.label}
                    className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-stone-500">
                        {metric.label}
                      </p>
                      <metric.icon size={20} className="text-[#2f6f5e]" />
                    </div>
                    <p className="mt-4 text-3xl font-semibold text-[#102820]">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {metric.change}
                    </p>
                  </article>
                ))}
              </section>

              <section className="rounded-lg border border-stone-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-stone-200 p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#102820]">
                      Active ticket queue
                    </h3>
                    <p className="text-sm text-stone-500">
                      Priority, assignment, SLA, and branch visibility.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex size-10 items-center justify-center rounded-md border border-stone-200 text-stone-600 hover:bg-stone-50"
                      title="Filter tickets"
                      type="button"
                    >
                      <Filter size={18} />
                    </button>
                    <button
                      className="flex size-10 items-center justify-center rounded-md border border-stone-200 text-stone-600 hover:bg-stone-50"
                      title="Queue settings"
                      type="button"
                    >
                      <SlidersHorizontal size={18} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px] text-left text-sm">
                    <thead className="bg-stone-50 text-xs uppercase text-stone-500">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Ticket</th>
                        <th className="px-5 py-3 font-semibold">Requester</th>
                        <th className="px-5 py-3 font-semibold">Branch</th>
                        <th className="px-5 py-3 font-semibold">Priority</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold">Owner</th>
                        <th className="px-5 py-3 font-semibold">SLA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {ticketRecords.map((ticket) => (
                        <tr key={ticket.id} className="align-top">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-[#102820]">
                              {ticket.id}
                            </p>
                            <p className="mt-1 max-w-xs text-stone-600">
                              {ticket.title}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-stone-700">
                            {ticket.requester}
                          </td>
                          <td className="px-5 py-4 text-stone-700">
                            {ticket.branch}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${priorityStyles[ticket.priority]}`}
                            >
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[ticket.status]}`}
                            >
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-stone-700">
                            {ticket.assignee}
                          </td>
                          <td className="px-5 py-4 font-medium text-[#2f6f5e]">
                            {ticket.due}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={20} className="text-[#2f6f5e]" />
                    <h3 className="text-lg font-semibold text-[#102820]">
                      Submit a ticket
                    </h3>
                  </div>
                  <QuickTicketForm
                    compact
                    defaultAffectedUser={
                      userRole === "Staff Requester" ? staffProfile.name : ""
                    }
                    lockedAffectedUser={userRole === "Staff Requester"}
                    onCreateTicket={handleCreateTicket}
                  />
                </article>

                <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Building2 size={20} className="text-[#2f6f5e]" />
                    <h3 className="text-lg font-semibold text-[#102820]">
                      Branch workload
                    </h3>
                  </div>
                  <div className="mt-5 grid gap-3">
                    {branches.map((branch) => (
                      <div
                        key={branch.name}
                        className="grid grid-cols-[1fr_auto] gap-3 rounded-md border border-stone-100 p-3"
                      >
                        <div>
                          <p className="font-medium text-[#102820]">
                            {branch.name}
                          </p>
                          <p className="text-sm text-stone-500">
                            {branch.open} open tickets - {branch.sla} SLA
                          </p>
                        </div>
                        <span className="self-center rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">
                          {branch.load}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            </div>

            <aside className="grid content-start gap-6">
              <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#102820]">
                    SLA watch
                  </h3>
                  <AlertTriangle size={20} className="text-amber-600" />
                </div>
                <div className="mt-5 space-y-4">
                  <div className="rounded-md bg-rose-50 p-4 text-sm">
                    <p className="font-semibold text-rose-800">
                      High priority due soon
                    </p>
                    <p className="mt-1 text-rose-700">
                      Lagos scanner sync issue needs update within 42 minutes.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md border border-stone-200 p-3">
                      <p className="text-2xl font-semibold text-[#102820]">
                        3
                      </p>
                      <p className="text-sm text-stone-500">At risk</p>
                    </div>
                    <div className="rounded-md border border-stone-200 p-3">
                      <p className="text-2xl font-semibold text-[#102820]">
                        0
                      </p>
                      <p className="text-sm text-stone-500">Breached today</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <UserRoundCheck size={20} className="text-[#2f6f5e]" />
                  <h3 className="text-lg font-semibold text-[#102820]">
                    ICT team
                  </h3>
                </div>
                <div className="mt-5 grid gap-3 text-sm">
                  {["Victor Okafor", "Mariam Bello", "Ifeanyi Nwosu"].map(
                    (name, index) => (
                      <div
                        key={name}
                        className="flex items-center justify-between rounded-md border border-stone-100 p-3"
                      >
                        <span className="font-medium">{name}</span>
                        <span className="text-stone-500">
                          {index === 0 ? "11" : index === 1 ? "8" : "6"} tickets
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </section>

              <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#102820]">
                    Activity stream
                  </h3>
                  <Bell size={20} className="text-[#2f6f5e]" />
                </div>
                <div className="mt-5 grid gap-4">
                  {activities.map((activity) => (
                    <div key={activity} className="flex gap-3">
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-[#2f6f5e]"
                      />
                      <p className="text-sm leading-6 text-stone-600">
                        {activity}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-stone-200 bg-[#102820] p-5 text-white shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-1.5">
                    <Image
                      src="/nowtravels-logo.jpg"
                      alt="Nowtravels logo"
                      width={80}
                      height={80}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex min-w-0 items-center gap-2">
                    <Mail size={20} className="shrink-0 text-[#f7c948]" />
                    <h3 className="text-lg font-semibold">Microsoft 365 ready</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-200">
                  The production build will connect Entra ID sign-in, Graph
                  mail alerts, shared mailbox notifications, and role mapping
                  from Microsoft 365 groups.
                </p>
              </section>
            </aside>
          </div>
          ) : (
            <ModuleView
              activeView={activeView}
              actionLabel={
                activeView === "Tickets"
                  ? userRole === "Staff Requester"
                    ? "Submit request"
                    : "New ticket"
                  : "Add record"
              }
              actionHref={
                userRole === "Staff Requester" && activeView === "Tickets"
                  ? "/staff/request"
                  : undefined
              }
              content={contentByView[activeView]}
              onAdd={() => setCreateMode(activeView)}
            />
          )}
        </section>
      </div>
    </main>
  );
}

export default function Home() {
  return <HelpdeskApp />;
}

function LoginScreen() {
  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1f2933]">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex min-h-[420px] flex-col justify-between bg-[#102820] p-6 text-white md:p-10">
          <div className="flex items-center gap-3">
            <div className="flex size-16 items-center justify-center overflow-hidden rounded-lg bg-white p-2">
              <Image
                src="/nowtravels-logo.jpg"
                alt="Nowtravels Travel and Tours logo"
                width={120}
                height={120}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f7c948]">
                Nowtravels
              </p>
              <h1 className="text-xl font-semibold">ICT Helpdesk</h1>
            </div>
          </div>

          <div className="max-w-xl py-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f7c948]">
              Secure support portal
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              Sign in to request ICT support
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-stone-200">
              Staff can submit requests and track their own tickets. ICT support
              users can access the full operational console.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/8 p-4 text-sm leading-6 text-stone-200">
            Microsoft 365 sign-in will be connected through Entra ID in the
            production stage.
          </div>
        </section>

        <section className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-md bg-[#eaf4ef] text-[#2f6f5e]">
                <ShieldCheck size={21} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#102820]">
                  Login
                </h2>
                <p className="text-sm text-stone-500">
                  Choose a demo access profile.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Link
                className="flex min-h-16 items-center justify-between rounded-md border border-stone-200 px-4 text-left transition hover:border-[#2f6f5e] hover:bg-[#f6fbf8]"
                href="/staff"
              >
                <span>
                  <span className="block font-semibold text-[#102820]">
                    Continue as staff
                  </span>
                  <span className="mt-1 block text-sm text-stone-500">
                  Submit and track my own tickets only
                  </span>
                </span>
                <LifeBuoy size={20} className="text-[#2f6f5e]" />
              </Link>

              <Link
                className="flex min-h-16 items-center justify-between rounded-md border border-stone-200 px-4 text-left transition hover:border-[#2f6f5e] hover:bg-[#f6fbf8]"
                href="/admin"
              >
                <span>
                  <span className="block font-semibold text-[#102820]">
                    Continue as ICT admin
                  </span>
                  <span className="mt-1 block text-sm text-stone-500">
                    Manage all tickets, users, reports, and audit logs
                  </span>
                </span>
                <ShieldCheck size={20} className="text-[#2f6f5e]" />
              </Link>
            </div>

            <div className="mt-6 rounded-md bg-stone-50 p-4 text-sm leading-6 text-stone-600">
              For now this is a local prototype login. Later, this screen will
              redirect to Microsoft 365 sign-in and apply roles automatically.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ModuleView({
  activeView,
  actionLabel,
  actionHref,
  content,
  onAdd,
}: {
  activeView: Exclude<NavigationLabel, "Dashboard">;
  actionLabel: string;
  actionHref?: string;
  content: ReturnType<typeof getModuleContent>[Exclude<
    NavigationLabel,
    "Dashboard"
  >];
  onAdd: () => void;
}) {
  return (
    <div className="grid gap-6 px-4 py-6 md:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#eaf4ef] text-[#2f6f5e]">
              <content.icon size={21} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#102820]">
                {content.title}
              </h3>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-stone-600">
                {content.description}
              </p>
            </div>
          </div>
          {actionHref ? (
            <Link
              className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#102820] px-4 text-sm font-semibold text-white hover:bg-[#183b31]"
              href={actionHref}
            >
              <Plus size={17} />
              {actionLabel}
            </Link>
          ) : (
            <button
              className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#102820] px-4 text-sm font-semibold text-white hover:bg-[#183b31]"
              onClick={onAdd}
              type="button"
            >
              <Plus size={17} />
              {actionLabel}
            </button>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {content.stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-stone-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-[#102820]">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-stone-500">{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-stone-200 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#102820]">
              {content.recordTitle}
            </h3>
            <p className="text-sm text-stone-500">{content.recordDescription}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="flex size-10 items-center justify-center rounded-md border border-stone-200 text-stone-600 hover:bg-stone-50"
              title={`Filter ${activeView}`}
              type="button"
            >
              <Filter size={18} />
            </button>
            <button
              className="flex size-10 items-center justify-center rounded-md border border-stone-200 text-stone-600 hover:bg-stone-50"
              title={`${activeView} settings`}
              type="button"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {content.rows.map((row) => (
            <article
              key={row.primary}
              className="grid gap-3 p-5 md:grid-cols-[1fr_180px] md:items-center"
            >
              <div>
                <p className="font-semibold text-[#102820]">{row.primary}</p>
                <p className="mt-1 text-sm text-stone-600">{row.secondary}</p>
              </div>
              <span className="w-fit rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700 md:justify-self-end">
                {row.meta}
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function QuickTicketForm({
  compact = false,
  defaultAffectedUser = "",
  lockedAffectedUser = false,
  onCreateTicket,
  onCancel,
}: {
  compact?: boolean;
  defaultAffectedUser?: string;
  lockedAffectedUser?: boolean;
  onCreateTicket?: (ticket: TicketDraft) => void;
  onCancel?: () => void;
}) {
  const [category, setCategory] = useState<IssueCategory>("Printer");
  const [issueTitle, setIssueTitle] = useState<string>(issueCatalog.Printer[0]);
  const [customIssueTitle, setCustomIssueTitle] = useState("");
  const [branch, setBranch] = useState("Lagos Hub");
  const [priority, setPriority] = useState("Medium");
  const [affectedUser, setAffectedUser] = useState(defaultAffectedUser);
  const [description, setDescription] = useState("");
  const issueOptions = [...issueCatalog[category], "Other"];

  return (
    <form
      className={`${compact ? "mt-5" : "mt-6"} grid gap-5`}
      onSubmit={(event) => {
        event.preventDefault();
        const finalTitle =
          issueTitle === "Other" ? customIssueTitle.trim() : issueTitle;

        if (!finalTitle || !affectedUser.trim()) {
          return;
        }

        onCreateTicket?.({
          title: finalTitle,
          requester: affectedUser.trim(),
          branch,
          priority,
          category,
          description,
        });

        setIssueTitle(issueCatalog[category][0]);
        setCustomIssueTitle("");
        setAffectedUser(defaultAffectedUser);
        setDescription("");
      }}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-stone-700">
          Category
          <select
            id="ticket-category"
            className="h-11 rounded-md border border-stone-200 px-3 text-sm font-normal outline-none focus:border-[#2f6f5e]"
            onChange={(event) => {
              const nextCategory = event.target.value as IssueCategory;
              setCategory(nextCategory);
              setIssueTitle(issueCatalog[nextCategory][0]);
              setCustomIssueTitle("");
            }}
            value={category}
          >
            {issueCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-stone-700">
          Issue title
          <select
            id="ticket-issue-title"
            className="h-11 rounded-md border border-stone-200 px-3 text-sm font-normal outline-none focus:border-[#2f6f5e]"
            onChange={(event) => setIssueTitle(event.target.value)}
            value={issueTitle}
          >
            {issueOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      {issueTitle === "Other" ? (
        <label className="grid gap-2 text-sm font-medium text-stone-700">
          Custom issue title
          <input
            id="ticket-custom-issue-title"
            className="h-11 rounded-md border border-stone-200 px-3 text-sm font-normal outline-none focus:border-[#2f6f5e]"
            onChange={(event) => setCustomIssueTitle(event.target.value)}
            placeholder="Type the issue in a few words"
            value={customIssueTitle}
          />
        </label>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-stone-700">
          Branch
          <select
            id="ticket-branch"
            className="h-11 rounded-md border border-stone-200 px-3 text-sm font-normal outline-none focus:border-[#2f6f5e]"
            onChange={(event) => setBranch(event.target.value)}
            value={branch}
          >
            <option>Lagos Hub</option>
            <option>Abuja Office</option>
            <option>Kano Depot</option>
            <option>PH Branch</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-stone-700">
          Priority
          <select
            id="ticket-priority"
            className="h-11 rounded-md border border-stone-200 px-3 text-sm font-normal outline-none focus:border-[#2f6f5e]"
            onChange={(event) => setPriority(event.target.value)}
            value={priority}
          >
            <option>Medium</option>
            <option>High</option>
            <option>Low</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-stone-700">
        Affected user
        <input
          id="ticket-affected-user"
          className="h-11 rounded-md border border-stone-200 px-3 text-sm font-normal outline-none focus:border-[#2f6f5e] disabled:bg-stone-50 disabled:text-stone-600"
          disabled={lockedAffectedUser}
          onChange={(event) => setAffectedUser(event.target.value)}
          placeholder="Enter user's full name"
          value={affectedUser}
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-stone-700">
        Description
        <textarea
          id="ticket-description"
          className={`${compact ? "min-h-28" : "min-h-36"} rounded-md border border-stone-200 p-3 text-sm font-normal outline-none focus:border-[#2f6f5e]`}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add useful details such as error message, location, or business impact"
          value={description}
        />
      </label>

      <div className="flex flex-col gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="flex h-10 items-center justify-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
          type="button"
        >
          <Paperclip size={17} />
          Add attachment
        </button>
        <div className="flex gap-3">
          {onCancel ? (
            <button
              className="h-10 rounded-md border border-stone-200 px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
          ) : null}
          <button
            className="h-10 rounded-md bg-[#f7c948] px-4 text-sm font-semibold text-[#102820] hover:bg-[#f5bd1f]"
            type="submit"
          >
            Generate ticket
          </button>
        </div>
      </div>
    </form>
  );
}

function CreateRecordView({
  mode,
  onCancel,
  onCreateTicket,
  userRole,
}: {
  mode: CreateMode;
  onCancel: () => void;
  onCreateTicket: (ticket: TicketDraft) => void;
  userRole: UserRole;
}) {
  if (mode === "Tickets") {
    return (
      <div className="grid gap-6 px-4 py-6 md:px-8 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-[#2f6f5e]" />
            <h3 className="text-xl font-semibold text-[#102820]">
              New ICT ticket
            </h3>
          </div>

          <QuickTicketForm
            defaultAffectedUser={
              userRole === "Staff Requester" ? staffProfile.name : ""
            }
            lockedAffectedUser={userRole === "Staff Requester"}
            onCancel={onCancel}
            onCreateTicket={onCreateTicket}
          />
        </section>

        <aside className="grid content-start gap-6">
          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#102820]">
              Ticket preview
            </h3>
            <div className="mt-5 grid gap-3 text-sm">
              <div className="rounded-md bg-stone-50 p-3">
                <p className="font-semibold text-[#102820]">
                  NW-ICT-2026-000129
                </p>
                <p className="mt-1 text-stone-500">Auto-generated on submit</p>
              </div>
              <div className="rounded-md border border-stone-100 p-3">
                <p className="font-medium text-stone-700">Default SLA</p>
                <p className="mt-1 text-stone-500">
                  Medium priority: 1 hour response, 8 hours resolution
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    );
  }

  const label = singularLabels[mode];

  return (
    <div className="grid gap-6 px-4 py-6 md:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Plus size={20} className="text-[#2f6f5e]" />
          <h3 className="text-xl font-semibold text-[#102820]">
            Add {label} record
          </h3>
        </div>

        <form className="mt-6 grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-stone-700">
              Name
              <input className="h-11 rounded-md border border-stone-200 px-3 text-sm font-normal outline-none focus:border-[#2f6f5e]" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-stone-700">
              Owner
              <input className="h-11 rounded-md border border-stone-200 px-3 text-sm font-normal outline-none focus:border-[#2f6f5e]" />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Notes
            <textarea className="min-h-32 rounded-md border border-stone-200 p-3 text-sm font-normal outline-none focus:border-[#2f6f5e]" />
          </label>
          <div className="flex justify-end gap-3 border-t border-stone-100 pt-5">
            <button
              className="h-10 rounded-md border border-stone-200 px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              className="h-10 rounded-md bg-[#102820] px-4 text-sm font-semibold text-white hover:bg-[#183b31]"
              type="button"
            >
              Save record
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
