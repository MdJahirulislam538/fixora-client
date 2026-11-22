import { getAuthHandlers } from "../../../lib/auth";

export function GET(request: Request) {
  return getAuthHandlers().GET(request);
}

export function POST(request: Request) {
  return getAuthHandlers().POST(request);
}