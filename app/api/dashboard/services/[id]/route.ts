import { requireDashboardUser } from "../../../../lib/dashboard-api";
import { forwardToFixoraServer } from "../../../../lib/fixora-server";

type RouteContext = { params: Promise<{ id: string }> };

async function updateService(request: Request, context: RouteContext) {
  const access = await requireDashboardUser(request, ["technician", "admin"]);
  if (!access.user) return access.response;
  const { id } = await context.params;
  return forwardToFixoraServer(
    request,
    `/api/dashboard/services/${encodeURIComponent(id)}`,
    access.user,
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  return updateService(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  const access = await requireDashboardUser(request, ["technician"]);
  if (!access.user) return access.response;
  const { id } = await context.params;
  return forwardToFixoraServer(
    request,
    `/api/dashboard/services/${encodeURIComponent(id)}`,
    access.user,
  );
}
