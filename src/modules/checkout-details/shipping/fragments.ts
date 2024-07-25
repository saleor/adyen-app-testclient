import { graphql } from "gql.tada";

export const ShippingAddressFragment = graphql(`
  fragment ShippingAddress on Address {
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

export const ShippingMethodFragment = graphql(`
  fragment ShippingMethod on ShippingMethod {
    id
    name
    price {
      amount
      currency
    }
  }
`);
