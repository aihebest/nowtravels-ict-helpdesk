import { HelpdeskApp } from "../page";

export default function StaffPage() {
  return (
    <HelpdeskApp
      initialAuthenticated
      initialActiveView="Tickets"
      initialRole="Staff Requester"
    />
  );
}
