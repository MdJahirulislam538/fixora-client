import { requireDashboardUser } from "../../../../lib/dashboard-api";
import { forwardToFixoraServer } from "../../../../lib/fixora-server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const access = await requireDashboardUser(request, ["technician"]);
  if (!access.user) return access.response;
  const { id } = await context.params;
  return forwardToFixoraServer(
    request,
    `/api/dashboard/requests/${encodeURIComponent(id)}`,
    access.user,
  );
}
