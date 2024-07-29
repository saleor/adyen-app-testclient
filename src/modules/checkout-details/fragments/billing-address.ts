import { graphql } from "gql.tada";

export const BillingAddressFragment = graphql(`
  fragment BillingAddress on Address {
    firstName
    lastName
    streetAddress1
    city
    postalCode
    country {
      code
    }
    countryArea
  }
`);
