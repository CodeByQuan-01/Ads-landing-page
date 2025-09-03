export interface WhatsAppLinkState {
  link: string;
  loading: boolean;
  error: string | null;
}

export interface AdminAuthState {
  isAuthenticated: boolean;
  loading: boolean;
}
