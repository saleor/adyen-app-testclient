import Decimal from "decimal.js-light";

interface Price {
  getAmount(): number;
  getCurrency(): string;
}

/**
 * Represents a price in the Saleor system (amount is represented as float).
 */
export class SaleorPrice implements Price {
  private constructor(
    private amount: Decimal,
    private currency: string,
  ) {}

  getCurrency(): string {
    return this.currency;
  }

  static create(args: { amount: number; currency: string }) {
    return new SaleorPrice(new Decimal(args.amount), args.currency);
  }

  toAdyenPrice(): AdyenPrice {
    return AdyenPrice.create({
      currency: this.currency,
      amount: this.amount.times(100).toNumber(),
    });
  }

  getAmount(): number {
    return this.amount.toNumber();
  }
}

/**
 * Represents a price in the Adyen system (amount is represented as integer).
 */
export class AdyenPrice implements Price {
  private constructor(
    private amount: Decimal,
    private currency: string,
  ) {}

  static create(args: { amount: number; currency: string }) {
    return new AdyenPrice(new Decimal(args.amount), args.currency);
  }

  toSaleorPrice(): SaleorPrice {
    return SaleorPrice.create({
      currency: this.currency,
      amount: this.amount.dividedBy(100).toNumber(),
    });
  }

  getAmount(): number {
    return this.amount.toNumber();
  }

  getCurrency(): string {
    return this.currency;
  }
}
