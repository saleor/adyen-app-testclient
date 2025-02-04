"use client";

import { type FragmentOf, readFragment } from "gql.tada";
import Image from "next/image";
import { useTransition } from "react";

import { FormButton } from "@/components/form-button";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { env } from "@/env";
import { analytics } from "@/lib/segment";

import { createCheckout } from "../actions/create-checkout";
import { loginToSaleor } from "../actions/login-to-saleor";
import { ProductFragment } from "../fragments";

export const Cart = (props: {
  data: FragmentOf<typeof ProductFragment>[];
  envUrl: string;
  channelSlug: string;
}) => {
  const [isPending, startTransition] = useTransition();

  const { envUrl, channelSlug, data } = props;
  const products = data.map((product) =>
    readFragment(ProductFragment, product),
  );

  const onClick = async () => {
    startTransition(async () => {
      const response = await createCheckout({
        envUrl,
        channelSlug,
        variantId: products[0]?.defaultVariant?.id ?? "",
        email: env.NEXT_PUBLIC_STOREFRONT_USER_EMAIL,
      });

      if (response?.serverError) {
        toast({
          title: response.serverError.name,
          variant: "destructive",
          description: response.serverError.message,
        });
      }

      if (response?.data) {
        toast({
          title: "Successfully created checkout",
        });
      }
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
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              const response = await loginToSaleor({
                envUrl,
                email: env.NEXT_PUBLIC_STOREFRONT_USER_EMAIL,
                password: env.NEXT_PUBLIC_STOREFRONT_USER_PASSWORD,
              });

              if (response?.serverError) {
                toast({
                  title: response.serverError.name,
                  variant: "destructive",
                  description: response.serverError.message,
                });
              }

              if (response?.data?.tokenCreate?.errors) {
                toast({
                  title: `${response.data.tokenCreate.errors.map((error) => error.code).join(", ")}`,
                  variant: "destructive",
                  description: response.data.tokenCreate.errors
                    .map((error) => error.message)
                    .join(", "),
                });
              }

              if (response?.data?.tokenCreate?.user) {
                analytics.identify(response.data.tokenCreate.user.id, {
                  email: response.data.tokenCreate.user.email,
                });

                toast({
                  title: "Successfully logged in",
                });
              }
            }}
          >
            Login user
          </Button>
          <FormButton
            type="submit"
            onClick={onClick}
            className="justify-self-end"
            loading={isPending}
          >
            Create checkout
          </FormButton>
        </div>
      </div>
    </div>
  );
};
