"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import { shippingMethodTypesFragment } from "./fragment";
import { updateDeliveryMethod } from "../../../lib/saleor/update-delivery-method";

const FormSchema = z.object({
  deliveryMethod: z.string(),
});

export const ShippingMethods = ({
  shippingMethods,
  envUrl,
  checkoutId,
}: {
  shippingMethods: (typeof shippingMethodTypesFragment)[];
  envUrl: string;
  checkoutId: string;
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await updateDeliveryMethod({
      envUrl,
      checkoutId,
      deliveryMethod: data.deliveryMethod,
    });
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(response, null, 2)}
          </code>
        </pre>
      ),
    });
  }

  return (
    <section className="mx-auto w-full max-w-md py-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Shipping Method</h2>
      </div>
      <div className="mt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="deliveryMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a deliveryMethod" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shippingMethods.map((method) => (
                        // @ts-expect-error
                        <SelectItem key={method.id} value={method.id}>
                          {/* @ts-expect-error */}
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </section>
  );
};
