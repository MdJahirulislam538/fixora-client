import { requireDashboardUser } from "../../../lib/dashboard-api";
import { forwardToFixoraServer } from "../../../lib/fixora-server";

export async function GET(request: Request) {
  const access = await requireDashboardUser(request, ["customer", "admin"]);
  if (!access.user) return access.response;
  return forwardToFixoraServer(request, "/api/dashboard/payments", access.user);
}
