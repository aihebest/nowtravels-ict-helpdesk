import { HelpdeskApp } from "../page";

export default function AdminPage() {
  return (
    <HelpdeskApp
      initialAuthenticated
      initialActiveView="Dashboard"
      initialRole="ICT Admin"
    />
  );
}
