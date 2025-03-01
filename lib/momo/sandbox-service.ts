import axios from "axios";
import { BaseMoMoService } from "./base-service";
import { PaymentRequest, PaymentResponse } from "./types";
import { logger } from "./logger";
import { generateReferenceId } from "./utils";

export class SandboxMoMoService extends BaseMoMoService {
  protected async createApiUser(): Promise<string> {
    logger.debug("Creating sandbox API user");
    const referenceId = generateReferenceId();

    try {
      const response = await axios.post("/api/momo", {
        endpoint: "/v1_0/apiuser",
        data: { providerCallbackHost: this.config.callbackUrl },
        headers: {
          "X-Reference-Id": referenceId,
        },
      });

      if (response.status !== 201) {
        throw new Error(
          `Failed to create API user. Status: ${response.status}`
        );
      }

      logger.info("Sandbox API user created", {
        referenceId,
        status: response.status,
      });
      return referenceId;
    } catch (error) {
      logger.error("Failed to create sandbox API user", error);
      throw error;
    }
  }

  protected async createApiKey(apiUser: string): Promise<string> {
    try {
      const response = await axios.post("/api/momo", {
        endpoint: `/v1_0/apiuser/${apiUser}/apikey`,
        data: {},
        headers: {},
      });

      if (response.status !== 201) {
        throw new Error(`Failed to create API key. Status: ${response.status}`);
      }

      logger.info("API key created", { status: response.status });
      return response.data.apiKey;
    } catch (error) {
      logger.error("Failed to create API key", error);
      throw error;
    }
  }

  async requestPayment(request: PaymentRequest): Promise<void> {
    logger.debug("Requesting payment in sandbox", request);
    try {
      const token = await this.getValidToken();

      // Format phone number (remove non-digits)
      const formattedPhone = request.phoneNumber.replace(/\D/g, "");

      // Ensure amount is a string with proper format
      const amount =
        typeof request.amount === "number"
          ? request.amount.toString()
          : request.amount;

      const paymentRequest = {
        endpoint: "/collection/v1_0/requesttopay",
        data: {
          amount: amount,
          currency: request.currency || "EUR",
          externalId: request.referenceId,
          payer: {
            partyIdType: "MSISDN",
            partyId: formattedPhone,
          },
          payerMessage: request.message || "Payment request",
          payeeNote: request.payeeNote || "Payment request",
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Reference-Id": request.referenceId,
          "Ocp-Apim-Subscription-Key":"66dae406108a49988a9b860ee04d7886",
          "X-Target-Environment": "sandbox",
          "Content-Type": "application/json",
        },
      };

      logger.debug("Payment request details", paymentRequest);

      const response = await axios.post("/api/momo", paymentRequest);

      if (response.status !== 202) {
        throw new Error(`Payment request failed. Status: ${response.status}`);
      }

      logger.info("Payment request accepted", {
        referenceId: request.referenceId,
      });
    } catch (error) {
      logger.error("Payment request failed", error);
      throw error;
    }
  }

  async checkPaymentStatus(referenceId: string): Promise<PaymentResponse> {
    logger.debug("Checking payment status", { referenceId });
    try {
      const token = await this.getValidToken();
      const response = await axios.get("/api/momo", {
        params: {
          endpoint: `/collection/v1_0/requesttopay/${referenceId}`,
          headers: JSON.stringify({
            Authorization: `Bearer ${token}`,
            "X-Target-Environment": "sandbox",
          }),
        },
      });

      logger.info("Payment status retrieved", { status: response.data.status });
      return {
        status: response.data.status,
        referenceId: referenceId,
        message: response.data.reason,
      };
    } catch (error) {
      logger.error("Failed to check payment status", error);
      throw error;
    }
  }
}
