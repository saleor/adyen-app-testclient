"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FragmentOf, readFragment } from "gql.tada";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ErrorToastDescription } from "@/components/sections/error-toast-description";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

import {
  CollectionPointFragment,
  DeliveryMethodFragment,
  ShippingMethodFragment,
} from "./fragments";
import { updateDeliveryMethod } from "./update-delivery-method";

export const DeliveryMethodSchema = z.object({
  deliveryMethodId: z.string(),
});

export type DeliveryMethodSchemaType = z.infer<typeof DeliveryMethodSchema>;

export const DeliveryMethod = (props: {
  deliveryMethodData:
    | FragmentOf<typeof DeliveryMethodFragment>
    | FragmentOf<typeof CollectionPointFragment>
    | null
    | undefined;
  shippingMethodData:
    | FragmentOf<typeof ShippingMethodFragment>[]
    | null
    | undefined;
  envUrl: string;
  checkoutId: string;
}) => {
  const { deliveryMethodData, shippingMethodData, envUrl, checkoutId } = props;

  const shippingMethods = readFragment(
    ShippingMethodFragment,
    shippingMethodData?.map((method) => method) ?? [],
  );

  const deliveryMethod = readFragment(
    DeliveryMethodFragment,
    // @ts-expect-error - figure out how to handle ShippingMethods & CollectionPoint in the same fragment
    deliveryMethodData,
  );

  const form = useForm<DeliveryMethodSchemaType>({
    resolver: zodResolver(DeliveryMethodSchema),
    defaultValues: {
      deliveryMethodId: deliveryMethod?.id ?? "",
    },
  });

  async function onSubmit(data: DeliveryMethodSchemaType) {
    const response = await updateDeliveryMethod({
      envUrl,
      checkoutId,
      deliveryMethod: data.deliveryMethodId,
    });

    if (response?.isErr()) {
      return toast({
        title: `${response.error.name}: ${response.error.message}`,
        variant: "destructive",
        description: <ErrorToastDescription details={response.error.errors} />,
      });
    }

    toast({
      title: "Successfully updated delivery method",
    });
  }

  if (shippingMethods.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-bold">Delivery Method Information</h2>
      <div className="mt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="deliveryMethodId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a delivery method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shippingMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid">
              <Button type="submit" className="justify-self-end">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};
