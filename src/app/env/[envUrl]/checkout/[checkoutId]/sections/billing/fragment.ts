import { graphql } from "gql.tada";

export const billingAddressTypesFragment = graphql(`
    fragment BillingAddress on Address @_unmask {
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
