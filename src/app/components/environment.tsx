import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export const Environment = () => {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">Environment Information</h2>
      <form className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="url">Environment URL</Label>
          <Input id="url" placeholder="Enter your env url" type="url" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="channelSlug">Channel slug</Label>
          <Input id="channelSlug" placeholder="Enter your channel slug" />
        </div>
        <Button>Fetch products</Button>
      </form>
    </div>
  );
};
