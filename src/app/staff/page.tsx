import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { HelpdeskApp, type UserRole } from "../page";

export default async function StaffPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const role =
    ((session.user as { role?: string }).role as UserRole) ?? "Staff Requester";

  return (
    <HelpdeskApp
      initialAuthenticated
      initialActiveView="Tickets"
      initialRole={role}
    />
  );
}
