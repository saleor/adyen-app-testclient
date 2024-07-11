"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { createCheckout } from "../create-checkout";

const EnvironmentConfigSchema = z.object({
  url: z.string().url().min(1),
  channelSlug: z.string().min(1),
});

export type EnvironmentConfigSchemaType = z.infer<
  typeof EnvironmentConfigSchema
>;

export const Environment = () => {
  const form = useForm<EnvironmentConfigSchemaType>({
    resolver: zodResolver(EnvironmentConfigSchema),
    defaultValues: {
      url: "https://dev-kz.eu.saleor.cloud/graphql/",
      channelSlug: "default-channel",
    },
  });

  const onSubmit = async (data: EnvironmentConfigSchemaType) => {
    const response = await createCheckout(data);
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
  };

  return (
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
  );
};
