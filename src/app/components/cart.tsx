import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export const Cart = () => {
  return (
    <>
      <div>
        <h2 className="mb-2 text-2xl font-bold">Cart</h2>
        <div className="grid gap-4">
          <div className="grid grid-cols-[80px_1fr_80px] items-center gap-4">
            <Image
              src="/placeholder.svg"
              alt="Product Image"
              width={80}
              height={80}
              className="aspect-square overflow-hidden rounded-lg border object-cover"
            />
            <div>
              <h3 className="font-medium">Product Name</h3>
              <p className="text-muted-foreground text-sm">Description</p>
            </div>
            <div className="text-right">
              <div>Qty: 2</div>
              <div>$99.99</div>
            </div>
          </div>
          <div className="grid grid-cols-[80px_1fr_80px] items-center gap-4">
            <Image
              src="/placeholder.svg"
              alt="Product Image"
              width={80}
              height={80}
              className="aspect-square overflow-hidden rounded-lg border object-cover"
            />
            <div>
              <h3 className="font-medium">Another Product</h3>
              <p className="text-muted-foreground text-sm">Description</p>
            </div>
            <div className="text-right">
              <div>Qty: 1</div>
              <div>$49.99</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted/20 rounded-lg p-4">
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
