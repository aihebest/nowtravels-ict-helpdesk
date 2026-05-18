import { HelpdeskApp } from "../../page";

export default function StaffRequestPage() {
  return (
    <HelpdeskApp
      initialAuthenticated
      initialActiveView="Tickets"
      initialCreateMode="Tickets"
      initialRole="Staff Requester"
    />
  );
}
