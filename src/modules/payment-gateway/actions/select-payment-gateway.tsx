"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FragmentOf, readFragment } from "gql.tada";
import { useRouter } from "next/navigation";
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
import { createPath } from "@/lib/utils";

import { PaymentGatewayFragment } from "../fragments";

export const PaymentGatewaySchema = z.object({
  paymentGatewayId: z.string(),
});

export type PaymentGatewaySchemaType = z.infer<typeof PaymentGatewaySchema>;

export const SelectPaymentMethod = (props: {
  data: FragmentOf<typeof PaymentGatewayFragment>[] | null | undefined;
}) => {
  const { data } = props;
  const router = useRouter();

  const availablePaymentGateways = readFragment(
    PaymentGatewayFragment,
    data?.map((method) => method) ?? [],
  );

  const form = useForm<PaymentGatewaySchemaType>({
    resolver: zodResolver(PaymentGatewaySchema),
  });

  async function onSubmit(data: PaymentGatewaySchemaType) {
    router.push(createPath("payment-gateway", data.paymentGatewayId));
  }

  return (
    <section className="mx-auto w-full max-w-md py-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Payment Gateway Information</h2>
      </div>
      <div className="mt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="paymentGatewayId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Gateway</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment gateway" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availablePaymentGateways.map((method) => (
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
