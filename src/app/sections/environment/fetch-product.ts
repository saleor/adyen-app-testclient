import { graphql } from "gql.tada";
import request from "graphql-request";

const FetchProduct = graphql(`
  query FetchProduct($channelSlug: String!) {
    products(
      first: 1
      channel: $channelSlug
      filter: {
        isPublished: true
        stockAvailability: IN_STOCK
        giftCard: false
      }
      sortBy: { field: PRICE, direction: DESC }
    ) {
      edges {
        node {
          id
          name
          thumbnail(size: 2048) {
            url
            alt
          }
          category {
            name
          }
          channel
          defaultVariant {
            id
            name
            pricing {
              price {
                gross {
                  amount
                  currency
                }
              }
            }
          }
        }
      }
    }
  }
`);

export const fetchProduct = async ({
  channelSlug,
  envUrl,
}: {
  channelSlug: string;
  envUrl: string;
}) => {
  const data = await request(envUrl, FetchProduct, {
    channelSlug,
  });
  console.log("products", data);

  //   revalidatePath("/");

  return data;
};
