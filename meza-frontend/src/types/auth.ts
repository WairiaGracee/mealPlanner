export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  auth_provider: "email" | "google";
  date_joined: string;
  onboarding_completed: boolean;
  avatar_url: string | null;
}