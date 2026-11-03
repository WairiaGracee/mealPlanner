import { api } from "./api";

export interface FeaturedReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  message: string;
}

export function getFeaturedReviews() {
  return api.get<FeaturedReview[]>("/reviews/");
}

export function submitReview(data: {
  name: string;
  location?: string;
  rating: number;
  message: string;
}) {
  return api.post<{ detail: string }>("/reviews/", data);
}