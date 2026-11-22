import { DashboardOverview } from "../../../components/dashboard/DashboardOverview";

export default function TechnicianDashboardPage() {
  return (
    <DashboardOverview
      role="Technician"
      description="Manage your services and stay on top of customer requests."
      chartTitle="Your services"
    />
  );
}
