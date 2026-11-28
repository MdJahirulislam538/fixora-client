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
  const endpoint = `/api/${path.replace(/^\/+/, "")}`;
  let response: Response;

  try {
    response = await fetch(endpoint, { cache: "no-store", ...init });
  } catch (error) {
    if (init?.signal?.aborted) throw error;
    throw new Error(
      "Unable to contact the FIXORA services API. Please try again.",
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
