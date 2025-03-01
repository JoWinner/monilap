import axios from "axios";
import { BaseMoMoService } from "./base-service";
import { MomoConfig, PaymentRequest, PaymentResponse } from "./types";

export class ProductionMoMoService extends BaseMoMoService {
  private readonly apiUser: string;
  private readonly apiKey: string;

  constructor(config: MomoConfig, apiUser: string, apiKey: string) {
    super(config);
    this.apiUser = apiUser;
    this.apiKey = apiKey;
  }

  protected async createApiUser(): Promise<string> {
    return this.apiUser;
  }

  protected async createApiKey(): Promise<string> {
    return this.apiKey;
  }

  async requestPayment(request: PaymentRequest): Promise<void> {
    const token = await this.getValidToken();
    await axios.post(
      `${this.config.apiUrl}/collection/v1_0/requesttopay`,
      {
        amount: request.amount.toString(),
        currency: request.currency || "EUR",
        externalId: request.referenceId,
        payer: {
          partyIdType: "MSISDN",
          partyId: request.phoneNumber,
        },
        payerMessage: request.message || "Payment",
        payeeNote: "MoneyLap Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Reference-Id": request.referenceId,
          "X-Target-Environment": "production",
          "Ocp-Apim-Subscription-Key": this.config.subscriptionKey,
        },
      }
    );
  }

  async checkPaymentStatus(referenceId: string): Promise<PaymentResponse> {
    const token = await this.getValidToken();
    const response = await axios.get(
      `${this.config.apiUrl}/collection/v1_0/requesttopay/${referenceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Target-Environment": "production",
          "Ocp-Apim-Subscription-Key": this.config.subscriptionKey,
        },
      }
    );
    return {
      status: response.data.status,
      referenceId: referenceId,
      message: response.data.reason,
    };
  }
}
