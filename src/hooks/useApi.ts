import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTenantInfo,
  getSession,
  logout,
  getCategories,
  createRequest,
  getMyRequests,
  getRequest,
  getRequestTimeline,
  uploadRequestAttachment,
  getPublicIssues,
} from '../api/services';
import type { CreateRequestPayload } from '../types/api';

// Query keys
export const queryKeys = {
  tenantInfo: ['tenantInfo'] as const,
  session: ['session'] as const,
  categories: ['categories'] as const,
  myRequests: ['myRequests'] as const,
  request: (id: string) => ['request', id] as const,
  requestTimeline: (id: string) => ['requestTimeline', id] as const,
  publicIssues: (bbox: string) => ['publicIssues', bbox] as const,
};

// Tenant Info Hook
export const useTenantInfo = () => {
  return useQuery({
    queryKey: queryKeys.tenantInfo,
    queryFn: getTenantInfo,
    staleTime: Infinity, // Tenant info doesn't change during session
    retry: 3,
  });
};

// Session Hook
export const useSession = () => {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: getSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if not authenticated
  });
};

// Logout Hook
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear session cache
      queryClient.setQueryData(queryKeys.session, {
        authenticated: false,
        user: null,
      });
      // Redirect to home or show logged out state
      window.location.href = '/';
    },
  });
};

// Categories Hook
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create Request Hook
export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateRequestPayload) => createRequest(payload),
    onSuccess: () => {
      // Invalidate my requests list
      queryClient.invalidateQueries({ queryKey: queryKeys.myRequests });
    },
  });
};

// My Requests Hook
export const useMyRequests = () => {
  return useQuery({
    queryKey: queryKeys.myRequests,
    queryFn: getMyRequests,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Request Detail Hook
export const useRequest = (id: string) => {
  return useQuery({
    queryKey: queryKeys.request(id),
    queryFn: () => getRequest(id),
    enabled: !!id,
  });
};

// Request Timeline Hook
export const useRequestTimeline = (id: string) => {
  return useQuery({
    queryKey: queryKeys.requestTimeline(id),
    queryFn: () => getRequestTimeline(id),
    enabled: !!id,
  });
};

// Upload Attachment Hook
export const useUploadAttachment = () => {
  return useMutation({
    mutationFn: ({ requestId, file }: { requestId: string; file: File }) =>
      uploadRequestAttachment(requestId, file),
  });
};

// Public Issues Hook
export const usePublicIssues = (bbox: {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
} | null) => {
  const bboxString = bbox
    ? `${bbox.minLng},${bbox.minLat},${bbox.maxLng},${bbox.maxLat}`
    : null;

  return useQuery({
    queryKey: queryKeys.publicIssues(bboxString || ''),
    queryFn: () => getPublicIssues(bbox!),
    enabled: !!bbox,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
