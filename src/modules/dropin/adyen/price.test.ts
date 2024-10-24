import { describe, expect, it } from "vitest";

import { AdyenPrice, SaleorPrice } from "./price";

describe("SaleorPrice", () => {
  it("should create AdyenPrice with amounts in integers from SaleorPrice", () => {
    const saleorPrice = SaleorPrice.create({ amount: 100.11, currency: "USD" });
    const adyenPrice = saleorPrice.toAdyenPrice();

    expect(adyenPrice.getAmount()).toBe(10011);
  });
});

describe("AdyenPrice", () => {
  it("should create SaleorPrice with amounts in float from AdyenPrice", () => {
    const adyenPrice = AdyenPrice.create({ amount: 10011, currency: "USD" });
    const saleorPrice = adyenPrice.toSaleorPrice();

    expect(saleorPrice.getAmount()).toBe(100.11);
  });
});
