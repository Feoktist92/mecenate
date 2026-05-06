import { env } from '@/shared/config/env';

type QueryValue = string | number | boolean | null | undefined;
type RequestBody = Record<string, unknown> | undefined;

type ApiErrorPayload = {
  ok?: boolean;
  error?: {
    code?: string;
    message?: string;
  };
};

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(params: { message: string; status: number; code?: string }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code;
  }
}

const buildUrl = (path: string, query?: Record<string, QueryValue>): string => {
  const url = new URL(`${env.API_BASE_URL}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};

const apiRequest = async <T>({
  method,
  path,
  query,
  body,
}: {
  method: 'GET' | 'POST';
  path: string;
  query?: Record<string, QueryValue>;
  body?: RequestBody;
}): Promise<T> => {
  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      Authorization: `Bearer ${env.API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = (await response.json()) as T & ApiErrorPayload;

  if (!response.ok) {
    throw new ApiError({
      message: payload.error?.message || 'Request failed',
      status: response.status,
      code: payload.error?.code,
    });
  }

  return payload;
};

export const apiGet = async <T>(
  path: string,
  query?: Record<string, QueryValue>
): Promise<T> => {
  return apiRequest<T>({
    method: 'GET',
    path,
    query,
  });
};

export const apiPost = async <T>(
  path: string,
  body?: RequestBody
): Promise<T> =>
  apiRequest<T>({
    method: 'POST',
    path,
    body,
  });
