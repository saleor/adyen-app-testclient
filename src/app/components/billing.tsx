import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Billing = () => {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">Contact Information</h2>
      <form className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter your name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" placeholder="Enter your phone number" />
        </div>
      </form>
    </div>
  );
};
