import { SandboxMoMoService } from "./sandbox-service";
import { ProductionMoMoService } from "./production-service";
import { MomoConfig } from "./types";

const sandboxConfig: MomoConfig = {
  apiUrl: "https://sandbox.momodeveloper.mtn.com",
  subscriptionKey: process.env.MOMO_SANDBOX_SUBSCRIPTION_KEY!,
  environment: "sandbox",
  callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
};

const productionConfig: MomoConfig = {
  apiUrl: "https://api.momodeveloper.mtn.com",
  subscriptionKey: process.env.MOMO_PRODUCTION_SUBSCRIPTION_KEY!,
  environment: "production",
  callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
};

export const MoMoService =
  process.env.NODE_ENV === "production"
    ? new ProductionMoMoService(
        productionConfig,
        process.env.MOMO_API_USER!,
        process.env.MOMO_API_KEY!
      )
    : new SandboxMoMoService(sandboxConfig);
