import { isAxiosError } from 'axios';

export interface RequestFailure {
  status: number | null;
  offline: boolean;
}

const GATEWAY_ERRORS = [502, 503, 504];

export const toRequestFailure = (error: unknown): RequestFailure => {
  if (isAxiosError(error)) {
    const status = error.response?.status ?? null;
    return {
      status,
      offline: status === null || GATEWAY_ERRORS.includes(status),
    };
  }
  return { status: null, offline: false };
};
