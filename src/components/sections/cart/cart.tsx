import { graphql } from "gql.tada";
import request from "graphql-request";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

type Props = {
  channelSlug: string | undefined | null;
  envUrl: string;
};

export const Cart = async ({ channelSlug, envUrl }: Props) => {
  const data = await request(envUrl, FetchProduct, {
    channelSlug: channelSlug ?? "",
  });

  console.log("Cart", data);

  return (
    <>
      <div>
        <h2 className="mb-2 text-2xl font-bold">Cart</h2>
        <div className="grid gap-4">
          {data.products?.edges.map((product) => (
            <div
              key={product.node.id}
              className="grid grid-cols-[80px_1fr_80px] items-center gap-4"
            >
              <Image
                src={product.node?.thumbnail?.url ?? ""}
                alt="Alt"
                width={80}
                height={80}
                className="aspect-square overflow-hidden rounded-lg border object-cover"
              />
              <div>
                <h3 className="font-medium">{product.node.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.node?.category?.name}
                </p>
              </div>
              <div className="text-right">
                <div>Qty: 1</div>
                <div>
                  {product.node.defaultVariant?.pricing?.price?.gross.amount}{" "}
                  {product.node.defaultVariant?.pricing?.price?.gross.currency}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg bg-muted/20 p-4">
        <div className="flex items-center justify-between">
          <div>Subtotal</div>
          <div>$149.98</div>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-between font-medium">
          <div>Total</div>
          <div>$149.98</div>
        </div>
      </div>
      <Button size="lg" className="w-full">
        Place Order
      </Button>
    </>
  );
};
