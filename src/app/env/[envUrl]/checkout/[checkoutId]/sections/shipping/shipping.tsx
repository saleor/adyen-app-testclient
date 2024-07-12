"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FragmentOf } from "gql.tada";
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

import { shippingAddressTypesFragment } from "./fragment";
import { updateShippingAddress } from "./update-shipping-address";

type Props = {
  address: FragmentOf<typeof shippingAddressTypesFragment> | null | undefined;
  envUrl: string;
  checkoutId: string;
};

const ShippingConfigSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  streetAddress1: z.string().min(1),
  city: z.string().min(1),
  countryArea: z.string().min(1),
  country: z.enum(["US", "CA"]),
  postalCode: z.string().min(1),
});

export type ShippingConfigSchemaType = z.infer<typeof ShippingConfigSchema>;

export const Shipping = ({ address, envUrl, checkoutId }: Props) => {
  const form = useForm<ShippingConfigSchemaType>({
    resolver: zodResolver(ShippingConfigSchema),
    defaultValues: {
      firstName: address?.firstName ?? "John",
      lastName: address?.lastName ?? "Snow",
      streetAddress1: address?.streetAddress1 ?? "Tęczowa 7",
      city: address?.city ?? "Wrocław",
      countryArea: address?.countryArea ?? "NY",
      // @ts-expect-error
      country: address?.country.code ?? "US",
      postalCode: address?.postalCode ?? "10001",
    },
  });

  const onSubmit = async (data: ShippingConfigSchemaType) => {
    const response = await updateShippingAddress({
      envUrl,
      checkoutId,
      shippingAddress: data,
    });
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
    <div>
      <h2 className="mb-2 text-2xl font-bold">Shipping Information</h2>
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="streetAddress1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="countryArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your state" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your postal code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your country" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit">Save shipping address</Button>
        </form>
      </Form>
    </div>
  );
};
