const API_ROOT = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

function buildUrl(path: string) {
  if (path.startsWith("http")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_ROOT}${p}`;
}

function buildHeaders(token: string | null | undefined, init?: RequestInit): Headers {
  const h = new Headers(init?.headers);
  const isForm = init?.body instanceof FormData;
  if (!isForm && !h.has("Content-Type")) {
    h.set("Content-Type", "application/json");
  }
  if (token) {
    h.set("Authorization", `Bearer ${token}`);
  }
  return h;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, ...rest } = init;
  const res = await fetch(buildUrl(path), {
    ...rest,
    headers: buildHeaders(token, rest),
  });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }
  if (!res.ok) {
    const msg =
      typeof data === "object" && data && data !== null && "message" in data
        ? String((data as { message: string }).message)
        : res.statusText;
    throw new Error(msg || "Request failed");
  }
  return data as T;
}
