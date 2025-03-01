import axios from "axios";
import { logger } from "./logger";
import {
  MomoConfig,
  PaymentRequest,
  PaymentResponse,
  TokenResponse,
  ApiKeyResponse,
} from "./types";

export abstract class BaseMoMoService {
  protected token: string | null = null;
  protected tokenExpiry: number | null = null;

  constructor(protected readonly config: MomoConfig) {}

  protected abstract createApiUser(): Promise<string>;
  protected abstract createApiKey(apiUser: string): Promise<string>;

  protected async getNewToken(
    apiUser: string,
    apiKey: string
  ): Promise<string> {
    logger.debug("Getting new token", { apiUser });
    try {
      const credentials = Buffer.from(`${apiUser}:${apiKey}`).toString(
        "base64"
      );
      const response = await axios.post<TokenResponse>("/api/momo", {
        endpoint: "/collection/token/",
        data: {},
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error(`Failed to get token. Status: ${response.status}`);
      }

      logger.info("Token obtained successfully");
      this.token = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;
      return this.token;
    } catch (error) {
      logger.error("Failed to get token", error);
      throw error;
    }
  }

  protected async getValidToken(): Promise<string> {
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    const apiUser = await this.createApiUser();
    const apiKey = await this.createApiKey(apiUser);
    return this.getNewToken(apiUser, apiKey);
  }

  abstract requestPayment(request: PaymentRequest): Promise<void>;
  abstract checkPaymentStatus(referenceId: string): Promise<PaymentResponse>;
}
