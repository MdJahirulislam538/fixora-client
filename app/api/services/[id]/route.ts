import { forwardToFixoraServer } from "../../../lib/fixora-server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return forwardToFixoraServer(
    request,
    `/api/services/${encodeURIComponent(id)}`,
  );
}
