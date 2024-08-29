"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FragmentOf } from "gql.tada";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormButton } from "@/components/form-button";
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
import { env } from "@/env";

import { fetchProduct } from "../actions";
import { ProductFragment } from "../fragments";
import { Cart } from "./cart";

const EnvironmentConfigSchema = z.object({
  url: z.string().url().min(1),
  channelSlug: z.string().min(1),
});

type EnvironmentConfigSchemaType = z.infer<typeof EnvironmentConfigSchema>;

export const Environment = () => {
  const [products, setProducts] = useState<
    FragmentOf<typeof ProductFragment>[]
  >([]);

  const form = useForm<EnvironmentConfigSchemaType>({
    resolver: zodResolver(EnvironmentConfigSchema),
    defaultValues: {
      url: env.NEXT_PUBLIC_INITIAL_ENV_URL,
      channelSlug: env.NEXT_PUBLIC_INITIAL_CHANNEL_SLUG,
    },
  });

  const onSubmit = async (data: EnvironmentConfigSchemaType) => {
    const response = await fetchProduct({
      channelSlug: data.channelSlug,
      envUrl: data.url,
    });

    if (response.type === "success") {
      setProducts(response.value.products?.edges.map((e) => e.node) ?? []);
      toast({
        title: "Successfully fetched products",
      });
    }

    if (response.type === "error") {
      toast({
        title: response.name,
        variant: "destructive",
        description: response.message,
      });
    }
  };

  return (
    <>
      <div className="grid gap-4 md:gap-8">
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
            <div className="grid">
              <FormButton
                type="submit"
                variant="secondary"
                className="justify-self-end"
                loading={form.formState.isSubmitting}
              >
                Fetch products
              </FormButton>
            </div>
          </form>
        </Form>
      </div>

      {products.length > 0 && (
        <Cart
          data={products}
          envUrl={form.getValues().url}
          channelSlug={form.getValues().channelSlug}
        />
      )}
    </>
  );
};
