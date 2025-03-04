import { SandboxMoMoService } from "./sandbox-service";
import { ProductionMoMoService } from "./production-service";
import { MomoConfig } from "./types";

// Validate environment variables
const sandboxKey = process.env.NEXT_PUBLIC_MOMO_SANDBOX_SUBSCRIPTION_KEY;
if (!sandboxKey) {
  throw new Error("MOMO_SANDBOX_SUBSCRIPTION_KEY is not configured");
}

const sandboxConfig: MomoConfig = {
  apiUrl: "https://sandbox.momodeveloper.mtn.com",
  subscriptionKey: sandboxKey,
  environment: "sandbox",
  callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
};

const productionConfig: MomoConfig = {
  apiUrl: "https://api.momodeveloper.mtn.com",
  subscriptionKey: process.env.NEXT_PUBLIC_MOMO_PRODUCTION_SUBSCRIPTION_KEY!,
  environment: "production",
  callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
};

export const MoMoService =
  process.env.NODE_ENV === "production"
    ? new ProductionMoMoService(
        productionConfig,
        process.env.NEXT_PUBLIC_MOMO_API_USER!,
        process.env.NEXT_PUBLIC_MOMO_API_KEY!
      )
    : new SandboxMoMoService(sandboxConfig);
