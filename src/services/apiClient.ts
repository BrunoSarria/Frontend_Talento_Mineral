import type { ApiError } from "../types/api";
import { API_BASE_URL } from "./config";

/**
 * Cliente HTTP fino, preparado para a futura API REST em Node.js/TypeScript.
 *
 * Nenhuma página ou componente deve chamar `fetch` diretamente — todos os
 * services dependem deste cliente (ou, hoje, da camada de mock em
 * `utils/mockDb.ts`). Isso garante que, quando USE_MOCK_API for desativado,
 * a troca ocorra inteiramente dentro dos services.
 */

function getToken(): string | null {
  try {
    return window.localStorage.getItem("talento-mineral:session-token");
  } catch {
    return null;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = "Ocorreu um erro inesperado. Tente novamente.";
    try {
      const data = await response.json();
      message = data?.message ?? message;
    } catch {
      // resposta sem corpo JSON
    }
    const error: ApiError = { status: response.status, message };
    throw error;
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
