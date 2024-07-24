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

export const shippingMethodTypesFragment = graphql(`
  fragment ShippingMethod on ShippingMethod @_unmask {
    id
    name
    price {
      amount
      currency
    }
  }
`);
