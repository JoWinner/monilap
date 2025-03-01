import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { logger } from "@/lib/momo/logger";

const MOMO_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.momodeveloper.mtn.com"
    : "https://sandbox.momodeveloper.mtn.com";

const SUBSCRIPTION_KEY =
  process.env.NODE_ENV === "production"
    ? process.env.MOMO_PRODUCTION_SUBSCRIPTION_KEY
    : process.env.MOMO_SANDBOX_SUBSCRIPTION_KEY;

if (!SUBSCRIPTION_KEY) {
  throw new Error("MOMO subscription key not configured");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, data, headers } = body;

    const requestHeaders = {
      ...headers,
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
    };

    logger.debug("MTN API Request", {
      url: `${MOMO_BASE_URL}${endpoint}`,
      method: "POST",
      headers: requestHeaders,
      data,
    });

    const response = await axios({
      method: "POST",
      url: `${MOMO_BASE_URL}${endpoint}`,
      data,
      headers: requestHeaders,
      validateStatus: null, // Allow any status code
    });

    logger.debug("MTN API Response", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });

    // Return response maintaining the original status code
    return NextResponse.json(response.data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    logger.error("MTN API Error", {
      message: error.message,
      response: error.response?.data,
    });

    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get("endpoint");
    const headers = JSON.parse(searchParams.get("headers") || "{}");

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      );
    }

    const response = await axios({
      method: "GET",
      url: `${MOMO_BASE_URL}${endpoint}`,
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
      },
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error: any) {
    console.error("MoMo API Error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: error.response?.data || "Internal server error",
        details: error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
