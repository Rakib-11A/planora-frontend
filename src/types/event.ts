/**
 * Computed label from `isPublic` + `isPaid` on the backend (`EventTypeLabel`).
 * This is what event APIs attach as `eventType`.
 */
export type EventTypeLabel = 'PUBLIC_FREE' | 'PUBLIC_PAID' | 'PRIVATE_FREE' | 'PRIVATE_PAID';

/**
 * Mirrors Prisma `EventType` enum. **Not** serialized as a field on event JSON —
 * visibility is represented by `isPublic` on {@link Event}.
 */
export enum EventType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

/**
 * Backend uses soft delete (`deletedAt` on the Prisma model). There is no
 * `EventStatus` enum in the schema; use this helper for client-side branching.
 */
export type EventSoftDelete = {
  deletedAt: string | null;
};

export interface EventCreator {
  id: string;
  name: string;
  email: string;
}

/**
 * Event fields as returned by the API (`EventSafe` + aggregates).
 * `fee` may arrive as a string (decimal JSON) or number depending on serialization.
 * `dateTime` is an ISO string over the wire.
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  venue: string;
  isPublic: boolean;
  isPaid: boolean;
  fee: string | number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  avgRating: number;
  totalReviews: number;
  participationCount: number;
  createdBy: EventCreator;
}

export interface EventWithType extends Event {
  eventType: EventTypeLabel;
}

/** Same as {@link EventWithType} — participant volume is `participationCount`. */
export type EventWithParticipants = EventWithType;

/**
 * Matches `createEventSchema` / `CreateEventInput`.
 * At least one of `fee` / default applies on the server when omitted.
 */
export interface CreateEventDto {
  title: string;
  description: string;
  dateTime: string | Date;
  venue: string;
  isPublic: boolean;
  isPaid: boolean;
  fee?: number;
}

/**
 * Matches `updateEventSchema` / `UpdateEventInput`.
 * Runtime requires at least one field — TypeScript cannot enforce that here.
 */
export interface UpdateEventDto {
  title?: string;
  description?: string;
  dateTime?: string | Date;
  venue?: string;
  isPublic?: boolean;
  isPaid?: boolean;
  fee?: number;
}
