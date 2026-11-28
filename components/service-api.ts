const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

export class ServiceApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ServiceApiError";
  }
}

export async function fetchServiceApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const endpoint = `${apiBaseUrl}/${path.replace(/^\/+/, "")}`;
  let response: Response;

  try {
    response = await fetch(endpoint, init);
  } catch (error) {
    if (init?.signal?.aborted) throw error;
    throw new Error(
      `Cannot connect to the FIXORA server at ${apiBaseUrl}. Make sure the backend is running.`,
    );
  }

  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      result &&
      typeof result === "object" &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : `The FIXORA server returned an error (${response.status}).`;
    throw new ServiceApiError(message, response.status);
  }

  return result as T;
}
