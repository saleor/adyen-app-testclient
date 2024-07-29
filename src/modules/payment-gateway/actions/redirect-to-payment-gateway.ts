"use server";

import { redirect } from "next/navigation";

import { createPath } from "@/lib/utils";

export async function redirectToPaymentGateway(paymentGatewayId: string) {
  redirect(createPath("payment-gateway", paymentGatewayId));
}
