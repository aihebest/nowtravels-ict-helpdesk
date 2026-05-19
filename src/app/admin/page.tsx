import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { HelpdeskApp } from "../page";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const role = (session.user as { role?: string }).role;

  // Only ICT Admins and ICT Supervisors can access the admin panel
  const adminRoles = ["ICT Admin", "ICT Supervisor"];
  if (!role || !adminRoles.includes(role)) {
    redirect("/staff");
  }

  return (
    <HelpdeskApp
      initialAuthenticated
      initialActiveView="Dashboard"
      initialRole={role}
    />
  );
}
