import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Shipping = () => {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">Shipping Information</h2>
      <form className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" placeholder="Enter your address" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Enter your city" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" placeholder="Enter your state" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="zip">Zip Code</Label>
            <Input id="zip" type="number" placeholder="Enter your zip code" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" placeholder="Enter your country" />
          </div>
        </div>
      </form>
    </div>
  );
};
