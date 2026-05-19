import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { HelpdeskApp } from "../page";

export default async function StaffPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const role = (session.user as { role?: string }).role ?? "Staff Requester";

  return (
    <HelpdeskApp
      initialAuthenticated
      initialActiveView="Tickets"
      initialRole={role}
    />
  );
}
