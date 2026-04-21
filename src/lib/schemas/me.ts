import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const participationStatusSchema = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
  'BANNED',
]);

export const eventSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  dateTime: z.string(),
  venue: z.string(),
  isPublic: z.boolean(),
  isPaid: z.boolean(),
  fee: z.union([z.string(), z.number()]),
  createdById: z.string(),
});

export const myParticipationItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  eventId: z.string(),
  status: participationStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  event: eventSummarySchema,
});

export const myParticipationsResponseSchema = z.object({
  items: z.array(myParticipationItemSchema),
  pagination: paginationSchema,
});

export type MyParticipationItem = z.infer<typeof myParticipationItemSchema>;

export const eventParticipantRowSchema = z.object({
  id: z.string(),
  userId: z.string(),
  eventId: z.string(),
  status: participationStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    avatar: z.string().nullable(),
    role: z.string(),
  }),
});

export const eventParticipantsListSchema = z.array(eventParticipantRowSchema);

export type EventParticipantRow = z.infer<typeof eventParticipantRowSchema>;

export const invitationStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED']);

export const myInvitationSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  inviterId: z.string(),
  inviteeId: z.string(),
  status: invitationStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  event: eventSummarySchema,
  inviter: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
});

export type MyInvitation = z.infer<typeof myInvitationSchema>;

export const myInvitationsListSchema = z.array(myInvitationSchema);

export const eventInvitationRowSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  inviterId: z.string(),
  inviteeId: z.string(),
  status: invitationStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  invitee: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    avatar: z.string().nullable(),
    role: z.string(),
  }),
});

export type EventInvitationRow = z.infer<typeof eventInvitationRowSchema>;

export const eventInvitationsListSchema = z.array(eventInvitationRowSchema);

export const paymentStatusSchema = z.enum([
  'PENDING',
  'INITIATED',
  'SUCCESS',
  'COMPLETED',
  'REFUNDED',
]);

export const myPaymentItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  eventId: z.string(),
  participationId: z.string(),
  amount: z.union([z.string(), z.number()]),
  status: paymentStatusSchema,
  provider: z.string(),
  transactionId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  event: eventSummarySchema,
});

export const myPaymentsResponseSchema = z.object({
  items: z.array(myPaymentItemSchema),
  pagination: paginationSchema,
});

export type MyPaymentItem = z.infer<typeof myPaymentItemSchema>;

export const notificationItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  metadata: z.unknown().nullable(),
  createdAt: z.string(),
});

export const myNotificationsResponseSchema = z.object({
  items: z.array(notificationItemSchema),
  pagination: paginationSchema,
});

export type NotificationItem = z.infer<typeof notificationItemSchema>;

export const initiatePaymentResponseSchema = z.object({
  paymentId: z.string(),
  paymentUrl: z.string(),
  status: z.string(),
});

export type InitiatePaymentResult = z.infer<typeof initiatePaymentResponseSchema>;
