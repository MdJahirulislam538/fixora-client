import { requireDashboardUser } from "../../../../../lib/dashboard-api";
import { forwardToFixoraServer } from "../../../../../lib/fixora-server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requireDashboardUser(request, ["customer"]);
  if (!access.user) return access.response;
  const { id } = await context.params;
  return forwardToFixoraServer(
    request,
    `/api/dashboard/bookings/${encodeURIComponent(id)}/checkout`,
    access.user,
  );
}
