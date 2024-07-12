import { graphql } from "gql.tada";

export const shippingAddressTypesFragment = graphql(`
  fragment ShippingAddress on Address @_unmask {
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
