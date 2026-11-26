import { requireDashboardUser } from "../../../lib/dashboard-api";
import { forwardToFixoraServer } from "../../../lib/fixora-server";

export async function GET(request: Request) {
  const access = await requireDashboardUser(request, ["technician", "admin"]);
  if (!access.user) return access.response;
  return forwardToFixoraServer(request, "/api/dashboard/services", access.user);
}

export async function POST(request: Request) {
  const access = await requireDashboardUser(request, ["technician"]);
  if (!access.user) return access.response;
  return forwardToFixoraServer(request, "/api/dashboard/services", access.user);
}
