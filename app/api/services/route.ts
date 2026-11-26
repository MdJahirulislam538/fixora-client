import { forwardToFixoraServer } from "../../lib/fixora-server";

export async function GET(request: Request) {
  return forwardToFixoraServer(request, "/api/services");
}
