"use client";

import { FragmentOf, graphql, readFragment } from "gql.tada";
import Image from "next/image";
import { useState } from "react";

import { ErrorToastDescription } from "@/components/error-toast-description";
import { FormButton } from "@/components/form-button";
import { toast } from "@/components/ui/use-toast";

import { createCheckout } from "../actions/create-checkout";

export const ProductFragment = graphql(`
  fragment Product on Product {
    id
    name
    thumbnail(size: 2048) {
      url
    }
    category {
      name
    }
    defaultVariant {
      id
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
`);

export const Cart = (props: {
  data: FragmentOf<typeof ProductFragment>[];
  envUrl: string;
  channelSlug: string;
}) => {
  const [loading, setLoading] = useState(false);
  const { envUrl, channelSlug, data } = props;
  const products = data.map((product) =>
    readFragment(ProductFragment, product),
  );

  const onClick = async () => {
    setLoading(true);
    const checkout = await createCheckout({
      envUrl,
      channelSlug,
      variantId: products[0].defaultVariant?.id ?? "",
    });

    if (checkout?.isErr()) {
      setLoading(false);
      return toast({
        title: `${checkout.error.name}: ${checkout.error.message}`,
        variant: "destructive",
        description: <ErrorToastDescription details={checkout.error.errors} />,
      });
    }

    setLoading(false);
    toast({
      title: "Successfully created checkout",
    });
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">Cart</h2>
      <div className="grid gap-4">
        {products?.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-[80px_1fr_80px] items-center gap-4"
          >
            <Image
              src={product.thumbnail?.url ?? ""}
              alt="Alt"
              width={80}
              height={80}
              className="aspect-square overflow-hidden rounded-lg border object-cover"
            />
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground">
                {product.category?.name}
              </p>
            </div>
            <div className="text-right">
              <div>Qty: 1</div>
              <div>
                {product.defaultVariant?.pricing?.price?.gross.amount}{" "}
                {product.defaultVariant?.pricing?.price?.gross.currency}
              </div>
            </div>
          </div>
        ))}
        <div className="grid">
          <FormButton
            type="submit"
            onClick={onClick}
            className="justify-self-end"
            loading={loading}
          >
            Create checkout
          </FormButton>
        </div>
      </div>
    </div>
  );
};
