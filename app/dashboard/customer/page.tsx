import { DashboardOverview } from "../../../components/dashboard/DashboardOverview";

export default function CustomerDashboardPage() {
  return (
    <DashboardOverview
      role="Customer"
      description="Track repair requests and see how your FIXORA jobs are progressing."
      chartTitle="Your requests"
    />
  );
}
