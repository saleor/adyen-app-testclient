import { graphql } from "gql.tada";

export const TotalPriceFragment = graphql(`
  fragment TotalPrice on TaxedMoney {
    gross {
      amount
      currency
    }
  }
`);
