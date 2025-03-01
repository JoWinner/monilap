export interface MomoConfig {
  apiUrl: string;
  subscriptionKey: string;
  environment: "sandbox" | "production";
  callbackUrl?: string;
}

export interface PaymentRequest {
  amount: number | string;
  phoneNumber: string;
  referenceId: string;
  currency?: string;
  message?: string;
  payeeNote?: string;
}

export interface PaymentResponse {
  status: "PENDING" | "SUCCESSFUL" | "FAILED";
  referenceId: string;
  message?: string;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface ApiUserResponse {
  providerCallbackHost: string;
  targetEnvironment: string;
}

export interface ApiKeyResponse {
  apiKey: string;
}
