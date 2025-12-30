import { apiClient } from './client';
import type {
  TenantInfo,
  Session,
  Category,
  Request,
  TimelineEvent,
  PublicIssue,
  CreateRequestPayload,
} from '../types/api';
import {
  TenantInfoSchema,
  SessionSchema,
  CategoriesResponseSchema,
  RequestSchema,
  RequestsResponseSchema,
  TimelineResponseSchema,
  PublicIssuesResponseSchema,
} from '../types/api';

// Tenant API
export const getTenantInfo = async (): Promise<TenantInfo> => {
  const data = await apiClient.get<unknown>('/api/v1/public/tenant-info');
  return TenantInfoSchema.parse(data);
};

// Auth API
export const getSession = async (): Promise<Session> => {
  const data = await apiClient.get<unknown>('/api/v1/auth/session');
  return SessionSchema.parse(data);
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/api/v1/auth/logout');
};

// Categories API
export const getCategories = async (): Promise<Category[]> => {
  try {
    const data = await apiClient.get<unknown>('/api/v1/public/categories');
    return CategoriesResponseSchema.parse(data);
  } catch (error) {
    // TODO: Backend endpoint may not be ready yet - return empty array
    console.warn('Categories endpoint not available, returning empty array', error);
    return [];
  }
};

// Requests API
export const createRequest = async (payload: CreateRequestPayload): Promise<Request> => {
  const data = await apiClient.post<unknown>('/api/v1/requests', payload);
  return RequestSchema.parse(data);
};

export const getMyRequests = async (): Promise<Request[]> => {
  const data = await apiClient.get<unknown>('/api/v1/requests/mine');
  return RequestsResponseSchema.parse(data);
};

export const getRequest = async (id: string): Promise<Request> => {
  const data = await apiClient.get<unknown>(`/api/v1/requests/${id}`);
  return RequestSchema.parse(data);
};

export const getRequestTimeline = async (id: string): Promise<TimelineEvent[]> => {
  const data = await apiClient.get<unknown>(`/api/v1/requests/${id}/timeline`);
  return TimelineResponseSchema.parse(data);
};

export const uploadRequestAttachment = async (requestId: string, file: File): Promise<{ id: string; url: string }> => {
  // TODO: Backend may expect different format - adjust when endpoint is available
  return await apiClient.uploadFile<{ id: string; url: string }>(
    `/api/v1/requests/${requestId}/attachments`,
    file
  );
};

// Public Issues API (for map)
export const getPublicIssues = async (bbox: {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}): Promise<PublicIssue[]> => {
  const bboxString = `${bbox.minLng},${bbox.minLat},${bbox.maxLng},${bbox.maxLat}`;
  const data = await apiClient.get<unknown>('/api/v1/public/issues', {
    params: { bbox: bboxString },
  });
  return PublicIssuesResponseSchema.parse(data);
};
