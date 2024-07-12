"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

import { createCheckout } from "./create-checkout";
import { fetchProduct } from "./fetch-product";

const EnvironmentConfigSchema = z.object({
  url: z.string().url().min(1),
  channelSlug: z.string().min(1),
});

export type EnvironmentConfigSchemaType = z.infer<
  typeof EnvironmentConfigSchema
>;

export const Environment = () => {
  const [products, setProducts] = useState<any>([]);

  const form = useForm<EnvironmentConfigSchemaType>({
    resolver: zodResolver(EnvironmentConfigSchema),
    defaultValues: {
      url: "https://dev-kz.eu.saleor.cloud/graphql/",
      channelSlug: "default-channel",
    },
  });

  const onSubmit = async (data: EnvironmentConfigSchemaType) => {
    const response = await fetchProduct({
      channelSlug: data.channelSlug,
      envUrl: data.url,
    });

    setProducts(response?.products?.edges ?? []);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] overflow-auto rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(response, null, 2)}
          </code>
        </pre>
      ),
    });
  };

  return (
    <>
      <div>
        <h2 className="mb-2 text-2xl font-bold">Environment Information</h2>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Environment URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your env url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="channelSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your channel slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Fetch products</Button>
          </form>
        </Form>
      </div>

      {products && (
        <div>
          <h2 className="mb-2 text-2xl font-bold">Cart</h2>
          <div className="grid gap-4">
            {/* @ts-expect-error */}
            {products?.map((product) => (
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
                    {
                      product.node.defaultVariant?.pricing?.price?.gross
                        .currency
                    }
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="submit"
              onClick={async () => {
                const checkout = await createCheckout(
                  form.getValues(),
                  products[0].node.defaultVariant.id,
                );

                toast({
                  title: "You submitted the following values:",
                  description: (
                    <pre className="mt-2 w-[340px] overflow-auto rounded-md bg-slate-950 p-4">
                      <code className="text-white">
                        {JSON.stringify(checkout, null, 2)}
                      </code>
                    </pre>
                  ),
                });
              }}
            >
              Create checkout
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
