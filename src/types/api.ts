import { z } from 'zod';

// Tenant Info Schema
export const TenantInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo_url: z.string().nullable().optional(),
  primary_color: z.string().nullable().optional(),
  commune_name: z.string().optional(),
});

export type TenantInfo = z.infer<typeof TenantInfoSchema>;

// Category Schema
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
});

export type Category = z.infer<typeof CategorySchema>;

export const CategoriesResponseSchema = z.array(CategorySchema);

// Session Schema
export const SessionSchema = z.object({
  authenticated: z.boolean(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().optional(),
  }).nullable().optional(),
});

export type Session = z.infer<typeof SessionSchema>;

// Request/Issue Schema
export const RequestStatusSchema = z.enum(['pending', 'in_progress', 'completed', 'rejected']);

export const RequestSchema = z.object({
  id: z.string(),
  category_id: z.string(),
  category_name: z.string().optional(),
  status: RequestStatusSchema,
  description: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  attachments: z.array(z.object({
    id: z.string(),
    url: z.string(),
    thumbnail_url: z.string().optional(),
  })).optional(),
});

export type Request = z.infer<typeof RequestSchema>;
export type RequestStatus = z.infer<typeof RequestStatusSchema>;

export const RequestsResponseSchema = z.array(RequestSchema);

// Timeline Schema
export const TimelineEventSchema = z.object({
  id: z.string(),
  request_id: z.string(),
  event_type: z.string(),
  description: z.string(),
  created_at: z.string(),
  user_name: z.string().optional(),
});

export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

export const TimelineResponseSchema = z.array(TimelineEventSchema);

// Public Issues Schema (for map)
export const PublicIssueSchema = z.object({
  id: z.string(),
  category_id: z.string(),
  category_name: z.string().optional(),
  status: RequestStatusSchema,
  latitude: z.number(),
  longitude: z.number(),
  created_at: z.string(),
});

export type PublicIssue = z.infer<typeof PublicIssueSchema>;

export const PublicIssuesResponseSchema = z.array(PublicIssueSchema);

// Create Request Payload
export const CreateRequestSchema = z.object({
  category_id: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type CreateRequestPayload = z.infer<typeof CreateRequestSchema>;
