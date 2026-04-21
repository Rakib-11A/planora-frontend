/** Review row returned by `GET /api/events/:eventId/reviews`. */
export interface EventReviewItem {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
}
