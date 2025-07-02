import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import HydrateMenu from "@/components/hydrate-menu";
import HydrateOrders from "@/components/hydrate-orders";
import { Toaster } from "sonner";
import SessionClientProvider from "@/providers/session-provider";

export const metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <SessionClientProvider>
          <QueryProvider>
            <HydrateMenu />
            <HydrateOrders />
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </SessionClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
