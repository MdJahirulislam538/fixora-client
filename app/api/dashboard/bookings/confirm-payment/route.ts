import { requireDashboardUser } from "../../../../lib/dashboard-api";
import { forwardToFixoraServer } from "../../../../lib/fixora-server";

export async function POST(request: Request) {
  const access = await requireDashboardUser(request, ["customer"]);
  if (!access.user) return access.response;
  return forwardToFixoraServer(
    request,
    "/api/dashboard/bookings/confirm-payment",
    access.user,
  );
}
