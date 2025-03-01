type LogLevel = "debug" | "info" | "error";

export const logger = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEBUG] 🔍 ${message}`, data || "");
    }
  },
  info: (message: string, data?: any) => {
    console.log(`[INFO] ℹ️ ${message}`, data || "");
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ❌ ${message}`, error || "");
  },
};
