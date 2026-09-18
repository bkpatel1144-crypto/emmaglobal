import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout for everything under /services.
 *
 * It deliberately carries no `head()`. A layout route's head is merged into
 * every child, so putting the /services title and canonical here emitted a
 * second, wrong canonical on each service detail page. The listing page's own
 * metadata lives in services.index.tsx.
 */
export const Route = createFileRoute("/services")({
  component: () => <Outlet />,
});
