import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { HelpdeskApp, type UserRole } from "../page";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const role = (session.user as { role?: string }).role;

  // Only ICT Admins and ICT Supervisors can access the admin panel
  const adminRoles: UserRole[] = ["ICT Admin", "ICT Supervisor"];
  if (!role || !adminRoles.includes(role as UserRole)) {
    redirect("/staff");
  }

  return (
    <HelpdeskApp
      initialAuthenticated
      initialActiveView="Dashboard"
      initialRole={role as UserRole}
    />
  );
}
