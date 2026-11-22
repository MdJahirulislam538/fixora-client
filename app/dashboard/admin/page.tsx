import { DashboardOverview } from "../../../components/dashboard/DashboardOverview";

export default function AdminDashboardPage() {
  return (
    <DashboardOverview
      role="Admin"
      description="Monitor FIXORA activity, users, and services awaiting approval."
      chartTitle="Platform bookings"
    />
  );
}
