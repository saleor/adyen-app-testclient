import { MountainIcon } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  // return <LoadingSkeleton />
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
          <MountainIcon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-primary" />
          <div className="animation-delay-200 h-3 w-3 animate-bounce rounded-full bg-primary" />
          <div className="animation-delay-400 h-3 w-3 animate-bounce rounded-full bg-primary" />
        </div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
