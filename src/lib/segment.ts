import { AnalyticsBrowser } from "@segment/analytics-next";

import { env } from "@/env";

export const analytics = AnalyticsBrowser.load({
  writeKey: env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
});
